const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data (name, email, password)
   * @returns {Promise<Object>} Created user
   */
  static async create(userData) {
    const { name, email, password } = userData;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    return await prisma.user.create({
      data: {
        name,
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
    });
  }

  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Promise<Object|null>} User or null
   */
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });
  }

  /**
   * Find user by ID
   * @param {String} id - User ID
   * @returns {Promise<Object|null>} User or null
   */
  static async findById(id) {
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
    });
  }

  /**
   * Find user by ID including password (for authentication)
   * @param {String} id - User ID
   * @returns {Promise<Object|null>} User with password or null
   */
  static async findByIdWithPassword(id) {
    return await prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  /**
   * Compare password
   * @param {String} candidatePassword - Password to compare
   * @param {String} hashedPassword - Hashed password from database
   * @returns {Promise<Boolean>} Password match result
   */
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Check if user exists by email
   * @param {String} email - User email
   * @returns {Promise<Boolean>} User exists
   */
  static async existsByEmail(email) {
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
}

module.exports = User;