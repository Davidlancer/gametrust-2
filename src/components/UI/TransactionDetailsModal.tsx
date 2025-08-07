import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import Button from './Button';

interface Transaction {
  id: string;
  type: 'escrow_payment' | 'refund' | 'deposit' | 'referral_bonus';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'disputed';
  date: string;
  orderId?: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!transaction) return null;

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'disputed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'disputed':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    }
  };

  const getPaymentMethod = (type: string) => {
    switch (type) {
      case 'escrow_payment':
        return 'Escrow Payment';
      case 'deposit':
        return 'Bank Transfer';
      case 'refund':
        return 'Automatic Refund';
      case 'referral_bonus':
        return 'Referral System';
      default:
        return 'Unknown';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const isNegative = transaction.amount < 0;
  const Icon = getTransactionIcon(transaction.type);
  const { date, time } = formatDateTime(transaction.date);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container - Higher z-index to appear above backdrop */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 pointer-events-none">
            {/* Modal Content - Desktop centered, Mobile slide-up */}
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.9, 
                y: window.innerWidth < 768 ? '100%' : 20 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9, 
                y: window.innerWidth < 768 ? '100%' : 20 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.4
              }}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-600/50 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center text-2xl">
                    {Icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                    <p className="text-sm text-gray-400">Transaction ID: {transaction.id}</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Transaction Overview */}
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {transaction.description}
                        </h3>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(transaction.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                          {isNegative ? '-' : '+'}₦{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {isNegative ? 'Sent' : 'Received'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Date & Time */}
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <ClockIcon className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-semibold text-white">Date & Time</h4>
                    </div>
                    <p className="text-gray-300">{date}</p>
                    <p className="text-sm text-gray-400">{time}</p>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <CreditCardIcon className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-semibold text-white">Payment Method</h4>
                    </div>
                    <p className="text-gray-300">{getPaymentMethod(transaction.type)}</p>
                    <p className="text-sm text-gray-400">Via GameVault Platform</p>
                  </div>

                  {/* Transaction ID */}
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <DocumentDuplicateIcon className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-semibold text-white">Transaction ID</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-300 font-mono text-sm">{transaction.id}</p>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(transaction.id)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Copy Transaction ID"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(transaction.status)}
                      <h4 className="font-semibold text-white">Status</h4>
                    </div>
                    <p className="text-gray-300 capitalize">{transaction.status}</p>
                    <p className="text-sm text-gray-400">
                      {transaction.status === 'completed' && 'Transaction completed successfully'}
                      {transaction.status === 'pending' && 'Transaction is being processed'}
                      {transaction.status === 'failed' && 'Transaction failed to process'}
                      {transaction.status === 'disputed' && 'Transaction is under dispute'}
                    </p>
                  </div>
                </div>

                {/* Order Details (if applicable) */}
                {transaction.orderId && (
                  <div className="mb-8">
                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-white mb-4 flex items-center space-x-2">
                        <LinkIcon className="w-5 h-5 text-indigo-400" />
                        <span>Related Order</span>
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-300 font-mono">{transaction.orderId}</p>
                          <p className="text-sm text-gray-400">Order Reference</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <span>View Order</span>
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description (if different from title) */}
                <div className="mb-6">
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <h4 className="font-semibold text-white mb-3">Description</h4>
                    <p className="text-gray-300 leading-relaxed">
                      {transaction.description}
                      {transaction.type === 'escrow_payment' && ' - Funds held securely until order completion.'}
                      {transaction.type === 'deposit' && ' - Funds added to your GameVault wallet.'}
                      {transaction.type === 'refund' && ' - Automatic refund processed for cancelled order.'}
                      {transaction.type === 'referral_bonus' && ' - Bonus earned from successful referral.'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center space-x-2"
                    onClick={() => copyToClipboard(transaction.id)}
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                    <span>Copy Transaction ID</span>
                  </Button>
                  
                  {transaction.status === 'disputed' && (
                    <Button
                      variant="primary"
                      className="flex-1 flex items-center justify-center space-x-2"
                    >
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <span>View Dispute</span>
                    </Button>
                  )}
                  
                  {transaction.orderId && (
                    <Button
                      variant="primary"
                      className="flex-1 flex items-center justify-center space-x-2"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      <span>View Order</span>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionDetailsModal;