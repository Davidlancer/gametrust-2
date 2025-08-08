import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PrinterIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Button from './Button';

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
  transaction: Transaction;
  onSubmit: (transactionId: string, message: string) => Promise<void>;
}

interface ViewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

// Modal backdrop and container animations
const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 }
};

const mobileModalContentVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' }
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
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(transaction.id, message);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Failed to submit issue report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={window.innerWidth < 768 ? mobileModalContentVariants : modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Report an Issue</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Transaction Details */}
              <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Transaction Details</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white ml-2 font-mono">{transaction.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white ml-2">₦{Math.abs(transaction.amount).toLocaleString()}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white ml-2">{new Date(transaction.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="space-y-2">
                <label htmlFor="issue-message" className="block text-sm font-medium text-gray-300">
                  Describe the issue
                </label>
                <textarea
                  id="issue-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please provide details about the issue you're experiencing with this transaction..."
                  className="w-full h-32 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ViewReceiptModal: React.FC<ViewReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase': return 'Account Purchase';
      case 'sale': return 'Account Sale';
      case 'withdrawal': return 'Withdrawal';
      case 'refund': return 'Refund';
      case 'escrow_hold': return 'Escrow Hold';
      case 'in_escrow': return 'In Escrow';
      default: return 'Transaction';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={window.innerWidth < 768 ? mobileModalContentVariants : modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl print:shadow-none print:max-w-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Transaction Receipt</h2>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Print Receipt"
                >
                  <PrinterIcon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-8 print:p-6">
              {/* Company Header */}
              <div className="text-center mb-8 print:mb-6">
                <h1 className="text-2xl font-bold text-gray-900 print:text-xl">GameTrust</h1>
                <p className="text-gray-600 text-sm">Secure Gaming Account Marketplace</p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2" />
              </div>

              {/* Receipt Details */}
              <div className="space-y-6 print:space-y-4">
                {/* Transaction Info */}
                <div className="bg-gray-50 rounded-lg p-4 print:bg-transparent print:border print:border-gray-300">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Transaction ID:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-gray-900">{transaction.id}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(transaction.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 print:hidden"
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <CheckIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Reference:</span>
                      <p className="font-mono text-gray-900 mt-1">{transaction.reference}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date & Time:</span>
                      <p className="text-gray-900 mt-1">{new Date(transaction.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className={`mt-1 font-medium ${
                        transaction.status === 'completed' ? 'text-green-600' :
                        transaction.status === 'pending' ? 'text-yellow-600' :
                        transaction.status === 'failed' ? 'text-red-600' :
                        'text-purple-600'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Transaction Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="text-gray-900">{getTransactionTypeLabel(transaction.type)}</span>
                    </div>
                    {transaction.relatedListing && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Item:</span>
                        <span className="text-gray-900 text-right max-w-[200px]">{transaction.relatedListing.title}</span>
                      </div>
                    )}
                    {transaction.counterparty && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{transaction.type === 'purchase' ? 'Seller:' : 'Buyer:'}:</span>
                        <span className="text-gray-900">@{transaction.counterparty.username}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-3">
                      <span className="text-gray-900">Amount:</span>
                      <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                        ₦{Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 border-t pt-4 print:pt-2">
                  <p>This is an official receipt from GameTrust</p>
                  <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};