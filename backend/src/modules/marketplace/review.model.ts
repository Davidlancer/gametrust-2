import { PrismaClient } from '@prisma/client';
import { Review } from '../../types';

const prisma = new PrismaClient();

export class ReviewModel {
  static async createReview(reviewData: {
    reviewerId: string;
    revieweeId: string;
    purchaseId: string;
    rating: number;
    comment?: string;
    isSellerReview: boolean;
  }): Promise<Review> {
    return await prisma.review.create({
      data: {
        ...reviewData,
        createdAt: new Date()
      },
      include: {
        reviewer: {
          include: {
            profile: true
          }
        },
        reviewee: {
          include: {
            profile: true
          }
        },
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            }
          }
        }
      }
    });
  }

  static async findById(id: string): Promise<Review | null> {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: {
          include: {
            profile: true
          }
        },
        reviewee: {
          include: {
            profile: true
          }
        },
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            }
          }
        }
      }
    });
  }

  static async findByPurchaseId(purchaseId: string): Promise<Review[]> {
    return await prisma.review.findMany({
      where: { purchaseId },
      include: {
        reviewer: {
          include: {
            profile: true
          }
        },
        reviewee: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async updateReview(id: string, updateData: {
    rating?: number;
    comment?: string;
  }): Promise<Review> {
    return await prisma.review.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        reviewer: {
          include: {
            profile: true
          }
        },
        reviewee: {
          include: {
            profile: true
          }
        },
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            }
          }
        }
      }
    });
  }

  static async deleteReview(id: string): Promise<void> {
    await prisma.review.delete({
      where: { id }
    });
  }

  static async getUserReviews(userId: string, options: {
    page?: number;
    limit?: number;
    asReviewer?: boolean;
    asReviewee?: boolean;
  } = {}): Promise<{ reviews: Review[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, asReviewer, asReviewee } = options;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (asReviewer && !asReviewee) {
      where.reviewerId = userId;
    } else if (asReviewee && !asReviewer) {
      where.revieweeId = userId;
    } else {
      // Default: get reviews where user is either reviewer or reviewee
      where = {
        OR: [
          { reviewerId: userId },
          { revieweeId: userId }
        ]
      };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          reviewer: {
            include: {
              profile: true
            }
          },
          reviewee: {
            include: {
              profile: true
            }
          },
          purchase: {
            include: {
              listing: {
                include: {
                  game: true
                }
              }
            }
          }
        }
      }),
      prisma.review.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      reviews,
      total,
      totalPages
    };
  }

  static async getSellerReviews(sellerId: string, options: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ reviews: Review[]; total: number; totalPages: number; averageRating: number }> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where = {
      revieweeId: sellerId,
      isSellerReview: true
    };

    const [reviews, total, ratingStats] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          reviewer: {
            include: {
              profile: true
            }
          },
          purchase: {
            include: {
              listing: {
                include: {
                  game: true
                }
              }
            }
          }
        }
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true }
      })
    ]);

    const totalPages = Math.ceil(total / limit);
    const averageRating = ratingStats._avg.rating || 0;

    return {
      reviews,
      total,
      totalPages,
      averageRating
    };
  }

  static async getBuyerReviews(buyerId: string, options: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ reviews: Review[]; total: number; totalPages: number; averageRating: number }> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where = {
      revieweeId: buyerId,
      isSellerReview: false
    };

    const [reviews, total, ratingStats] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          reviewer: {
            include: {
              profile: true
            }
          },
          purchase: {
            include: {
              listing: {
                include: {
                  game: true
                }
              }
            }
          }
        }
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true }
      })
    ]);

    const totalPages = Math.ceil(total / limit);
    const averageRating = ratingStats._avg.rating || 0;

    return {
      reviews,
      total,
      totalPages,
      averageRating
    };
  }

  static async getReviewStats(userId: string): Promise<{
    totalReviewsGiven: number;
    totalReviewsReceived: number;
    averageRatingGiven: number;
    averageRatingReceived: number;
    sellerRating: number;
    buyerRating: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  }> {
    const [reviewsGiven, reviewsReceived, sellerRating, buyerRating, ratingDistribution] = await Promise.all([
      prisma.review.aggregate({
        where: { reviewerId: userId },
        _count: { id: true },
        _avg: { rating: true }
      }),
      prisma.review.aggregate({
        where: { revieweeId: userId },
        _count: { id: true },
        _avg: { rating: true }
      }),
      prisma.review.aggregate({
        where: { revieweeId: userId, isSellerReview: true },
        _avg: { rating: true }
      }),
      prisma.review.aggregate({
        where: { revieweeId: userId, isSellerReview: false },
        _avg: { rating: true }
      }),
      Promise.all([
        prisma.review.count({ where: { revieweeId: userId, rating: 1 } }),
        prisma.review.count({ where: { revieweeId: userId, rating: 2 } }),
        prisma.review.count({ where: { revieweeId: userId, rating: 3 } }),
        prisma.review.count({ where: { revieweeId: userId, rating: 4 } }),
        prisma.review.count({ where: { revieweeId: userId, rating: 5 } })
      ])
    ]);

    return {
      totalReviewsGiven: reviewsGiven._count.id,
      totalReviewsReceived: reviewsReceived._count.id,
      averageRatingGiven: reviewsGiven._avg.rating || 0,
      averageRatingReceived: reviewsReceived._avg.rating || 0,
      sellerRating: sellerRating._avg.rating || 0,
      buyerRating: buyerRating._avg.rating || 0,
      ratingDistribution: {
        1: ratingDistribution[0],
        2: ratingDistribution[1],
        3: ratingDistribution[2],
        4: ratingDistribution[3],
        5: ratingDistribution[4]
      }
    };
  }

  static async canUserReview(userId: string, purchaseId: string, isSellerReview: boolean): Promise<boolean> {
    // Check if purchase exists and is completed
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        listing: true
      }
    });

    if (!purchase || purchase.status !== 'COMPLETED') {
      return false;
    }

    // Check if user is involved in the purchase
    const isInvolved = isSellerReview 
      ? purchase.buyerId === userId  // Buyer reviewing seller
      : purchase.listing.sellerId === userId;  // Seller reviewing buyer

    if (!isInvolved) {
      return false;
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        purchaseId,
        reviewerId: userId,
        isSellerReview
      }
    });

    return !existingReview;
  }

  static async getRecentReviews(options: {
    limit?: number;
    minRating?: number;
  } = {}): Promise<Review[]> {
    const { limit = 10, minRating } = options;

    const where: any = {};
    if (minRating) {
      where.rating = {
        gte: minRating
      };
    }

    return await prisma.review.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        reviewer: {
          include: {
            profile: true
          }
        },
        reviewee: {
          include: {
            profile: true
          }
        },
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            }
          }
        }
      }
    });
  }

  static async getFeaturedReviews(options: {
    limit?: number;
  } = {}): Promise<Review[]> {
    const { limit = 5 } = options;

    return await prisma.review.findMany({
      where: {
        rating: {
          gte: 4
        },
        comment: {
          not: null
        }
      },
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        reviewer: {
          include: {
            profile: true
          }
        },
        reviewee: {
          include: {
            profile: true
          }
        },
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            }
          }
        }
      }
    });
  }
}