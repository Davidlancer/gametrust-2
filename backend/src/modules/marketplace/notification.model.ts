import { PrismaClient } from '@prisma/client';
import { Notification, NotificationType } from '../../types';

const prisma = new PrismaClient();

export class NotificationModel {
  static async createNotification(notificationData: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    relatedId?: string;
  }): Promise<Notification> {
    return await prisma.notification.create({
      data: {
        ...notificationData,
        isRead: false,
        createdAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async findById(id: string): Promise<Notification | null> {
    return await prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async markAsRead(id: string): Promise<Notification> {
    return await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }

  static async deleteNotification(id: string): Promise<void> {
    await prisma.notification.delete({
      where: { id }
    });
  }

  static async getUserNotifications(userId: string, options: {
    page?: number;
    limit?: number;
    type?: NotificationType;
    unreadOnly?: boolean;
  } = {}): Promise<{ notifications: Notification[]; total: number; totalPages: number; unreadCount: number }> {
    const { page = 1, limit = 20, type, unreadOnly } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      userId
    };

    if (type) {
      where.type = type;
    }

    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      notifications,
      total,
      totalPages,
      unreadCount
    };
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  static async cleanupOldNotifications(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        isRead: true
      }
    });
  }

  // Notification creation helpers for specific events
  static async notifyPurchaseCreated(purchaseId: string, sellerId: string, buyerName: string, gameName: string): Promise<Notification> {
    return await this.createNotification({
      userId: sellerId,
      type: NotificationType.PURCHASE_CREATED,
      title: 'New Purchase',
      message: `${buyerName} has purchased your ${gameName} account`,
      relatedId: purchaseId
    });
  }

  static async notifyPurchaseCompleted(purchaseId: string, buyerId: string, gameName: string): Promise<Notification> {
    return await this.createNotification({
      userId: buyerId,
      type: NotificationType.PURCHASE_COMPLETED,
      title: 'Purchase Completed',
      message: `Your purchase of ${gameName} account has been completed`,
      relatedId: purchaseId
    });
  }

  static async notifyListingSold(listingId: string, sellerId: string, gameName: string): Promise<Notification> {
    return await this.createNotification({
      userId: sellerId,
      type: NotificationType.LISTING_SOLD,
      title: 'Listing Sold',
      message: `Your ${gameName} account listing has been sold`,
      relatedId: listingId
    });
  }

  static async notifyListingExpired(listingId: string, sellerId: string, gameName: string): Promise<Notification> {
    return await this.createNotification({
      userId: sellerId,
      type: NotificationType.LISTING_EXPIRED,
      title: 'Listing Expired',
      message: `Your ${gameName} account listing has expired`,
      relatedId: listingId
    });
  }

  static async notifyEscrowFunded(escrowId: string, sellerId: string, amount: number): Promise<Notification> {
    return await this.createNotification({
      userId: sellerId,
      type: NotificationType.ESCROW_FUNDED,
      title: 'Escrow Funded',
      message: `Escrow has been funded with $${amount}. You can now deliver the account`,
      relatedId: escrowId
    });
  }

  static async notifyEscrowReleased(escrowId: string, sellerId: string, amount: number): Promise<Notification> {
    return await this.createNotification({
      userId: sellerId,
      type: NotificationType.ESCROW_RELEASED,
      title: 'Payment Released',
      message: `$${amount} has been released from escrow to your account`,
      relatedId: escrowId
    });
  }

  static async notifyDisputeCreated(disputeId: string, respondentId: string, reason: string): Promise<Notification> {
    return await this.createNotification({
      userId: respondentId,
      type: NotificationType.DISPUTE_CREATED,
      title: 'Dispute Created',
      message: `A dispute has been created against you: ${reason}`,
      relatedId: disputeId
    });
  }

  static async notifyDisputeResolved(disputeId: string, userId: string, resolution: string): Promise<Notification> {
    return await this.createNotification({
      userId,
      type: NotificationType.DISPUTE_RESOLVED,
      title: 'Dispute Resolved',
      message: `Your dispute has been resolved: ${resolution}`,
      relatedId: disputeId
    });
  }

  static async notifyReviewReceived(reviewId: string, revieweeId: string, rating: number, reviewerName: string): Promise<Notification> {
    return await this.createNotification({
      userId: revieweeId,
      type: NotificationType.REVIEW_RECEIVED,
      title: 'New Review',
      message: `${reviewerName} left you a ${rating}-star review`,
      relatedId: reviewId
    });
  }

  static async notifyAccountVerified(userId: string): Promise<Notification> {
    return await this.createNotification({
      userId,
      type: NotificationType.ACCOUNT_VERIFIED,
      title: 'Account Verified',
      message: 'Your account has been successfully verified'
    });
  }

  static async notifySecurityAlert(userId: string, alertType: string, details: string): Promise<Notification> {
    return await this.createNotification({
      userId,
      type: NotificationType.SECURITY_ALERT,
      title: 'Security Alert',
      message: `${alertType}: ${details}`
    });
  }

  static async notifySystemMaintenance(userId: string, maintenanceDetails: string): Promise<Notification> {
    return await this.createNotification({
      userId,
      type: NotificationType.SYSTEM_MAINTENANCE,
      title: 'System Maintenance',
      message: maintenanceDetails
    });
  }

  static async notifyPromotionalOffer(userId: string, offerTitle: string, offerDetails: string): Promise<Notification> {
    return await this.createNotification({
      userId,
      type: NotificationType.PROMOTIONAL_OFFER,
      title: offerTitle,
      message: offerDetails
    });
  }

  // Bulk notification methods
  static async createBulkNotifications(notifications: Array<{
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    relatedId?: string;
  }>): Promise<void> {
    const notificationData = notifications.map(notification => ({
      ...notification,
      isRead: false,
      createdAt: new Date()
    }));

    await prisma.notification.createMany({
      data: notificationData
    });
  }

  static async notifyAllUsers(notification: {
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
  }): Promise<void> {
    // Get all active users
    const users = await prisma.user.findMany({
      select: { id: true }
    });

    const notifications = users.map(user => ({
      userId: user.id,
      ...notification
    }));

    await this.createBulkNotifications(notifications);
  }

  static async getNotificationStats(userId?: string): Promise<{
    totalNotifications: number;
    unreadNotifications: number;
    notificationsByType: Record<NotificationType, number>;
    recentActivity: number;
  }> {
    const where = userId ? { userId } : {};
    const recentDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

    const [totalNotifications, unreadNotifications, recentActivity, typeStats] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { ...where, isRead: false } }),
      prisma.notification.count({ 
        where: { 
          ...where, 
          createdAt: { gte: recentDate } 
        } 
      }),
      prisma.notification.groupBy({
        by: ['type'],
        where,
        _count: { id: true }
      })
    ]);

    const notificationsByType = typeStats.reduce((acc, stat) => {
      acc[stat.type as NotificationType] = stat._count.id;
      return acc;
    }, {} as Record<NotificationType, number>);

    return {
      totalNotifications,
      unreadNotifications,
      notificationsByType,
      recentActivity
    };
  }
}