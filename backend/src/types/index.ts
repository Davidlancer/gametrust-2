import { Request } from 'express';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
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