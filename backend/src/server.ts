import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config';
import database from './config/database';
import { authRoutes } from './modules/auth';
import { healthRoutes } from './routes/health.routes';
import listingRoutes from './routes/listing.routes';
import { userRoutes } from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import reviewRoutes from './routes/review.routes';
import messageRoutes from './routes/message.routes';
import adminRoutes from './routes/admin.routes';
import { ApiResponse } from './types';



const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.corsOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Environment-aware rate limiting for auth routes
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  console.log('🔓 Rate limiting disabled for auth routes in development mode');
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 10000 : 5, // Very high limit in dev, strict in production
  message: 'Too many authentication attempts, please try again later.',
  skip: isDevelopment ? () => false : undefined // Don't skip in production
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  
  let message = 'Internal server error';
  let statusCode = 500;
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    const validationErr = err as unknown as { errors: Record<string, { message: string }> };
    message = Object.values(validationErr.errors).map((e) => e.message).join(', ');
    statusCode = 400;
  }
  
  // Handle duplicate key errors
  const mongoErr = err as unknown as { code?: number; keyPattern?: Record<string, unknown> };
  if (mongoErr.code === 11000 && mongoErr.keyPattern) {
    const field = Object.keys(mongoErr.keyPattern)[0];
    message = `${field} already exists`;
    statusCode = 409;
  }
  
  const response: ApiResponse = {
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  };
  
  res.status(statusCode).json(response);
});

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: 'Route not found'
  };
  res.status(404).json(response);
});

const PORT = config.port;

app.listen(PORT, async () => {
  console.log(`🚀 GameTrust Auth Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  
  // Connect to database
  await database.connect();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});