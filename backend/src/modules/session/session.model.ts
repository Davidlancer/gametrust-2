import { PrismaClient } from '@prisma/client';
import { Session } from '../../types';

const prisma = new PrismaClient();

export class SessionModel {
  static async createSession(sessionData: {
    userId: string;
    token: string;
    refreshToken: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<Session> {
    return await prisma.session.create({
      data: sessionData,
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async findByToken(token: string): Promise<Session | null> {
    return await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            profile: true,
            socialAccounts: true
          }
        }
      }
    });
  }

  static async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          include: {
            profile: true,
            socialAccounts: true
          }
        }
      }
    });
  }

  static async findUserSessions(userId: string): Promise<Session[]> {
    return await prisma.session.findMany({
      where: { 
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
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

  static async updateSession(id: string, data: Partial<Session>): Promise<Session> {
    return await prisma.session.update({
      where: { id },
      data,
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async deactivateSession(token: string): Promise<void> {
    await prisma.session.update({
      where: { token },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    });
  }

  static async deactivateUserSessions(userId: string, excludeToken?: string): Promise<void> {
    await prisma.session.updateMany({
      where: {
        userId,
        isActive: true,
        ...(excludeToken && { token: { not: excludeToken } })
      },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });
  }

  static async cleanupExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        OR: [
          {
            expiresAt: {
              lt: new Date()
            }
          },
          {
            isActive: false,
            updatedAt: {
              lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
            }
          }
        ]
      }
    });
  }

  static async refreshSession(refreshToken: string, newTokenData: {
    token: string;
    expiresAt: Date;
  }): Promise<Session> {
    return await prisma.session.update({
      where: { refreshToken },
      data: {
        token: newTokenData.token,
        expiresAt: newTokenData.expiresAt,
        updatedAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true,
            socialAccounts: true
          }
        }
      }
    });
  }
}