import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { User, RegisterData } from '../../types';

const prisma = new PrismaClient();

export class AuthModel {
  /**
   * Create a new user
   * @param userData - User registration data
   * @returns Created user
   */
  static async create(userData: RegisterData): Promise<User> {
    const { name, email, password } = userData;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    return await prisma.user.create({
      data: {
        name: name?.trim() || 'User',
        email: email.toLowerCase(),
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    }) as User;
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User or null
   */
  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    }) as User | null;
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User or null
   */
  static async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    }) as User | null;
  }

  /**
   * Find user by ID with password (for authentication)
   * @param id - User ID
   * @returns User with password or null
   */
  static async findByIdWithPassword(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id
      }
    }) as User | null;
  }

  /**
   * Compare password with hash
   * @param candidatePassword - Plain text password
   * @param hashedPassword - Hashed password
   * @returns Boolean indicating match
   */
  static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Check if user exists by email
   * @param email - User email
   * @returns Boolean indicating existence
   */
  static async existsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      },
      select: {
        id: true
      }
    });
    
    return !!user;
  }

  /**
   * Update user's refresh token (stored in memory/cache for this demo)
   * @param userId - User ID
   * @param refreshToken - New refresh token
   */
  static async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    // For demo purposes, we'll skip storing refresh tokens in DB
    // In production, you might want to add a refreshToken field to the schema
    // or use a separate tokens table
    console.log(`Refresh token updated for user ${userId}`);
  }

  /**
   * Update user's last login timestamp
   * @param userId - User ID
   */
  static async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        updatedAt: new Date()
      }
    });
  }
}