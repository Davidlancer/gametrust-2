import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Message, Conversation } from '../models/Message';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { ApiResponse, MongoFilter } from '../types';

// Send a message
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { recipientId, content, conversationId, productId, orderId, attachments } = req.body;

    // Validate required fields
    if (!recipientId || !content) {
      res.status(400).json({
        success: false,
        message: 'Recipient and content are required'
      } as ApiResponse);
      return;
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404).json({
        success: false,
        message: 'Recipient not found'
      } as ApiResponse);
      return;
    }

    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        res.status(404).json({
          success: false,
          message: 'Conversation not found'
        } as ApiResponse);
        return;
      }

      // Check if user is part of the conversation
      if (!conversation.participants.includes(new mongoose.Types.ObjectId(userId))) {
        res.status(403).json({
          success: false,
          message: 'Not authorized to send message in this conversation'
        } as ApiResponse);
        return;
      }
    } else {
      // Create new conversation or find existing one
      conversation = await Conversation.findOne({
        participants: { $all: [userId, recipientId] },
        ...(productId && { product: productId })
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [userId, recipientId],
          product: productId,
          order: orderId
        });
        await conversation.save();
      }
    }

    // Create message
    const message = new Message({
      conversation: conversation._id,
      sender: userId,
      recipient: recipientId,
      content,
      attachments: attachments || [],
      messageType: attachments && attachments.length > 0 ? 'media' : 'text'
    });

    await message.save();

    // Populate message for response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName username avatar')
      .populate('recipient', 'firstName lastName username avatar')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { 
        message: populatedMessage,
        conversationId: conversation._id
      }
    } as ApiResponse);

    logger.info(`Message sent: ${message._id} from ${userId} to ${recipientId}`);
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get user conversations
export const getConversations = async (req: Request, res: Response): Promise<void> => {
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
      limit = 20
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [conversations, totalCount] = await Promise.all([
      Conversation.find({ participants: userId })
        .populate('participants', 'firstName lastName username avatar')
        .populate('product', 'title images price')
        .populate('lastMessage')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Conversation.countDocuments({ participants: userId })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        conversations,
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
    logger.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get messages in a conversation
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
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
      limit = 50
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Check if user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found'
      } as ApiResponse);
      return;
    }

    if (!conversation.participants.includes(new mongoose.Types.ObjectId(userId))) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation'
      } as ApiResponse);
      return;
    }

    const [messages, totalCount] = await Promise.all([
      Message.find({ conversation: conversationId })
        .populate('sender', 'firstName lastName username avatar')
        .populate('recipient', 'firstName lastName username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Message.countDocuments({ conversation: conversationId })
    ]);

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        recipient: userId,
        isRead: false
      },
      { isRead: true, readAt: new Date() }
    );

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
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
    logger.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Mark message as read
export const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message as read'
      } as ApiResponse);
      return;
    }

    // Mark as read
    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read'
    } as ApiResponse);
  } catch (error) {
    logger.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Delete message
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the sender
    if (message.sender.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      } as ApiResponse);
      return;
    }

    // Soft delete - mark as deleted
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    } as ApiResponse);

    logger.info(`Message deleted: ${messageId} by user: ${userId}`);
  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Get unread message count
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

    const unreadCount = await Message.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false
    });

    res.json({
      success: true,
      data: { unreadCount }
    } as ApiResponse);
  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

// Search messages
export const searchMessages = async (req: Request, res: Response): Promise<void> => {
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
      query,
      conversationId,
      page = 1,
      limit = 20
    } = req.query;

    if (!query) {
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
      $or: [
        { sender: userId },
        { recipient: userId }
      ],
      content: { $regex: query, $options: 'i' },
      isDeleted: false
    };

    if (conversationId) {
      filter.conversation = conversationId;
    }

    const [messages, totalCount] = await Promise.all([
      Message.find(filter)
        .populate('sender', 'firstName lastName username avatar')
        .populate('recipient', 'firstName lastName username avatar')
        .populate('conversation', 'participants product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Message.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        messages,
        searchQuery: query,
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
    logger.error('Search messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};