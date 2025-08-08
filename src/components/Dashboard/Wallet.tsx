import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import {
  WalletIcon as WalletIconSolid,
  BanknotesIcon as BanknotesIconSolid
} from '@heroicons/react/24/solid';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import Spinner from '../UI/Spinner';
import { mockWalletTransactions } from '../../data/mockData';
import { useEscrow } from '../../hooks/useEscrow';
import EscrowStatusCard from '../UI/EscrowStatusCard';

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'escrow_hold' | 'withdrawal' | 'refund' | 'in_escrow';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'in_escrow';
  date: string;
  relatedListing?: {
    title: string;
    listingId: string;
  } | null;
  counterparty?: {
    username: string;
    userId: string;
  } | null;
  reference: string;
  bankDetails?: string;
}

interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

// Use enhanced transaction data from mockData
const mockTransactions: Transaction[] = mockWalletTransactions as Transaction[];

const mockBankDetails: BankDetails = {
  bankName: 'GTBank',
  accountNumber: '0123456789',
  accountName: 'BLUNT SELLER'
};

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'purchase':
      return <ArrowUpIcon className="w-5 h-5 text-red-400" />;
    case 'sale':
      return <ArrowDownIcon className="w-5 h-5 text-green-400" />;
    case 'escrow_hold':
      return <ClockIcon className="w-5 h-5 text-purple-400" />;
    case 'withdrawal':
      return <ArrowUpIcon className="w-5 h-5 text-red-400" />;
    case 'refund':
      return <ArrowDownIcon className="w-5 h-5 text-blue-400" />;
    case 'in_escrow':
      return <ClockIcon className="w-5 h-5 text-purple-400" />;
    default:
      return <WalletIcon className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusBadge = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">
          <ClockIcon className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case 'failed':
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    case 'in_escrow':
      return (
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border">
          <ClockIcon className="w-3 h-3 mr-1" />
          In Escrow
        </Badge>
      );
    default:
      return null;
  }
};

const getTransactionTypeLabel = (type: Transaction['type']) => {
  switch (type) {
    case 'purchase':
      return 'Purchase';
    case 'sale':
      return 'Sale';
    case 'escrow_hold':
      return 'Escrow Hold';
    case 'withdrawal':
      return 'Withdrawal';
    case 'refund':
      return 'Refund';
    case 'in_escrow':
      return 'In Escrow';
    default:
      return 'Transaction';
  }
};



const formatAmount = (amount: number) => {
  const isCredit = amount > 0;
  const formattedAmount = Math.abs(amount).toLocaleString();
  return {
    display: `${isCredit ? '+' : '-'}₦${formattedAmount}`,
    colorClass: isCredit ? 'text-green-600' : 'text-red-600'
  };
};

// Error Boundary Component
class WalletErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Wallet Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
            <p className="text-gray-400 mb-4">We're having trouble loading your wallet.</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main Wallet Section Component
const WalletSection: React.FC = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [bankDetails, setBankDetails] = useState(mockBankDetails);
  const [showBalance, setShowBalance] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const [isActionBarVisible, setIsActionBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Use escrow hook properly
  const { escrow: escrowData, error: escrowError } = useEscrow();

  // Safe fallbacks for wallet data
  const currentBalance = 125450; // This would come from API
  const safeTransactions = transactions || [];
  const escrowAmount = escrowData?.amount || 0;
  const escrowStatus = escrowData?.status || 'in_escrow';
  
  // Debug logging
  console.log('Wallet Load:', { 
    balance: currentBalance, 
    transactions: safeTransactions.length, 
    escrow: escrowData,
    escrowError,
    walletError 
  });
  
  const pendingWithdrawals = safeTransactions
    .filter(t => t?.type === 'withdrawal' && t?.status === 'pending')
    .reduce((sum, t) => sum + Math.abs(t?.amount || 0), 0);

  // Smart scroll behavior for action bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollThreshold = 100; // Hide after scrolling 100px
      
      // Only hide/show if we've scrolled a significant amount
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        if (scrollingDown && currentScrollY > scrollThreshold) {
          setIsActionBarVisible(false);
        } else if (!scrollingDown || currentScrollY <= scrollThreshold) {
          setIsActionBarVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Hide action bar when modals are open
  const shouldHideActionBar = showWithdrawModal || showSecurityModal || showFilters;

  // Initialize component with loading state and error handling
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        // Simulate wallet data loading
        const timer = setTimeout(() => {
          setIsLoading(false);
          if (escrowError) {
            setWalletError(escrowError);
          }
        }, 1000);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Wallet data loading error:', error);
        setWalletError('Failed to load wallet data');
        setIsLoading(false);
      }
    };
    
    loadWalletData();
  }, [escrowError]);

  const filteredTransactions = transactions.filter(transaction => {
    try {
      const matchesFilter = filter === 'all' || transaction.type === filter;
      const matchesSearch = 
        (transaction?.relatedListing?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction?.reference || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    } catch (error) {
      console.error('Error filtering transactions:', error);
      return true; // Show transaction if filtering fails
    }
  });

  const handleWithdraw = useCallback(() => {
    try {
      const amount = parseFloat(withdrawAmount);
      if (amount > 0 && amount <= currentBalance) {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'withdrawal',
          amount: -amount,
          date: new Date().toISOString(),
          status: 'pending',
          reference: `WTH_${Date.now().toString().slice(-6)}`,
          bankDetails: `${bankDetails.bankName} ****${bankDetails.accountNumber.slice(-4)}`
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setWithdrawAmount('');
        setShowWithdrawModal(false);
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
    }
  }, [withdrawAmount, currentBalance, bankDetails]);

  const toggleTransactionDetails = useCallback((transactionId: string) => {
    setExpandedTransaction(prev => prev === transactionId ? null : transactionId);
  }, []);

  const dismissNotification = useCallback(() => {
    setShowNotifications(false);
  }, []);

  // Show error state
  if (walletError && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Wallet Error</h3>
          <p className="text-gray-400 mb-4">{walletError}</p>
          <Button
            variant="primary"
            onClick={() => {
              setWalletError(null);
              setIsLoading(true);
              window.location.reload();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-400">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:pb-0 mobile-content-padding">
      {/* Notifications/Alerts */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BellIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-400">Security Notice</h3>
                    <p className="text-xs text-blue-300">Your account is fully verified and secure</p>
                  </div>
                </div>
                <button
                  onClick={dismissNotification}
                  className="p-1 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Escrow Status Banner */}
      {escrowData && escrowStatus === 'in_escrow' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden"
        >
          <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <ClockIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400">Active Escrow Transaction</h3>
                  <p className="text-yellow-300">₦{escrowAmount.toLocaleString()} is currently held in escrow</p>
                </div>
              </div>
              <EscrowStatusCard status={escrowStatus} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
            Wallet
          </h1>
          <p className="text-gray-400">Manage your earnings and withdrawals with confidence</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSecurityModal(true)}
            className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all duration-200 group"
          >
            <ShieldCheckIcon className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all duration-200 group"
          >
            <FunnelIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Premium Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative overflow-hidden"
        >
          <div className="bg-gradient-to-br from-[#00FFB2]/20 via-[#00A8E8]/15 to-indigo-500/10 backdrop-blur-xl border border-[#00FFB2]/30 rounded-3xl p-8 relative">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#00FFB2]/20 rounded-2xl backdrop-blur-sm">
                    <WalletIconSolid className="w-8 h-8 text-[#00FFB2]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Available Balance</p>
                    <p className="text-xs text-gray-400">Ready for withdrawal</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 bg-gray-800/30 backdrop-blur-sm rounded-xl hover:bg-gray-700/40 transition-all duration-200 group"
                >
                  {showBalance ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  )}
                </button>
              </div>
              
              <div className="mb-4">
                <motion.p 
                  key={showBalance ? 'visible' : 'hidden'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold text-[#00FFB2] mb-2"
                >
                  {showBalance ? `₦${currentBalance.toLocaleString()}` : '₦••••••'}
                </motion.p>
                <div className="flex items-center space-x-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">+12.5% this month</span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Locked in Escrow</p>
                  <p className="text-lg font-bold text-purple-400">₦{escrowAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Total Earned</p>
                  <p className="text-lg font-bold text-blue-400">₦{(currentBalance + 45000).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Side Stats */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden"
          >
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <ClockIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Processing</p>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-300 mb-1">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-yellow-400">
                ₦{pendingWithdrawals.toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden"
          >
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <BanknotesIconSolid className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-400">+15.2%</p>
                  <ArrowTrendingUpIcon className="w-3 h-3 text-green-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-300 mb-1">This Month</p>
              <p className="text-2xl font-bold text-green-400">
                ₦{transactions
                  .filter(t => t.amount > 0 && new Date(t.date).getMonth() === new Date().getMonth())
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Smart Sticky Action Buttons - Desktop */}
      <div className="hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="sticky top-4 z-20 bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary Withdraw Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWithdrawModal(true)}
              disabled={currentBalance <= 0}
              className="relative overflow-hidden bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-[#00FFB2]/25 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center space-x-2">
                <ArrowUpIcon className="w-5 h-5" />
                <span>Withdraw Funds</span>
              </div>
            </motion.button>

            {/* Secondary Actions */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 text-gray-300 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-center space-x-2">
                <ArrowDownIcon className="w-5 h-5 group-hover:text-[#00FFB2] transition-colors" />
                <span>Deposit Funds</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditingBank(true)}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 text-gray-300 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-center space-x-2">
                <CreditCardIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                <span>Bank Details</span>
              </div>
            </motion.button>
          </div>
          
          {/* Quick Info */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">Withdrawals processed within 24 hours • Secure & encrypted</p>
          </div>
        </motion.div>
      </div>

      {/* Mobile Optimized Sticky Action Bar */}
      <AnimatePresence>
        {!shouldHideActionBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: isActionBarVisible ? 0 : 100, 
              opacity: isActionBarVisible ? 1 : 0 
            }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 mobile-action-bar action-bar-transition"
          >
            {/* Mobile Action Buttons */}
            <div className="flex gap-3">
              {/* Primary Withdraw Button - Takes more space */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowWithdrawModal(true)}
                disabled={currentBalance <= 0}
                className="flex-[2] relative overflow-hidden bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-[#00FFB2]/25 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center space-x-2">
                  <ArrowUpIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">Withdraw</span>
                </div>
              </motion.button>

              {/* Secondary Actions - Compact */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-gray-300 font-medium py-3.5 px-3 rounded-xl hover:bg-gray-700/70 hover:border-gray-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center">
                  <ArrowDownIcon className="w-4 h-4 group-hover:text-[#00FFB2] transition-colors" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditingBank(true)}
                className="flex-1 bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-gray-300 font-medium py-3.5 px-3 rounded-xl hover:bg-gray-700/70 hover:border-gray-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center">
                  <CreditCardIcon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                </div>
              </motion.button>
            </div>
            
            {/* Mobile Quick Balance Info */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-400 font-medium">
                Balance: ₦{currentBalance.toLocaleString()} • Secure withdrawals
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Details */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Bank Details</h3>
          {!isEditingBank && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingBank(true)}
            >
              Edit
            </Button>
          )}
        </div>
        
        {isEditingBank ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Name
              </label>
              <input
                type="text"
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails(prev => ({ ...prev, accountName: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                onClick={() => setIsEditingBank(false)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditingBank(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Bank Name</p>
              <p className="text-white font-medium">{bankDetails.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Account Number</p>
              <p className="text-white font-medium">{bankDetails.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Account Name</p>
              <p className="text-white font-medium">{bankDetails.accountName}</p>
            </div>
          </div>
        )}  
      </Card>

      {/* Premium Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6"
      >
        {/* Header with Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Transaction History
            </h3>
            <p className="text-sm text-gray-400">
              {filteredTransactions.length} transactions • Last updated {new Date().toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 focus:border-[#00FFB2]/50 transition-all duration-200 w-full sm:w-64"
              />
            </div>
            
            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                showFilters 
                  ? 'bg-[#00FFB2]/20 text-[#00FFB2] border border-[#00FFB2]/30' 
                  : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
              {filteredTransactions.length !== transactions.length && (
                <div className="w-2 h-2 bg-[#00FFB2] rounded-full" />
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50"
                    >
                      <option value="all">All Transactions</option>
                      <option value="purchase">Purchases</option>
                      <option value="sale">Sales</option>
                      <option value="escrow_hold">Escrow Hold</option>
                      <option value="withdrawal">Withdrawals</option>
                      <option value="refund">Refunds</option>
                      <option value="in_escrow">In Escrow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                    <select className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50">
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Last 6 months</option>
                      <option>All time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount Range</label>
                    <select className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50">
                      <option>Any amount</option>
                      <option>Under ₦10,000</option>
                      <option>₦10,000 - ₦50,000</option>
                      <option>Over ₦50,000</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Desktop Table View */}
        <div className="hidden lg:block">
          <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/30">
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-700/30 bg-gray-800/30">
              <div className="text-sm font-semibold text-gray-300">Transaction</div>
              <div className="text-sm font-semibold text-gray-300">Listing</div>
              <div className="text-sm font-semibold text-gray-300">Party</div>
              <div className="text-sm font-semibold text-gray-300">Amount</div>
              <div className="text-sm font-semibold text-gray-300">Date</div>
              <div className="text-sm font-semibold text-gray-300">Status</div>
            </div>
            <div className="divide-y divide-gray-700/30">
              {filteredTransactions.map((transaction, index) => {
                const amountInfo = formatAmount(transaction.amount);
                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
                    className="grid grid-cols-6 gap-4 p-4 cursor-pointer group transition-all duration-200"
                    onClick={() => toggleTransactionDetails(transaction.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${transaction.amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="text-white font-semibold group-hover:text-[#00FFB2] transition-colors">
                          {getTransactionTypeLabel(transaction.type)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {transaction.relatedListing ? (
                        <div>
                          <p className="text-white font-medium truncate max-w-32">{transaction.relatedListing.title}</p>
                          <p className="text-xs text-gray-400">ID: {transaction.relatedListing.listingId}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      {transaction.counterparty ? (
                        <div>
                          <p className="text-white font-medium">@{transaction.counterparty.username}</p>
                          <p className="text-xs text-gray-400">{transaction.type === 'purchase' ? 'Seller' : 'Buyer'}</p>
                        </div>
                      ) : transaction.bankDetails ? (
                        <div>
                          <p className="text-white font-medium truncate max-w-24">{transaction.bankDetails}</p>
                          <p className="text-xs text-gray-400">Bank</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`font-bold text-lg ${amountInfo.colorClass}`}>
                        {amountInfo.display}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <div>
                        <p className="text-white font-medium">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {getStatusBadge(transaction.status)}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {expandedTransaction === transaction.id ? (
                          <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Premium Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredTransactions.map((transaction, index) => {
            const amountInfo = formatAmount(transaction.amount);
            const isExpanded = expandedTransaction === transaction.id;
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden"
              >
                <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
                     onClick={() => toggleTransactionDetails(transaction.id)}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${transaction.amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{getTransactionTypeLabel(transaction.type)}</p>
                        <p className="text-xs text-gray-400">{transaction.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-bold ${amountInfo.colorClass}`}>
                        {amountInfo.display}
                      </span>
                      <div className="flex items-center justify-end mt-1">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Date</p>
                      <p className="text-sm text-white font-medium">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Time</p>
                      <p className="text-sm text-white font-medium">
                        {new Date(transaction.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Expandable Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-700/50 pt-4 mt-4 space-y-3"
                      >
                        {transaction.relatedListing && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Related Listing</p>
                            <p className="text-white font-medium">{transaction.relatedListing.title}</p>
                            <p className="text-xs text-gray-400">ID: {transaction.relatedListing.listingId}</p>
                          </div>
                        )}
                        
                        {transaction.counterparty && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">{transaction.type === 'purchase' ? 'Seller' : 'Buyer'}</p>
                            <p className="text-white font-medium">@{transaction.counterparty.username}</p>
                          </div>
                        )}
                        
                        {transaction.bankDetails && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Bank Details</p>
                            <p className="text-white font-medium">{transaction.bankDetails}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Expand Indicator */}
                  <div className="flex items-center justify-center mt-3">
                    <div className="w-8 h-1 bg-gray-600 rounded-full">
                      <motion.div 
                        className="h-full bg-[#00FFB2] rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: isExpanded ? '100%' : '25%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Escrow Transaction Display */}
        {escrowData && (
          <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Escrow Transaction</h4>
              <EscrowStatusCard status={escrowStatus} size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Account:</p>
                <p className="text-white">{escrowData.accountId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400">Amount:</p>
                <p className="text-white font-semibold">₦{escrowAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-gray-400 text-xs">Created: {escrowData.createdAt ? new Date(escrowData.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        )}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <WalletIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No Transactions Yet</h4>
            <p className="text-gray-400 max-w-md mx-auto">
              You haven't made any transactions yet. Once you buy or sell an account, your history will appear here.
            </p>
          </div>
        )}
        
        {/* Security & Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <ShieldCheckIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Account Security</h3>
                <p className="text-sm text-gray-400">Your wallet is protected</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSecurityModal(true)}
              className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500/30 transition-colors font-medium"
            >
              Manage
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm font-medium text-green-400">2FA Enabled</span>
              </div>
              <p className="text-xs text-gray-400">Two-factor authentication active</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-sm font-medium text-blue-400">KYC Verified</span>
              </div>
              <p className="text-xs text-gray-400">Identity verification complete</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-[#00FFB2] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#00FFB2]">Secure Wallet</span>
              </div>
              <p className="text-xs text-gray-400">End-to-end encryption</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Security Settings</h3>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-400">Extra security for your account</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </div>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">KYC Verification</p>
                    <p className="text-sm text-gray-400">Identity verification complete</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                </div>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Wallet Encryption</p>
                    <p className="text-sm text-gray-400">End-to-end security active</p>
                  </div>
                  <div className="w-2 h-2 bg-[#00FFB2] rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={() => setShowSecurityModal(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Withdraw Funds</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={currentBalance}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                  placeholder="Enter amount to withdraw"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Available: ₦{currentBalance.toLocaleString()}
                </p>
              </div>
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-400">
                  Funds will be transferred to {bankDetails.bankName} ****{bankDetails.accountNumber.slice(-4)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-6">
              <Button
                variant="primary"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > currentBalance}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              >
                Withdraw
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Main Wallet Component with Error Boundary
const Wallet: React.FC = () => {
  return (
    <WalletErrorBoundary>
      <WalletSection />
    </WalletErrorBoundary>
  );
};

export default Wallet;