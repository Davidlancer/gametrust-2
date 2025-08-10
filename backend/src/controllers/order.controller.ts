import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { ApiResponse, MongoFilter } from '../types';
import { sendEmail } from '../utils/email';

// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Order items are required'
      } as ApiResponse);
      return;
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`
        } as ApiResponse);
        return;
      }

      if (!product.isActive) {
        res.status(400).json({
          success: false,
          message: `Product ${product.title} is not available`
        } as ApiResponse);
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`
        } as ApiResponse);
        return;
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        title: product.title,
        quantity: item.quantity,
        price: product.price,
        isDigital: product.isDigital || false
      });
    }

    // Calculate fees and total
    const platformFee = subtotal * 0.05; // 5% platform fee
    const shippingFee = 10; // Fixed shipping fee
    const total = subtotal + platformFee + shippingFee;

    // Get the seller from the first product
    const firstProduct = await Product.findById(items[0].productId);
    
    // Create order
    const order = new Order({
      buyer: userId,
      seller: firstProduct?.seller,
      items: orderItems,
      totalAmount: subtotal,
      shippingCost: shippingFee,
      taxAmount: platformFee,
      finalAmount: total,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, 'stats.sales': item.quantity }
      });
    }

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'title images price')
      .populate('items.seller', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: populatedOrder }
    } as ApiResponse);

    logger.info(`Order created: ${order._id} by user: ${userId}`);
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get user orders
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const {
      page = 1,
      limit = 10,
      status,
      type = 'buyer' // buyer or seller
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: MongoFilter = {};
    if (type === 'buyer') {
      filter.buyer = userId;
    } else {
      filter['items.seller'] = userId;
    }

    if (status) {
      filter.status = status;
    }

    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate('buyer', 'firstName lastName email')
        .populate('items.product', 'title images price')
        .populate('items.seller', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        orders,
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
    logger.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
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

    const order = await Order.findById(id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'title images price')
      .populate('items.seller', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      } as ApiResponse);
      return;
    }

    // Check if user has access to this order
    const isBuyer = order.buyer.toString() === userId;
    const isSeller = order.seller.toString() === userId;
    const user = await User.findById(userId);
    const isAdmin = user?.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { order }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const order = await Order.findById(id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.seller', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      } as ApiResponse);
      return;
    }

    // Check authorization
    const isSeller = order.seller.toString() === userId;
    const user = await User.findById(userId);
    const isAdmin = user?.role === 'admin';

    if (!isSeller && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      } as ApiResponse);
      return;
    }

    // Update order status
    order.status = status;
    if (trackingNumber) {
      order.tracking = { trackingNumber };
    }
    if (notes) {
      order.notes = notes;
    }
    await order.save();

    // Send notification email to buyer
    const buyer = await User.findById(order.buyer);
    if (buyer?.email) {
      try {
        await sendEmail({
          to: buyer.email,
          subject: `Order ${status.toUpperCase()}`,
          template: 'order-update',
          data: {
            orderNumber: order.orderNumber,
            status: status,
            trackingNumber: trackingNumber || '',
            notes: notes || ''
          }
        });
      } catch (emailError) {
        logger.error('Failed to send order update email:', emailError);
      }
    }

    const updatedOrder = await Order.findById(id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'title images price')
      .populate('items.seller', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order: updatedOrder }
    } as ApiResponse);

    logger.info(`Order status updated: ${id} to ${status} by user: ${userId}`);
  } catch (error) {
    logger.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const order = await Order.findById(id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'title')
      .populate('items.seller', 'firstName lastName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      } as ApiResponse);
      return;
    }

    // Check if user can cancel this order
    const isBuyer = order.buyer.toString() === userId;
    const user = await User.findById(userId);
    const isAdmin = user?.role === 'admin';

    if (!isBuyer && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      } as ApiResponse);
      return;
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      } as ApiResponse);
      return;
    }

    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    if (reason) {
      order.notes = reason;
    }
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, 'stats.sales': -item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    } as ApiResponse);

    logger.info(`Order cancelled: ${id} by user: ${userId}`);
  } catch (error) {
    logger.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get order statistics
export const getOrderStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { type = 'buyer' } = req.query;

    const filter: MongoFilter = {};
    if (type === 'buyer') {
      filter.buyer = userId;
    } else {
      filter['items.seller'] = userId;
    }

    const [totalOrders, pendingOrders, completedOrders, cancelledOrders] = await Promise.all([
      Order.countDocuments(filter),
      Order.countDocuments({ ...filter, status: 'pending' }),
      Order.countDocuments({ ...filter, status: 'delivered' }),
      Order.countDocuments({ ...filter, status: 'cancelled' })
    ]);

    // Calculate total revenue (for sellers)
    let totalRevenue = 0;
    if (type === 'seller') {
      const revenueResult = await Order.aggregate([
        { $match: { 'items.seller': userId, status: 'delivered' } },
        { $unwind: '$items' },
        { $match: { 'items.seller': userId } },
        { $group: { _id: null, total: { $sum: '$items.total' } } }
      ]);
      totalRevenue = revenueResult[0]?.total || 0;
    }

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        ...(type === 'seller' && { totalRevenue })
      }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};