import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { authenticate } from '../modules/auth/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

// GET /api/reviews - Get all reviews
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        reviewer: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatar: true
              }
            }
          }
        },
        purchase: {
          include: {
            listing: {
              select: {
                title: true,
                game: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      buyerUsername: review.reviewer.profile?.displayName || 'Anonymous',
      buyerAvatar: review.reviewer.profile?.avatar || null,
      comment: review.comment,
      rating: review.rating,
      game: review.purchase.listing.game.name,
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
    const { purchaseId, rating, comment } = req.body;
    const userId = req.user?.userId;

    // Validation
    if (!purchaseId || !rating || !comment) {
      const response: ApiResponse = {
        success: false,
        message: 'Purchase ID, rating, and comment are required'
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

    // Verify the purchase exists and belongs to the user
    const purchase = await prisma.purchase.findFirst({
      where: {
        id: purchaseId,
        buyerId: userId,
        status: 'COMPLETED'
      }
    });

    if (!purchase) {
      const response: ApiResponse = {
        success: false,
        message: 'Purchase not found or not completed'
      };
      res.status(404).json(response);
      return;
    }

    // Check if user already reviewed this purchase
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: userId,
        purchaseId: purchaseId
      }
    });

    if (existingReview) {
      const response: ApiResponse = {
        success: false,
        message: 'You have already reviewed this purchase'
      };
      res.status(409).json(response);
      return;
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        reviewerId: userId,
        purchaseId: purchaseId,
        rating: rating,
        comment: comment.trim()
      }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Review added successfully',
      data: {
        id: review.id,
        reviewerId: review.reviewerId,
        purchaseId: review.purchaseId,
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

    // Basic ID validation (Prisma will handle the rest)
    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: 'Review ID is required'
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
    const review = await prisma.review.findUnique({
      where: { id: id }
    });

    if (!review) {
      const response: ApiResponse = {
        success: false,
        message: 'Review not found'
      };
      res.status(404).json(response);
      return;
    }

    if (review.reviewerId !== userId) {
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

    const updatedReview = await prisma.review.update({
      where: { id: id },
      data: updateData
    });

    const response: ApiResponse = {
      success: true,
      message: 'Review updated successfully',
      data: {
        id: updatedReview.id,
        reviewerId: updatedReview.reviewerId,
        purchaseId: updatedReview.purchaseId,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        createdAt: updatedReview.createdAt,
        updatedAt: updatedReview.updatedAt
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

    // Basic ID validation
    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: 'Review ID is required'
      };
      res.status(400).json(response);
      return;
    }

    // Find review and verify ownership
    const review = await prisma.review.findUnique({
      where: { id: id }
    });

    if (!review) {
      const response: ApiResponse = {
        success: false,
        message: 'Review not found'
      };
      res.status(404).json(response);
      return;
    }

    if (review.reviewerId !== userId) {
      const response: ApiResponse = {
        success: false,
        message: 'You can only delete your own reviews'
      };
      res.status(403).json(response);
      return;
    }

    // Delete review
    await prisma.review.delete({
      where: { id: id }
    });

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