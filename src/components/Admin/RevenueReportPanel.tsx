import React from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import { useActivityLog } from '../../context/ActivityLogContext';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface RevenueReportPanelProps {
  onClose?: () => void;
}

interface RevenueData {
  period: string;
  revenue: number;
  transactions: number;
  fees: number;
  growth: number;
}

interface TransactionData {
  id: string;
  type: 'sale' | 'fee' | 'refund';
  amount: number;
  date: string;
  description: string;
}

const RevenueReportPanel: React.FC<RevenueReportPanelProps> = ({ onClose }) => {
  const { addActivity } = useActivityLog();
  
  const totalRevenue = 1847500;
  const totalTransactions = 342;
  const monthlyGrowth = 23.5;
  const totalFees = 184750; // 10% of revenue
  
  const revenueData: RevenueData[] = [
    {
      period: 'January 2024',
      revenue: 1847500,
      transactions: 342,
      fees: 184750,
      growth: 23.5
    },
    {
      period: 'December 2023',
      revenue: 1495000,
      transactions: 278,
      fees: 149500,
      growth: 18.2
    },
    {
      period: 'November 2023',
      revenue: 1265000,
      transactions: 234,
      fees: 126500,
      growth: 12.8
    }
  ];
  
  const recentTransactions: TransactionData[] = [
    {
      id: 'TXN001',
      type: 'sale',
      amount: 25000,
      date: '2024-01-25',
      description: 'Gaming account sale - Call of Duty'
    },
    {
      id: 'TXN002',
      type: 'fee',
      amount: 2500,
      date: '2024-01-25',
      description: 'Platform fee (10%)'
    },
    {
      id: 'TXN003',
      type: 'sale',
      amount: 15000,
      date: '2024-01-24',
      description: 'Gaming account sale - FIFA 24'
    },
    {
      id: 'TXN004',
      type: 'refund',
      amount: -12000,
      date: '2024-01-24',
      description: 'Refund processed - Dispute resolution'
    },
    {
      id: 'TXN005',
      type: 'sale',
      amount: 35000,
      date: '2024-01-23',
      description: 'Gaming account sale - Fortnite'
    }
  ];

  const handleExportReport = () => {
    addActivity('Revenue report exported', 'system', 'info');
    alert('Revenue report has been exported to CSV.');
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-green-400';
      case 'fee': return 'text-blue-400';
      case 'refund': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Revenue Report</h1>
            <p className="text-gray-400 mt-1">Financial overview and transaction analytics</p>
          </div>
        </div>
        <button
          onClick={handleExportReport}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-500">+{monthlyGrowth}%</span>
                <span className="text-sm text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Transactions</p>
              <p className="text-2xl font-bold text-white mt-1">{totalTransactions}</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-500">+15.2%</span>
                <span className="text-sm text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Platform Fees</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalFees)}</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-500">+{monthlyGrowth}%</span>
                <span className="text-sm text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Avg Transaction</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(Math.round(totalRevenue / totalTransactions))}</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-500">+8.1%</span>
                <span className="text-sm text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-orange-500">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue by Period */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Revenue by Period</h2>
        <div className="space-y-4">
          {revenueData.map((data, index) => (
            <motion.div
              key={data.period}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">{data.period}</p>
                  <p className="text-sm text-gray-400">{data.transactions} transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{formatCurrency(data.revenue)}</p>
                <div className="flex items-center justify-end mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+{data.growth}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    transaction.type === 'sale' ? 'bg-green-500/10 text-green-400' :
                    transaction.type === 'fee' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {transaction.type}
                  </span>
                  <p className="text-white font-medium">{transaction.description}</p>
                </div>
                <p className="text-sm text-gray-400 mt-1">{transaction.date} • {transaction.id}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default RevenueReportPanel;