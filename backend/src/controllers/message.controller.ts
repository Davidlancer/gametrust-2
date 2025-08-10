import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const prisma = new PrismaClient();

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
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });
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
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
      });
      if (!conversation) {
        res.status(404).json({
          success: false,
          message: 'Conversation not found'
        } as ApiResponse);
        return;
      }

      // Check if user is part of the conversation
      if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Not authorized to send message in this conversation'
        } as ApiResponse);
        return;
      }
    } else {
      // Create new conversation or find existing one
      conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            { AND: [{ user1Id: userId }, { user2Id: recipientId }] },
            { AND: [{ user1Id: recipientId }, { user2Id: userId }] }
          ]
        }
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            user1Id: userId < recipientId ? userId : recipientId,
            user2Id: userId < recipientId ? recipientId : userId
          }
        });
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        receiverId: recipientId,
        content,
        attachments: attachments || []
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatar: true
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
                displayName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: message.createdAt }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { 
        message,
        conversationId: conversation.id
      }
    } as ApiResponse);

    logger.info(`Message sent: ${message.id} from ${userId} to ${recipientId}`);
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
      prisma.conversation.findMany({
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
                  displayName: true,
                  avatar: true
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
                  displayName: true,
                  avatar: true
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
                  email: true,
                  profile: {
                    select: {
                      displayName: true,
                      avatar: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { lastMessageAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.conversation.count({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId }
          ]
        }
      })
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
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });
    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found'
      } as ApiResponse);
      return;
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation'
      } as ApiResponse);
      return;
    }

    const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  displayName: true,
                  avatar: true
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
                  displayName: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.message.count({ where: { conversationId } })
    ]);

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true, readAt: new Date() }
    });

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

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });
    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the recipient
    if (message.receiverId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message as read'
      } as ApiResponse);
      return;
    }

    // Mark as read
    await prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

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

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });
    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Message not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the sender
    if (message.senderId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      } as ApiResponse);
      return;
    }

    // Soft delete - mark as deleted
    await prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

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

    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
        isDeleted: false
      }
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
    const whereClause: any = {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ],
      content: {
        contains: query as string,
        mode: 'insensitive'
      },
      isDeleted: false
    };

    if (conversationId) {
      whereClause.conversationId = conversationId as string;
    }

    const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where: whereClause,
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  displayName: true,
                  avatar: true
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
                  displayName: true,
                  avatar: true
                }
              }
            }
          },
          conversation: {
            select: {
              id: true,
              user1Id: true,
              user2Id: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.message.count({ where: whereClause })
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