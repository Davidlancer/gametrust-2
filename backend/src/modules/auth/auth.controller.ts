import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../user/user.model';
import { SessionModel } from '../session/session.model';
import { ProfileModel } from '../profile/profile.model';
import { generateAccessToken, generateRefreshToken } from './auth.utils';
import { ApiResponse, RegisterData, LoginData, SocialAuthData } from '../../types';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, password, confirmPassword }: RegisterData = req.body;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'Passwords do not match'
        } as ApiResponse<null>);
        return;
      }
      
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        } as ApiResponse<null>);
        return;
      }
      
      // Create new user
      const user = await UserModel.createUser({ firstName, lastName, email, password });
      
      // Generate tokens
      const accessToken = generateAccessToken({ id: user.id, email: user.email, name: user?.name ?? `${firstName} ${lastName}` });
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email, name: user?.name ?? `${firstName} ${lastName}` });
      
      // Create session
      await SessionModel.createSession({
        userId: user.id,
        token: accessToken,
        refreshToken,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            // profile: user.profile,
            createdAt: user.createdAt
          },
          accessToken,
          refreshToken
        }
      } as ApiResponse<any>);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<null>);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginData = req.body;
      
      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        } as ApiResponse<null>);
        return;
      }
      
      // Verify password
      const isValidPassword = await UserModel.verifyPassword(password, user.password!);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        } as ApiResponse<null>);
        return;
      }
      
      // Generate tokens
      const accessToken = generateAccessToken({ id: user.id, email: user.email, name: user?.name ?? `${user.firstName} ${user.lastName}` });
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email, name: user?.name ?? `${user.firstName} ${user.lastName}` });
      
      // Create session
      await SessionModel.createSession({
        userId: user.id,
        token: accessToken,
        refreshToken,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            // profile: user.profile,
            createdAt: user.createdAt
          },
          accessToken,
          refreshToken
        }
      } as ApiResponse<any>);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<null>);
    }
  }

  static async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { token }: SocialAuthData = req.body;
      
      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        res.status(400).json({
          success: false,
          message: 'Invalid Google token'
        } as ApiResponse<null>);
        return;
      }
      
      const { sub: providerId, email, given_name: firstName, family_name: lastName, picture: avatar } = payload;
      
      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email not provided by Google'
        } as ApiResponse<null>);
        return;
      }
      
      // Check if user exists with social account
      let user = await UserModel.findBySocialAccount('google', providerId);
      
      if (!user) {
        // Check if user exists with email
        user = await UserModel.findByEmail(email);
        
        if (!user) {
          // Create new user
          user = await UserModel.createSocialUser({
            email,
            firstName: firstName || 'User',
            lastName,
            provider: 'google',
            providerId,
            avatar
          });
        }
      }
      
      // Generate tokens
      const accessToken = generateAccessToken({ id: user.id, email: user.email, name: user?.name ?? `${user.firstName} ${user.lastName}` });
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email, name: user?.name ?? `${user.firstName} ${user.lastName}` });
      
      // Create session
      await SessionModel.createSession({
        userId: user.id,
        token: accessToken,
        refreshToken,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      
      res.json({
        success: true,
        message: 'Google authentication successful',
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            // profile: user.profile,
            createdAt: user.createdAt
          },
          accessToken,
          refreshToken
        }
      } as ApiResponse<any>);
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Google authentication failed'
      } as ApiResponse<null>);
    }
  }

  static async appleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { token, email, name }: SocialAuthData = req.body;
      
      // Decode Apple JWT token (simplified - in production, verify signature)
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.sub) {
        res.status(400).json({
          success: false,
          message: 'Invalid Apple token'
        } as ApiResponse<null>);
        return;
      }
      
      const providerId = decoded.sub;
      const userEmail = email || decoded.email;
      
      if (!userEmail) {
        res.status(400).json({
          success: false,
          message: 'Email not provided by Apple'
        } as ApiResponse<null>);
        return;
      }
      
      // Check if user exists with social account
      let user = await UserModel.findBySocialAccount('apple', providerId);
      
      if (!user) {
        // Check if user exists with email
        user = await UserModel.findByEmail(userEmail);
        
        if (!user) {
          // Create new user
          const [firstName, lastName] = (name || 'User').split(' ');
          user = await UserModel.createSocialUser({
            email: userEmail,
            firstName: firstName || 'User',
            lastName,
            provider: 'apple',
            providerId
          });
        }
      }
      
      // Generate tokens
      const accessToken = generateAccessToken({ id: user.id, email: user.email, name: user?.name ?? `${user.firstName} ${user.lastName}` });
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email, name: user?.name ?? `${user.firstName} ${user.lastName}` });
      
      // Create session
      await SessionModel.createSession({
        userId: user.id,
        token: accessToken,
        refreshToken,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      
      res.json({
        success: true,
        message: 'Apple authentication successful',
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            // profile: user.profile,
            createdAt: user.createdAt
          },
          accessToken,
          refreshToken
        }
      } as ApiResponse<any>);
    } catch (error) {
      console.error('Apple auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Apple authentication failed'
      } as ApiResponse<null>);
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
     try {
       const { refreshToken } = req.body;
       
       if (!refreshToken) {
         res.status(400).json({
           success: false,
           message: 'Refresh token is required'
         } as ApiResponse<null>);
         return;
       }
       
       // Find session by refresh token
       const session = await SessionModel.findByRefreshToken(refreshToken);
       if (!session || !session.isActive) {
         res.status(401).json({
           success: false,
           message: 'Invalid refresh token'
         } as ApiResponse<null>);
         return;
       }
       
       // Generate new tokens
       const newAccessToken = generateAccessToken({ id: session.userId, email: session.user.email, name: session.user.name });
       const newRefreshToken = generateRefreshToken({ id: session.userId, email: session.user.email, name: session.user.name });
       
       // Update session
       await SessionModel.refreshSession(refreshToken, {
         token: newAccessToken,
         expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
       });
       
       res.json({
         success: true,
         message: 'Token refreshed successfully',
         data: {
           accessToken: newAccessToken,
           refreshToken: newRefreshToken
         }
       } as ApiResponse<any>);
     } catch (error) {
       console.error('Refresh token error:', error);
       res.status(500).json({
         success: false,
         message: 'Token refresh failed'
       } as ApiResponse<null>);
     }
   }

   static async logout(req: Request, res: Response): Promise<void> {
     try {
       const token = req.headers.authorization?.replace('Bearer ', '');
       
       if (token) {
         await SessionModel.deactivateSession(token);
       }
       
       res.json({
         success: true,
         message: 'Logged out successfully'
       } as ApiResponse<null>);
     } catch (error) {
       console.error('Logout error:', error);
       res.status(500).json({
         success: false,
         message: 'Logout failed'
       } as ApiResponse<null>);
     }
   }

   static async logoutAll(req: Request, res: Response): Promise<void> {
     try {
       const userId = (req as any).user.userId;
       const currentToken = req.headers.authorization?.replace('Bearer ', '');
       
       await SessionModel.deactivateUserSessions(userId, currentToken);
       
       res.json({
         success: true,
         message: 'Logged out from all devices successfully'
       } as ApiResponse<null>);
     } catch (error) {
       console.error('Logout all error:', error);
       res.status(500).json({
         success: false,
         message: 'Logout from all devices failed'
       } as ApiResponse<null>);
     }
   }

   static async getProfile(req: Request, res: Response): Promise<void> {
     try {
       const userId = (req as any).user.userId;
       
       const user = await UserModel.findById(userId);
       if (!user) {
         res.status(404).json({
           success: false,
           message: 'User not found'
         } as ApiResponse<null>);
         return;
       }
       
       res.json({
         success: true,
         message: 'User profile retrieved successfully',
         data: {
           id: user.id,
           firstName: user.firstName,
           lastName: user.lastName,
           email: user.email,
          //  isEmailVerified: user.isEmailVerified,
          //  profile: user.profile,
          //  socialAccounts: user.socialAccounts,
           createdAt: user.createdAt,
           updatedAt: user.updatedAt
         }
       } as ApiResponse<any>);
     } catch (error) {
       console.error('Get profile error:', error);
       res.status(500).json({
         success: false,
         message: 'Internal server error'
       } as ApiResponse<null>);
     }
   }

   static async updateProfile(req: Request, res: Response): Promise<void> {
     try {
       const userId = (req as any).user.userId;
       const profileData = req.body;
       
       const updatedProfile = await ProfileModel.updateProfile(userId, profileData);
       
       res.json({
         success: true,
         message: 'Profile updated successfully',
         data: updatedProfile
       } as ApiResponse<any>);
     } catch (error) {
       console.error('Update profile error:', error);
       res.status(500).json({
         success: false,
         message: 'Profile update failed'
       } as ApiResponse<null>);
     }
   }

   static async getSessions(req: Request, res: Response): Promise<void> {
     try {
       const userId = (req as any).user.userId;
       
       const sessions = await SessionModel.findUserSessions(userId);
       
       res.json({
         success: true,
         message: 'Sessions retrieved successfully',
         data: sessions.map(session => ({
           id: session.id,
           userAgent: session.userAgent,
           ipAddress: session.ipAddress,
           createdAt: session.createdAt,
           expiresAt: session.expiresAt,
           isActive: session.isActive
         }))
       } as ApiResponse<any>);
     } catch (error) {
       console.error('Get sessions error:', error);
       res.status(500).json({
         success: false,
         message: 'Failed to retrieve sessions'
       } as ApiResponse<null>);
     }
   }

   static async deleteSession(req: Request, res: Response): Promise<void> {
     try {
       const { sessionId } = req.params;
       const userId = (req as any).user.userId;
       
       // Find session and verify ownership
       const session = await SessionModel.findByToken(sessionId);
       if (!session || session.userId !== userId) {
         res.status(404).json({
           success: false,
           message: 'Session not found'
         } as ApiResponse<null>);
         return;
       }
       
       await SessionModel.deactivateSession(sessionId);
       
       res.json({
         success: true,
         message: 'Session deleted successfully'
       } as ApiResponse<null>);
     } catch (error) {
       console.error('Delete session error:', error);
       res.status(500).json({
         success: false,
         message: 'Failed to delete session'
       } as ApiResponse<null>);
     }
   }

   // Placeholder methods for email verification and password reset
   static async sendVerificationEmail(req: Request, res: Response): Promise<void> {
     res.status(501).json({
       success: false,
       message: 'Email verification not implemented yet'
     } as ApiResponse<null>);
   }

   static async verifyEmail(req: Request, res: Response): Promise<void> {
     res.status(501).json({
       success: false,
       message: 'Email verification not implemented yet'
     } as ApiResponse<null>);
   }

   static async forgotPassword(req: Request, res: Response): Promise<void> {
     res.status(501).json({
       success: false,
       message: 'Password reset not implemented yet'
     } as ApiResponse<null>);
   }

   static async resetPassword(req: Request, res: Response): Promise<void> {
     res.status(501).json({
       success: false,
       message: 'Password reset not implemented yet'
     } as ApiResponse<null>);
   }
 }