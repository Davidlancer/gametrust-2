import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config';
import { authRoutes } from './modules/auth';
import { ApiResponse } from './types';

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test database connection
prisma.$connect()
  .then(() => console.log('✅ Connected to database'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Routes
app.use('/api/auth', authLimiter, authRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'GameTrust Auth API is running',
    data: {
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv
    }
  };
  res.status(200).json(response);
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    const response: ApiResponse = {
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e: any) => e.message)
    };
    res.status(400).json(response);
    return;
  }
  
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const response: ApiResponse = {
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    };
    res.status(400).json(response);
    return;
  }
  
  const response: ApiResponse = {
    success: false,
    message: config.nodeEnv === 'production' 
      ? 'Internal server error' 
      : err.message
  };
  res.status(500).json(response);
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: 'Route not found'
  };
  res.status(404).json(response);
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 GameTrust Auth Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});