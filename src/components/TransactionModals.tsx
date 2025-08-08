import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from './UI/Button';
import { showToast } from '../utils/transactionUtils';

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

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSubmit: (transactionId: string, message: string) => void;
}

interface ViewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.15
    }
  }
};

const mobileModalVariants = {
  hidden: {
    opacity: 0,
    y: '100%'
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: {
      duration: 0.2
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSubmit
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(transaction.id, message.trim());
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error submitting issue report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  if (!transaction) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />
          <motion.div
            className="relative w-full h-full md:h-auto md:max-w-md bg-white md:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            variants={window.innerWidth < 768 ? mobileModalVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Report an Issue</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">

            {/* Transaction Details */}
            <div className="p-4 md:p-6 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-900">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">₦{transaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 pb-6 md:pb-8">
              <div className="mb-6">
                <label htmlFor="issue-message" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the issue
                </label>
                <textarea
                  id="issue-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please provide details about the issue you're experiencing with this transaction..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ViewReceiptModal: React.FC<ViewReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleCopyTransactionId = async () => {
    if (!transaction) return;
    
    try {
      await navigator.clipboard.writeText(transaction.id);
      showToast('Transaction ID copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy transaction ID:', error);
      showToast('Failed to copy transaction ID', 'error');
    }
  };

  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const { date, time } = formatDate(transaction.date);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full h-full md:h-auto md:max-w-md bg-white md:rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none flex flex-col"
            variants={window.innerWidth < 768 ? mobileModalVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 print:hidden bg-white sticky top-0 z-10">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Transaction Receipt</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Print Receipt"
                >
                  <PrinterIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
            {/* Receipt Content */}
            <div className="p-4 md:p-8 print:p-6 pb-6 md:pb-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">GameTrust</h1>
                <p className="text-gray-600">Transaction Receipt</p>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Transaction ID</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-gray-900">{transaction.id}</span>
                    <button
                      onClick={handleCopyTransactionId}
                      className="p-1 hover:bg-gray-100 rounded transition-colors print:hidden"
                      title="Copy Transaction ID"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date</span>
                  <span className="text-gray-900">{date}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Time</span>
                  <span className="text-gray-900">{time}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Type</span>
                  <span className="text-gray-900 capitalize">{transaction.type.replace('_', ' ')}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>

                {transaction.counterparty && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">
                      {transaction.type === 'purchase' ? 'Seller' : 'Buyer'}
                    </span>
                    <span className="text-gray-900">{transaction.counterparty.username}</span>
                  </div>
                )}

                {transaction.relatedListing && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Service</span>
                    <span className="text-gray-900">{transaction.relatedListing.title}</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Reference</span>
                  <span className="font-mono text-sm text-gray-900">{transaction.reference}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Amount</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500">
                <p>Thank you for using GameTrust</p>
                <p className="mt-1">For support, contact us at support@gametrust.com</p>
              </div>
            </div>
            </div>

            {/* Close Button (Print Hidden) */}
            <div className="p-4 md:p-6 border-t border-gray-100 print:hidden bg-white">
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full min-h-[48px]"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};