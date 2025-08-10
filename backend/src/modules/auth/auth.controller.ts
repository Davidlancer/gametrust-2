import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { logger } from '../../utils/logger';
import { sendEmail } from '../../utils/email';
import { ApiResponse } from '../../types';
import { AuthService } from './auth.service';

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const payload = { userId, role };
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRE || '7d' } as SignOptions);
};

// Generate refresh token
const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    { expiresIn: '30d' }
  );
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, username, role = 'buyer' } = req.body;
    
    // Log registration attempt (mask password)
    console.info('Register attempt', {
      email,
      firstName,
      lastName,
      username,
      origin: req.get('origin')
    });

    // 1. Input validation - check required fields
    if (!email || !firstName || !lastName || !password) {
      res.status(400).json({
        success: false,
        message: 'Email, firstName, lastName and password are required'
      } as ApiResponse);
      return;
    }

    // 2. Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include uppercase, lowercase, number and symbol'
      } as ApiResponse);
      return;
    }

    // 3. Email uniqueness check
    const existingUser = await AuthService.userExistsByEmail(email);

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email is already registered'
      } as ApiResponse);
      return;
    }

    // 4. Create new user
    const user = await AuthService.createUser({
      email,
      password,
      firstName,
      lastName,
      username,
      role
    });

    // Generate tokens
    const token = generateToken(user.id, role);

    // 5. Success response (201)
    res.status(201).json({
      success: true,
      message: 'User registered',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        username: user.profile?.displayName
      },
      token
    } as ApiResponse);

    logger.info(`New user registered: ${email}`);
  } catch (error) {
    // Log error with stack trace (mask password)
    console.error('Registration error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: { ...req.body, password: '***' }
    });
    
    logger.error('Registration error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: { ...req.body, password: '***' }
    });
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes('E11000')) {
        const duplicateField = error.message.includes('email') ? 'Email' : 'Username';
        const errorMessage = duplicateField === 'Email' ? 'Email is already registered' : 'Username is already taken';
        res.status(400).json({
          success: false,
          message: errorMessage
        } as ApiResponse);
        return;
      }
      
      if (error.name === 'ValidationError') {
        const validationError = error as unknown as { errors: Record<string, { message: string }> };
        const firstErrorMessage = Object.values(validationError.errors)[0];
        const errorMessage = firstErrorMessage?.message || 'Invalid input data';
        res.status(400).json({
          success: false,
          message: errorMessage
        } as ApiResponse);
        return;
      }
    }
    
    // 6. Unexpected server error (500)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Log the full request body for debugging
    console.log('Login request received:', {
      body: req.body,
      bodyKeys: Object.keys(req.body || {}),
      contentType: req.headers['content-type'],
      method: req.method,
      url: req.url
    });
    
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      console.log('Login validation failed:', {
        email: email ? 'provided' : 'missing',
        password: password ? 'provided' : 'missing',
        emailType: typeof email,
        passwordType: typeof password
      });
      
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      } as ApiResponse);
      return;
    }
    
    console.log('Login attempt:', { 
      email,
      emailLength: email?.length,
      passwordLength: password?.length
    });

    // Authenticate user
    const user = await AuthService.authenticateUser(email, password);

    if (!user) {
      // Log failed login attempt
      console.log('Failed login attempt:', { email, reason: 'Invalid credentials' });
      logger.warn(`Failed login attempt for email: ${email} - Invalid credentials`);
      
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is inactive'
      } as ApiResponse);
      return;
    }

    // Generate tokens
    const token = generateToken(user.id, 'buyer'); // Default role for now
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          username: user.profile?.displayName,
          role: 'buyer', // Default role for now
          isEmailVerified: user.isEmailVerified,
          avatar: user.profile?.avatar
        },
        token,
        refreshToken
      }
    } as ApiResponse);

    logger.info(`User logged in: ${email}`);
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token required'
      } as ApiResponse);
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret') as { userId: string };
    
    // Find user
    const user = await AuthService.findUserById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      } as ApiResponse);
      return;
    }

    // Generate new tokens
    const newToken = generateToken(user.id, 'buyer'); // Default role for now
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    } as ApiResponse);
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const result = await AuthService.generatePasswordResetTokenForUser(email);
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    const { user, token: resetToken } = result;

    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: 'Reset your GameTrust password',
        template: 'password-reset',
        data: {
          firstName: user.profile?.firstName,
          resetToken,
          resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        }
      });

      res.json({
        success: true,
        message: 'Password reset link sent to your email'
      } as ApiResponse);
    } catch (emailError) {
      logger.error('Failed to send reset email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send reset email'
      } as ApiResponse);
    }
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    const user = await AuthService.resetUserPassword(token, password);

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    } as ApiResponse);

    logger.info(`Password reset for user: ${user.email}`);
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    const user = await AuthService.verifyUserEmail(token);

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Email verified successfully'
    } as ApiResponse);

    logger.info(`Email verified for user: ${user.email}`);
  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as { user: { userId: string } }).user.userId;
    
    const user = await AuthService.findUserById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          username: user.profile?.displayName,
          role: 'buyer', // Default role for now
          isEmailVerified: user.isEmailVerified,
          avatar: user.profile?.avatar,
          phone: user.profile?.phone,
          bio: user.profile?.bio,
          country: user.profile?.country,
          timezone: user.profile?.timezone,
          language: user.profile?.language,
          favoriteGames: user.profile?.favoriteGames,
          gamingPlatforms: user.profile?.gamingPlatforms,
          createdAt: user.createdAt
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as { user: { userId: string } }).user.userId;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.isEmailVerified;
    delete updates.isActive;
    delete updates.id;
    delete updates.userId;

    const user = await AuthService.updateUserProfile(userId, updates);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    } as ApiResponse);

    logger.info(`Profile updated for user: ${user.email}`);
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as { user: { userId: string } }).user.userId;
    const { currentPassword, newPassword } = req.body;

    const result = await AuthService.changeUserPassword(userId, currentPassword, newPassword);

    if (!result.success) {
      const statusCode = result.message === 'User not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: result.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: result.message
    } as ApiResponse);

    logger.info(`Password changed for user: ${result?.user?.email}`);
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // However, we can log the logout event for security purposes
    const userId = (req as { user?: { userId: string } }).user?.userId;
    
    if (userId) {
      logger.info(`User logged out: ${userId}`);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    } as ApiResponse);
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};