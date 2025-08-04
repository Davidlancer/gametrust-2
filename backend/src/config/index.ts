import dotenv from 'dotenv';
import { AppConfig } from '../types';

// Load environment variables
dotenv.config();

const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  database: {
    url: process.env.DATABASE_URL || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessTokenExpire: process.env.JWT_EXPIRE || '15m',
    refreshTokenExpire: process.env.JWT_REFRESH_EXPIRE || '7d'
  }
};

// Validate required environment variables
if (!config.jwt.secret) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!config.database.url) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default config;