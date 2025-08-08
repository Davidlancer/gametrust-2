import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhoneIcon,
  KeyIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import Button from '../UI/Button';
import ChatModal from '../UI/ChatModal';
import { useToast } from '../UI/ToastProvider';

interface PendingOrder {
  id: string;
  orderId: string;
  game: string;
  gameIcon: string;
  buyerUsername: string;
  buyerAvatar: string;
  buyerVerified: boolean;
  salePrice: number;
  commission: number;
  escrowStatus: 'awaiting_delivery' | 'awaiting_confirmation' | 'released' | 'disputed';
  orderDate: string;
  timeLeftHours: number;
  timeLeftMinutes: number;
  isDelivered: boolean;
  listingTitle: string;
  credentials: {
    email: string;
    password: string;
    linkedSocials: string[];
    level: string;
    notableSkins: string[];
    videoProof: boolean;
  };
  timeline: {
    step: string;
    status: 'completed' | 'current' | 'pending';
    timestamp?: string;
  }[];
}

interface PendingOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockPendingOrders: PendingOrder[] = [
  {
    id: '1',
    orderId: 'GTX-24053',
    game: 'Call of Duty Mobile',
    gameIcon: '🎯',
    buyerUsername: 'KingShadow12',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
    buyerVerified: true,
    salePrice: 72000,
    commission: 7200,
    escrowStatus: 'awaiting_confirmation',
    orderDate: '2024-06-21T10:30:00Z',
    timeLeftHours: 23,
    timeLeftMinutes: 17,
    isDelivered: true,
    listingTitle: 'CODM Legendary Account - Mythic Weapons',
    credentials: {
      email: 'account@email.com',
      password: '••••••••••',
      linkedSocials: ['Facebook', 'Apple ID'],
      level: 'Lv. 89',
      notableSkins: ['Dark Aether M4', 'Ghost - Plasma'],
      videoProof: true
    },
    timeline: [
      { step: 'Order Placed', status: 'completed', timestamp: '2024-06-21T10:30:00Z' },
      { step: 'Payment Escrowed', status: 'completed', timestamp: '2024-06-21T10:31:00Z' },
      { step: 'Account Delivered', status: 'completed', timestamp: '2024-06-21T11:15:00Z' },
      { step: 'Buyer Confirmation', status: 'current' },
      { step: 'Payment Released', status: 'pending' }
    ]
  },
  {
    id: '2',
    orderId: 'GTX-24054',
    game: 'PUBG Mobile',
    gameIcon: '🔫',
    buyerUsername: 'ProGamer88',
    buyerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
    buyerVerified: false,
    salePrice: 45000,
    commission: 4500,
    escrowStatus: 'awaiting_delivery',
    orderDate: '2024-06-22T14:20:00Z',
    timeLeftHours: 47,
    timeLeftMinutes: 32,
    isDelivered: false,
    listingTitle: 'PUBG Mobile Conqueror Account',
    credentials: {
      email: 'pubg@account.com',
      password: '••••••••••',
      linkedSocials: ['Google Play'],
      level: 'Conqueror',
      notableSkins: ['Glacier M416', 'Pharaoh X-Suit'],
      videoProof: true
    },
    timeline: [
      { step: 'Order Placed', status: 'completed', timestamp: '2024-06-22T14:20:00Z' },
      { step: 'Payment Escrowed', status: 'completed', timestamp: '2024-06-22T14:21:00Z' },
      { step: 'Account Delivery', status: 'current' },
      { step: 'Buyer Confirmation', status: 'pending' },
      { step: 'Payment Released', status: 'pending' }
    ]
  },
  {
    id: '3',
    orderId: 'GTX-24055',
    game: 'Free Fire',
    gameIcon: '🔥',
    buyerUsername: 'FireMaster99',
    buyerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face',
    buyerVerified: true,
    salePrice: 28000,
    commission: 2800,
    escrowStatus: 'disputed',
    orderDate: '2024-06-20T09:15:00Z',
    timeLeftHours: 0,
    timeLeftMinutes: 0,
    isDelivered: true,
    listingTitle: 'Free Fire Grandmaster Account',
    credentials: {
      email: 'freefire@account.com',
      password: '••••••••••',
      linkedSocials: ['Facebook', 'VK'],
      level: 'Grandmaster',
      notableSkins: ['Crimson Dragon', 'Ice Phoenix'],
      videoProof: false
    },
    timeline: [
      { step: 'Order Placed', status: 'completed', timestamp: '2024-06-20T09:15:00Z' },
      { step: 'Payment Escrowed', status: 'completed', timestamp: '2024-06-20T09:16:00Z' },
      { step: 'Account Delivered', status: 'completed', timestamp: '2024-06-20T10:30:00Z' },
      { step: 'Dispute Raised', status: 'current', timestamp: '2024-06-20T16:45:00Z' },
      { step: 'Resolution Pending', status: 'pending' }
    ]
  }
];

const getStatusConfig = (status: string, timeLeft: { hours: number; minutes: number }) => {
  const isUrgent = timeLeft.hours < 1 && timeLeft.minutes < 60;
  
  switch (status) {
    case 'awaiting_delivery':
      return {
        label: 'AWAITING DELIVERY',
        color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
        icon: '📦',
        pulse: false
      };
    case 'awaiting_confirmation':
      return {
        label: 'AWAITING CONFIRMATION',
        color: `bg-blue-500/20 border-blue-500/50 text-blue-400 ${isUrgent ? 'animate-pulse' : ''}`,
        icon: '⏳',
        pulse: isUrgent
      };
    case 'disputed':
      return {
        label: 'UNDER DISPUTE',
        color: 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse',
        icon: '⚠️',
        pulse: true
      };
    case 'released':
      return {
        label: 'COMPLETED',
        color: 'bg-green-500/20 border-green-500/50 text-green-400',
        icon: '✅',
        pulse: false
      };
    default:
      return {
        label: 'UNKNOWN',
        color: 'bg-gray-500/20 border-gray-500/50 text-gray-400',
        icon: '❓',
        pulse: false
      };
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const PendingOrdersModal: React.FC<PendingOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState(mockPendingOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [chatModal, setChatModal] = useState<string | null>(null);
  const [emergencyModal, setEmergencyModal] = useState<string | null>(null);
  const { showSuccess, showWarning } = useToast();

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.buyerUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOrderExpansion = useCallback((e: React.MouseEvent, orderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  }, [expandedOrders]);

  const handleMarkAsDelivered = useCallback((e: React.MouseEvent, orderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            isDelivered: true, 
            escrowStatus: 'awaiting_confirmation' as const,
            timeline: order.timeline.map((step, index) => 
              step.step === 'Account Delivery' 
                ? { ...step, status: 'completed' as const, timestamp: new Date().toISOString() }
                : index === order.timeline.findIndex(s => s.step === 'Buyer Confirmation')
                ? { ...step, status: 'current' as const }
                : step
            )
          }
        : order
    ));
    showSuccess('Account marked as delivered! Buyer will be notified.');
  }, [showSuccess]);

  const handleInitiateDispute = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showWarning('Dispute initiated. Our support team will review within 2 hours.');
  }, [showWarning]);

  const handleEmergencySupport = useCallback((e: React.MouseEvent, orderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEmergencyModal(orderId);
  }, []);

  const OrderCard: React.FC<{ order: PendingOrder }> = React.memo(({ order }) => {
    const statusConfig = getStatusConfig(order.escrowStatus, { hours: order.timeLeftHours, minutes: order.timeLeftMinutes });
    const isUrgent = order.timeLeftHours < 1 && order.timeLeftMinutes < 60 && order.escrowStatus === 'awaiting_confirmation';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        whileHover={{ 
          scale: 1.02, 
          transition: { duration: 0.2, ease: 'easeInOut' } 
        }}
        className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 border rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-[#00FFB2]/10 ${
          isUrgent ? 'border-red-500/50 shadow-lg shadow-red-500/20' : 'border-gray-700/50 hover:border-[#00FFB2]/30'
        }`}
      >
        {/* Mission Dossier Header */}
        <div className="p-4 md:p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{order.gameIcon}</div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[#00FFB2] font-mono text-sm font-bold tracking-wider">{order.orderId}</span>
                  <span className="text-gray-500 text-xs">•</span>
                  <span className="text-gray-400 text-xs font-medium">{formatTimeAgo(order.orderDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src={order.buyerAvatar}
                    alt={order.buyerUsername}
                    className="w-6 h-6 rounded-full border border-gray-600"
                  />
                  <span className="text-white font-medium text-sm">{order.buyerUsername}</span>
                  {order.buyerVerified && (
                    <CheckCircleIconSolid className="w-4 h-4 text-[#00FFB2]" />
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#00FFB2] mb-1">₦{order.salePrice.toLocaleString()}</div>
              <div className="text-xs text-gray-400">-₦{order.commission.toLocaleString()} fee</div>
            </div>
          </div>

          {/* Game Info & Status */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-medium text-sm mb-1">{order.game}</div>
              <div className="text-gray-400 text-xs">{order.listingTitle}</div>
            </div>
            <div className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${statusConfig.color}`}>
              <span className="mr-1">{statusConfig.icon}</span>
              {statusConfig.label}
            </div>
          </div>

          {/* Countdown Timer */}
          {order.timeLeftHours > 0 && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg border ${isUrgent ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <ClockIcon className={`w-4 h-4 ${isUrgent ? 'text-red-400' : 'text-yellow-400'}`} />
              <span className={`text-sm font-medium ${isUrgent ? 'text-red-400' : 'text-yellow-400'}`}>
                {isUrgent ? '🚨 URGENT: ' : '⏰ '}{order.timeLeftHours}h {order.timeLeftMinutes}m until auto-confirm
              </span>
            </div>
          )}
        </div>

        {/* Expandable Sections */}
        <div className="p-4 md:p-6">
          {/* Credentials Section */}
          <div className="mb-4">
            <motion.button
              onClick={(e) => toggleOrderExpansion(e, `${order.id}-credentials`)}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(31, 41, 55, 0.7)' }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex items-center justify-between w-full p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-[#00FFB2]/30 transition-all duration-200 ease-in-out"
            >
              <div className="flex items-center space-x-2">
                <KeyIcon className="w-4 h-4 text-[#00FFB2]" />
                <span className="text-white font-medium text-sm">Login Credentials</span>
              </div>
              {expandedOrders.has(`${order.id}-credentials`) ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
            
            <AnimatePresence>
              {expandedOrders.has(`${order.id}-credentials`) && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4 mt-2 bg-gray-900/50 rounded-lg border border-gray-700/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <div className="text-white font-mono">{order.credentials.email}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Password:</span>
                        <div className="text-white font-mono">{order.credentials.password}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Level:</span>
                        <div className="text-white">{order.credentials.level}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Linked Socials:</span>
                        <div className="text-white">{order.credentials.linkedSocials.join(', ')}</div>
                      </div>
                    </div>
                    {order.credentials.notableSkins.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-400 text-sm">Notable Items:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {order.credentials.notableSkins.map((skin, index) => (
                            <span key={index} className="px-2 py-1 bg-[#00FFB2]/20 text-[#00FFB2] text-xs rounded-full">
                              {skin}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Timeline Section */}
          <div className="mb-6">
            <motion.button
              onClick={(e) => toggleOrderExpansion(e, `${order.id}-timeline`)}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(31, 41, 55, 0.7)' }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex items-center justify-between w-full p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-[#00FFB2]/30 transition-all duration-200 ease-in-out"
            >
              <div className="flex items-center space-x-2">
                <ClipboardDocumentListIcon className="w-4 h-4 text-[#00FFB2]" />
                <span className="text-white font-medium text-sm">Action Timeline</span>
              </div>
              {expandedOrders.has(`${order.id}-timeline`) ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
            
            <AnimatePresence>
              {expandedOrders.has(`${order.id}-timeline`) && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4 mt-2 bg-gray-900/50 rounded-lg border border-gray-700/30">
                    <div className="space-y-3">
                      {order.timeline.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            step.status === 'completed' ? 'bg-green-500 border-green-500' :
                            step.status === 'current' ? 'bg-[#00FFB2] border-[#00FFB2] animate-pulse' :
                            'bg-gray-600 border-gray-600'
                          }`} />
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${
                              step.status === 'completed' ? 'text-green-400' :
                              step.status === 'current' ? 'text-[#00FFB2]' :
                              'text-gray-400'
                            }`}>
                              {step.step}
                            </div>
                            {step.timestamp && (
                              <div className="text-xs text-gray-500">
                                {new Date(step.timestamp).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              <Button
                 size="sm"
                 variant="outline"
                 onClick={(e) => handleInitiateDispute(e)}
                 className="w-full border-yellow-600 hover:border-yellow-400 hover:bg-yellow-400/10 text-yellow-400 transition-all duration-200 ease-in-out"
               >
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Initiate Dispute</span>
                <span className="md:hidden">Dispute</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setChatModal(order.orderId);
                }}
                className="w-full border-blue-600 hover:border-blue-400 hover:bg-blue-400/10 text-blue-400 transition-all duration-200 ease-in-out"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Message Buyer</span>
                <span className="md:hidden">Message</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleEmergencySupport(e, order.id)}
                className="w-full border-red-600 hover:border-red-400 hover:bg-red-400/10 text-red-400 transition-all duration-200 ease-in-out hover:shadow-lg hover:shadow-red-500/20"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">🚨 Emergency</span>
                <span className="md:hidden">🚨 SOS</span>
              </Button>
            </motion.div>
          </div>

          {/* Mark as Delivered Button */}
          {!order.isDelivered && order.escrowStatus === 'awaiting_delivery' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="mt-4 pt-4 border-t border-gray-700/50"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
              >
                <Button
                  size="sm"
                  variant="primary"
                  onClick={(e) => handleMarkAsDelivered(e, order.id)}
                  className="w-full bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] hover:from-[#00FFB2]/80 hover:to-[#00A8E8]/80 transition-all duration-200 ease-in-out"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Enhanced Backdrop with smooth fade-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          />
          
          {/* Enhanced Modal Panel with slide-up and fade-in */}
          <motion.div
            initial={{ x: '100%', y: 20, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ x: '100%', y: 20, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              opacity: { duration: 0.2, ease: 'easeInOut' }
            }}
            className="absolute right-0 top-0 h-full w-full max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l border-gray-700/50 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#00FFB2]/20 rounded-lg">
                    <ClipboardDocumentListIcon className="w-6 h-6 text-[#00FFB2]" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Pending Orders</h2>
                    <p className="text-sm text-gray-400">Digital Dealroom • Mission Control</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <div className="px-3 py-1 bg-[#00FFB2]/20 border border-[#00FFB2]/30 rounded-full">
                    <span className="text-[#00FFB2] text-sm font-bold">{filteredOrders.length} Pending</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Mobile Search Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchVisible(!searchVisible);
                  }}
                  className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 ease-in-out hover:scale-105"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
                
                {/* Desktop Search */}
                <div className="hidden md:block relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders, buyers, games..."
                    value={searchQuery}
                    onChange={(e) => {
                      e.preventDefault();
                      setSearchQuery(e.target.value);
                    }}
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent w-64"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 ease-in-out hover:scale-105"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <AnimatePresence>
              {searchVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="md:hidden border-b border-gray-700/50 bg-gray-800/50"
                >
                  <div className="p-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search orders, buyers, games..."
                        value={searchQuery}
                        onChange={(e) => {
                          e.preventDefault();
                          setSearchQuery(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-white mb-2">No pending orders? You're all clear, agent.</h3>
                  <p className="text-gray-400">Your mission queue is empty. Time to create more listings.</p>
                </motion.div>
              ) : (
                filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Chat Modal */}
       {chatModal && (() => {
         const order = orders.find(o => o.orderId === chatModal);
         const otherUser = {
           id: order?.buyerUsername || 'unknown',
           username: order?.buyerUsername || 'Unknown Buyer',
           avatar: order?.buyerAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
           isOnline: Math.random() > 0.5,
           lastSeen: 'Active now'
         };
         
         return (
           <ChatModal
             isOpen={!!chatModal}
             onClose={() => setChatModal(null)}
             orderId={chatModal}
             userRole="seller"
             otherUser={otherUser}
             onSendMessage={(message) => {
               console.log('Message sent:', message);
               showSuccess('Message sent successfully!');
             }}
           />
         );
       })()}
      
      {/* Emergency Support Modal */}
      <AnimatePresence>
        {emergencyModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEmergencyModal(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="relative bg-gradient-to-br from-red-900/90 to-gray-900/90 border border-red-500/50 rounded-2xl p-6 w-full max-w-md backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 animate-bounce">🚨</div>
                <h3 className="text-xl font-bold text-white mb-2">Emergency Support</h3>
                <p className="text-gray-300 mb-6">Our support team will contact you within 15 minutes for urgent assistance.</p>
                
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                  >
                    <Button
                      variant="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showSuccess('Emergency support request sent! We\'ll contact you shortly.');
                        setEmergencyModal(null);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 border-red-500 transition-all duration-200 ease-in-out"
                    >
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Request Emergency Call
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                  >
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEmergencyModal(null);
                      }}
                      className="w-full border-gray-600 hover:border-gray-500 transition-all duration-200 ease-in-out"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default PendingOrdersModal;