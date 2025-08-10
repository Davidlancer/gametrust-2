import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Review } from '../models/Review';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

// Get dashboard analytics
export const getDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    let analytics;

    if (userRole === 'admin') {
      analytics = await getAdminAnalytics();
    } else if (userRole === 'seller') {
      analytics = await getSellerAnalytics(userId);
    } else {
      analytics = await getBuyerAnalytics(userId);
    }

    res.json({
      success: true,
      data: analytics
    } as ApiResponse);
  } catch (error) {
    logger.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Admin analytics
const getAdminAnalytics = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
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

  // Top selling products
  const topProducts = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        title: '$product.title',
        totalSold: 1,
        totalRevenue: 1,
        image: { $arrayElemAt: ['$product.images', 0] }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .populate('buyer', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return {
    overview: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      newUsersThisMonth,
      newProductsThisMonth,
      ordersThisMonth,
      revenueThisMonth: revenueThisMonth[0]?.total || 0,
      ordersThisWeek,
      revenueThisWeek: revenueThisWeek[0]?.total || 0
    },
    topProducts,
    recentOrders
  };
};

// Seller analytics
const getSellerAnalytics = async (sellerId: string) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalProducts, totalOrders, totalRevenue, averageRating] = await Promise.all([
    Product.countDocuments({ seller: sellerId }),
    Order.countDocuments({ seller: sellerId }),
    Order.aggregate([
      { $match: { seller: sellerId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]),
    Review.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      { $match: { 'productInfo.seller': sellerId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ])
  ]);

  const [ordersThisMonth, revenueThisMonth, ordersThisWeek, revenueThisWeek] = await Promise.all([
    Order.countDocuments({ seller: sellerId, createdAt: { $gte: thirtyDaysAgo } }),
    Order.aggregate([
      { $match: { seller: sellerId, status: 'delivered', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]),
    Order.countDocuments({ seller: sellerId, createdAt: { $gte: sevenDaysAgo } }),
    Order.aggregate([
      { $match: { seller: sellerId, status: 'delivered', createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ])
  ]);

  // Top selling products for this seller
  const topProducts = await Order.aggregate([
    { $match: { seller: sellerId, status: 'delivered' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        title: '$product.title',
        totalSold: 1,
        totalRevenue: 1,
        image: { $arrayElemAt: ['$product.images', 0] }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }
  ]);

  // Recent orders for this seller
  const recentOrders = await Order.find({ seller: sellerId })
    .populate('buyer', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Order status distribution
  const orderStatusStats = await Order.aggregate([
    { $match: { seller: sellerId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  return {
    overview: {
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageRating: averageRating[0]?.avgRating || 0,
      ordersThisMonth,
      revenueThisMonth: revenueThisMonth[0]?.total || 0,
      ordersThisWeek,
      revenueThisWeek: revenueThisWeek[0]?.total || 0
    },
    topProducts,
    recentOrders,
    orderStatusStats
  };
};

// Buyer analytics
const getBuyerAnalytics = async (buyerId: string) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalOrders, totalSpent, totalReviews] = await Promise.all([
    Order.countDocuments({ buyer: buyerId }),
    Order.aggregate([
      { $match: { buyer: buyerId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]),
    Review.countDocuments({ buyer: buyerId })
  ]);

  const [ordersThisMonth, spentThisMonth] = await Promise.all([
    Order.countDocuments({ buyer: buyerId, createdAt: { $gte: thirtyDaysAgo } }),
    Order.aggregate([
      { $match: { buyer: buyerId, status: 'delivered', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ])
  ]);

  // Recent orders
  const recentOrders = await Order.find({ buyer: buyerId })
    .populate('seller', 'firstName lastName businessName')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Favorite categories (based on purchase history)
  const favoriteCategories = await Order.aggregate([
    { $match: { buyer: buyerId, status: 'delivered' } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        totalSpent: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        totalItems: { $sum: '$items.quantity' }
      }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 }
  ]);

  return {
    overview: {
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      totalReviews,
      ordersThisMonth,
      spentThisMonth: spentThisMonth[0]?.total || 0
    },
    recentOrders,
    favoriteCategories
  };
};

// Get sales report
export const getSalesReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const {
      startDate,
      endDate,
      period = 'daily' // daily, weekly, monthly
    } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      } as ApiResponse);
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Build match filter based on user role
    const matchFilter: Record<string, unknown> = {
      createdAt: { $gte: start, $lte: end },
      status: 'delivered'
    };

    if (userRole === 'seller') {
      matchFilter.seller = userId;
    }

    // Group by period
    let groupBy: Record<string, unknown>;
    switch (period) {
      case 'weekly':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default: // daily
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const salesData = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: groupBy,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          averageOrderValue: { $avg: '$finalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate,
        salesData
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get product performance
export const getProductPerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const {
      page = 1,
      limit = 20,
      sortBy = 'totalSold', // totalSold, totalRevenue, averageRating
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build match filter based on user role
    const matchFilter: Record<string, unknown> = { status: 'delivered' };
    if (userRole === 'seller') {
      matchFilter.seller = userId;
    }

    const productPerformance = await Order.aggregate([
      { $match: matchFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'product',
          as: 'reviews'
        }
      },
      {
        $project: {
          _id: 1,
          title: '$product.title',
          category: '$product.category',
          price: '$product.price',
          image: { $arrayElemAt: ['$product.images', 0] },
          totalSold: 1,
          totalRevenue: 1,
          totalOrders: 1,
          averageRating: { $avg: '$reviews.rating' },
          totalReviews: { $size: '$reviews' }
        }
      },
      { $sort: { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 } },
      { $skip: skip },
      { $limit: limitNum }
    ]);

    const totalCount = await Order.aggregate([
      { $match: matchFilter },
      { $unwind: '$items' },
      { $group: { _id: '$items.product' } },
      { $count: 'total' }
    ]);

    const totalPages = Math.ceil((totalCount[0]?.total || 0) / limitNum);

    res.json({
      success: true,
      data: {
        products: productPerformance,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount: totalCount[0]?.total || 0,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get product performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};