import { Request, Response } from 'express';
import { AuthModel } from './auth.model';
import { generateTokenPair } from './auth.utils';
import { RegisterData, LoginData, ApiResponse, AuthRequest } from '../../types';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: RegisterData = req.body;

    // Check if user already exists
    const existingUser = await AuthModel.existsByEmail(email);

    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        message: 'User with this email already exists'
      };
      res.status(400).json(response);
      return;
    }

    // Create new user
    const user = await AuthModel.create({ name, email, password, confirmPassword: password });

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Save refresh token to user
    await AuthModel.updateRefreshToken(user.id, tokens.refreshToken);

    // Update last login
    await AuthModel.updateLastLogin(user.id);

    const response: ApiResponse = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        tokens
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Registration failed'
    };
    res.status(500).json(response);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginData = req.body;

    // Find user by email
    const user = await AuthModel.findByEmail(email);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }

    // Check password
    const isPasswordValid = await AuthModel.comparePassword(password, user.password!);

    if (!isPasswordValid) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Save refresh token to user
    await AuthModel.updateRefreshToken(user.id, tokens.refreshToken);

    // Update last login
    await AuthModel.updateLastLogin(user.id);

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        tokens
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Login failed'
    };
    res.status(500).json(response);
  }
};

/**
 * Get current user profile
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not authenticated'
      };
      res.status(401).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get profile error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve user profile'
    };
    res.status(500).json(response);
  }
};