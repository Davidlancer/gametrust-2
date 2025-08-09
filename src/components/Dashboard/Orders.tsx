import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UserIcon,
  EyeIcon,
  DocumentArrowUpIcon,
  FlagIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import ChatModal from '../UI/ChatModal';


interface Order {
  id: string;
  buyerUsername: string;
  buyerAvatar: string;
  listingTitle: string;
  listingId: string;
  amount: number;
  status: 'payment_pending' | 'in_escrow' | 'delivered' | 'completed' | 'refunded' | 'disputed';
  createdAt: string;
  deliveryDeadline?: string;
  lastActivity: string;
  hasCredentials: boolean;
  disputeReason?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    buyerUsername: 'gamer123',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
    listingTitle: 'CODM Legendary Account - Mythic Weapons',
    listingId: '1',
    amount: 45000,
    status: 'in_escrow',
    createdAt: '2024-01-20T10:30:00Z',
    deliveryDeadline: '2024-01-22T10:30:00Z',
    lastActivity: '2024-01-20T14:15:00Z',
    hasCredentials: false
  },
  {
    id: '2',
    buyerUsername: 'proPlayer99',
    buyerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
    listingTitle: 'PUBG Mobile Conqueror Account',
    listingId: '2',
    amount: 28500,
    status: 'delivered',
    createdAt: '2024-01-18T09:15:00Z',
    deliveryDeadline: '2024-01-20T09:15:00Z',
    lastActivity: '2024-01-19T16:45:00Z',
    hasCredentials: true
  },
  {
    id: '3',
    buyerUsername: 'fireGamer',
    buyerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face',
    listingTitle: 'Free Fire Grandmaster Account',
    listingId: '3',
    amount: 15000,
    status: 'completed',
    createdAt: '2024-01-15T14:20:00Z',
    lastActivity: '2024-01-17T11:30:00Z',
    hasCredentials: true
  },
  {
    id: '4',
    buyerUsername: 'valorantPro',
    buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    listingTitle: 'Valorant Immortal Account - Rare Skins',
    listingId: '4',
    amount: 52000,
    status: 'disputed',
    createdAt: '2024-01-12T11:45:00Z',
    lastActivity: '2024-01-16T09:20:00Z',
    hasCredentials: true,
    disputeReason: 'Account credentials not working'
  },
  {
    id: '5',
    buyerUsername: 'mobileLegend',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    listingTitle: 'CODM Master Rank Account',
    listingId: '5',
    amount: 22000,
    status: 'payment_pending',
    createdAt: '2024-01-21T08:00:00Z',
    lastActivity: '2024-01-21T08:00:00Z',
    hasCredentials: false
  }
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'payment_pending':
      return {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: ClockIcon,
        label: 'Payment Pending'
      };
    case 'in_escrow':
      return {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: CurrencyDollarIcon,
        label: 'In Escrow'
      };
    case 'delivered':
      return {
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: DocumentArrowUpIcon,
        label: 'Delivered'
      };
    case 'completed':
      return {
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircleIcon,
        label: 'Completed'
      };
    case 'refunded':
      return {
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: ExclamationTriangleIcon,
        label: 'Refunded'
      };
    case 'disputed':
      return {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: ExclamationTriangleIcon,
        label: 'Disputed'
      };
    default:
      return {
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: ClockIcon,
        label: 'Unknown'
      };
  }
};

const formatTimeRemaining = (deadline: string) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Overdue';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  }
  
  return `${hours}h ${minutes}m remaining`;
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatOrderId, setChatOrderId] = useState<string>('');


  const openChat = (orderId: string) => {
    setChatOrderId(orderId);
    setChatModalOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.buyerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.listingTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUploadCredentials = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, hasCredentials: true, status: 'delivered' as const }
        : order
    ));
  };

  const handleMarkDelivered = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed' as const }
        : order
    ));
  };

  const getActionButtons = (order: Order) => {
    const buttons = [];
    
    // Add Contact Buyer button for all orders
    buttons.push(
      <Button
        key="contact"
        variant="outline"
        size="sm"
        onClick={() => openChat(order.id)}
        className="flex items-center gap-2"
      >
        <ChatBubbleLeftRightIcon className="w-4 h-4" />
        Contact Buyer
      </Button>
    );
    
    // Add status-specific buttons
    switch (order.status) {
      case 'in_escrow':
        if (!order.hasCredentials) {
          buttons.push(
            <Button 
              key="upload"
              size="sm" 
              variant="primary"
              onClick={() => handleUploadCredentials(order.id)}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
            >
              <DocumentArrowUpIcon className="w-4 h-4 mr-1" />
              Upload Credentials
            </Button>
          );
        } else {
          buttons.push(
            <Button 
              key="delivered"
              size="sm" 
              variant="outline"
              onClick={() => handleMarkDelivered(order.id)}
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Mark as Delivered
            </Button>
          );
        }
        buttons.push(
          <Button key="flag" size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
            <FlagIcon className="w-4 h-4" />
          </Button>
        );
        break;
      case 'delivered':
        buttons.push(
          <span key="waiting" className="text-sm text-gray-400">Waiting for buyer confirmation</span>
        );
        buttons.push(
          <Button key="flag" size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
            <FlagIcon className="w-4 h-4" />
          </Button>
        );
        break;
      case 'disputed':
        buttons.push(
          <Button key="dispute" size="sm" variant="outline" className="border-red-500/30 text-red-400">
            View Dispute
          </Button>
        );
        break;
      default:
        buttons.push(
          <Button key="view" size="sm" variant="ghost">
            <EyeIcon className="w-4 h-4" />
          </Button>
        );
        break;
    }
    
    return (
      <div className="flex items-center space-x-2">
        {buttons}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Orders & Escrow Deals</h1>
        <p className="text-gray-400">Manage your sales and track escrow transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Orders</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => ['payment_pending', 'in_escrow', 'delivered'].includes(o.status)).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/20">
              <ClockIcon className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">In Escrow</p>
              <p className="text-2xl font-bold text-white">
                ₦{orders.filter(o => o.status === 'in_escrow').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <CurrencyDollarIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/20">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Disputes</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'disputed').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/20">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Orders</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="in_escrow">In Escrow</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="disputed">Disputed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <img
                      src={order.buyerAvatar}
                      alt={order.buyerUsername}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {order.listingTitle}
                        </h3>
                        <Badge
                          text={statusConfig.label}
                          className={`${statusConfig.color} border flex items-center`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-4 h-4" />
                          <span>@{order.buyerUsername}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        {order.deliveryDeadline && order.status === 'in_escrow' && (
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span className="text-yellow-400">
                              {formatTimeRemaining(order.deliveryDeadline)}
                            </span>
                          </div>
                        )}
                      </div>
                      {order.disputeReason && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                          <strong>Dispute:</strong> {order.disputeReason}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
                    <div className="text-right mb-4 lg:mb-0">
                      <p className="text-2xl font-bold text-indigo-400">
                        ₦{order.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        Order #{order.id}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {getActionButtons(order)}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-gray-400">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any orders yet. Start selling to see orders here!'}
            </p>
          </div>
        </Card>
      )}

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        orderId={chatOrderId}
        userRole="seller"
        otherUser={{
           id: orders.find(order => order.id === chatOrderId)?.buyerUsername || 'buyer',
           username: orders.find(order => order.id === chatOrderId)?.buyerUsername || 'Buyer',
           avatar: orders.find(order => order.id === chatOrderId)?.buyerAvatar || ''
         }}
      />
    </div>
  );
};

export default Orders;