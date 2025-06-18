const jwt = require('jsonwebtoken');

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload (usually user id and role)
 * @returns {String} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
    issuer: 'gametrust-api',
    audience: 'gametrust-client'
  });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload (usually user id)
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    issuer: 'gametrust-api',
    audience: 'gametrust-client'
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'gametrust-api',
    audience: 'gametrust-client'
  });
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing both tokens
 */
const generateTokenPair = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    username: user.username
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user._id });

  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRE || '15m'
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateTokenPair
};