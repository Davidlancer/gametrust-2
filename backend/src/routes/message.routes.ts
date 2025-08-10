import express from 'express';
import mongoose from 'mongoose';
import Message from '../models/message.model';
import Conversation from '../models/conversation.model';
import { authenticate } from '../modules/auth/auth.middleware';

const router = express.Router();

// POST / - Send message
router.post('/', authenticate, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user?.userId;

    // Validation
    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receiver ID'
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty'
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself'
      });
    }

    // Create the message
    const message = new Message({
      senderId,
      receiverId,
      content: content.trim()
    });

    await message.save();

    // Find or create conversation
    const participants = [senderId, receiverId].sort();
    let conversation = await Conversation.findOne({
      participants: { $all: participants }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants,
        lastMessage: message._id,
        lastMessageAt: message.createdAt
      });
    } else {
      conversation.lastMessage = message._id as mongoose.Types.ObjectId;
    conversation.lastMessageAt = message.createdAt;
    }

    await conversation.save();

    // Populate sender and receiver info
    await message.populate('senderId', 'username email');
    await message.populate('receiverId', 'username email');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message,
        conversationId: conversation._id
      }
    });
    return;
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
    return;
  }
});

// GET /conversations - List conversations for logged-in user
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'username email')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 })
    .limit(50);

    // Format conversations to include other participant info
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        (p: { _id: mongoose.Types.ObjectId }) => p._id.toString() !== userId
      );

      return {
        _id: conv._id,
        otherParticipant,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      };
    });

    res.json({
      success: true,
      data: {
        conversations: formattedConversations,
        total: formattedConversations.length
      }
    });
    return;
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
    return;
  }
});

// GET /:conversationId - Get messages in conversation
router.get('/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Validate conversation ID
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID'
      });
    }

    // Check if user is participant in the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const isParticipant = conversation.participants.some(
      (p: mongoose.Types.ObjectId) => p.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a participant in this conversation'
      });
    }

    // Get messages in the conversation
    const messages = await Message.find({
      $or: [
        { senderId: { $in: conversation.participants }, receiverId: { $in: conversation.participants } }
      ]
    })
    .populate('senderId', 'username email')
    .populate('receiverId', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    // Get total count for pagination
    const totalMessages = await Message.countDocuments({
      $or: [
        { senderId: { $in: conversation.participants }, receiverId: { $in: conversation.participants } }
      ]
    });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasNextPage: page < Math.ceil(totalMessages / limit),
          hasPrevPage: page > 1
        },
        conversation: {
          _id: conversation._id,
          participants: conversation.participants,
          createdAt: conversation.createdAt
        }
      }
    });
    return;
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
    return;
  }
});

export default router;