import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { ApiResponse, MongoFilter } from '../types';

// Create new review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { productId, orderId, rating, comment, images } = req.body;

    // Validate required fields
    if (!productId || !rating) {
      res.status(400).json({
        success: false,
        message: 'Product ID and rating are required'
      } as ApiResponse);
      return;
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
      return;
    }

    // Check if user has purchased this product
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        buyer: userId,
        status: 'delivered',
        'items.product': productId
      });

      if (!order) {
        res.status(400).json({
          success: false,
          message: 'You can only review products you have purchased and received'
        } as ApiResponse);
        return;
      }
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      buyer: userId
    });

    if (existingReview) {
      res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      } as ApiResponse);
      return;
    }

    // Create review
    const review = new Review({
      product: productId,
      buyer: userId,
      seller: product.seller,
      order: orderId,
      rating,
      comment,
      images: images || []
    });

    await review.save();

    // Update product rating
    await updateProductRating(productId);

    // Populate review for response
    const populatedReview = await Review.findById(review._id)
      .populate('buyer', 'firstName lastName username avatar')
      .populate('product', 'title images')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review: populatedReview }
    } as ApiResponse);

    logger.info(`Review created: ${review._id} for product: ${productId} by user: ${userId}`);
  } catch (error) {
    logger.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: MongoFilter = {
      product: productId,
      isVisible: true
    };

    if (rating) {
      filter.rating = parseInt(rating as string);
    }

    // Sort options
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const [reviews, totalCount, ratingStats] = await Promise.all([
      Review.find(filter)
        .populate('buyer', 'firstName lastName username avatar')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { product: productId, isVisible: true } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    // Format rating statistics
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => {
      const stat = ratingStats.find(s => s._id === rating);
      return {
        rating,
        count: stat ? stat.count : 0
      };
    });

    res.json({
      success: true,
      data: {
        reviews,
        ratingDistribution,
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
    logger.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get user reviews
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const {
      page = 1,
      limit = 10,
      type = 'given' // given or received
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter based on type
    const filter: MongoFilter = { isVisible: true };
    if (type === 'given') {
      filter.buyer = userId;
    } else {
      filter.seller = userId;
    }

    const [reviews, totalCount] = await Promise.all([
      Review.find(filter)
        .populate('buyer', 'firstName lastName username avatar')
        .populate('seller', 'firstName lastName username avatar')
        .populate('product', 'title images price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments(filter)
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
    logger.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Update review
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { rating, comment, images } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found'
      } as ApiResponse);
      return;
    }

    // Check if user owns this review
    if (review.buyer.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      } as ApiResponse);
      return;
    }

    // Update review
    const updates: Partial<typeof review> = {};
    if (rating !== undefined) updates.rating = rating;
    if (comment !== undefined) updates.comment = comment;
    if (images !== undefined) updates.images = images;
    updates.updatedAt = new Date();

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('buyer', 'firstName lastName username avatar')
     .populate('product', 'title images');

    // Update product rating if rating changed
    if (rating !== undefined) {
      await updateProductRating(review.product.toString());
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review: updatedReview }
    } as ApiResponse);

    logger.info(`Review updated: ${id} by user: ${userId}`);
  } catch (error) {
    logger.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Delete review
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found'
      } as ApiResponse);
      return;
    }

    // Check if user owns this review or is admin
    const user = await User.findById(userId);
    const isOwner = review.buyer.toString() === userId;
    const isAdmin = user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      } as ApiResponse);
      return;
    }

    const productId = review.product.toString();
    await Review.findByIdAndDelete(id);

    // Update product rating
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    } as ApiResponse);

    logger.info(`Review deleted: ${id} by user: ${userId}`);
  } catch (error) {
    logger.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Report review
export const reportReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found'
      } as ApiResponse);
      return;
    }

    // Check if review is already reported
    if (review.isReported) {
      res.status(400).json({
        success: false,
        message: 'This review has already been reported'
      } as ApiResponse);
      return;
    }

    // Update review as reported
    await Review.findByIdAndUpdate(id, {
      isReported: true,
      reportReason: reason
    });

    res.json({
      success: true,
      message: 'Review reported successfully'
    } as ApiResponse);

    logger.info(`Review reported: ${id} by user: ${userId} for reason: ${reason}`);
  } catch (error) {
    logger.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Helper function to update product rating
const updateProductRating = async (productId: string): Promise<void> => {
  try {
    const ratingStats = await Review.aggregate([
      { $match: { product: productId, isVisible: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const stats = ratingStats[0];
    if (stats) {
      await Product.findByIdAndUpdate(productId, {
        'stats.rating': Math.round(stats.averageRating * 10) / 10, // Round to 1 decimal
        'stats.reviews': stats.totalReviews
      });
    } else {
      // No reviews, reset rating
      await Product.findByIdAndUpdate(productId, {
        'stats.rating': 0,
        'stats.reviews': 0
      });
    }
  } catch (error) {
    logger.error('Update product rating error:', error);
  }
};