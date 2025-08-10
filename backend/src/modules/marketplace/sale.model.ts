import { PrismaClient } from '@prisma/client';
import { Sale, SaleStatus } from '../../types';

const prisma = new PrismaClient();

export class SaleModel {
  static async createSale(saleData: {
    sellerId: string;
    listingId: string;
    purchaseId: string;
    buyerId: string;
    amount: number;
    currency: string;
    commission: number;
    netAmount: number;
  }): Promise<Sale> {
    return await prisma.sale.create({
      data: {
        ...saleData,
        status: SaleStatus.PENDING,
        soldAt: new Date()
      },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
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
        purchase: true
      }
    });
  }

  static async findById(id: string): Promise<Sale | null> {
    return await prisma.sale.findUnique({
      where: { id },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
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
        purchase: {
          include: {
            escrow: true
          }
        }
      }
    });
  }

  static async findByPurchaseId(purchaseId: string): Promise<Sale | null> {
    return await prisma.sale.findUnique({
      where: { purchaseId },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
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
        purchase: {
          include: {
            escrow: true
          }
        }
      }
    });
  }

  static async updateSaleStatus(id: string, status: SaleStatus): Promise<Sale> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (status === SaleStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (status === SaleStatus.COMPLETED) {
      updateData.completedAt = new Date();
    } else if (status === SaleStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    } else if (status === SaleStatus.REFUNDED) {
      updateData.refundedAt = new Date();
    }

    return await prisma.sale.update({
      where: { id },
      data: updateData,
      include: {
        seller: {
          include: {
            profile: true
          }
        },
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
        purchase: {
          include: {
            escrow: true
          }
        }
      }
    });
  }

  static async markAsDelivered(id: string): Promise<Sale> {
    return await this.updateSaleStatus(id, SaleStatus.DELIVERED);
  }

  static async markAsCompleted(id: string): Promise<Sale> {
    return await this.updateSaleStatus(id, SaleStatus.COMPLETED);
  }

  static async markAsCancelled(id: string): Promise<Sale> {
    return await this.updateSaleStatus(id, SaleStatus.CANCELLED);
  }

  static async markAsDisputed(id: string): Promise<Sale> {
    return await this.updateSaleStatus(id, SaleStatus.DISPUTED);
  }

  static async markAsRefunded(id: string): Promise<Sale> {
    return await this.updateSaleStatus(id, SaleStatus.REFUNDED);
  }

  static async getSellerSales(sellerId: string, options: {
    page?: number;
    limit?: number;
    status?: SaleStatus;
  } = {}): Promise<{ sales: Sale[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      sellerId
    };

    if (status) {
      where.status = status;
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          soldAt: 'desc'
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
          purchase: {
            include: {
              escrow: true
            }
          }
        }
      }),
      prisma.sale.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      sales,
      total,
      totalPages
    };
  }

  static async getBuyerSales(buyerId: string, options: {
    page?: number;
    limit?: number;
    status?: SaleStatus;
  } = {}): Promise<{ sales: Sale[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      buyerId
    };

    if (status) {
      where.status = status;
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          soldAt: 'desc'
        },
        include: {
          seller: {
            include: {
              profile: true
            }
          },
          listing: {
            include: {
              game: true
            }
          },
          purchase: {
            include: {
              escrow: true
            }
          }
        }
      }),
      prisma.sale.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      sales,
      total,
      totalPages
    };
  }

  static async getListingSales(listingId: string): Promise<Sale[]> {
    return await prisma.sale.findMany({
      where: {
        listingId
      },
      orderBy: {
        soldAt: 'desc'
      },
      include: {
        buyer: {
          include: {
            profile: true
          }
        },
        seller: {
          include: {
            profile: true
          }
        },
        purchase: {
          include: {
            escrow: true
          }
        }
      }
    });
  }

  static async getPendingSales(options: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ sales: Sale[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where = {
      status: SaleStatus.PENDING
    };

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          soldAt: 'asc'
        },
        include: {
          seller: {
            include: {
              profile: true
            }
          },
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
          purchase: {
            include: {
              escrow: true
            }
          }
        }
      }),
      prisma.sale.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      sales,
      total,
      totalPages
    };
  }

  static async getDisputedSales(options: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ sales: Sale[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where = {
      status: SaleStatus.DISPUTED
    };

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          soldAt: 'asc'
        },
        include: {
          seller: {
            include: {
              profile: true
            }
          },
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
          purchase: {
            include: {
              escrow: true
            }
          }
        }
      }),
      prisma.sale.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      sales,
      total,
      totalPages
    };
  }

  static async getSaleStats(sellerId?: string): Promise<{
    totalSales: number;
    completedSales: number;
    pendingSales: number;
    disputedSales: number;
    totalRevenue: number;
    totalCommission: number;
    netRevenue: number;
    averageOrderValue: number;
  }> {
    const where = sellerId ? { sellerId } : {};

    const [totalSales, completedSales, pendingSales, disputedSales, revenueStats] = await Promise.all([
      prisma.sale.count({ where }),
      prisma.sale.count({ where: { ...where, status: SaleStatus.COMPLETED } }),
      prisma.sale.count({ where: { ...where, status: SaleStatus.PENDING } }),
      prisma.sale.count({ where: { ...where, status: SaleStatus.DISPUTED } }),
      prisma.sale.aggregate({
        where: { ...where, status: { in: [SaleStatus.COMPLETED, SaleStatus.DELIVERED] } },
        _sum: { 
          amount: true,
          commission: true,
          netAmount: true
        },
        _avg: { amount: true }
      })
    ]);

    return {
      totalSales,
      completedSales,
      pendingSales,
      disputedSales,
      totalRevenue: revenueStats._sum.amount || 0,
      totalCommission: revenueStats._sum.commission || 0,
      netRevenue: revenueStats._sum.netAmount || 0,
      averageOrderValue: revenueStats._avg.amount || 0
    };
  }

  static async getTopSellingGames(options: {
    limit?: number;
    timeframe?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<Array<{
    gameId: string;
    gameName: string;
    totalSales: number;
    totalRevenue: number;
  }>> {
    const { limit = 10, timeframe = 'month' } = options;
    
    let dateFilter: Date;
    const now = new Date();
    
    switch (timeframe) {
      case 'day':
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const results = await prisma.sale.groupBy({
      by: ['listingId'],
      where: {
        status: { in: [SaleStatus.COMPLETED, SaleStatus.DELIVERED] },
        soldAt: {
          gte: dateFilter
        }
      },
      _count: {
        id: true
      },
      _sum: {
        amount: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: limit
    });

    // Get game details for each listing
    const gameStats = await Promise.all(
      results.map(async (result) => {
        const listing = await prisma.listing.findUnique({
          where: { id: result.listingId },
          include: { game: true }
        });
        
        return {
          gameId: listing?.game.id || '',
          gameName: listing?.game.name || 'Unknown Game',
          totalSales: result._count.id,
          totalRevenue: result._sum.amount || 0
        };
      })
    );

    return gameStats;
  }

  static async cancelExpiredSales(): Promise<void> {
    // Cancel sales that have been pending for more than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    await prisma.sale.updateMany({
      where: {
        status: SaleStatus.PENDING,
        soldAt: {
          lt: twentyFourHoursAgo
        }
      },
      data: {
        status: SaleStatus.CANCELLED,
        cancelledAt: new Date(),
        updatedAt: new Date()
      }
    });
  }
}