import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../modules/auth/auth.middleware';

const prisma = new PrismaClient();

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

    // Basic validation - Prisma will handle ID validation
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID is required'
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

    // Find or create conversation first
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { AND: [{ user1Id: senderId }, { user2Id: receiverId }] },
          { AND: [{ user1Id: receiverId }, { user2Id: senderId }] }
        ]
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: senderId < receiverId ? senderId : receiverId,
          user2Id: senderId < receiverId ? receiverId : senderId
        }
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        conversationId: conversation.id,
        content: content.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        },
        receiver: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        }
      }
    });

    // Update conversation with last message info
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: message.createdAt
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message,
        conversationId: conversation.id
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

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        },
        user2: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                profile: {
                  select: {
                    displayName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' },
      take: 50
    });

    // Format conversations to include other participant info
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.user1Id === userId ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0] || null;

      return {
        id: conv.id,
        otherParticipant,
        lastMessage,
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

    // Basic validation
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required'
      });
    }

    // Check if user is participant in the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        },
        user2: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const isParticipant = conversation.user1Id === userId || conversation.user2Id === userId;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a participant in this conversation'
      });
    }

    // Get messages in the conversation
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        },
        receiver: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limit
    });

    // Get total count for pagination
    const totalMessages = await prisma.message.count({
      where: {
        conversationId: conversationId
      }
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
          id: conversation.id,
          participants: [conversation.user1, conversation.user2],
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