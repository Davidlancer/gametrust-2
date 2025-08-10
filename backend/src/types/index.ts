import { Request } from 'express';

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password?: string;
  role?: string;
  isEmailVerified?: boolean;
  refreshToken?: string | null;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}

// Extend Express Request to include user info
/* eslint-disable */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
        email: string;
      };
    }
  }
}
/* eslint-enable */

export interface RegisterData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SocialAuthData {
  token: string;
  email: string;
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

export interface MongoFilter {
  [key: string]: unknown;
}

export interface SortOptions {
  [key: string]: 1 | -1;
}

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface DatabaseConfig {
  url: string;
}

export interface JWTConfig {
  secret: string;
  accessTokenExpire: string;
  refreshTokenExpire: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  database: DatabaseConfig;
  jwt: JWTConfig;
}