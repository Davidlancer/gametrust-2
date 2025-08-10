import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { authenticate } from '../modules/auth/auth.middleware';
import { Review } from '../models/review.model';
import mongoose from 'mongoose';

const router = Router();

// GET /api/reviews - Get all reviews
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({})
      .populate('userId', 'username avatar')
      .populate('productId', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    const formattedReviews = reviews.map(review => ({
      id: review._id,
      buyerUsername: (review.userId as { username?: string })?.username || 'Anonymous',
      buyerAvatar: (review.userId as { avatar?: string })?.avatar || null,
      comment: review.comment,
      rating: review.rating,
      game: (review.productId as { title?: string })?.title || 'Gaming',
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    }));

    const response: ApiResponse = {
      success: true,
      data: formattedReviews
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch reviews'
    };
    res.status(500).json(response);
  }
});

// POST /api/reviews - Add a new review (requires authentication)
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user?.userId;

    // Validation
    if (!productId || !rating || !comment) {
      const response: ApiResponse = {
        success: false,
        message: 'Product ID, rating, and comment are required'
      };
      res.status(400).json(response);
      return;
    }

    if (rating < 1 || rating > 5) {
      const response: ApiResponse = {
        success: false,
        message: 'Rating must be between 1 and 5'
      };
      res.status(400).json(response);
      return;
    }

    if (comment.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Comment cannot be empty'
      };
      res.status(400).json(response);
      return;
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      const response: ApiResponse = {
        success: false,
        message: 'You have already reviewed this product'
      };
      res.status(409).json(response);
      return;
    }

    // Create new review
    const review = new Review({
      userId,
      productId,
      rating,
      comment: comment.trim()
    });

    await review.save();

    const response: ApiResponse = {
      success: true,
      message: 'Review added successfully',
      data: {
        id: review._id,
        userId: review.userId,
        productId: review.productId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error adding review:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to add review'
    };
    res.status(500).json(response);
  }
});

// PUT /api/reviews/:id - Edit a review (requires authentication)
router.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.userId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid review ID'
      };
      res.status(400).json(response);
      return;
    }

    // Validation
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      const response: ApiResponse = {
        success: false,
        message: 'Rating must be between 1 and 5'
      };
      res.status(400).json(response);
      return;
    }

    if (comment !== undefined && comment.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Comment cannot be empty'
      };
      res.status(400).json(response);
      return;
    }

    // Find review and verify ownership
    const review = await Review.findById(id);
    if (!review) {
      const response: ApiResponse = {
        success: false,
        message: 'Review not found'
      };
      res.status(404).json(response);
      return;
    }

    if (review.userId.toString() !== userId) {
      const response: ApiResponse = {
        success: false,
        message: 'You can only edit your own reviews'
      };
      res.status(403).json(response);
      return;
    }

    // Update review
    const updateData: { rating?: number; comment?: string } = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment.trim();

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    const response: ApiResponse = {
      success: true,
      message: 'Review updated successfully',
      data: {
        id: updatedReview!._id,
        userId: updatedReview!.userId,
        productId: updatedReview!.productId,
        rating: updatedReview!.rating,
        comment: updatedReview!.comment,
        createdAt: updatedReview!.createdAt,
        updatedAt: updatedReview!.updatedAt
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating review:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to update review'
    };
    res.status(500).json(response);
  }
});

// DELETE /api/reviews/:id - Delete a review (requires authentication)
router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid review ID'
      };
      res.status(400).json(response);
      return;
    }

    // Find review and verify ownership
    const review = await Review.findById(id);
    if (!review) {
      const response: ApiResponse = {
        success: false,
        message: 'Review not found'
      };
      res.status(404).json(response);
      return;
    }

    if (review.userId.toString() !== userId) {
      const response: ApiResponse = {
        success: false,
        message: 'You can only delete your own reviews'
      };
      res.status(403).json(response);
      return;
    }

    // Delete review
    await Review.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Review deleted successfully',
      data: {
        deletedReviewId: id,
        deletedAt: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting review:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to delete review'
    };
    res.status(500).json(response);
  }
});

export default router;