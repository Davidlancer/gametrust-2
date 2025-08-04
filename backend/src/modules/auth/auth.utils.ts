import jwt from 'jsonwebtoken';
import config from '../../config';
import { User, AuthTokens, TokenPayload } from '../../types';

/**
 * Generate JWT access token
 * @param payload - Token payload (usually user id and role)
 * @returns JWT token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpire,
    issuer: 'gametrust-api',
    audience: 'gametrust-client'
  } as jwt.SignOptions);
};

/**
 * Generate JWT refresh token
 * @param payload - Token payload (usually user id)
 * @returns JWT refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpire,
    issuer: 'gametrust-api',
    audience: 'gametrust-client'
  } as jwt.SignOptions);
};

/**
 * Verify JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.secret, {
    issuer: 'gametrust-api',
    audience: 'gametrust-client'
  }) as TokenPayload;
};

/**
 * Generate both access and refresh tokens
 * @param user - User object
 * @returns Object containing both tokens
 */
export const generateTokenPair = (user: User): AuthTokens => {
  const payload: TokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  const accessToken = generateAccessToken({ id: user.id, name: user.name, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, name: user.name, email: user.email });

  return {
    accessToken,
    refreshToken
  };
};