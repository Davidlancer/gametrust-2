const User = require('../models/User');
const { generateTokenPair, verifyToken } = require('../utils/generateToken');
const { registerValidation, loginValidation } = require('../validation/authValidation');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    // Validate input
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Save refresh token to user
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    // Update last login
    await user.updateLastLogin();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          rating: user.rating,
          totalSales: user.totalSales,
          isVerified: user.isVerified,
          role: user.role,
          createdAt: user.createdAt
        },
        ...tokens
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    // Validate input
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { email, password } = req.body;

    // Find user by email or username and include password for comparison
    const user = await User.findByEmailOrUsername(email).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Save refresh token to user
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    // Update last login
    await user.updateLastLogin();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          rating: user.rating,
          totalSales: user.totalSales,
          isVerified: user.isVerified,
          role: user.role,
          lastLogin: user.lastLogin
        },
        ...tokens
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          rating: user.rating,
          totalSales: user.totalSales,
          socials: user.socials,
          isVerified: user.isVerified,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken);
      
      // Find user with this refresh token
      const user = await User.findOne({
        _id: decoded.id,
        refreshToken: refreshToken
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Generate new tokens
      const tokens = generateTokenPair(user);

      // Update refresh token in database
      user.refreshToken = tokens.refreshToken;
      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    const user = req.user;

    // Clear refresh token from database
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
  logout
};