import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';
import { ApiResponse } from '../../types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
        email: string;
      };
    }
  }
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      } as ApiResponse);
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: string;
      role: string;
    };

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        isActive: true
      }
    });
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
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

    // Attach user to request
    req.user = {
      userId: user.id,
      role: decoded.role,
      email: user.email
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      } as ApiResponse);
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      next();
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: string;
      role: string;
    };

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        isActive: true
      }
    });
    
    if (user && user.isActive) {
      req.user = {
        userId: user.id,
        role: decoded.role,
        email: user.email
      };
    }

    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      } as ApiResponse);
      return;
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = authorize('admin');

// Seller or admin middleware
export const sellerOrAdmin = authorize('seller', 'admin');

// Buyer or admin middleware
export const buyerOrAdmin = authorize('buyer', 'admin');

// Owner or admin middleware (for resource ownership)
export const ownerOrAdmin = (getResourceUserId: (req: Request) => string | Promise<string>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as ApiResponse);
        return;
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        next();
        return;
      }

      // Get resource owner ID
      const resourceUserId = await getResourceUserId(req);
      
      if (req.user.userId !== resourceUserId) {
        res.status(403).json({
          success: false,
          message: 'Access denied - not the owner'
        } as ApiResponse);
        return;
      }

      next();
    } catch (error) {
      logger.error('Owner authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };
};

// Rate limiting middleware for sensitive operations
export const sensitiveOperationLimit = (req: Request, res: Response, next: NextFunction): void => {
  // This would typically use Redis or in-memory store
  // For now, we'll just pass through
  next();
};

// Email verification required middleware
export const requireEmailVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        isEmailVerified: true
      }
    });
    
    if (!user || !user.isEmailVerified) {
      res.status(403).json({
        success: false,
        message: 'Email verification required'
      } as ApiResponse);
      return;
    }

    next();
  } catch (error) {
    logger.error('Email verification check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};