import { Request, Response, NextFunction } from 'express';
import { AuthModel } from './auth.model';
import { verifyToken } from './auth.utils';
import { AuthRequest, ApiResponse } from '../../types';

/**
 * Middleware to protect routes - requires valid JWT token
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Access denied. No token provided.'
      };
      res.status(401).json(response);
      return;
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      
      // Get user from database (excluding password)
      const user = await AuthModel.findById(decoded.id);
      
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'Token is valid but user no longer exists'
        };
        res.status(401).json(response);
        return;
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (jwtError: any) {
      if (jwtError.name === 'TokenExpiredError') {
        const response: ApiResponse = {
          success: false,
          message: 'Token has expired'
        };
        res.status(401).json(response);
        return;
      } else if (jwtError.name === 'JsonWebTokenError') {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid token'
        };
        res.status(401).json(response);
        return;
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Authentication failed'
    };
    res.status(500).json(response);
  }
};

/**
 * Middleware to restrict access to specific roles
 */
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not authenticated'
      };
      res.status(401).json(response);
      return;
    }

    // Note: Role-based access control is disabled since User model doesn't have role field
    // For now, all authenticated users have access
    // TODO: Implement role-based access control when User model includes role field

    next();
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, continue without user
    if (!token) {
      next();
      return;
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      
      // Get user from database
      const user = await AuthModel.findById(decoded.id);
      
      if (user) {
        req.user = user;
      }
    } catch (jwtError) {
      // Token invalid, but continue without user
      console.log('Optional auth - invalid token:', jwtError);
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};