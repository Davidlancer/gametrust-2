import React, { useState } from 'react';
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
  XCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';

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
    amount: -75000,
    status: 'pending',
    date: 'June 18, 2024',
    orderId: 'ORD-001'
  },
  {
    id: 'TXN-002',
    type: 'deposit',
    description: 'Wallet Funding via Bank Transfer',
    amount: 100000,
    status: 'completed',
    date: 'June 17, 2024'
  },
  {
    id: 'TXN-003',
    type: 'refund',
    description: 'PUBG Account Refund',
    amount: 70000,
    status: 'completed',
    date: 'June 15, 2024',
    orderId: 'ORD-005'
  },
  {
    id: 'TXN-004',
    type: 'referral_bonus',
    description: 'Referral bonus from @newuser',
    amount: 500,
    status: 'completed',
    date: 'June 14, 2024'
  },
  {
    id: 'TXN-005',
    type: 'escrow_payment',
    description: 'Free Fire Account Purchase',
    amount: -45000,
    status: 'completed',
    date: 'June 12, 2024',
    orderId: 'ORD-003'
  },
  {
    id: 'TXN-006',
    type: 'deposit',
    description: 'Wallet Funding via Card',
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

const BuyerWallet: React.FC = () => {
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [filter, setFilter] = useState('all');
  
  const currentBalance = 12000;
  const pendingBalance = 75000; // Amount in escrow
  
  const filteredTransactions = mockTransactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const handleFundWallet = () => {
    // Handle wallet funding logic
    console.log('Funding wallet with:', fundAmount, 'via', paymentMethod);
    setShowFundModal(false);
    setFundAmount('');
  };

  return (
    <div className="h-full flex flex-col space-y-6">
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
          {filteredTransactions.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <WalletIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No transactions found</h3>
                <p className="text-gray-500">Your transaction history will appear here</p>
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

export default BuyerWallet;