import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { logger } from '../utils/logger';
import { ApiResponse, MongoFilter } from '../types';

// Get user notifications
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
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
      type,
      isRead
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: MongoFilter = {
      recipient: userId
    };

    if (type) {
      filter.type = type;
    }

    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const [notifications, totalCount] = await Promise.all([
      Notification.find(filter)
        .populate('sender', 'firstName lastName username avatar')
        .populate('relatedProduct', 'title images price')
        .populate('relatedOrder', 'orderNumber status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Notification.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        notifications,
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
    logger.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      } as ApiResponse);
      return;
    }

    // Check if user owns the notification
    if (notification.recipient.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to modify this notification'
      } as ApiResponse);
      return;
    }

    // Mark as read
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read'
    } as ApiResponse);
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    await Notification.updateMany(
      {
        recipient: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    } as ApiResponse);

    logger.info(`All notifications marked as read for user: ${userId}`);
  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      } as ApiResponse);
      return;
    }

    // Check if user owns the notification
    if (notification.recipient.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      } as ApiResponse);
      return;
    }

    await Notification.findByIdAndDelete(notificationId);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    } as ApiResponse);

    logger.info(`Notification deleted: ${notificationId} by user: ${userId}`);
  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get unread notification count
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.json({
      success: true,
      data: { unreadCount }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get unread notification count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Create notification (internal use)
export const createNotification = async (
  recipientId: string,
  type: string,
  title: string,
  message: string,
  senderId?: string,
  relatedProductId?: string,
  relatedOrderId?: string,
  actionUrl?: string
): Promise<void> => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      relatedProduct: relatedProductId,
      relatedOrder: relatedOrderId,
      actionUrl
    });

    await notification.save();
    logger.info(`Notification created: ${notification._id} for user: ${recipientId}`);
  } catch (error) {
    logger.error('Create notification error:', error);
  }
};

// Delete old notifications (cleanup)
export const cleanupOldNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    // Delete notifications older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      recipient: userId,
      createdAt: { $lt: thirtyDaysAgo }
    });

    res.json({
      success: true,
      message: `${result.deletedCount} old notifications deleted`
    } as ApiResponse);

    logger.info(`Cleaned up ${result.deletedCount} old notifications for user: ${userId}`);
  } catch (error) {
    logger.error('Cleanup old notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};