import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { mockWalletTransactions } from '../../data/mockData';

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

const formatTransactionDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatAmount = (amount: number) => {
  const isCredit = amount > 0;
  const formattedAmount = Math.abs(amount).toLocaleString();
  return {
    display: `${isCredit ? '+' : '-'}₦${formattedAmount}`,
    colorClass: isCredit ? 'text-green-600' : 'text-red-600'
  };
};

const Wallet: React.FC = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [bankDetails, setBankDetails] = useState(mockBankDetails);
  const [showBalance, setShowBalance] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isEditingBank, setIsEditingBank] = useState(false);

  const currentBalance = 125450; // This would come from API
  const pendingWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'pending')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= currentBalance) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: -amount,
        description: `Withdrawal to ${bankDetails.bankName} ****${bankDetails.accountNumber.slice(-4)}`,
        date: new Date().toISOString(),
        status: 'pending',
        reference: `WTH_${Date.now().toString().slice(-6)}`
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setWithdrawAmount('');
      setShowWithdrawModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-gray-400">Manage your earnings and withdrawals</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-[#00FFB2]/10 to-[#00A8E8]/10 border-[#00FFB2]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-sm font-medium text-gray-300">Available Balance</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showBalance ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-3xl font-bold text-[#00FFB2]">
                {showBalance ? `₦${currentBalance.toLocaleString()}` : '₦••••••'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#00FFB2]/20">
              <WalletIcon className="w-8 h-8 text-[#00FFB2]" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-yellow-400">
                ₦{pendingWithdrawals.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <ClockIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-green-400">
                ₦{transactions
                  .filter(t => t.amount > 0 && new Date(t.date).getMonth() === new Date().getMonth())
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/20">
              <BanknotesIcon className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
            <p className="text-gray-400">Withdrawals are processed within 24 hours</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              onClick={() => setShowWithdrawModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold"
              disabled={currentBalance <= 0}
            >
              <ArrowUpIcon className="w-5 h-5 mr-2" />
              Withdraw Funds
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditingBank(true)}
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Edit Bank Details
            </Button>
          </div>
        </div>
      </Card>

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

      {/* Transaction History */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
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
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Listing</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Party</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => {
                const amountInfo = formatAmount(transaction.amount);
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <span className="text-white font-medium">{getTransactionTypeLabel(transaction.type)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {transaction.relatedListing ? (
                        <div>
                          <p className="text-white font-medium">{transaction.relatedListing.title}</p>
                          <p className="text-sm text-gray-400">ID: {transaction.relatedListing.listingId}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {transaction.counterparty ? (
                        <div>
                          <p className="text-white font-medium">@{transaction.counterparty.username}</p>
                          <p className="text-sm text-gray-400">{transaction.type === 'purchase' ? 'Seller' : 'Buyer'}</p>
                        </div>
                      ) : transaction.bankDetails ? (
                        <div>
                          <p className="text-white font-medium">{transaction.bankDetails}</p>
                          <p className="text-sm text-gray-400">Bank Account</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-lg font-semibold ${amountInfo.colorClass}`}>
                        {amountInfo.display}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{formatTransactionDate(transaction.date)}</span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredTransactions.map((transaction, index) => {
            const amountInfo = formatAmount(transaction.amount);
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <span className="text-white font-medium">{getTransactionTypeLabel(transaction.type)}</span>
                  </div>
                  <span className={`text-lg font-semibold ${amountInfo.colorClass}`}>
                    {amountInfo.display}
                  </span>
                </div>
                
                {transaction.relatedListing && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-400">Listing:</p>
                    <p className="text-white font-medium">{transaction.relatedListing.title}</p>
                  </div>
                )}
                
                {transaction.counterparty && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-400">{transaction.type === 'purchase' ? 'Seller:' : 'Buyer:'}</p>
                    <p className="text-white font-medium">@{transaction.counterparty.username}</p>
                  </div>
                )}
                
                {transaction.bankDetails && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-400">Bank:</p>
                    <p className="text-white font-medium">{transaction.bankDetails}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-400">{formatTransactionDate(transaction.date)}</span>
                  {getStatusBadge(transaction.status)}
                </div>
              </motion.div>
            );
          })}
        </div>

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
      </Card>

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

export default Wallet;