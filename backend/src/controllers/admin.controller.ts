import { Request, Response } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { logger } from '../utils/logger';
import { ApiResponse, MongoFilter } from '../types';
import { sendEmail } from '../utils/email';

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: MongoFilter = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.isActive = status === 'active';
    }

    const sortOptions: Record<string, 1 | -1> = {
      [sortBy as string]: sortOrder === 'desc' ? -1 : 1
    };

    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .select('-password -refreshTokens')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get user details (admin only)
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password -refreshTokens')
      .lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    // Get user statistics
    const [totalOrders, totalSpent, totalProducts, totalReviews] = await Promise.all([
      Order.countDocuments({ buyer: userId }),
      Order.aggregate([
        { $match: { buyer: userId, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ]),
      Product.countDocuments({ seller: userId }),
      Review.countDocuments({ buyer: userId })
    ]);

    const userStats = {
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      totalProducts,
      totalReviews
    };

    res.json({
      success: true,
      data: {
        user,
        stats: userStats
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Update user status (admin only)
export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { isActive, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    // Update user status
    user.isActive = isActive;

    await user.save();

    // Send notification email
    try {
      await sendEmail({
        to: user.email,
        subject: isActive ? 'Account Reactivated' : 'Account Suspended',
        template: 'account-status',
        data: {
          firstName: user.firstName,
          isActive,
          reason: reason || 'No reason provided'
        }
      });
    } catch (emailError) {
      logger.error('Failed to send account status email:', emailError);
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'suspended'} successfully`
    } as ApiResponse);

    logger.info(`User ${userId} ${isActive ? 'activated' : 'suspended'} by admin`);
  } catch (error) {
    logger.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
      return;
    }

    // Check if user has active orders
    const activeOrders = await Order.countDocuments({
      $or: [{ buyer: userId }, { seller: userId }],
      status: { $in: ['pending', 'processing', 'shipped'] }
    });

    if (activeOrders > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete user with active orders'
      } as ApiResponse);
      return;
    }

    // Soft delete - deactivate instead of actual deletion
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
    } as ApiResponse);

    logger.info(`User ${userId} deleted by admin`);
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get all products for moderation (admin only)
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: MongoFilter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.isActive = status === 'active';
    }

    const sortOptions: Record<string, 1 | -1> = {
      [sortBy as string]: sortOrder === 'desc' ? -1 : 1
    };

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('seller', 'firstName lastName businessName email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Update product status (admin only)
export const updateProductStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { isActive, reason } = req.body;

    const product = await Product.findById(productId).populate('seller', 'email firstName');
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
      return;
    }

    // Update product status
    product.isActive = isActive;

    await product.save();

    // Send notification email to seller
    try {
      const seller = product.seller as unknown as { email: string; firstName: string };
      await sendEmail({
        to: seller.email,
        subject: isActive ? 'Product Approved' : 'Product Suspended',
        template: 'product-status',
        data: {
          firstName: seller.firstName,
          productTitle: product.title,
          isActive,
          reason: reason || 'No reason provided'
        }
      });
    } catch (emailError) {
      logger.error('Failed to send product status email:', emailError);
    }

    res.json({
      success: true,
      message: `Product ${isActive ? 'approved' : 'suspended'} successfully`
    } as ApiResponse);

    logger.info(`Product ${productId} ${isActive ? 'approved' : 'suspended'} by admin`);
  } catch (error) {
    logger.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: MongoFilter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const sortOptions: Record<string, 1 | -1> = {
      [sortBy as string]: sortOrder === 'desc' ? -1 : 1
    };

    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate('buyer', 'firstName lastName email')
        .populate('seller', 'firstName lastName businessName email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get reported reviews (admin only)
export const getReportedReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions: Record<string, 1 | -1> = {
      [sortBy as string]: sortOrder === 'desc' ? -1 : 1
    };

    const [reviews, totalCount] = await Promise.all([
      Review.find({ isReported: true })
        .populate('buyer', 'firstName lastName email')
        .populate('seller', 'firstName lastName businessName email')
        .populate('product', 'title images')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ isReported: true })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get reported reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Moderate review (admin only)
export const moderateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { action, adminResponse } = req.body; // action: 'approve', 'hide', 'delete'

    const review = await Review.findById(reviewId)
      .populate('buyer', 'email firstName')
      .populate('product', 'title');

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found'
      } as ApiResponse);
      return;
    }

    switch (action) {
      case 'approve':
        review.isReported = false;
        review.reportReason = undefined;
        review.isVisible = true;
        break;
      case 'hide':
        review.isVisible = false;
        break;
      case 'delete':
        await Review.findByIdAndDelete(reviewId);
        res.json({
          success: true,
          message: 'Review deleted successfully'
        } as ApiResponse);
        return;
      default:
        res.status(400).json({
          success: false,
          message: 'Invalid action'
        } as ApiResponse);
        return;
    }

    if (adminResponse) {
      review.adminResponse = adminResponse;
    }

    await review.save();

    // Send notification email to reviewer
    try {
      const buyer = review.buyer as unknown as { email: string; firstName: string };
      const product = review.product as unknown as { title: string };
      await sendEmail({
        to: buyer.email,
        subject: 'Review Moderation Update',
        template: 'review-moderation',
        data: {
          firstName: buyer.firstName,
          productTitle: product.title,
          action,
          adminResponse: adminResponse || 'No additional comments'
        }
      });
    } catch (emailError) {
      logger.error('Failed to send review moderation email:', emailError);
    }

    res.json({
      success: true,
      message: `Review ${action}d successfully`
    } as ApiResponse);

    logger.info(`Review ${reviewId} ${action}d by admin`);
  } catch (error) {
    logger.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get system statistics (admin only)
export const getSystemStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeUsers, totalProducts, activeProducts, totalOrders, totalRevenue] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ])
    ]);

    const [newUsersThisMonth, newProductsThisMonth, ordersThisMonth, revenueThisMonth] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Order.aggregate([
        { $match: { status: 'delivered', createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ])
    ]);

    const [ordersThisWeek, revenueThisWeek] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Order.aggregate([
        { $match: { status: 'delivered', createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ])
    ]);

    const [reportedReviews, suspendedUsers, suspendedProducts] = await Promise.all([
      Review.countDocuments({ isReported: true }),
      User.countDocuments({ isActive: false, suspendedAt: { $exists: true } }),
      Product.countDocuments({ isActive: false, suspendedAt: { $exists: true } })
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalProducts,
          activeProducts,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        growth: {
          newUsersThisMonth,
          newProductsThisMonth,
          ordersThisMonth,
          revenueThisMonth: revenueThisMonth[0]?.total || 0,
          ordersThisWeek,
          revenueThisWeek: revenueThisWeek[0]?.total || 0
        },
        moderation: {
          reportedReviews,
          suspendedUsers,
          suspendedProducts
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};