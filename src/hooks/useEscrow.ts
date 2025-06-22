import { useState, useEffect } from 'react';
import { useToast } from '../components/UI/ToastProvider';
import { notificationService } from '../services/notificationService';

export interface EscrowTransaction {
  id: string;
  buyerId: string;
  sellerId: string;
  accountId: string;
  listingTitle: string;
  amount: number;
  status: 'in_escrow' | 'released' | 'disputed' | 'refunded';
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

// Safe localStorage access with SSR compatibility
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get localStorage item '${key}':`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Failed to set localStorage item '${key}':`, error);
      return false;
    }
  },
  removeItem: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove localStorage item '${key}':`, error);
      return false;
    }
  }
};

// Validate escrow transaction object
const isValidEscrowTransaction = (obj: any): obj is EscrowTransaction => {
  if (!obj || typeof obj !== 'object') return false;
  
  const requiredFields = ['id', 'buyerId', 'sellerId', 'accountId', 'listingTitle', 'amount', 'status', 'timestamp', 'createdAt', 'updatedAt'];
  const validStatuses = ['in_escrow', 'released', 'disputed', 'refunded'];
  
  return requiredFields.every(field => obj.hasOwnProperty(field)) &&
         typeof obj.id === 'string' &&
         typeof obj.buyerId === 'string' &&
         typeof obj.sellerId === 'string' &&
         typeof obj.accountId === 'string' &&
         typeof obj.listingTitle === 'string' &&
         typeof obj.amount === 'number' &&
         validStatuses.includes(obj.status) &&
         typeof obj.timestamp === 'number' &&
         typeof obj.createdAt === 'string' &&
         typeof obj.updatedAt === 'string';
};

export const useEscrow = () => {
  const [escrow, setEscrow] = useState<EscrowTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Safe toast access with fallback
  let toastHandlers = { showSuccess: () => {}, showError: () => {}, showInfo: () => {} };
  try {
    const toast = useToast();
    toastHandlers = toast;
  } catch (toastError) {
    console.warn('Toast provider not available, using fallback handlers');
  }
  
  const { showSuccess, showError, showInfo } = toastHandlers;

  // Load escrow data from localStorage on mount with comprehensive error handling
  useEffect(() => {
    const loadEscrowData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const storedEscrow = safeLocalStorage.getItem('escrow_transaction');
        
        if (!storedEscrow) {
          setEscrow(null);
          return;
        }
        
        let parsedEscrow;
        try {
          parsedEscrow = JSON.parse(storedEscrow);
        } catch (parseError) {
          console.error('Failed to parse escrow JSON:', parseError);
          setError('Invalid escrow data format');
          safeLocalStorage.removeItem('escrow_transaction');
          setEscrow(null);
          return;
        }
        
        if (!isValidEscrowTransaction(parsedEscrow)) {
          console.error('Invalid escrow transaction structure:', parsedEscrow);
          setError('Invalid escrow transaction data');
          safeLocalStorage.removeItem('escrow_transaction');
          setEscrow(null);
          return;
        }
        
        setEscrow(parsedEscrow);
      } catch (error) {
        console.error('Unexpected error loading escrow data:', error);
        setError('Failed to load escrow data');
        setEscrow(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEscrowData();
  }, []);

  const createEscrowTransaction = (transaction: Omit<EscrowTransaction, 'id' | 'status' | 'timestamp' | 'createdAt' | 'updatedAt'>): EscrowTransaction | null => {
    try {
      // Validate input transaction data
      if (!transaction || typeof transaction !== 'object') {
        console.error('Invalid transaction data provided');
        setError('Invalid transaction data');
        return null;
      }
      
      const requiredFields = ['buyerId', 'sellerId', 'accountId', 'listingTitle', 'amount'];
      const missingFields = requiredFields.filter(field => !transaction.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        setError(`Missing required fields: ${missingFields.join(', ')}`);
        return null;
      }
      
      if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
        console.error('Invalid amount:', transaction.amount);
        setError('Invalid transaction amount');
        return null;
      }
      
      const newEscrow: EscrowTransaction = {
        ...transaction,
        id: `ESCROW_${Date.now()}`,
        status: 'in_escrow',
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const success = safeLocalStorage.setItem('escrow_transaction', JSON.stringify(newEscrow));
      
      if (!success) {
        console.error('Failed to save escrow transaction to localStorage');
        setError('Failed to save transaction');
        return null;
      }
      
      setEscrow(newEscrow);
      setError(null);
      
      try {
        showSuccess('Payment Secured', 'Your payment is now held safely in escrow.');
      } catch (toastError) {
        console.warn('Failed to show success toast:', toastError);
      }
      
      // Add notification for active escrow (safe)
      try {
        if (import.meta.env.MODE === 'development' && notificationService) {
          notificationService.addNotification({
            id: `escrow-${newEscrow.id}`,
            title: 'Escrow Active',
            message: 'You have an active transaction in escrow.',
            type: 'info',
            timestamp: Date.now(),
            read: false
          });
        }
      } catch (notificationError) {
        console.warn('Failed to add notification:', notificationError);
      }
      
      return newEscrow;
    } catch (error) {
      console.error('Unexpected error creating escrow transaction:', error);
      setError('Failed to create escrow transaction');
      return null;
    }
  };

  const updateEscrowStatus = (status: EscrowTransaction['status'], reason?: string): boolean => {
    try {
      if (!escrow) {
        console.warn('No active escrow transaction to update');
        setError('No active escrow transaction');
        return false;
      }
      
      const validStatuses = ['in_escrow', 'released', 'disputed', 'refunded'];
      if (!validStatuses.includes(status)) {
        console.error('Invalid escrow status:', status);
        setError('Invalid escrow status');
        return false;
      }
      
      const updatedEscrow = {
        ...escrow,
        status,
        updatedAt: new Date().toISOString()
      };
      
      const success = safeLocalStorage.setItem('escrow_transaction', JSON.stringify(updatedEscrow));
      
      if (!success) {
        console.error('Failed to save updated escrow status to localStorage');
        setError('Failed to update escrow status');
        return false;
      }
      
      setEscrow(updatedEscrow);
      setError(null);
      
      // Show appropriate toast based on status (safe)
      try {
        switch (status) {
          case 'released':
            showSuccess('Payment Released', 'Payment has been released to the seller.');
            break;
          case 'disputed':
            showError('Dispute Raised', reason || 'A dispute has been raised for this transaction.');
            break;
          case 'refunded':
            showInfo('Payment Refunded', 'Your payment has been refunded.');
            break;
        }
      } catch (toastError) {
        console.warn('Failed to show status update toast:', toastError);
      }
      
      // Add notification for status changes (safe)
      try {
        if (import.meta.env.MODE === 'development' && notificationService) {
          const statusMessages = {
            'in_escrow': 'Transaction is in escrow',
            'released': 'Payment has been released to seller',
            'disputed': 'Dispute has been raised',
            'refunded': 'Payment has been refunded to buyer'
          };
          
          const notificationTypes = {
            'released': 'success',
            'disputed': 'warning',
            'refunded': 'info',
            'in_escrow': 'info'
          };
          
          notificationService.addNotification({
            id: `escrow-update-${updatedEscrow.id}-${Date.now()}`,
            title: 'Escrow Status Updated',
            message: statusMessages[status] || 'Escrow status updated',
            type: notificationTypes[status] as any || 'info',
            timestamp: Date.now(),
            read: false
          });
        }
      } catch (notificationError) {
        console.warn('Failed to add status update notification:', notificationError);
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error updating escrow status:', error);
      setError('Failed to update escrow status');
      return false;
    }
  };

  const clearEscrowTransaction = (): boolean => {
    try {
      const success = safeLocalStorage.removeItem('escrow_transaction');
      
      if (!success) {
        console.error('Failed to clear escrow transaction from localStorage');
        setError('Failed to clear escrow transaction');
        return false;
      }
      
      setEscrow(null);
      setError(null);
      
      try {
        showInfo('Escrow Cleared', 'Escrow transaction has been cleared.');
      } catch (toastError) {
        console.warn('Failed to show clear escrow toast:', toastError);
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error clearing escrow transaction:', error);
      setError('Failed to clear escrow transaction');
      return false;
    }
  };

  const isEscrowActive = (): boolean => {
    try {
      return Boolean(escrow && escrow.status === 'in_escrow');
    } catch (error) {
      console.error('Error checking escrow active status:', error);
      return false;
    }
  };
  
  const getEscrowStatusText = (status?: EscrowTransaction['status']): string => {
    try {
      if (!status) return 'Unknown';
      
      switch (status) {
        case 'in_escrow':
          return 'In Escrow';
        case 'released':
          return 'Released';
        case 'disputed':
          return 'Disputed';
        case 'refunded':
          return 'Refunded';
        default:
          return 'Unknown';
      }
    } catch (error) {
      console.error('Error getting escrow status text:', error);
      return 'Unknown';
    }
  };
  
  const refreshEscrowData = (): void => {
    try {
      const storedEscrow = safeLocalStorage.getItem('escrow_transaction');
      
      if (!storedEscrow) {
        setEscrow(null);
        setError(null);
        return;
      }
      
      const parsedEscrow = JSON.parse(storedEscrow);
      
      if (!isValidEscrowTransaction(parsedEscrow)) {
        console.error('Invalid escrow data during refresh');
        setError('Invalid escrow data');
        safeLocalStorage.removeItem('escrow_transaction');
        setEscrow(null);
        return;
      }
      
      setEscrow(parsedEscrow);
      setError(null);
    } catch (error) {
      console.error('Error refreshing escrow data:', error);
      setError('Failed to refresh escrow data');
    }
  };

  return {
    escrow,
    isLoading,
    error,
    createEscrowTransaction,
    updateEscrowStatus,
    clearEscrowTransaction,
    isEscrowActive,
    getEscrowStatusText,
    refreshEscrowData
  };
};