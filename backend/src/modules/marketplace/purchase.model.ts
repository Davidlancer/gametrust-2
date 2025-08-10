import { PrismaClient } from '@prisma/client';
import { Purchase, PurchaseStatus, PurchaseRequest } from '../../types';

const prisma = new PrismaClient();

export class PurchaseModel {
  static async createPurchase(purchaseData: {
    buyerId: string;
    listingId: string;
    sellerId: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
  }): Promise<Purchase> {
    return await prisma.purchase.create({
      data: {
        ...purchaseData,
        status: PurchaseStatus.PENDING,
        purchasedAt: new Date()
      },
      include: {
        buyer: {
          include: {
            profile: true
          }
        },
        listing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        },
        escrow: true
      }
    });
  }

  static async findById(id: string): Promise<Purchase | null> {
    return await prisma.purchase.findUnique({
      where: { id },
      include: {
        buyer: {
          include: {
            profile: true
          }
        },
        listing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        },
        escrow: true,
        sale: true
      }
    });
  }

  static async updatePurchaseStatus(id: string, status: PurchaseStatus, paymentId?: string): Promise<Purchase> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (paymentId) {
      updateData.paymentId = paymentId;
    }

    if (status === PurchaseStatus.PAID) {
      // No specific timestamp for PAID status as purchasedAt is already set
    } else if (status === PurchaseStatus.DELIVERED) {
      // Delivery timestamp will be handled by escrow
    } else if (status === PurchaseStatus.COMPLETED) {
      updateData.completedAt = new Date();
    } else if (status === PurchaseStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    }

    return await prisma.purchase.update({
      where: { id },
      data: updateData,
      include: {
        buyer: {
          include: {
            profile: true
          }
        },
        listing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        },
        escrow: true,
        sale: true
      }
    });
  }

  static async markAsPaid(id: string, paymentId: string): Promise<Purchase> {
    return await this.updatePurchaseStatus(id, PurchaseStatus.PAID, paymentId);
  }

  static async markAsDelivered(id: string): Promise<Purchase> {
    return await this.updatePurchaseStatus(id, PurchaseStatus.DELIVERED);
  }

  static async markAsCompleted(id: string): Promise<Purchase> {
    return await this.updatePurchaseStatus(id, PurchaseStatus.COMPLETED);
  }

  static async markAsCancelled(id: string): Promise<Purchase> {
    return await this.updatePurchaseStatus(id, PurchaseStatus.CANCELLED);
  }

  static async markAsDisputed(id: string): Promise<Purchase> {
    return await this.updatePurchaseStatus(id, PurchaseStatus.DISPUTED);
  }

  static async markAsRefunded(id: string): Promise<Purchase> {
    return await this.updatePurchaseStatus(id, PurchaseStatus.REFUNDED);
  }

  static async getBuyerPurchases(buyerId: string, options: {
    page?: number;
    limit?: number;
    status?: PurchaseStatus;
  } = {}): Promise<{ purchases: Purchase[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      buyerId
    };

    if (status) {
      where.status = status;
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          purchasedAt: 'desc'
        },
        include: {
          listing: {
            include: {
              game: true,
              seller: {
                include: {
                  profile: true
                }
              }
            }
          },
          escrow: true,
          sale: true
        }
      }),
      prisma.purchase.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      purchases,
      total,
      totalPages
    };
  }

  static async getSellerPurchases(sellerId: string, options: {
    page?: number;
    limit?: number;
    status?: PurchaseStatus;
  } = {}): Promise<{ purchases: Purchase[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      sellerId
    };

    if (status) {
      where.status = status;
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          purchasedAt: 'desc'
        },
        include: {
          buyer: {
            include: {
              profile: true
            }
          },
          listing: {
            include: {
              game: true
            }
          },
          escrow: true,
          sale: true
        }
      }),
      prisma.purchase.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      purchases,
      total,
      totalPages
    };
  }

  static async getListingPurchases(listingId: string): Promise<Purchase[]> {
    return await prisma.purchase.findMany({
      where: {
        listingId
      },
      orderBy: {
        purchasedAt: 'desc'
      },
      include: {
        buyer: {
          include: {
            profile: true
          }
        },
        escrow: true,
        sale: true
      }
    });
  }

  static async getPendingPurchases(options: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ purchases: Purchase[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where = {
      status: PurchaseStatus.PENDING
    };

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          purchasedAt: 'asc'
        },
        include: {
          buyer: {
            include: {
              profile: true
            }
          },
          listing: {
            include: {
              game: true,
              seller: {
                include: {
                  profile: true
                }
              }
            }
          },
          escrow: true
        }
      }),
      prisma.purchase.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      purchases,
      total,
      totalPages
    };
  }

  static async getDisputedPurchases(options: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ purchases: Purchase[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where = {
      status: PurchaseStatus.DISPUTED
    };

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          purchasedAt: 'asc'
        },
        include: {
          buyer: {
            include: {
              profile: true
            }
          },
          listing: {
            include: {
              game: true,
              seller: {
                include: {
                  profile: true
                }
              }
            }
          },
          escrow: true
        }
      }),
      prisma.purchase.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      purchases,
      total,
      totalPages
    };
  }

  static async getPurchaseStats(userId?: string): Promise<{
    totalPurchases: number;
    completedPurchases: number;
    pendingPurchases: number;
    disputedPurchases: number;
    totalSpent: number;
    averageOrderValue: number;
  }> {
    const where = userId ? { buyerId: userId } : {};

    const [totalPurchases, completedPurchases, pendingPurchases, disputedPurchases, spentStats] = await Promise.all([
      prisma.purchase.count({ where }),
      prisma.purchase.count({ where: { ...where, status: PurchaseStatus.COMPLETED } }),
      prisma.purchase.count({ where: { ...where, status: PurchaseStatus.PENDING } }),
      prisma.purchase.count({ where: { ...where, status: PurchaseStatus.DISPUTED } }),
      prisma.purchase.aggregate({
        where: { ...where, status: { in: [PurchaseStatus.COMPLETED, PurchaseStatus.DELIVERED] } },
        _sum: { amount: true },
        _avg: { amount: true }
      })
    ]);

    return {
      totalPurchases,
      completedPurchases,
      pendingPurchases,
      disputedPurchases,
      totalSpent: spentStats._sum.amount || 0,
      averageOrderValue: spentStats._avg.amount || 0
    };
  }

  static async cancelExpiredPurchases(): Promise<void> {
    // Cancel purchases that have been pending for more than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    await prisma.purchase.updateMany({
      where: {
        status: PurchaseStatus.PENDING,
        purchasedAt: {
          lt: twentyFourHoursAgo
        }
      },
      data: {
        status: PurchaseStatus.CANCELLED,
        cancelledAt: new Date(),
        updatedAt: new Date()
      }
    });
  }
}