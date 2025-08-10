import { PrismaClient } from '@prisma/client';
import { Game } from '../../types';

const prisma = new PrismaClient();

export class GameModel {
  static async createGame(gameData: {
    name: string;
    slug: string;
    description?: string;
    genre: string[];
    platform: string[];
    publisher?: string;
    releaseDate?: Date;
    imageUrl?: string;
  }): Promise<Game> {
    return await prisma.game.create({
      data: {
        ...gameData,
        isActive: true
      }
    });
  }

  static async findById(id: string): Promise<Game | null> {
    return await prisma.game.findUnique({
      where: { id }
    });
  }

  static async findBySlug(slug: string): Promise<Game | null> {
    return await prisma.game.findUnique({
      where: { slug }
    });
  }

  static async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string[];
    platform?: string[];
    isActive?: boolean;
  } = {}): Promise<{ games: Game[]; total: number; totalPages: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      genre,
      platform,
      isActive = true
    } = options;

    const skip = (page - 1) * limit;

    const where: any = {
      isActive
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { publisher: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (genre && genre.length > 0) {
      where.genre = {
        hasSome: genre
      };
    }

    if (platform && platform.length > 0) {
      where.platform = {
        hasSome: platform
      };
    }

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.game.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      games,
      total,
      totalPages
    };
  }

  static async updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
    return await prisma.game.update({
      where: { id },
      data: {
        ...gameData,
        updatedAt: new Date()
      }
    });
  }

  static async deleteGame(id: string): Promise<void> {
    await prisma.game.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });
  }

  static async getPopularGames(limit: number = 10): Promise<Game[]> {
    return await prisma.game.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            listings: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      },
      orderBy: {
        listings: {
          _count: 'desc'
        }
      },
      take: limit
    });
  }

  static async searchGames(query: string, limit: number = 10): Promise<Game[]> {
    return await prisma.game.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { publisher: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    });
  }

  static async getGamesByGenre(genre: string, limit: number = 20): Promise<Game[]> {
    return await prisma.game.findMany({
      where: {
        isActive: true,
        genre: {
          has: genre
        }
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    });
  }

  static async getGamesByPlatform(platform: string, limit: number = 20): Promise<Game[]> {
    return await prisma.game.findMany({
      where: {
        isActive: true,
        platform: {
          has: platform
        }
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    });
  }

  static async getGameStats(gameId: string): Promise<{
    totalListings: number;
    activeListings: number;
    soldListings: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
  }> {
    const [totalListings, activeListings, soldListings, priceStats] = await Promise.all([
      prisma.listing.count({
        where: { gameId }
      }),
      prisma.listing.count({
        where: { gameId, status: 'ACTIVE' }
      }),
      prisma.listing.count({
        where: { gameId, status: 'SOLD' }
      }),
      prisma.listing.aggregate({
        where: { gameId, status: 'ACTIVE' },
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true }
      })
    ]);

    return {
      totalListings,
      activeListings,
      soldListings,
      averagePrice: priceStats._avg.price || 0,
      priceRange: {
        min: priceStats._min.price || 0,
        max: priceStats._max.price || 0
      }
    };
  }
}