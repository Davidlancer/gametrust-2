import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'wallet' | 'referral' | 'escrow' | 'dispute' | 'order' | 'message';
  title: string;
  body: string;
  time: string;
  read: boolean;
  timestamp: number;
  ctaLabel?: string;
  ctaRoute?: string;
}

const STORAGE_KEY = 'gt_notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalNotification, setModalNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadNotifications = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error parsing notifications:', error);
        setNotifications([]);
      }
    }
  }, []);

  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    const updatedNotifications = [newNotification, ...notifications].slice(0, 50); // Keep only latest 50
    saveNotifications(updatedNotifications);
    
    return newNotification;
  }, [notifications, saveNotifications]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Listen for new chat messages
  useEffect(() => {
    const handleNewChatMessage = (event: CustomEvent) => {
      const { orderId, fromUser } = event.detail;
      
      // Add notification for new message
      addNotification({
        type: 'message',
        title: `New Message from @${fromUser}`,
        body: `You have a new message about Order #${orderId}`,
        time: 'Just now',
        ctaLabel: 'Open Chat',
        ctaRoute: `/orders/${orderId}/chat`
      });
    };

    window.addEventListener('newChatMessage', handleNewChatMessage as EventListener);
    return () => {
      window.removeEventListener('newChatMessage', handleNewChatMessage as EventListener);
    };
  }, [addNotification]);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  const clearAllNotifications = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setNotifications([]);
  }, []);

  const generateRandomNotification = useCallback(() => {
    const types: Notification['type'][] = ['wallet', 'referral', 'escrow', 'dispute', 'order', 'message'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const templates = {
      wallet: {
        titles: ['Wallet Funded', 'Payment Received', 'Withdrawal Completed'],
        bodies: [
          'You just added ₦5,000 to your balance.',
          'You received ₦2,500 from a transaction.',
          'Your withdrawal of ₦1,000 has been processed.'
        ]
      },
      referral: {
        titles: ['Referral Bonus', 'Friend Joined', 'Referral Reward'],
        bodies: [
          'You earned ₦500 from a friend\'s transaction.',
          'Your friend just joined GameTrust using your link!',
          'You received ₦250 referral bonus.'
        ]
      },
      escrow: {
        titles: ['Escrow Released', 'Escrow Created', 'Escrow Updated'],
        bodies: [
          '₦70,000 was released to the seller for Order #GTX1234.',
          'Escrow of ₦45,000 created for your purchase.',
          'Escrow status updated for Order #GTX5678.'
        ]
      },
      dispute: {
        titles: ['Dispute Opened', 'Dispute Resolved', 'Dispute Update'],
        bodies: [
          'A dispute was opened for Order #GTX5678.',
          'Your dispute for Order #GTX1234 has been resolved.',
          'New message in your dispute case #D123.'
        ]
      },
      order: {
        titles: ['Order Completed', 'New Order', 'Order Update'],
        bodies: [
          'You bought \'PUBG Elite\' — Check your inbox for details.',
          'New order received for \'Fortnite V-Bucks\'.',
          'Your order #GTX9999 status has been updated.'
        ]
      },
      message: {
        titles: ['New Message from @SellerX', 'New Message from @BuyerY', 'Chat Message'],
        bodies: [
          'You have a new message about Order #GTX1234',
          'New message: "Thanks for the quick delivery!"',
          'You received a message about your recent order.'
        ]
      }
    };

    const template = templates[randomType];
    const randomTitle = template.titles[Math.floor(Math.random() * template.titles.length)];
    const randomBody = template.bodies[Math.floor(Math.random() * template.bodies.length)];

    return addNotification({
      type: randomType,
      title: randomTitle,
      body: randomBody,
      time: 'Just now'
    });
  }, [addNotification]);

  const initializeMockData = useCallback(() => {
    // Always initialize mock data if no notifications exist
    if (notifications.length > 0) return;

    const mockNotifications: Notification[] = [
      {
        id: 'n1',
        type: 'wallet',
        title: 'Wallet Funded',
        body: 'You just added ₦5,000 to your balance.',
        time: 'Just now',
        read: false,
        timestamp: Date.now(),
        ctaLabel: 'View Wallet',
        ctaRoute: '/wallet'
      },
      {
        id: 'n2',
        type: 'referral',
        title: 'You earned ₦500!',
        body: 'Your friend @AceCODM just completed a transaction. You\'ve been credited ₦500 in your referral wallet.',
        time: '1h ago',
        read: false,
        timestamp: Date.now() - 3600000,
        ctaLabel: 'View Referrals',
        ctaRoute: '/referrals'
      },
      {
        id: 'n3',
        type: 'escrow',
        title: 'Escrow Released',
        body: '₦70,000 has been sent to the seller for Order #GTX54321. Funds successfully released.',
        time: '2h ago',
        read: true,
        timestamp: Date.now() - 7200000,
        ctaLabel: 'View Order',
        ctaRoute: '/orders/GTX54321'
      },
      {
        id: 'n4',
        type: 'order',
        title: 'Order Completed',
        body: 'You bought \'PUBG Elite\' — Check your inbox for details.',
        time: '3h ago',
        read: true,
        timestamp: Date.now() - 10800000,
        ctaLabel: 'View Order',
        ctaRoute: '/orders'
      },
      {
        id: 'n5',
        type: 'dispute',
        title: 'Dispute Opened',
        body: 'You reported an issue with \'CODM Legend Account\'. Our team is reviewing your case.',
        time: '1d ago',
        read: false,
        timestamp: Date.now() - 86400000,
        ctaLabel: 'Go to Disputes',
        ctaRoute: '/disputes'
      }
    ];

    saveNotifications(mockNotifications);
  }, [notifications.length, saveNotifications]);

  // Initialize mock data after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMockData();
    }, 100);
    return () => clearTimeout(timer);
  }, [initializeMockData]);

  const openNotificationModal = useCallback((notification: Notification) => {
    setModalNotification(notification);
    setIsModalOpen(true);
    // Mark as read when opening modal
    markAsRead(notification.id);
  }, [markAsRead]);

  const closeNotificationModal = useCallback(() => {
    setIsModalOpen(false);
    setModalNotification(null);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    generateRandomNotification,
    initializeMockData,
    loadNotifications,
    // Modal state and functions
    modalNotification,
    isModalOpen,
    openNotificationModal,
    closeNotificationModal
  };
};

export default useNotifications;