import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';
import { sendEmail } from '../utils/email';

// Process payment (placeholder for payment gateway integration)
export const processPayment = async (req: Request, res: Response): Promise<void> => {
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
      orderId,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!orderId || !paymentMethod) {
      res.status(400).json({
        success: false,
        message: 'Order ID and payment method are required'
      } as ApiResponse);
      return;
    }

    // Find the order
    const order = await Order.findById(orderId)
      .populate('buyer', 'email firstName lastName')
      .populate('seller', 'email firstName lastName businessName');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      } as ApiResponse);
      return;
    }

    // Check if user owns the order
    if (order.buyer.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      } as ApiResponse);
      return;
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      res.status(400).json({
        success: false,
        message: 'Order is already paid'
      } as ApiResponse);
      return;
    }

    // Check if order is still valid (not cancelled)
    if (order.status === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'Cannot pay for cancelled order'
      } as ApiResponse);
      return;
    }

    // Process payment based on method
    let paymentResult;
    switch (paymentMethod) {
      case 'stripe':
        paymentResult = await processStripePayment();
        break;
      case 'paypal':
        paymentResult = await processPayPalPayment();
        break;
      case 'bank_transfer':
        paymentResult = await processBankTransfer();
        break;
      default:
        res.status(400).json({
          success: false,
          message: 'Unsupported payment method'
        } as ApiResponse);
        return;
    }

    if (!paymentResult.success) {
      res.status(400).json({
        success: false,
        message: paymentResult.error || 'Payment processing failed'
      } as ApiResponse);
      return;
    }

    // Update order with payment information
    order.paymentStatus = 'paid';
    order.paymentMethod = paymentMethod;
    order.status = 'processing';

    await order.save();

    // Send confirmation emails
    try {
      const buyer = order.buyer as unknown as { email: string; firstName: string };
      const seller = order.seller as unknown as { email: string; firstName: string; businessName?: string };

      // Email to buyer
      await sendEmail({
        to: buyer.email,
        subject: 'Payment Confirmation',
        template: 'payment-confirmation',
        data: {
          firstName: buyer.firstName,
          orderNumber: order.orderNumber,
          amount: order.finalAmount,
          paymentMethod,
          transactionId: paymentResult.transactionId
        }
      });

      // Email to seller
      await sendEmail({
        to: seller.email,
        subject: 'New Order Payment Received',
        template: 'seller-payment-notification',
        data: {
          firstName: seller.firstName,
          businessName: seller.businessName,
          orderNumber: order.orderNumber,
          amount: order.finalAmount,
          buyerName: `${buyer.firstName}`
        }
      });
    } catch (emailError) {
      logger.error('Failed to send payment confirmation emails:', emailError);
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        orderId: order._id,
        transactionId: paymentResult.transactionId,
        amount: order.finalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    } as ApiResponse);

    logger.info(`Payment processed for order ${orderId}: ${paymentResult.transactionId}`);
  } catch (error) {
    logger.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get payment methods
export const getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    // Get user's saved payment methods (placeholder)
    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        type: 'card',
        enabled: true,
        description: 'Pay securely with your credit or debit card'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        type: 'digital_wallet',
        enabled: true,
        description: 'Pay with your PayPal account'
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        type: 'bank_transfer',
        enabled: true,
        description: 'Direct bank transfer (manual verification required)'
      }
    ];

    res.json({
      success: true,
      data: { paymentMethods }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get payment history
export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
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
      limit = 20,
      status,
      paymentMethod
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: Record<string, unknown> = {
      buyer: userId,
      paymentStatus: { $in: ['paid', 'failed', 'refunded'] }
    };

    if (status) {
      filter.paymentStatus = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    const [payments, totalCount] = await Promise.all([
      Order.find(filter)
        .select('orderNumber finalAmount paymentStatus paymentMethod paymentDetails paidAt createdAt')
        .sort({ paidAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        payments,
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
    logger.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Request refund
export const requestRefund = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { orderId } = req.params;
    const { reason, description } = req.body;

    // Find the order
    const order = await Order.findById(orderId)
      .populate('buyer', 'email firstName lastName')
      .populate('seller', 'email firstName lastName businessName');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      } as ApiResponse);
      return;
    }

    // Check if user owns the order
    if (order.buyer.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to request refund for this order'
      } as ApiResponse);
      return;
    }

    // Check if order is eligible for refund
    if (order.paymentStatus !== 'paid') {
      res.status(400).json({
        success: false,
        message: 'Order must be paid to request refund'
      } as ApiResponse);
      return;
    }

    if (order.status === 'refunded') {
      res.status(400).json({
        success: false,
        message: 'Order is already refunded'
      } as ApiResponse);
      return;
    }

    // Check refund eligibility (e.g., within 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (order.createdAt && order.createdAt < thirtyDaysAgo) {
      res.status(400).json({
        success: false,
        message: 'Refund request period has expired (30 days)'
      } as ApiResponse);
      return;
    }

    // Update order status
    order.status = 'cancelled';

    await order.save();

    // Send notification emails
    try {
      const buyer = order.buyer as unknown as { email: string; firstName: string };
      const seller = order.seller as unknown as { email: string; firstName: string; businessName?: string };

      // Email to buyer
      await sendEmail({
        to: buyer.email,
        subject: 'Refund Request Received',
        template: 'refund-request-confirmation',
        data: {
          firstName: buyer.firstName,
          orderNumber: order.orderNumber,
          reason,
          description
        }
      });

      // Email to seller
      await sendEmail({
        to: seller.email,
        subject: 'Refund Request for Your Order',
        template: 'seller-refund-notification',
        data: {
          firstName: seller.firstName,
          businessName: seller.businessName,
          orderNumber: order.orderNumber,
          buyerName: buyer.firstName,
          reason,
          description
        }
      });
    } catch (emailError) {
      logger.error('Failed to send refund request emails:', emailError);
    }

    res.json({
      success: true,
      message: 'Refund request submitted successfully',
      data: {
        orderId: order._id,
        status: order.status,
        refundReason: reason
      }
    } as ApiResponse);

    logger.info(`Refund requested for order ${orderId} by user ${userId}`);
  } catch (error) {
    logger.error('Request refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Payment gateway integration functions (placeholders)
const processStripePayment = async () => {
  // Placeholder for Stripe integration
  // In a real implementation, you would use Stripe SDK
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure
    if (Math.random() > 0.1) { // 90% success rate
      return {
        success: true,
        transactionId: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Payment declined by bank'
      };
    }
  } catch {
    return {
      success: false,
      error: 'Stripe payment processing failed'
    };
  }
};

const processPayPalPayment = async () => {
  // Placeholder for PayPal integration
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      transactionId: `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } catch {
    return {
      success: false,
      error: 'PayPal payment processing failed'
    };
  }
};

const processBankTransfer = async () => {
  // Placeholder for bank transfer processing
  try {
    // Bank transfers require manual verification
    return {
      success: true,
      transactionId: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requiresVerification: true
    };
  } catch {
    return {
      success: false,
      error: 'Bank transfer processing failed'
    };
  }
};