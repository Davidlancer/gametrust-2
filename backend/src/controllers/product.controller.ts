import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { ApiResponse, MongoFilter } from '../types';

// Create new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    // Check if user is a seller
    const user = await User.findById(userId);
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      res.status(403).json({
        success: false,
        message: 'Only sellers can create products'
      } as ApiResponse);
      return;
    }

    const productData = {
      ...req.body,
      seller: userId
    };

    const product = new Product(productData);
    await product.save();

    // Update seller's product count
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalProducts': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    } as ApiResponse);

    logger.info(`Product created: ${product._id} by user: ${userId}`);
  } catch (error) {
    logger.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get all products with pagination and filters
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      platform,
      genre,
      condition,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      seller
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: MongoFilter = {
      isActive: true
    };

    if (category) filter.category = category;
    if (platform) filter.platform = platform;
    if (genre) filter.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    if (condition) filter.condition = condition;
    if (seller) filter.seller = seller;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as any).$gte = parseFloat(minPrice as string);
      if (maxPrice) (filter.price as any).$lte = parseFloat(maxPrice as string);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('seller', 'firstName lastName username avatar stats.rating stats.totalSales')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('seller', 'firstName lastName username avatar stats.rating stats.totalSales')
      .lean();

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
      return;
    }

    // Increment view count
    await Product.findByIdAndUpdate(id, {
      $inc: { 'stats.views': 1 }
    });

    res.json({
      success: true,
      data: { product }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the seller or admin
    const user = await User.findById(userId);
    if (!user || (product.seller.toString() !== userId && user.role !== 'admin')) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      } as ApiResponse);
      return;
    }

    // Remove fields that shouldn't be updated
    const updates = { ...req.body };
    delete updates.seller;
    delete updates.stats;
    delete updates.createdAt;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('seller', 'firstName lastName username avatar stats.rating stats.totalSales');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    } as ApiResponse);

    logger.info(`Product updated: ${id} by user: ${userId}`);
  } catch (error) {
    logger.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the seller or admin
    const user = await User.findById(userId);
    if (!user || (product.seller.toString() !== userId && user.role !== 'admin')) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      } as ApiResponse);
      return;
    }

    await Product.findByIdAndDelete(id);

    // Update seller's product count
    await User.findByIdAndUpdate(product.seller, {
      $inc: { 'stats.totalProducts': -1 }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    } as ApiResponse);

    logger.info(`Product deleted: ${id} by user: ${userId}`);
  } catch (error) {
    logger.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get products by seller
export const getSellerProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sellerId } = req.params;
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const [products, totalCount] = await Promise.all([
      Product.find({ seller: sellerId, isActive: true })
        .populate('seller', 'firstName lastName username avatar stats.rating stats.totalSales')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments({ seller: sellerId, isActive: true })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get seller products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 8 } = req.query;
    const limitNum = parseInt(limit as string);

    const products = await Product.find({
      isActive: true,
      isFeatured: true
    })
      .populate('seller', 'firstName lastName username avatar stats.rating stats.totalSales')
      .sort({ 'stats.sales': -1, createdAt: -1 })
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: { products }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get product categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: { categories }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Search products with advanced filters
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      q,
      page = 1,
      limit = 12,
      category,
      platform,
      minPrice,
      maxPrice,
      condition,
      sortBy = 'relevance'
    } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        message: 'Search query is required'
      } as ApiResponse);
      return;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build search filter
    const filter: MongoFilter = {
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q as string, 'i')] } }
      ]
    };

    // Additional filters
    if (category) filter.category = category;
    if (platform) filter.platform = platform;
    if (condition) filter.condition = condition;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as any).$gte = parseFloat(minPrice as string);
      if (maxPrice) (filter.price as any).$lte = parseFloat(maxPrice as string);
    }

    // Sort options
    let sortOptions: Record<string, 1 | -1> = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { 'stats.sales': -1, 'stats.views': -1 };
        break;
      default:
        // Relevance sorting (newest first as fallback)
        sortOptions = { createdAt: -1 };
        break;
    }

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('seller', 'firstName lastName username avatar stats.rating stats.totalSales')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        products,
        searchQuery: q,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};