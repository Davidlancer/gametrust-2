import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useActivityLog } from '../../context/ActivityLogContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Toast notification function
const toast = {
  success: (message: string) => {
    console.log('✅ SUCCESS:', message);
    alert('✅ ' + message);
  },
  error: (message: string) => {
    console.log('❌ ERROR:', message);
    alert('❌ ' + message);
  },
  info: (message: string) => {
    console.log('ℹ️ INFO:', message);
    alert('ℹ️ ' + message);
  }
};

interface Dispute {
  id: string;
  orderId: string;
  title: string;
  buyer: {
    username: string;
    avatar?: string;
  };
  seller: {
    username: string;
    avatar?: string;
  };
  amount: number;
  status: 'open' | 'investigating' | 'resolved_buyer' | 'resolved_seller' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  createdAt: string;
  lastActivity: string;
  messages: number;
  evidence: {
    buyer: number;
    seller: number;
  };
  description: string;
}

const DisputesPage: React.FC = () => {
  const { addActivity } = useActivityLog();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedDisputes, setSelectedDisputes] = useState<string[]>([]);

  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 'DSP001',
      orderId: 'ORD12345',
      title: 'CS:GO Dragon Lore AWP - Item not as described',
      buyer: { username: 'gamer123', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' },
      seller: { username: 'proSeller' },
      amount: 2500.00,
      status: 'open',
      priority: 'urgent',
      reason: 'Item not as described',
      createdAt: '2024-03-15T10:30:00Z',
      lastActivity: '2 hours ago',
      messages: 8,
      evidence: { buyer: 3, seller: 2 },
      description: 'Buyer claims the AWP Dragon Lore has different float value than advertised'
    },
    {
      id: 'DSP002',
      orderId: 'ORD12346',
      title: 'Fortnite Account - Account credentials changed',
      buyer: { username: 'fortniteFan' },
      seller: { username: 'accountSeller', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face' },
      amount: 850.00,
      status: 'investigating',
      priority: 'high',
      reason: 'Account access issues',
      createdAt: '2024-03-14T15:45:00Z',
      lastActivity: '1 day ago',
      messages: 12,
      evidence: { buyer: 5, seller: 1 },
      description: 'Seller changed account credentials after payment was made'
    },
    {
      id: 'DSP003',
      orderId: 'ORD12347',
      title: 'Valorant Account - Rank not as advertised',
      buyer: { username: 'valorantPro' },
      seller: { username: 'rankBooster' },
      amount: 1200.00,
      status: 'resolved_buyer',
      priority: 'medium',
      reason: 'Misrepresentation',
      createdAt: '2024-03-13T09:15:00Z',
      lastActivity: '3 days ago',
      messages: 15,
      evidence: { buyer: 4, seller: 3 },
      description: 'Account was advertised as Radiant but was actually Diamond'
    },
    {
      id: 'DSP004',
      orderId: 'ORD12348',
      title: 'Minecraft Account - Payment dispute',
      buyer: { username: 'minecraftKid' },
      seller: { username: 'minecraftSeller' },
      amount: 25.00,
      status: 'open',
      priority: 'low',
      reason: 'Payment issues',
      createdAt: '2024-03-12T14:20:00Z',
      lastActivity: '5 hours ago',
      messages: 4,
      evidence: { buyer: 1, seller: 2 },
      description: 'Buyer claims payment was made but seller denies receiving it'
    },
    {
      id: 'DSP005',
      orderId: 'ORD12349',
      title: 'League of Legends Account - Banned after purchase',
      buyer: { username: 'lolPlayer' },
      seller: { username: 'suspiciousUser' },
      amount: 150.00,
      status: 'resolved_seller',
      priority: 'high',
      reason: 'Account issues',
      createdAt: '2024-03-11T11:30:00Z',
      lastActivity: '1 week ago',
      messages: 20,
      evidence: { buyer: 2, seller: 6 },
      description: 'Account was banned shortly after purchase, seller provided proof of clean history'
    }
  ]);

  // Load disputes from localStorage on component mount
  useEffect(() => {
    const savedDisputes = localStorage.getItem('admin_disputes');
    if (savedDisputes) {
      setDisputes(JSON.parse(savedDisputes));
    }
  }, []);

  // Save disputes to localStorage whenever disputes state changes
  useEffect(() => {
    localStorage.setItem('admin_disputes', JSON.stringify(disputes));
  }, [disputes]);

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.buyer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.seller.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || dispute.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'investigating': return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'resolved_buyer': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'resolved_seller': return <CheckCircleIcon className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XMarkIcon className="w-4 h-4 text-gray-500" />;
      default: return <ExclamationTriangleIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-400 bg-red-500/10';
      case 'investigating': return 'text-yellow-400 bg-yellow-500/10';
      case 'resolved_buyer': return 'text-green-400 bg-green-500/10';
      case 'resolved_seller': return 'text-blue-400 bg-blue-500/10';
      case 'cancelled': return 'text-gray-400 bg-gray-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  // Enhanced dispute actions with toast notifications
  const resolveDispute = (disputeId: string, resolution: 'resolved_buyer' | 'resolved_seller') => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;
    
    if (dispute.status.startsWith('resolved')) {
      toast.info(`Dispute ${dispute.id} is already resolved.`);
      return;
    }
    
    setDisputes(prevDisputes => 
      prevDisputes.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, status: resolution }
          : dispute
      )
    );
    
    const winner = resolution === 'resolved_buyer' ? 'buyer' : 'seller';
    addActivity(`Dispute "${dispute.title}" has been resolved in favor of ${winner}`, 'dispute', 'success');
    toast.success(`Dispute ${dispute.id} resolved in favor of ${winner}.`);
  };

  const investigateDispute = (disputeId: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;
    
    if (dispute.status === 'investigating') {
      toast.info(`Dispute ${dispute.id} is already under investigation.`);
      return;
    }
    
    setDisputes(prevDisputes => 
      prevDisputes.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, status: 'investigating' }
          : dispute
      )
    );
    addActivity(`Investigation started for dispute "${dispute.title}"`, 'dispute', 'info');
    toast.info(`Dispute ${dispute.id} is now under investigation.`);
  };

  const cancelDispute = (disputeId: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;
    
    setDisputes(prevDisputes => 
      prevDisputes.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, status: 'cancelled' }
          : dispute
      )
    );
    addActivity(`Dispute "${dispute.title}" has been cancelled`, 'dispute', 'warning');
    toast.error(`Dispute ${dispute.id} has been cancelled.`);
  };



  const handleBulkAction = (action: string) => {
    if (selectedDisputes.length === 0) {
      toast.info('No disputes selected for bulk action.');
      return;
    }
    
    let message = '';
    let severity: 'info' | 'warning' | 'success' | 'error' = 'info';
    
    selectedDisputes.forEach(disputeId => {
      switch (action) {
        case 'investigate':
          investigateDispute(disputeId);
          break;
        case 'resolve_buyer':
          resolveDispute(disputeId, 'resolved_buyer');
          break;
        case 'resolve_seller':
          resolveDispute(disputeId, 'resolved_seller');
          break;
        case 'cancel':
          cancelDispute(disputeId);
          break;
      }
    });
    
    switch (action) {
      case 'investigate':
        message = `${selectedDisputes.length} disputes under investigation`;
        severity = 'info';
        break;
      case 'resolve_buyer':
        message = `${selectedDisputes.length} disputes resolved in favor of buyer`;
        severity = 'success';
        break;
      case 'resolve_seller':
        message = `${selectedDisputes.length} disputes resolved in favor of seller`;
        severity = 'success';
        break;
      case 'cancel':
        message = `${selectedDisputes.length} disputes cancelled`;
        severity = 'warning';
        break;
    }
    
    // Log bulk action to activity log
    addActivity(`Bulk action: ${message}`, 'dispute', severity);
    const actionCount = selectedDisputes.length;
    setSelectedDisputes([]);
    toast.success(`Bulk ${action} completed for ${actionCount} dispute(s).`);
  };

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowDisputeModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Disputes Management</h1>
          <p className="text-gray-400 mt-1">Review and resolve transaction disputes</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="md">
            Export Report
          </Button>
          <Button variant="primary" size="md">
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Open Disputes</p>
              <p className="text-2xl font-bold text-white">{disputes.filter(d => d.status === 'open').length}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Investigating</p>
              <p className="text-2xl font-bold text-white">{disputes.filter(d => d.status === 'investigating').length}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-white">{disputes.filter(d => d.status.includes('resolved')).length}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white">${disputes.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search disputes..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved_buyer">Resolved (Buyer)</option>
                <option value="resolved_seller">Resolved (Seller)</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 px-3 py-2"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDisputes.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">
                {selectedDisputes.length} dispute(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('investigate')}>
                  Investigate ({selectedDisputes.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('resolve')}>
                  Resolve ({selectedDisputes.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('cancel')}>
                  Cancel ({selectedDisputes.length})
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDisputes([])}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.map((dispute, index) => (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedDisputes.includes(dispute.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDisputes([...selectedDisputes, dispute.id]);
                      } else {
                        setSelectedDisputes(selectedDisputes.filter(id => id !== dispute.id));
                      }
                    }}
                    className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">{dispute.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(dispute.priority)}`}>
                          {dispute.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{dispute.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Order: {dispute.orderId}</span>
                        <span>•</span>
                        <span>Amount: ${dispute.amount.toLocaleString()}</span>
                        <span>•</span>
                        <span>Created: {formatDate(dispute.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(dispute.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                        {dispute.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          {dispute.buyer.avatar ? (
                            <img src={dispute.buyer.avatar} alt="" className="w-8 h-8 rounded-full" />
                          ) : (
                            <UserIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Buyer</p>
                          <p className="text-xs text-gray-400">{dispute.buyer.username}</p>
                        </div>
                      </div>
                      <div className="text-gray-500">vs</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          {dispute.seller.avatar ? (
                            <img src={dispute.seller.avatar} alt="" className="w-8 h-8 rounded-full" />
                          ) : (
                            <UserIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Seller</p>
                          <p className="text-xs text-gray-400">{dispute.seller.username}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        <span>{dispute.messages} messages</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{dispute.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center space-x-3 pt-4 border-t border-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDispute(dispute.id)}
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {dispute.status === 'open' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => investigateDispute(dispute.id)}
                          className="text-yellow-400 border-yellow-400 hover:bg-yellow-500/10"
                          title="Start Investigation"
                        >
                          <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveDispute(dispute.id)}
                          className="text-green-400 border-green-400 hover:bg-green-500/10"
                          title="Resolve Dispute"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelDispute(dispute.id)}
                          className="text-red-400 border-red-400 hover:bg-red-500/10"
                          title="Cancel Dispute"
                        >
                          <XCircleIcon className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {dispute.status === 'investigating' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveDispute(dispute.id)}
                          className="text-green-400 border-green-400 hover:bg-green-500/10"
                          title="Resolve Dispute"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelDispute(dispute.id)}
                          className="text-red-400 border-red-400 hover:bg-red-500/10"
                          title="Cancel Dispute"
                        >
                          <XCircleIcon className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {filteredDisputes.length} of {disputes.length} disputes
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DisputesPage;