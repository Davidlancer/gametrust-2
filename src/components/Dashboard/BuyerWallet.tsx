import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  PlusIcon,
  ArrowDownIcon,
  CreditCardIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import { alertUtils } from '../../utils/alertMigration';
import { useEscrow } from '../../hooks/useEscrow';
import EscrowStatusCard from '../UI/EscrowStatusCard';
import TransactionDetailsModal from '../UI/TransactionDetailsModal';

interface Transaction {
  id: string;
  type: 'escrow_payment' | 'refund' | 'deposit' | 'referral_bonus';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'disputed';
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
      return '💳';
    case 'deposit':
      return '💰';
    case 'refund':
      return '↩️';
    case 'referral_bonus':
      return '🎁';
    default:
      return '💳';
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
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
            <p className="text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
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

const BuyerWalletSection: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [isLoading, setIsLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);



  // Use escrow hook for buyer functionality
  const escrowHookResult = useEscrow();
  const {
    escrow
  } = escrowHookResult || {
    escrow: null
  };

  const escrowAmount = escrow?.amount || 0;
  const escrowStatus = escrow?.status || 'none';

  // Mock wallet data - in real app, this would come from an API
  const currentBalance = 125000;
  const pendingBalance = escrowAmount || 70000;

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    let matchesFilter = false;
    
    if (filter === 'all') {
      matchesFilter = true;
    } else if (filter === 'deposit') {
      matchesFilter = transaction.amount > 0;
    } else if (filter === 'escrow_payment') {
      matchesFilter = transaction.amount < 0;
    } else if (filter === 'pending') {
      matchesFilter = transaction.status === 'pending';
    } else {
      matchesFilter = transaction.type === filter;
    }
    
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFundWallet = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      alertUtils.error('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      
      const amount = parseFloat(fundAmount);
      // Payment method processing would go here
      
      alertUtils.success(`Successfully added ₦${amount.toLocaleString()} to your wallet`);
      
      setShowFundModal(false);
      setFundAmount('');
      setPaymentMethod('bank_transfer');
    } catch (error) {
      console.error('Fund wallet error:', error);
      alertUtils.error('Failed to fund wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };

  // Show error state
  if (walletError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Wallet Error</h3>
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
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Escrow Status Banner */}
      {escrow && escrowStatus === 'in_escrow' && (
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

      {/* Main Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">₦{currentBalance.toLocaleString()}</h1>
              <p className="text-white/80 text-sm sm:text-base">Available Balance</p>
            </div>
            
            {pendingBalance > 0 && (
              <div className="text-center sm:text-right">
                <p className="text-lg sm:text-xl font-semibold text-yellow-300">₦{pendingBalance.toLocaleString()}</p>
                <p className="text-white/70 text-xs sm:text-sm">Pending in Escrow</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFundModal(true)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Funds</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-all duration-200"
            >
              <ArrowDownIcon className="w-4 h-4" />
              <span>Withdraw</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 lg:p-6 flex flex-col flex-1 min-h-0 overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Recent Transactions</h2>
            <p className="text-sm text-gray-400">Track your wallet activity</p>
          </div>
        </div>

        {/* Professional Filter Bar */}
        <div className="space-y-3 mb-6">
          {/* Primary Filters - Mobile Stacked, Desktop Horizontal */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Transaction Type Filter Tabs */}
            <div className="flex-1 max-w-full md:max-w-lg">
              <div className="flex items-center bg-gray-800/40 rounded-lg p-0.5 border border-gray-700/30 overflow-hidden">
                {[
                  { value: 'all', label: 'All', count: mockTransactions.length },
                  { value: 'deposit', label: 'Credit', count: mockTransactions.filter(t => t.amount > 0).length },
                  { value: 'escrow_payment', label: 'Debit', count: mockTransactions.filter(t => t.amount < 0).length },
                  { value: 'pending', label: 'Pending', count: mockTransactions.filter(t => t.status === 'pending').length }
                ].map((tab) => (
                  <motion.button
                    key={tab.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilter(tab.value)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 relative overflow-hidden whitespace-nowrap min-w-fit h-auto ${
                      filter === tab.value
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/40'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`px-1 py-0.5 text-[9px] font-semibold rounded-full ${
                          filter === tab.value
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-600/50 text-gray-300'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Additional Filters - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {/* Date Range Filter */}
              <div className="relative min-w-[120px]">
                <select className="appearance-none bg-gray-800/40 border border-gray-700/30 rounded-md px-3 py-1.5 pr-8 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 cursor-pointer hover:bg-gray-700/40 h-auto">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <CalendarDaysIcon className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Amount Range Filter */}
              <div className="relative min-w-[120px]">
                <select className="appearance-none bg-gray-800/40 border border-gray-700/30 rounded-md px-3 py-1.5 pr-8 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 cursor-pointer hover:bg-gray-700/40 h-auto">
                  <option value="all">Any Amount</option>
                  <option value="small">Under ₦10K</option>
                  <option value="medium">₦10K - ₦100K</option>
                  <option value="large">Over ₦100K</option>
                </select>
                <FunnelIcon className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Clear Filters Button */}
              {(filter !== 'all' || searchTerm) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-700/40 hover:bg-gray-600/40 border border-gray-600/30 rounded-md text-xs text-gray-300 hover:text-white transition-all duration-200 h-auto"
                >
                  <XMarkIcon className="w-3 h-3" />
                  <span>Reset</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Search Bar - Full Width */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/40 border border-gray-700/30 rounded-md text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 hover:bg-gray-700/40 h-auto"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Additional Filters */}
          <div className="flex md:hidden flex-wrap gap-2">
            {/* Date Filter - Mobile */}
            <select className="appearance-none bg-gray-800/40 border border-gray-700/30 rounded-md px-3 py-1.5 pr-8 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 cursor-pointer min-w-[100px] h-auto">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Amount Filter - Mobile */}
            <select className="appearance-none bg-gray-800/40 border border-gray-700/30 rounded-md px-3 py-1.5 pr-8 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 cursor-pointer min-w-[100px] h-auto">
              <option value="all">Any Amount</option>
              <option value="small">Under ₦10K</option>
              <option value="medium">₦10K - ₦100K</option>
              <option value="large">Over ₦100K</option>
            </select>

            {/* Clear Filters - Mobile */}
            {(filter !== 'all' || searchTerm) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-700/40 hover:bg-gray-600/40 border border-gray-600/30 rounded-md text-xs text-gray-300 hover:text-white transition-all duration-200 whitespace-nowrap h-auto"
              >
                <XMarkIcon className="w-3 h-3" />
                <span>Reset</span>
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-none">
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
            <div className="space-y-2">
              {filteredTransactions.map((transaction, index) => {
                const Icon = getTransactionIcon(transaction.type);
                const isNegative = transaction.amount < 0;
                
                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTransactionClick(transaction)}
                    className="group relative bg-gray-800/20 hover:bg-gray-700/30 border border-gray-700/30 hover:border-gray-600/50 rounded-xl p-3 sm:p-4 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left: Icon + Details */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Transaction Type Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700/50 rounded-xl flex items-center justify-center text-lg sm:text-xl">
                            {Icon}
                          </div>
                        </div>
                        
                        {/* Transaction Details */}
                         <div className="flex-1 min-w-0">
                           {/* Title */}
                           <h4 
                             className="font-semibold text-white text-sm sm:text-base leading-snug line-clamp-1 md:line-clamp-2" 
                             title={transaction.description}
                           >
                             {transaction.description}
                           </h4>
                         </div>
                        
                        {/* Subtitle - Mobile Stacked */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-0">
                          {/* Status + Date Row */}
                          <div className="flex items-center space-x-2">
                            <span className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full font-medium capitalize text-[10px] sm:text-xs shrink-0 ${
                              transaction.status === 'completed' ? 'bg-green-500/15 text-green-400' :
                              transaction.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                              transaction.status === 'failed' ? 'bg-red-500/15 text-red-400' :
                              'bg-orange-500/15 text-orange-400'
                            }`}>
                              {transaction.status}
                            </span>
                            
                            <span className="hidden sm:inline text-gray-500">•</span>
                            <span className="font-medium truncate text-[11px] sm:text-xs">{transaction.date}</span>
                          </div>
                          
                          {/* Order ID - Second Row on Mobile */}
                          {transaction.orderId && (
                            <div className="flex items-center space-x-2 sm:space-x-0">
                              <span className="hidden sm:inline text-gray-500">•</span>
                              <span className="text-gray-400 font-mono text-[9px] sm:text-[10px] bg-gray-700/30 px-1 py-0.5 sm:px-1.5 rounded shrink-0">
                                {transaction.orderId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right: Amount */}
                      <div className="text-right shrink-0 ml-2">
                        <p className={`font-bold text-sm sm:text-base lg:text-lg leading-tight ${
                          isNegative ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {isNegative ? '-' : '+'}₦{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                          {isNegative ? 'Sent' : 'Received'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Indicator - Left Border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 rounded-l-xl ${
                      transaction.status === 'completed' ? 'bg-green-400' :
                      transaction.status === 'pending' ? 'bg-yellow-400' :
                      transaction.status === 'failed' ? 'bg-red-400' :
                      'bg-orange-400'
                    }`} />
                    
                    {/* Subtle Hover Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

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

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={showTransactionModal}
        onClose={handleCloseTransactionModal}
        transaction={selectedTransaction}
      />
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