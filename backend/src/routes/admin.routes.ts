import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import Message from '../models/message.model';
import { authenticate, adminOnly } from '../modules/auth/auth.middleware';

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

    // Build query filters
    const query: {
      $or?: Array<{ username: { $regex: string; $options: string } } | { email: { $regex: string; $options: string } }>;
      role?: string;
      isActive?: boolean;
      isBanned?: boolean;
    } = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && ['buyer', 'seller', 'admin'].includes(role)) {
      query.role = role;
    }
    
    if (status === 'active') {
      query.isActive = true;
      query.isBanned = false;
    } else if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password -refreshToken -resetPasswordToken -emailVerificationToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

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

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Validate isBanned field
    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isBanned field must be a boolean'
      });
    }

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from banning themselves
    if (user._id.toString() === req.user?.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban yourself'
      });
    }

    // Prevent banning other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban other administrators'
      });
    }

    // Update user ban status
    user.isBanned = isBanned;
    
    // Note: Ban reason, bannedAt, and bannedBy fields would need to be added to User model
    // For now, we'll just update the isBanned status

    await user.save();

    // Return updated user (without sensitive fields)
    const updatedUser = await User.findById(id)
      .select('-password -refreshToken -resetPasswordToken -emailVerificationToken');

    res.json({
      success: true,
      message: isBanned ? 'User banned successfully' : 'User unbanned successfully',
      data: {
        user: updatedUser
      }
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
    const totalUsers = await User.countDocuments();
    const totalActiveUsers = await User.countDocuments({ isActive: true, isBanned: false });
    const totalBannedUsers = await User.countDocuments({ isBanned: true });
    
    // Get user counts by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent user registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get message statistics
    const totalMessages = await Message.countDocuments();
    const recentMessages = await Message.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Format user role statistics
    const roleStats = {
      buyers: 0,
      sellers: 0,
      admins: 0
    };
    
    usersByRole.forEach(role => {
      if (role._id === 'buyer') roleStats.buyers = role.count;
      if (role._id === 'seller') roleStats.sellers = role.count;
      if (role._id === 'admin') roleStats.admins = role.count;
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: totalActiveUsers,
          banned: totalBannedUsers,
          recentRegistrations,
          byRole: roleStats
        },
        messages: {
          total: totalMessages,
          recent: recentMessages
        },
        // Mock data for products and orders (since models don't exist yet)
        products: {
          total: 0,
          active: 0,
          recent: 0
        },
        orders: {
          total: 0,
          completed: 0,
          pending: 0,
          recent: 0
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