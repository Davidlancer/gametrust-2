import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import { useToast } from '../UI/ToastProvider';
import { notificationService } from '../../services/notificationService';
import { useEscrow } from '../../hooks/useEscrow';
import EscrowStatusCard from '../UI/EscrowStatusCard';

interface Transaction {
  id: string;
  type: 'escrow_payment' | 'refund' | 'deposit' | 'referral_bonus';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  orderId?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    type: 'escrow_payment',
    description: 'CODM Legendary Account Purchase',
    amount: -70000,
    status: 'pending',
    date: 'June 18, 2024',
    orderId: 'ORD-001'
  },
  {
    id: 'TXN-002',
    type: 'deposit',
    description: 'Wallet Funding via Bank Transfer',
    amount: 150000,
    status: 'completed',
    date: 'June 17, 2024'
  },
  {
    id: 'TXN-003',
    type: 'escrow_payment',
    description: 'PUBG Elite Account Purchase',
    amount: -50000,
    status: 'completed',
    date: 'June 15, 2024',
    orderId: 'ORD-002'
  },
  {
    id: 'TXN-004',
    type: 'referral_bonus',
    description: 'Referral bonus from @newuser',
    amount: 3000,
    status: 'completed',
    date: 'June 14, 2024'
  },
  {
    id: 'TXN-005',
    type: 'escrow_payment',
    description: 'Free Fire God Mode Account Purchase',
    amount: -30000,
    status: 'disputed',
    date: 'June 12, 2024',
    orderId: 'ORD-003'
  },
  {
    id: 'TXN-006',
    type: 'deposit',
    description: 'Initial Wallet Setup',
    amount: 50000,
    status: 'completed',
    date: 'June 10, 2024'
  }
];

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'escrow_payment':
      return ArrowUpIcon;
    case 'refund':
      return ArrowDownIcon;
    case 'deposit':
      return PlusIcon;
    case 'referral_bonus':
      return BanknotesIcon;
    default:
      return WalletIcon;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircleIcon;
    case 'pending':
      return ClockIcon;
    case 'failed':
      return XCircleIcon;
    default:
      return ClockIcon;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-400';
    case 'pending':
      return 'text-yellow-400';
    case 'failed':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

// Error Boundary Component
class BuyerWalletErrorBoundary extends React.Component<
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
    console.error('BuyerWallet Error:', error, errorInfo);
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

// Main BuyerWallet Section Component
const BuyerWalletSection: React.FC = () => {
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  
  // Safe toast usage with fallback
  let toastHandlers = { showSuccess: () => {}, showError: () => {} };
  try {
    const toast = useToast();
    toastHandlers = toast;
  } catch (toastError) {
    console.warn('Toast provider not available, using fallback handlers');
  }
  const { showSuccess, showError } = toastHandlers;
  
  // Safe escrow hook usage with error handling
  let escrowData = null;
  let updateEscrowStatusFn = () => {};
  let escrowError = null;
  try {
    const { escrow, updateEscrowStatus, error } = useEscrow();
    escrowData = escrow;
    updateEscrowStatusFn = updateEscrowStatus;
    escrowError = error;
  } catch (hookError) {
    console.error('useEscrow hook error:', hookError);
    escrowError = 'Failed to load escrow data';
  }
  
  // Safe fallbacks for wallet data
  const currentBalance = 100000;
  const pendingBalance = escrowData?.amount || 70000; // Amount in escrow
  const escrowAmount = escrowData?.amount || 0;
  const escrowStatus = escrowData?.status || null;
  
  // Debug logging
  console.log('BuyerWallet Load:', { 
    balance: currentBalance, 
    pendingBalance, 
    escrow: escrowData,
    escrowError,
    walletError 
  });
  
  // Initialize component with loading state and error handling
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const timer = setTimeout(() => {
          setIsLoading(false);
          if (escrowError) {
            setWalletError(escrowError);
          }
        }, 1000);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('BuyerWallet data loading error:', error);
        setWalletError('Failed to load wallet data');
        setIsLoading(false);
      }
    };
    
    loadWalletData();
  }, [escrowError]);

  const filteredTransactions = mockTransactions.filter(transaction => {
    try {
      const matchesFilter = filter === 'all' || transaction.type === filter;
      const matchesSearch = (transaction?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    } catch (error) {
      console.error('Error filtering transactions:', error);
      return true; // Show transaction if filtering fails
    }
  });

  const handleFundWallet = () => {
    try {
      if (!fundAmount || parseFloat(fundAmount) <= 0) {
        showError('Invalid Amount', 'Please enter a valid amount to fund your wallet.');
        return;
      }
      
      const amount = parseFloat(fundAmount);
      const methodName = paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                        paymentMethod === 'card' ? 'Debit/Credit Card' : 'USSD';
      
      // Use notification service for both notification and toast
      notificationService.walletFunded(
        `₦${amount.toLocaleString()}`,
        {
          toastTitle: '💸 Wallet Funded',
          toastMessage: `You just added ₦${amount.toLocaleString()} to your balance.`
        }
      );
      
      setShowFundModal(false);
      setFundAmount('');
    } catch (error) {
      console.error('Error funding wallet:', error);
      showError('Error', 'Error funding wallet. Please try again.');
    }
  };

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
    <div className="h-full flex flex-col space-y-6">
      {/* Escrow Status Banner */}
      {escrowData && escrowStatus === 'in_escrow' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">Active Escrow Transaction</h3>
                <p className="text-yellow-300">₦{escrowAmount.toLocaleString()} is currently held in escrow</p>
              </div>
            </div>
            <EscrowStatusCard status={escrowStatus} />
          </div>
        </div>
      )}

      {/* Escrow Actions for Buyer */}
      {escrowData && escrowStatus === 'in_escrow' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Escrow Actions</h3>
          <p className="text-gray-400 text-sm mb-4">
            Once you receive your account details and verify everything is correct, you can release the payment to the seller.
          </p>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => {
                try {
                  updateEscrowStatusFn('released');
                  showSuccess('Success', 'Payment released to seller successfully!');
                } catch (error) {
                  console.error('Error confirming delivery:', error);
                  showError('Error', 'Failed to confirm delivery. Please try again.');
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Confirm Delivery
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                try {
                  updateEscrowStatusFn('disputed');
                  showError('Dispute Raised', 'Dispute raised. Our team will review this case.');
                } catch (error) {
                  console.error('Error raising dispute:', error);
                  showError('Error', 'Failed to raise dispute. Please try again.');
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
              Raise Dispute
            </Button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Wallet</h1>
          <p className="text-gray-400 mt-1">Manage your funds and transaction history</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowFundModal(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Fund Wallet
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <WalletIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            ₦{currentBalance.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-300">Available Balance</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            ₦{pendingBalance.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-300">In Escrow</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            ₦{(currentBalance + pendingBalance).toLocaleString()}
          </h3>
          <p className="text-sm text-gray-300">Total Balance</p>
        </motion.div>
      </div>

      {/* Transaction History */}
      <div className="flex-1 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-white">Transaction History</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Transactions</option>
            <option value="deposit">Deposits</option>
            <option value="escrow_payment">Escrow Payments</option>
            <option value="refund">Refunds</option>
            <option value="referral_bonus">Referral Bonuses</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
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

          {filteredTransactions.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <WalletIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  {filter === 'all' ? 'Your transaction history will appear here' : `No ${filter} transactions found.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.type);
                const StatusIcon = getStatusIcon(transaction.status);
                const isNegative = transaction.amount < 0;
                
                return (
                  <motion.div
                    key={transaction.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isNegative ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{transaction.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(transaction.status)}`} />
                        <span className={`text-sm ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                        {transaction.orderId && (
                          <span className="text-sm text-gray-500">• {transaction.orderId}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${
                        isNegative ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {isNegative ? '-' : '+'}₦{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Fund Wallet</h3>
              <button
                onClick={() => setShowFundModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Debit/Credit Card</option>
                  <option value="ussd">USSD</option>
                </select>
              </div>
              
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CreditCardIcon className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-indigo-400">Secure Payment</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Your payment information is encrypted and secure. Funds will be available immediately after confirmation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFundModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleFundWallet}
                  disabled={!fundAmount || parseFloat(fundAmount) <= 0}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  Fund Wallet
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Main BuyerWallet Component with Error Boundary
const BuyerWallet: React.FC = () => {
  return (
    <BuyerWalletErrorBoundary>
      <BuyerWalletSection />
    </BuyerWalletErrorBoundary>
  );
};

export default BuyerWallet;