import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UserIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  FlagIcon,
  CalendarIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface PendingOrder {
  id: string;
  orderId: string;
  game: string;
  buyerUsername: string;
  buyerAvatar: string;
  salePrice: number;
  escrowStatus: 'awaiting_delivery' | 'awaiting_confirmation' | 'released' | 'disputed';
  orderDate: string;
  timeLeftHours: number;
  timeLeftMinutes: number;
  isDelivered: boolean;
  listingTitle: string;
}

interface PendingOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockPendingOrders: PendingOrder[] = [
  {
    id: '1',
    orderId: 'GTX-24053',
    game: 'CODM',
    buyerUsername: 'KingShadow12',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
    salePrice: 72000,
    escrowStatus: 'awaiting_confirmation',
    orderDate: 'June 21, 2025',
    timeLeftHours: 23,
    timeLeftMinutes: 17,
    isDelivered: true,
    listingTitle: 'CODM Legendary Account - Mythic Weapons'
  },
  {
    id: '2',
    orderId: 'GTX-24054',
    game: 'PUBG Mobile',
    buyerUsername: 'ProGamer88',
    buyerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
    salePrice: 45000,
    escrowStatus: 'awaiting_delivery',
    orderDate: 'June 22, 2025',
    timeLeftHours: 47,
    timeLeftMinutes: 32,
    isDelivered: false,
    listingTitle: 'PUBG Mobile Conqueror Account'
  },
  {
    id: '3',
    orderId: 'GTX-24055',
    game: 'Free Fire',
    buyerUsername: 'FireMaster99',
    buyerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face',
    salePrice: 28000,
    escrowStatus: 'disputed',
    orderDate: 'June 20, 2025',
    timeLeftHours: 0,
    timeLeftMinutes: 0,
    isDelivered: true,
    listingTitle: 'Free Fire Grandmaster Account'
  }
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'awaiting_delivery':
      return {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: '🟡',
        label: 'Awaiting Delivery'
      };
    case 'awaiting_confirmation':
      return {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: '🔵',
        label: 'Awaiting Buyer Confirmation'
      };
    case 'released':
      return {
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: '🟢',
        label: 'Released'
      };
    case 'disputed':
      return {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: '🔴',
        label: 'Disputed'
      };
    default:
      return {
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: '⚪',
        label: 'Unknown'
      };
  }
};

const PendingOrdersModal: React.FC<PendingOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState(mockPendingOrders);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(`#${orderId}`);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleMarkAsDelivered = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, isDelivered: true, escrowStatus: 'awaiting_confirmation' as const }
        : order
    ));
  };

  const handleViewOrderDetails = (orderId: string) => {
    // This would typically navigate to a detailed order page
    console.log('View order details for:', orderId);
  };

  const handleReportIssue = (orderId: string) => {
    // This would typically open a dispute form or navigate to dispute page
    console.log('Report issue for order:', orderId);
  };

  const handleContactBuyer = (buyerUsername: string) => {
    // This would typically open chat or email interface
    console.log('Contact buyer:', buyerUsername);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#121212] border-l border-[#292929] flex flex-col"
          >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#292929] bg-[#1E1E1E]">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-6 h-6 text-[#00FFB2]" />
                <h2 className="text-xl font-semibold text-white">Pending Orders</h2>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>You have {orders.length} pending orders</span>
                <div className="group relative">
                  <InformationCircleIcon className="w-4 h-4 text-gray-500 hover:text-gray-300 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Orders remain pending until buyer confirms successful delivery.
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.escrowStatus);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1E1E1E] border border-[#292929] rounded-xl p-6 hover:border-[#00FFB2]/30 transition-all duration-200"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={order.buyerAvatar}
                        alt={order.buyerUsername}
                        className="w-10 h-10 rounded-full border-2 border-gray-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{order.buyerUsername}</span>
                          <button
                            onClick={() => handleCopyOrderId(order.orderId)}
                            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-[#00FFB2] transition-colors"
                          >
                            <span>#{order.orderId}</span>
                            <DocumentDuplicateIcon className="w-3 h-3" />
                          </button>
                          {copiedOrderId === order.orderId && (
                            <span className="text-xs text-green-400">Copied!</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{order.game} • {order.orderDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#00FFB2]">₦{order.salePrice.toLocaleString()}</p>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${statusConfig.color}`}>
                        <span>{statusConfig.icon}</span>
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Listing</p>
                      <p className="text-sm text-white">{order.listingTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Escrow Status</p>
                      <p className="text-sm text-white">
                        {order.escrowStatus === 'awaiting_confirmation' ? '🔄 Waiting for buyer confirmation' :
                         order.escrowStatus === 'awaiting_delivery' ? '📦 Waiting for delivery' :
                         order.escrowStatus === 'disputed' ? '⚠️ Under dispute' :
                         '✅ Released'}
                      </p>
                    </div>
                  </div>

                  {/* Time Remaining */}
                  {order.timeLeftHours > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time Left Before Auto-Confirm</p>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400 font-medium">
                          ⏰ {order.timeLeftHours}h {order.timeLeftMinutes}m
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrderDetails(order.orderId)}
                      className="border-gray-600 hover:border-[#00FFB2] hover:bg-[#00FFB2]/10"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContactBuyer(order.buyerUsername)}
                      className="border-gray-600 hover:border-blue-400 hover:bg-blue-400/10"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                      Contact Buyer
                    </Button>

                    {!order.isDelivered && order.escrowStatus === 'awaiting_delivery' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleMarkAsDelivered(order.id)}
                        className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] hover:from-[#00FFB2]/80 hover:to-[#00A8E8]/80"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Mark as Delivered
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReportIssue(order.orderId)}
                      className="border-red-600 hover:border-red-400 hover:bg-red-400/10 text-red-400"
                    >
                      <FlagIcon className="w-4 h-4 mr-1" />
                      Report Issue
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default PendingOrdersModal;