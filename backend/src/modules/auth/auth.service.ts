import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';
import { sendEmail } from '../../utils/email';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  role?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  country?: string;
  timezone?: string;
  language?: string;
  favoriteGames?: string[];
  gamingPlatforms?: string[];
}

export class AuthService {
  /**
   * Hash password
   */
  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  private static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Generate email verification token
   */
  private static generateEmailVerificationToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate password reset token
   */
  private static generatePasswordResetToken(): { token: string; hashedToken: string; expires: Date } {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return { token, hashedToken, expires };
  }

  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserData) {
    const { email, password, firstName, lastName, username, role = 'buyer' } = userData;

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Generate email verification token
    const verificationToken = this.generateEmailVerificationToken();

    // Create user with profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          emailVerificationToken: verificationToken,
          isActive: true,
          profile: {
            create: {
              firstName,
              lastName,
              displayName: username || `${firstName} ${lastName}`,
            }
          }
        },
        include: {
          profile: true
        }
      });

      return newUser;
    });

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your GameTrust account',
        template: 'email-verification',
        data: {
          firstName,
          verificationToken,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
        }
      });
    } catch (emailError) {
      logger.error('Failed to send verification email:', emailError);
    }

    return user;
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string, includePassword = false) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      },
      ...(includePassword ? {} : {
        select: {
          id: true,
          email: true,
          isEmailVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          profile: true
        }
      })
    });
  }

  /**
   * Find user by ID
   */
  static async findUserById(id: string, includePassword = false) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
      // ...(includePassword ? {} : {
      //   select: {
      //     id: true,
      //     email: true,
      //     isEmailVerified: true,
      //     isActive: true,
      //     lastLoginAt: true,
      //     createdAt: true,
      //     updatedAt: true,
      //     profile: true
      //   }
      // })
    });
  }

  /**
   * Authenticate user
   */
  static async authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      }
    });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Check if user exists by email
   */
  static async userExistsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });
    return !!user;
  }

  /**
   * Generate password reset token for user
   */
  static async generatePasswordResetTokenForUser(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return null;
    }

    const { token, hashedToken, expires } = this.generatePasswordResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expires
      }
    });

    return { user, token };
  }

  /**
   * Reset user password
   */
  static async resetUserPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return null;
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    return user;
  }

  /**
   * Verify user email
   */
  static async verifyUserEmail(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: hashedToken
      }
    });

    if (!user) {
      return null;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null
      }
    });

    return user;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: UpdateUserData) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: updates
        }
      },
      include: {
        profile: true
      }
    });

    return user;
  }

  /**
   * Change user password
   */
  static async changeUserPassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) {
      return { success: false, message: 'User not found' };
    }

    const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { success: false, message: 'Current password is incorrect' };
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true, message: 'Password changed successfully', user };
  }
}