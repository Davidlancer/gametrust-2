import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ArrowDownTrayIcon,
  StarIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  KeyIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import { useToast } from '../UI/ToastProvider';
import DisputeModal from '../UI/DisputeModal';
import ChatModal from '../UI/ChatModal';

interface Order {
  id: string;
  game: string;
  accountTitle: string;
  seller: string;
  sellerAvatar: string;
  price: number;
  status: 'in_escrow' | 'delivered' | 'completed' | 'disputed' | 'refunded';
  escrowStatus: 'pending_delivery' | 'delivered' | 'confirmed' | 'disputed';
  date: string;
  timeLeft?: string;
  credentials?: {
    email: string;
    password: string;
    additionalInfo?: string;
  };
  proofImages?: string[];
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    game: 'CODM',
    accountTitle: 'Legendary',
    seller: '@GamerPlug',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face',
    price: 70000,
    status: 'in_escrow',
    escrowStatus: 'delivered',
    date: 'June 18, 2024',
    timeLeft: '2 days left to confirm',
    credentials: {
      email: 'codm.legend@email.com',
      password: 'SecurePass123',
      additionalInfo: 'Facebook linked, all legendary skins included'
    },
    proofImages: ['proof1.jpg', 'proof2.jpg']
  },
  {
    id: 'ORD-002',
    game: 'PUBG',
    accountTitle: 'Elite',
    seller: '@ProGamer',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    price: 50000,
    status: 'completed',
    escrowStatus: 'confirmed',
    date: 'June 15, 2024',
    credentials: {
      email: 'pubg.elite@email.com',
      password: 'ElitePass456',
      additionalInfo: 'All season passes completed'
    }
  },
  {
    id: 'ORD-003',
    game: 'Free Fire',
    accountTitle: 'God Mode',
    seller: '@FireMaster',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    price: 30000,
    status: 'disputed',
    escrowStatus: 'disputed',
    date: 'June 12, 2024'
  }
];

const getStatusBadge = (status: string, escrowStatus: string) => {
  const getStatusInfo = () => {
    if (status === 'in_escrow') {
      switch (escrowStatus) {
        case 'pending_delivery':
          return { text: 'Pending Delivery', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: ClockIcon };
        case 'delivered':
          return { text: 'Confirm Access', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: ClockIcon };
        case 'confirmed':
          return { text: 'Confirmed', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircleIcon };
        case 'disputed':
          return { text: 'Disputed', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: ExclamationTriangleIcon };
        default:
          return { text: 'In Escrow', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: ShieldCheckIcon };
      }
    }
    
    switch (status) {
      case 'completed':
        return { text: 'Completed', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', icon: CheckCircleIcon };
      case 'disputed':
        return { text: 'Disputed', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: ExclamationTriangleIcon };
      case 'refunded':
        return { text: 'Refunded', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', icon: CheckCircleIcon };
      default:
        return { text: status, color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', icon: ClockIcon };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bg} border ${statusInfo.border} min-w-[100px] justify-center`}>
      <Icon className="w-3 h-3 mr-1 flex-shrink-0" />
      <span className="truncate">{statusInfo.text}</span>
    </span>
  );
};

const BuyerOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeOrder, setDisputeOrder] = useState<Order | null>(null);
  const [disputedOrders, setDisputedOrders] = useState<Set<string>>(new Set());
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatOrderId, setChatOrderId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-switch to list view on mobile for better UX
      if (window.innerWidth < 768) {
        setViewMode('list');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const { showSuccess } = useToast();

  const openChat = (orderId: string) => {
    setChatOrderId(orderId);
    setChatModalOpen(true);
  };

  // Listen for chat events from notifications
  useEffect(() => {
    const handleOpenOrderChat = (event: CustomEvent) => {
      const { orderId } = event.detail;
      openChat(orderId);
    };

    window.addEventListener('openOrderChat', handleOpenOrderChat as EventListener);
    return () => {
      window.removeEventListener('openOrderChat', handleOpenOrderChat as EventListener);
    };
  }, []);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.accountTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeTab === 'all' || order.status === activeTab;
    
    return matchesSearch && matchesFilter;
  });



  const orderCounts = {
    all: filteredOrders.length,
    in_escrow: filteredOrders.filter(order => order.status === 'in_escrow').length,
    completed: filteredOrders.filter(order => order.status === 'completed').length,
    disputed: filteredOrders.filter(order => order.status === 'disputed').length,
  };

  const handleConfirmAccess = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    showSuccess(
      'Access Confirmed!',
      `Successfully confirmed access for ${order?.accountTitle} account. Escrow funds have been released to the seller.`
    );
    setSelectedOrder(null);
  };

  const handleOpenDispute = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      setDisputeOrder(order);
      setShowDisputeModal(true);
    }
  };

  const handleDisputeSubmitted = (orderId: string) => {
    setDisputedOrders(prev => new Set([...prev, orderId]));
    setShowDisputeModal(false);
    setDisputeOrder(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Mobile-Optimized Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">My Orders</h1>
            <p className="text-gray-400 mt-1 text-sm md:text-base">Track your gaming account purchases</p>
          </div>
          {/* Mobile: Show filter toggle prominently */}
          <div className="md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] transition-all duration-200"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Search and Controls */}
      <div className="flex flex-col gap-4">
        {/* Search Bar - Full width on mobile */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            placeholder={isMobile ? "Search orders..." : "Search orders, games, or sellers..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 md:py-2.5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/[0.12] focus:border-white/[0.16] w-full transition-all duration-200"
          />
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] transition-all duration-200"
          >
            {viewMode === 'grid' ? (
              <ListBulletIcon className="w-4 h-4" />
            ) : (
              <Squares2X2Icon className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] transition-all duration-200"
          >
            <FunnelIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile-Optimized Status Tabs */}
      <div className={`transition-all duration-300 ${showFilters && isMobile ? 'block' : isMobile ? 'hidden' : 'block'}`}>
        <div className="bg-white/[0.02] p-1 rounded-lg">
          {/* Mobile: Scrollable horizontal tabs */}
          <div className="md:flex md:items-center md:gap-1 overflow-x-auto scrollbar-hide">
            <div className="flex md:flex-wrap gap-1 min-w-max md:min-w-0">
              {[
                 { id: 'all', label: 'All', count: mockOrders.length },
                 { id: 'in_escrow', label: 'In Progress', count: orderCounts.in_escrow },
                 { id: 'completed', label: 'Completed', count: orderCounts.completed },
                 { id: 'disputed', label: 'Disputed', count: orderCounts.disputed },
               ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 md:px-3 py-2 md:py-1.5 text-sm md:text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white/[0.08] backdrop-blur-sm'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {isMobile ? tab.label : tab.label}
                  <span className="ml-1.5 opacity-60">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Display */}
      <div className="flex-1 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-sm opacity-60">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 25px -8px rgba(255, 255, 255, 0.1)" }}
                    className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 md:p-5 hover:border-white/[0.12] active:bg-white/[0.04] transition-all duration-200 group flex flex-col touch-manipulation h-full"
                  >
                    {/* Header - Fixed Height */}
                    <div className="flex items-start justify-between mb-3 md:mb-4 min-h-[48px]">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate mb-1 leading-tight" title={order.accountTitle}>{order.accountTitle}</h3>
                        <p className="text-xs opacity-60 truncate" title={order.game}>{order.game}</p>
                      </div>
                      <div className="flex-shrink-0 ml-2 md:ml-3">
                        {getStatusBadge(order.status, order.escrowStatus)}
                      </div>
                    </div>

                    {/* Seller Info - Fixed Height */}
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 min-h-[40px]">
                      <img
                        src={order.sellerAvatar}
                        alt={order.seller}
                        className="w-8 h-8 rounded-full ring-1 ring-white/[0.12] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={order.seller}>{order.seller}</p>
                        <p className="text-xs opacity-60 truncate">{order.date}</p>
                      </div>
                    </div>

                    {/* Price & Time Info - Flexible Height */}
                    <div className="flex-1 mb-3 md:mb-4">
                      <p className="text-lg font-semibold mb-1">₦{order.price.toLocaleString()}</p>
                      {order.timeLeft && (
                        <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-md px-2 py-1 inline-block">
                          <p className="text-xs text-yellow-400 font-medium">{order.timeLeft}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions - Uniform Layout */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-auto pt-4 border-t border-white/[0.08]">
                      {/* Confirm Access Button - Full width on mobile, flex-1 on desktop */}
                      {order.status === 'in_escrow' && order.escrowStatus === 'delivered' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConfirmAccess(order.id)}
                          className="w-full sm:flex-1 h-12 sm:h-9 text-sm sm:text-xs bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/40 text-green-400 border-green-500/30 font-medium flex items-center justify-center"
                        >
                          <CheckCircleIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5 mr-1.5" />
                          <span className="truncate">Confirm Access</span>
                        </Button>
                      )}
                      
                      {/* Secondary Actions - Aligned consistently */}
                      <div className={`flex gap-2 ${!(order.status === 'in_escrow' && order.escrowStatus === 'delivered') ? 'w-full sm:justify-between' : 'sm:w-auto'}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 sm:flex-none h-12 sm:h-9 sm:px-3 text-sm sm:text-xs hover:bg-white/[0.04] active:bg-white/[0.08] font-medium flex items-center justify-center"
                        >
                          <EyeIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5 sm:mr-1.5" />
                          <span className="sm:inline hidden truncate">View</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openChat(order.id)}
                          className="h-12 sm:h-9 px-4 sm:px-3 text-sm sm:text-xs hover:bg-white/[0.04] active:bg-white/[0.08] font-medium flex items-center justify-center"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </Button>
                        
                        {order.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-12 sm:h-9 px-4 sm:px-3 text-sm sm:text-xs hover:bg-white/[0.04] active:bg-white/[0.08] font-medium flex items-center justify-center"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl overflow-hidden">
                 {/* Desktop Header - Hidden on Mobile */}
                 <div className="hidden md:flex items-center justify-between p-4 border-b border-white/[0.06] text-xs font-semibold opacity-70">
                   <div className="flex-1">Order Details</div>
                   <div className="w-32 text-center">Actions</div>
                 </div>
                 
                 <div className="divide-y divide-white/[0.06]">
                   {filteredOrders.map((order) => (
                     <motion.div
                       key={order.id}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                       className="transition-all duration-200 group min-h-[80px] md:min-h-[80px] touch-manipulation"
                     >
                       {/* Mobile Layout */}
                       <div className="md:hidden p-4 space-y-3">
                         {/* Mobile Header Row */}
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/[0.08]">
                             <span className="text-lg font-bold text-blue-400">{order.game.charAt(0)}</span>
                           </div>
                           <div className="flex-1 min-w-0">
                             <h3 className="text-sm font-semibold truncate leading-tight" title={`${order.accountTitle} - ${order.game}`}>
                               {order.accountTitle} - {order.game}
                             </h3>
                             <div className="flex items-center gap-2 mt-1">
                               <img
                                 src={order.sellerAvatar}
                                 alt={order.seller}
                                 className="w-4 h-4 rounded-full ring-1 ring-white/[0.12] flex-shrink-0"
                               />
                               <span className="text-xs font-medium truncate opacity-80" title={order.seller}>{order.seller}</span>
                             </div>
                           </div>
                           <div className="text-right flex-shrink-0">
                             <p className="text-lg font-bold text-white">₦{order.price.toLocaleString()}</p>
                           </div>
                         </div>
                         
                         {/* Mobile Meta Row */}
                         <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-2">
                             <span className="opacity-60">{order.date}</span>
                             {order.timeLeft && (
                               <span className="text-yellow-400 font-medium">{order.timeLeft}</span>
                             )}
                           </div>
                           <div className="flex items-center">
                             {getStatusBadge(order.status, order.escrowStatus)}
                           </div>
                         </div>
                         
                         {/* Mobile Action Buttons - Uniform Layout */}
                          <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-white/[0.08]">
                            {/* Confirm Access Button - Full width when present */}
                            {order.status === 'in_escrow' && order.escrowStatus === 'delivered' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleConfirmAccess(order.id)}
                                className="w-full h-12 text-sm bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/40 text-green-400 border-green-500/30 font-medium flex items-center justify-center"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Confirm Access
                              </Button>
                            )}
                            
                            {/* Secondary Actions Row - Consistent alignment */}
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="flex-1 h-12 text-sm hover:bg-white/[0.04] active:bg-white/[0.08] font-medium flex items-center justify-center"
                              >
                                <EyeIcon className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openChat(order.id)}
                                className="h-12 px-4 text-sm hover:bg-white/[0.04] active:bg-white/[0.08] font-medium flex items-center justify-center"
                              >
                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                       </div>
                       
                       {/* Desktop Layout */}
                       <div className="hidden md:flex items-center justify-between p-4">
                         {/* Left Section: Icon + Content */}
                         <div className="flex items-center gap-4 flex-1 min-w-0">
                           {/* Order Icon/Image */}
                           <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/[0.08]">
                             <span className="text-lg font-bold text-blue-400">{order.game.charAt(0)}</span>
                           </div>
                           
                           {/* Order Content */}
                           <div className="flex-1 min-w-0 space-y-1">
                             {/* Title */}
                             <h3 className="text-sm font-semibold truncate leading-tight">
                               {order.accountTitle} - {order.game}
                             </h3>
                             
                             {/* Meta Info Row 1: Seller & Price */}
                             <div className="flex items-center gap-4 text-xs">
                               <div className="flex items-center gap-2 min-w-0">
                                 <img
                                   src={order.sellerAvatar}
                                   alt={order.seller}
                                   className="w-5 h-5 rounded-full ring-1 ring-white/[0.12] flex-shrink-0"
                                 />
                                 <span className="font-medium truncate opacity-80">{order.seller}</span>
                               </div>
                               <span className="font-semibold text-white">₦{order.price.toLocaleString()}</span>
                             </div>
                             
                             {/* Meta Info Row 2: Date, Status & Time Left */}
                             <div className="flex items-center gap-3 text-xs">
                               <span className="opacity-60">{order.date}</span>
                               <div className="flex items-center">
                                 {getStatusBadge(order.status, order.escrowStatus)}
                               </div>
                               {order.timeLeft && (
                                 <span className="text-yellow-400 font-medium truncate">{order.timeLeft}</span>
                               )}
                             </div>
                           </div>
                         </div>
                         
                         {/* Right Section: Action Buttons - Uniform Layout */}
                         <div className="flex flex-col items-center justify-center gap-1 w-36 flex-shrink-0">
                           {/* Confirm Access Button - Top priority when present */}
                           {order.status === 'in_escrow' && order.escrowStatus === 'delivered' && (
                             <Button
                               variant="primary"
                               size="sm"
                               onClick={() => handleConfirmAccess(order.id)}
                               className="w-full h-8 px-2 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 font-medium mb-1"
                             >
                               <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                               Confirm
                             </Button>
                           )}
                           
                           {/* Secondary Actions Row - Consistent positioning */}
                           <div className="flex gap-1 justify-center">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => setSelectedOrder(order)}
                               className="h-8 px-2.5 text-xs hover:bg-white/[0.04] font-medium"
                             >
                               <EyeIcon className="w-3.5 h-3.5" />
                             </Button>
                             
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => openChat(order.id)}
                               className="h-8 px-2.5 text-xs hover:bg-white/[0.04] font-medium"
                             >
                               <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                             </Button>
                             
                             {order.status === 'completed' && (
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 px-2.5 text-xs hover:bg-white/[0.04] font-medium"
                               >
                                 <StarIcon className="w-3.5 h-3.5" />
                               </Button>
                             )}
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal - Mobile Optimized */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: isMobile ? 50 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isMobile ? 50 : 20 }}
            className={`bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden ${
              isMobile 
                ? 'fixed inset-x-4 inset-y-8 rounded-2xl max-h-[calc(100vh-4rem)]' 
                : 'rounded-2xl max-w-2xl w-full max-h-[90vh]'
            }`}
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06] bg-white/[0.01] backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/[0.08]">
                  <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Order Details</h3>
                  <p className="text-sm text-white/60 font-mono">{selectedOrder.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedOrder.status, selectedOrder.escrowStatus)}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto smooth-scroll scrollbar-thin">
              {/* Progress Timeline */}
              <div className="p-4 md:p-6 border-b border-white/[0.06]">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/[0.08] rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: selectedOrder.status === 'completed' ? '100%' : 
                               selectedOrder.status === 'delivered' || selectedOrder.escrowStatus === 'delivered' ? '75%' :
                               selectedOrder.status === 'in_escrow' ? '50%' : '25%'
                      }}
                    />
                  </div>
                  {[
                     { label: 'Placed', icon: CheckCircleIcon, active: true },
                     { label: 'Processing', icon: ClockIcon, active: selectedOrder.status === 'in_escrow' || selectedOrder.escrowStatus === 'delivered' || selectedOrder.status === 'completed' },
                     { label: 'Delivered', icon: ShieldCheckIcon, active: selectedOrder.escrowStatus === 'delivered' || selectedOrder.status === 'completed' },
                     { label: 'Completed', icon: StarIcon, active: selectedOrder.status === 'completed' }
                   ].map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          step.active 
                            ? 'bg-gradient-to-br from-blue-500 to-green-500 border-transparent text-white' 
                            : 'bg-white/[0.02] border-white/[0.12] text-white/40'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs mt-2 font-medium ${
                          step.active ? 'text-white' : 'text-white/40'
                        }`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Content Sections */}
              <div className="p-4 md:p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <InformationCircleIcon className="w-5 h-5 text-blue-400" />
                  Order Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/60 mb-1">Game Account</p>
                    <p className="text-white font-medium">{selectedOrder.accountTitle}</p>
                    <p className="text-sm text-white/80">{selectedOrder.game}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      Price
                    </p>
                    <p className="text-xl font-bold text-green-400">₦{selectedOrder.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-1">
                      <CalendarDaysIcon className="w-4 h-4" />
                      Order Date
                    </p>
                    <p className="text-white font-medium">{selectedOrder.date}</p>
                  </div>
                  {selectedOrder.timeLeft && (
                    <div>
                      <p className="text-sm text-white/60 mb-1">Time Remaining</p>
                      <p className="text-yellow-400 font-medium">{selectedOrder.timeLeft}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-purple-400" />
                  Seller Information
                </h4>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedOrder.sellerAvatar}
                    alt={selectedOrder.seller}
                    className="w-12 h-12 rounded-full ring-2 ring-white/[0.12]"
                  />
                  <div>
                    <p className="text-white font-semibold">{selectedOrder.seller}</p>
                    <p className="text-sm text-white/60">Verified Seller</p>
                  </div>
                </div>
              </div>

                {/* Account Credentials */}
                {selectedOrder.credentials && (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <KeyIcon className="w-5 h-5 text-green-400" />
                      Account Credentials
                    </h4>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-white/60 mb-1">Email Address</p>
                          <p className="text-white font-mono text-sm bg-white/[0.02] px-3 py-2 rounded border border-white/[0.04]">
                            {selectedOrder.credentials.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60 mb-1">Password</p>
                          <p className="text-white font-mono text-sm bg-white/[0.02] px-3 py-2 rounded border border-white/[0.04]">
                            {selectedOrder.credentials.password}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.credentials.additionalInfo && (
                        <div>
                          <p className="text-xs text-white/60 mb-1">Additional Information</p>
                          <p className="text-white text-sm bg-white/[0.02] px-3 py-2 rounded border border-white/[0.04]">
                            {selectedOrder.credentials.additionalInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Footer with Action Buttons */}
            <div className="border-t border-white/[0.06] p-4 md:p-6 bg-white/[0.01] backdrop-blur-xl sticky bottom-0 z-10">
              <div className={`flex gap-2 md:gap-3 ${isMobile ? 'flex-col' : ''}`}>
                <Button
                  variant="outline"
                  onClick={() => openChat(selectedOrder.id)}
                  className={`flex items-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 active:bg-blue-500/20 px-4 md:px-6 min-h-[48px] md:min-h-[40px] ${isMobile ? 'w-full justify-center' : ''}`}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Message Seller
                </Button>
                
                {selectedOrder.status === 'in_escrow' && selectedOrder.escrowStatus === 'delivered' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleConfirmAccess(selectedOrder.id)}
                      className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white font-semibold px-4 md:px-6 min-h-[48px] md:min-h-[40px] ${isMobile ? 'w-full flex-1 justify-center' : 'flex-1'}`}
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Confirm Access
                    </Button>
                    {disputedOrders.has(selectedOrder.id) ? (
                      <Button
                        variant="outline"
                        disabled
                        className={`border-orange-500/30 text-orange-400 cursor-not-allowed px-4 md:px-6 min-h-[48px] md:min-h-[40px] ${isMobile ? 'w-full justify-center' : ''}`}
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                        In Dispute
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleOpenDispute(selectedOrder.id)}
                        className={`border-red-500/30 text-red-400 hover:bg-red-500/10 active:bg-red-500/20 px-4 md:px-6 min-h-[48px] md:min-h-[40px] ${isMobile ? 'w-full justify-center' : ''}`}
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                        {isMobile ? 'Dispute' : 'Open Dispute'}
                      </Button>
                    )}
                  </>
                )}
                
                {selectedOrder.status === 'completed' && (
                  <Button
                    variant="outline"
                    className={`border-green-500/30 text-green-400 hover:bg-green-500/10 active:bg-green-500/20 px-4 md:px-6 min-h-[48px] md:min-h-[40px] ${isMobile ? 'w-full justify-center' : ''}`}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    {isMobile ? 'Download' : 'Download Receipt'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        order={disputeOrder}
        onDisputeSubmitted={handleDisputeSubmitted}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        orderId={chatOrderId || ''}
        userRole="buyer"
        otherUser={{ id: 'seller', username: 'Seller', avatar: '' }}
      />
    </div>
  );
};

export default BuyerOrders;