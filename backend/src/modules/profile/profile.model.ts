import { PrismaClient } from '@prisma/client';
import { UserProfile, UpdateProfileData } from '../../types';

const prisma = new PrismaClient();

export class ProfileModel {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    return await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  static async updateProfile(userId: string, profileData: UpdateProfileData): Promise<UserProfile> {
    return await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...profileData,
        updatedAt: new Date()
      },
      create: {
        userId,
        ...profileData,
        displayName: profileData.displayName || 'User'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  static async uploadAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    return await prisma.userProfile.upsert({
      where: { userId },
      update: {
        avatar: avatarUrl,
        updatedAt: new Date()
      },
      create: {
        userId,
        avatar: avatarUrl,
        displayName: 'User'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  static async updateSettings(userId: string, settings: {
    language?: string;
    timezone?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    marketingEmails?: boolean;
  }): Promise<UserProfile> {
    return await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...settings,
        updatedAt: new Date()
      },
      create: {
        userId,
        ...settings,
        displayName: 'User'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  static async addFavoriteGame(userId: string, gameId: string): Promise<UserProfile> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    const currentFavorites = profile?.favoriteGames || [];
    if (!currentFavorites.includes(gameId)) {
      currentFavorites.push(gameId);
    }

    return await prisma.userProfile.upsert({
      where: { userId },
      update: {
        favoriteGames: currentFavorites,
        updatedAt: new Date()
      },
      create: {
        userId,
        favoriteGames: [gameId],
        displayName: 'User'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  static async removeFavoriteGame(userId: string, gameId: string): Promise<UserProfile> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    const currentFavorites = profile?.favoriteGames || [];
    const updatedFavorites = currentFavorites.filter(id => id !== gameId);

    return await prisma.userProfile.update({
      where: { userId },
      data: {
        favoriteGames: updatedFavorites,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  static async getPublicProfile(userId: string): Promise<Partial<UserProfile> | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        displayName: true,
        bio: true,
        avatar: true,
        country: true,
        favoriteGames: true,
        gamingPlatforms: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            createdAt: true
          }
        }
      }
    });

    return profile;
  }
}