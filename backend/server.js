const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Since the project uses TypeScript, we need to use ts-node for imports
// or work with the compiled JavaScript files
let authRoutes, userRoutes, productRoutes, orderRoutes, reviewRoutes, messageRoutes, adminRoutes;

try {
  // Try to import from compiled dist folder first
  authRoutes = require('./dist/modules/auth/auth.routes').default;
  userRoutes = require('./dist/routes/user.routes').userRoutes;
  productRoutes = require('./dist/routes/product.routes').default;
  orderRoutes = require('./dist/routes/order.routes').default;
  reviewRoutes = require('./dist/routes/review.routes').default;
  messageRoutes = require('./dist/routes/message.routes').default;
  adminRoutes = require('./dist/routes/admin.routes').default;
} catch (error) {
  console.log('Compiled files not found, using ts-node for TypeScript imports...');
  
  // Fallback to using ts-node for TypeScript files
  require('ts-node/register');
  
  authRoutes = require('./src/modules/auth/auth.routes').default;
  const { userRoutes: userRoutesImport } = require('./src/routes/user.routes');
  userRoutes = userRoutesImport;
  productRoutes = require('./src/routes/product.routes').default;
  orderRoutes = require('./src/routes/order.routes').default;
  reviewRoutes = require('./src/routes/review.routes').default;
  messageRoutes = require('./src/routes/message.routes').default;
  adminRoutes = require('./src/routes/admin.routes').default;
}

const app = express();

// Environment variables
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/gametrust';
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  process.exit(1);
}

// Database connection (Mock for demonstration)
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB:', MONGO_URI);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to Database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
    'http://localhost:4173', // Vite preview server
    'https://yourdomain.com' // Replace with your deployed frontend domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GameTrust API is running',
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Don't log the error if it's a validation error or client error
  if (error.status >= 400 && error.status < 500) {
    console.log(`Client error ${error.status}: ${error.message}`);
  } else {
    console.error('Server error:', error);
  }
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error'
  });
});

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;