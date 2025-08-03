import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface RevenueData {
  period: string;
  revenue: number;
  transactions: number;
  fees: number;
  escrow: number;
}

interface Transaction {
  id: string;
  type: 'sale' | 'fee' | 'refund' | 'withdrawal';
  amount: number;
  user: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const RevenuePage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [chartType, setChartType] = useState<'revenue' | 'transactions' | 'fees'>('revenue');

  // Mock data for revenue analytics
  const revenueData: RevenueData[] = [
    { period: 'Jan 2024', revenue: 125000, transactions: 1250, fees: 6250, escrow: 45000 },
    { period: 'Feb 2024', revenue: 142000, transactions: 1420, fees: 7100, escrow: 52000 },
    { period: 'Mar 2024', revenue: 158000, transactions: 1580, fees: 7900, escrow: 58000 },
    { period: 'Apr 2024', revenue: 134000, transactions: 1340, fees: 6700, escrow: 48000 },
    { period: 'May 2024', revenue: 167000, transactions: 1670, fees: 8350, escrow: 62000 },
    { period: 'Jun 2024', revenue: 189000, transactions: 1890, fees: 9450, escrow: 71000 }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'sale',
      amount: 2500.00,
      user: 'proGamer123',
      description: 'CS:GO Dragon Lore AWP sale commission',
      date: '2024-03-15T14:30:00Z',
      status: 'completed'
    },
    {
      id: 'TXN002',
      type: 'fee',
      amount: 125.00,
      user: 'valorantPro',
      description: 'Listing verification fee',
      date: '2024-03-15T13:45:00Z',
      status: 'completed'
    },
    {
      id: 'TXN003',
      type: 'withdrawal',
      amount: -1500.00,
      user: 'trustedSeller',
      description: 'Seller payout withdrawal',
      date: '2024-03-15T12:20:00Z',
      status: 'pending'
    },
    {
      id: 'TXN004',
      type: 'refund',
      amount: -850.00,
      user: 'disputeUser',
      description: 'Dispute resolution refund',
      date: '2024-03-15T11:15:00Z',
      status: 'completed'
    },
    {
      id: 'TXN005',
      type: 'sale',
      amount: 1200.00,
      user: 'accountSeller',
      description: 'Valorant account sale commission',
      date: '2024-03-15T10:30:00Z',
      status: 'completed'
    }
  ];

  // Calculate summary statistics
  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
  const transactionGrowth = ((currentMonth.transactions - previousMonth.transactions) / previousMonth.transactions) * 100;

  const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />;
      case 'fee': return <CreditCardIcon className="w-4 h-4 text-blue-400" />;
      case 'refund': return <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />;
      case 'withdrawal': return <BanknotesIcon className="w-4 h-4 text-yellow-400" />;
      default: return <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-green-400';
      case 'fee': return 'text-blue-400';
      case 'refund': return 'text-red-400';
      case 'withdrawal': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10';
      case 'failed': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = (format: 'csv' | 'pdf') => {
    console.log(`Exporting revenue data as ${format}`);
    // Implement export functionality
  };

  // Simple chart component (in a real app, you'd use a library like Chart.js or Recharts)
  const SimpleChart: React.FC<{ data: RevenueData[], type: string }> = ({ data, type }) => {
    const maxValue = Math.max(...data.map(d => {
      switch (type) {
        case 'revenue': return d.revenue;
        case 'transactions': return d.transactions;
        case 'fees': return d.fees;
        default: return d.revenue;
      }
    }));

    return (
      <div className="h-64 flex items-end space-x-2 p-4">
        {data.map((item, index) => {
          const value = type === 'revenue' ? item.revenue : type === 'transactions' ? item.transactions : item.fees;
          const height = (value / maxValue) * 200;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-500 hover:to-blue-300"
                style={{ height: `${height}px` }}
                title={`${item.period}: ${type === 'revenue' ? formatCurrency(value) : value.toLocaleString()}`}
              />
              <span className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-left">
                {item.period.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Revenue Analytics</h1>
          <p className="text-gray-400 mt-1">Track platform revenue and financial metrics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="md" onClick={() => exportData('csv')}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="md" onClick={() => exportData('pdf')}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
              <div className="flex items-center mt-2">
                {revenueGrowth >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className={`text-sm ${revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(revenueGrowth).toFixed(1)}% from last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(currentMonth.revenue)}</p>
              <div className="flex items-center mt-2">
                {revenueGrowth >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className={`text-sm ${revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Transactions</p>
              <p className="text-2xl font-bold text-white">{currentMonth.transactions.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {transactionGrowth >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className={`text-sm ${transactionGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(transactionGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Funds in Escrow</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(currentMonth.escrow)}</p>
              <div className="flex items-center mt-2">
                <ShieldCheckIcon className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-sm text-gray-400">
                  {((currentMonth.escrow / currentMonth.revenue) * 100).toFixed(1)}% of revenue
                </span>
              </div>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <BanknotesIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Revenue Trends</h2>
            <p className="text-gray-400 text-sm mt-1">Monthly performance overview</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'revenue' | 'transactions' | 'fees')}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value="revenue">Revenue</option>
              <option value="transactions">Transactions</option>
              <option value="fees">Fees</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
        <SimpleChart data={revenueData} type={chartType} />
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Fee Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Transaction Fees</span>
              </div>
              <span className="text-white font-medium">{formatCurrency(currentMonth.fees * 0.6)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Listing Fees</span>
              </div>
              <span className="text-white font-medium">{formatCurrency(currentMonth.fees * 0.25)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Verification Fees</span>
              </div>
              <span className="text-white font-medium">{formatCurrency(currentMonth.fees * 0.15)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Credit Cards</span>
              </div>
              <div className="text-right">
                <span className="text-white font-medium">65%</span>
                <p className="text-xs text-gray-400">{formatCurrency(currentMonth.revenue * 0.65)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BanknotesIcon className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Bank Transfers</span>
              </div>
              <div className="text-right">
                <span className="text-white font-medium">25%</span>
                <p className="text-xs text-gray-400">{formatCurrency(currentMonth.revenue * 0.25)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Crypto</span>
              </div>
              <div className="text-right">
                <span className="text-white font-medium">10%</span>
                <p className="text-xs text-gray-400">{formatCurrency(currentMonth.revenue * 0.10)}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Transaction</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-700/50 hover:bg-gray-700/20"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{transaction.type}</p>
                        <p className="text-xs text-gray-400">{transaction.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-300">{transaction.user}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount < 0 ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-400">{formatDate(transaction.date)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default RevenuePage;