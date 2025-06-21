import { useNotifications } from '../hooks/useNotifications';

interface NotificationToastConfig {
  showToast?: boolean;
  toastTitle?: string;
  toastMessage?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private addNotificationCallback?: (notification: any) => any;
  private showToastCallback?: (type: string, title: string, message: string) => void;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setCallbacks(
    addNotification: (notification: any) => any,
    showToast: (type: string, title: string, message: string) => void
  ) {
    this.addNotificationCallback = addNotification;
    this.showToastCallback = showToast;
  }

  // Wallet notifications
  walletFunded(amount: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'wallet' as const,
      title: 'Wallet Funded',
      body: `You just added ${amount} to your balance.`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'success',
        config?.toastTitle || '💸 Wallet Funded',
        config?.toastMessage || `You just added ${amount} to your balance.`
      );
    }
  }

  walletWithdrawal(amount: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'wallet' as const,
      title: 'Withdrawal Completed',
      body: `Your withdrawal of ${amount} has been processed.`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'success',
        config?.toastTitle || '💸 Withdrawal Completed',
        config?.toastMessage || `Your withdrawal of ${amount} has been processed.`
      );
    }
  }

  // Referral notifications
  referralBonus(amount: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'referral' as const,
      title: 'Referral Bonus',
      body: `You earned ${amount} from a referral.`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'success',
        config?.toastTitle || '🎯 Referral Bonus',
        config?.toastMessage || `You earned ${amount} from a referral.`
      );
    }
  }

  friendJoined(friendName?: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'referral' as const,
      title: 'Friend Joined',
      body: friendName 
        ? `${friendName} just joined GameTrust using your link!`
        : 'Your friend just joined GameTrust using your link!',
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'info',
        config?.toastTitle || '🎯 Friend Joined',
        config?.toastMessage || notification.body
      );
    }
  }

  // Escrow notifications
  escrowReleased(amount: string, orderId: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'escrow' as const,
      title: 'Escrow Released',
      body: `${amount} was released to the seller for Order #${orderId}.`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'success',
        config?.toastTitle || '🛡️ Escrow Released',
        config?.toastMessage || notification.body
      );
    }
  }

  escrowCreated(amount: string, orderId: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'escrow' as const,
      title: 'Escrow Created',
      body: `Escrow of ${amount} created for Order #${orderId}.`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'info',
        config?.toastTitle || '🛡️ Escrow Created',
        config?.toastMessage || notification.body
      );
    }
  }

  // Order notifications
  orderCompleted(itemName: string, orderId?: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'order' as const,
      title: 'Order Completed',
      body: orderId 
        ? `You bought '${itemName}' — Order #${orderId} completed.`
        : `You bought '${itemName}' — Check your inbox for details.`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'success',
        config?.toastTitle || '🛍️ Order Completed',
        config?.toastMessage || notification.body
      );
    }
  }

  newOrder(itemName: string, orderId: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'order' as const,
      title: 'New Order',
      body: `New order received for '${itemName}' — Order #${orderId}.`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'info',
        config?.toastTitle || '🛍️ New Order',
        config?.toastMessage || notification.body
      );
    }
  }

  // Dispute notifications
  disputeOpened(orderId: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'dispute' as const,
      title: 'Dispute Opened',
      body: `A dispute was opened for Order #${orderId}.`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'warning',
        config?.toastTitle || '⚠️ Dispute Opened',
        config?.toastMessage || notification.body
      );
    }
  }

  disputeResolved(orderId: string, resolution: string, config?: NotificationToastConfig) {
    const notification = {
      type: 'dispute' as const,
      title: 'Dispute Resolved',
      body: `Your dispute for Order #${orderId} has been resolved: ${resolution}`,
      time: 'Just now'
    };

    this.addNotificationCallback?.(notification);

    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'success',
        config?.toastTitle || '⚠️ Dispute Resolved',
        config?.toastMessage || notification.body
      );
    }
  }

  // Role switching notification
  roleSwitched(newRole: string, config?: NotificationToastConfig) {
    if (config?.showToast !== false) {
      this.showToastCallback?.(
        'success',
        config?.toastTitle || '🔄 Role Switched',
        config?.toastMessage || `Switched to ${newRole} dashboard`
      );
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Hook to use the notification service with toast integration
export const useNotificationService = () => {
  const { addNotification } = useNotifications();
  
  // This would need to be called from a component that has access to useToast
  const initializeService = (showToast: (type: string, title: string, message: string) => void) => {
    notificationService.setCallbacks(addNotification, showToast);
  };

  return {
    notificationService,
    initializeService
  };
};