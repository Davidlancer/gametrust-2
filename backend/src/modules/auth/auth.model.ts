import bcrypt from 'bcrypt';
import { User, RegisterData } from '../../types';

// Mock user storage (in production, this would be a database)
const mockUsers: User[] = [];
let userIdCounter = 1;

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
    
    const newUser: User = {
      id: (userIdCounter++).toString(),
      email,
      password: hashedPassword,
      name,
      role: 'buyer',
      isEmailVerified: false,
      refreshToken: null,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockUsers.push(newUser);
    
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User or null
   */
  static async findByEmail(email: string): Promise<User | null> {
    const user = mockUsers.find(u => u.email === email);
    if (!user) return null;
    
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User or null
   */
  static async findById(id: string): Promise<User | null> {
    const user = mockUsers.find(u => u.id === id);
    if (!user) return null;
    
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _userPwd, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Find user by ID with password (for authentication)
   * @param id - User ID
   * @returns User with password or null
   */
  static async findByIdWithPassword(id: string): Promise<User | null> {
    return mockUsers.find(u => u.id === id) || null;
  }

  /**
   * Find user by email with password (for authentication)
   * @param email - User email
   * @returns User with password or null
   */
  static async findByEmailWithPassword(email: string): Promise<User | null> {
    return mockUsers.find(u => u.email === email) || null;
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
    return mockUsers.some(u => u.email === email);
  }

  /**
   * Update user's refresh token
   * @param userId - User ID
   * @param refreshToken - New refresh token
   */
  static async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.refreshToken = refreshToken;
      user.updatedAt = new Date();
    }
  }

  /**
   * Update user's last login timestamp
   * @param userId - User ID
   */
  static async updateLastLogin(userId: string): Promise<void> {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
    }
  }

  /**
   * Update user's email verification status
   * @param userId - User ID
   */
  static async verifyEmail(userId: string): Promise<void> {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.isEmailVerified = true;
      user.updatedAt = new Date();
    }
  }

  /**
   * Update user's password
   * @param userId - User ID
   * @param newPassword - New password (plain text)
   */
  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      const saltRounds = 12;
      user.password = await bcrypt.hash(newPassword, saltRounds);
      user.updatedAt = new Date();
    }
  }
}