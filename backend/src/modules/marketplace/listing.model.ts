import { PrismaClient } from '@prisma/client';
import { Listing, CreateListingData, ListingStatus } from '../../types';

const prisma = new PrismaClient();

export class ListingModel {
  static async createListing(sellerId: string, listingData: CreateListingData): Promise<Listing> {
    return await prisma.listing.create({
      data: {
        sellerId,
        gameId: listingData.gameId,
        title: listingData.title,
        description: listingData.description,
        price: listingData.price,
        currency: listingData.currency || 'USD',
        accountLevel: listingData.accountLevel,
        accountRank: listingData.accountRank,
        accountStats: listingData.accountStats,
        serverRegion: listingData.serverRegion,
        platform: listingData.platform,
        accountEmail: listingData.accountEmail,
        accountPassword: listingData.accountPassword,
        additionalInfo: listingData.additionalInfo,
        images: listingData.images,
        proofImages: listingData.proofImages,
        status: ListingStatus.DRAFT,
        isVisible: false,
        isFeatured: false,
        isPromoted: false,
        viewCount: 0
      },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
        game: true
      }
    });
  }

  static async findById(id: string): Promise<Listing | null> {
    return await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
        game: true,
        purchases: true,
        escrows: true
      }
    });
  }

  static async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    gameId?: string;
    sellerId?: string;
    status?: ListingStatus;
    minPrice?: number;
    maxPrice?: number;
    platform?: string;
    serverRegion?: string;
    sortBy?: 'price' | 'createdAt' | 'viewCount';
    sortOrder?: 'asc' | 'desc';
    isVisible?: boolean;
  } = {}): Promise<{ listings: Listing[]; total: number; totalPages: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      gameId,
      sellerId,
      status,
      minPrice,
      maxPrice,
      platform,
      serverRegion,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isVisible = true
    } = options;

    const skip = (page - 1) * limit;

    const where: any = {
      isVisible
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { game: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (gameId) {
      where.gameId = gameId;
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (platform) {
      where.platform = platform;
    }

    if (serverRegion) {
      where.serverRegion = serverRegion;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          seller: {
            include: {
              profile: true
            }
          },
          game: true
        }
      }),
      prisma.listing.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      listings,
      total,
      totalPages
    };
  }

  static async updateListing(id: string, listingData: Partial<Listing>): Promise<Listing> {
    return await prisma.listing.update({
      where: { id },
      data: {
        ...listingData,
        updatedAt: new Date()
      },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
        game: true
      }
    });
  }

  static async deleteListing(id: string): Promise<void> {
    await prisma.listing.update({
      where: { id },
      data: {
        status: ListingStatus.DELETED,
        isVisible: false,
        updatedAt: new Date()
      }
    });
  }

  static async publishListing(id: string): Promise<Listing> {
    return await prisma.listing.update({
      where: { id },
      data: {
        status: ListingStatus.ACTIVE,
        isVisible: true,
        updatedAt: new Date()
      },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
        game: true
      }
    });
  }

  static async incrementViewCount(id: string): Promise<void> {
    await prisma.listing.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }

  static async markAsSold(id: string): Promise<Listing> {
    return await prisma.listing.update({
      where: { id },
      data: {
        status: ListingStatus.SOLD,
        updatedAt: new Date()
      },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
        game: true
      }
    });
  }

  static async getFeaturedListings(limit: number = 10): Promise<Listing[]> {
    return await prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
        isVisible: true,
        isFeatured: true
      },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
        game: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  static async getPromotedListings(limit: number = 10): Promise<Listing[]> {
    return await prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
        isVisible: true,
        isPromoted: true,
        promotedUntil: {
          gt: new Date()
        }
      },
      include: {
        seller: {
          include: {
            profile: true
          }
        },
        game: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  static async getSellerListings(sellerId: string, options: {
    page?: number;
    limit?: number;
    status?: ListingStatus;
  } = {}): Promise<{ listings: Listing[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      sellerId
    };

    if (status) {
      where.status = status;
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          game: true,
          purchases: true
        }
      }),
      prisma.listing.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      listings,
      total,
      totalPages
    };
  }

  static async expireListings(): Promise<void> {
    await prisma.listing.updateMany({
      where: {
        status: ListingStatus.ACTIVE,
        expiresAt: {
          lt: new Date()
        }
      },
      data: {
        status: ListingStatus.EXPIRED,
        updatedAt: new Date()
      }
    });
  }

  static async getListingsByGame(gameId: string, options: {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    platform?: string;
    serverRegion?: string;
  } = {}): Promise<{ listings: Listing[]; total: number; totalPages: number }> {
    const {
      page = 1,
      limit = 20,
      minPrice,
      maxPrice,
      platform,
      serverRegion
    } = options;

    const skip = (page - 1) * limit;

    const where: any = {
      gameId,
      status: ListingStatus.ACTIVE,
      isVisible: true
    };

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (platform) {
      where.platform = platform;
    }

    if (serverRegion) {
      where.serverRegion = serverRegion;
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          seller: {
            include: {
              profile: true
            }
          },
          game: true
        }
      }),
      prisma.listing.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      listings,
      total,
      totalPages
    };
  }
}