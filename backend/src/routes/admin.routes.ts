import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, adminOnly } from '../modules/auth/auth.middleware';

const prisma = new PrismaClient();

const router = express.Router();

// Apply authentication and admin-only middleware to all routes
router.use(authenticate);
router.use(adminOnly);

// GET /users - List all users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const status = req.query.status as string;

    // Build Prisma where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
            totalSales: true,
            rating: true,
            isVerified: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNextPage: page < Math.ceil(totalUsers / limit),
          hasPrevPage: page > 1,
          limit
        }
      }
    });
    return;
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
    return;
  }
});

// PUT /users/:id/ban - Ban/unban user
router.put('/users/:id/ban', async (req, res) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;

    // Prisma will handle invalid ID validation automatically

    // Validate isBanned field
    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isBanned field must be a boolean'
      });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, isActive: true }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from banning themselves
    if (user.id === req.user?.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban yourself'
      });
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !isBanned },
      select: {
        id: true,
        email: true,
        isActive: true,
        profile: {
          select: {
            displayName: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      data: { user: updatedUser }
    });
    return;
  } catch (error) {
    console.error('Ban/unban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
    return;
  }
});

// GET /stats - Return system statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await prisma.user.count();
    const totalActiveUsers = await prisma.user.count({ 
      where: { isActive: true } 
    });
    const totalInactiveUsers = await prisma.user.count({ 
      where: { isActive: false } 
    });

    // Get recent user registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    // Get listing statistics
    const totalListings = await prisma.listing.count();
    const activeListings = await prisma.listing.count({
      where: { status: 'ACTIVE' }
    });
    const soldListings = await prisma.listing.count({
      where: { status: 'SOLD' }
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: totalActiveUsers,
          inactive: totalInactiveUsers,
          recentRegistrations
        },
        listings: {
          total: totalListings,
          active: activeListings,
          sold: soldListings
        },
        marketplace: {
          totalPurchases: await prisma.purchase.count(),
          completedPurchases: await prisma.purchase.count({ where: { status: 'COMPLETED' } }),
          totalSales: await prisma.sale.count(),
          totalEscrows: await prisma.escrow.count()
        },
        systemInfo: {
          serverUptime: process.uptime(),
          nodeVersion: process.version,
          environment: process.env.NODE_ENV || 'development',
          lastUpdated: new Date().toISOString()
        }
      }
    });
    return;
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
    return;
  }
});

export default router;