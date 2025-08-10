import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { User, UserProfile, CreateUserData, UpdateProfileData } from '../../types';

const prisma = new PrismaClient();

export class UserModel {
  static async createUser(userData: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        profile: {
          create: {
            displayName: userData.firstName + (userData.lastName ? ` ${userData.lastName}` : ''),
          }
        }
      },
      include: {
        profile: true,
        socialAccounts: true,
        sessions: true
      }
    });
    
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        socialAccounts: true,
        sessions: true
      }
    });
  }

  static async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        socialAccounts: true,
        sessions: true
      }
    });
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: userData,
      include: {
        profile: true,
        socialAccounts: true,
        sessions: true
      }
    });
  }

  static async updateProfile(userId: string, profileData: UpdateProfileData): Promise<UserProfile> {
    return await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });
  }

  static async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async createSocialUser(socialData: {
    email: string;
    firstName: string;
    lastName?: string;
    provider: string;
    providerId: string;
    avatar?: string;
  }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        firstName: socialData.firstName,
        lastName: socialData.lastName,
        email: socialData.email,
        isEmailVerified: true,
        profile: {
          create: {
            displayName: socialData.firstName + (socialData.lastName ? ` ${socialData.lastName}` : ''),
            avatar: socialData.avatar,
          }
        },
        socialAccounts: {
          create: {
            provider: socialData.provider,
            providerId: socialData.providerId,
          }
        }
      },
      include: {
        profile: true,
        socialAccounts: true,
        sessions: true
      }
    });
    
    return user;
  }

  static async findBySocialAccount(provider: string, providerId: string): Promise<User | null> {
    const socialAccount = await prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId
        }
      },
      include: {
        user: {
          include: {
            profile: true,
            socialAccounts: true,
            sessions: true
          }
        }
      }
    });
    
    return socialAccount?.user || null;
  }
}