import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  ScaleIcon,
  PhotoIcon,
  DocumentIcon,
  PlayIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../UI/ToastProvider';
import SupportThread from './SupportThread';

interface Dispute {
  id: string;
  caseNumber: string;
  orderId: string;
  game: string;
  gameImage?: string;
  accountLevel: string;
  seller: string;
  amount: number;
  status: 'open' | 'in_review' | 'resolved' | 'escalated';
  reason: string;
  description: string;
  createdDate: string;
  lastUpdate: string;
  supportThread?: string;
  evidence: {
    screenshots: number;
    documents: number;
    videos: number;
  };
  timeline: {
    stage: string;
    date: string;
    completed: boolean;
  }[];
  hasNewMessages?: boolean;
}

const mockDisputes: Dispute[] = [
  {
    id: 'DISP-001',
    caseNumber: 'GT-2024-001',
    orderId: 'TRX-8483',
    game: 'Call of Duty Mobile',
    gameImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
    accountLevel: 'Lvl 72 Legendary',
    seller: '@GamerPlug',
    amount: 75000,
    status: 'in_review',
    reason: 'Login credentials not working',
    description: 'The account credentials provided by the seller are not working. I have tried multiple times but cannot access the account.',
    createdDate: 'June 18, 2024',
    lastUpdate: 'Aug 5',
    supportThread: 'THREAD-001',
    evidence: {
      screenshots: 3,
      documents: 1,
      videos: 0
    },
    timeline: [
      { stage: 'Filed', date: 'June 18, 2024', completed: true },
      { stage: 'Review', date: 'June 19, 2024', completed: true },
      { stage: 'Response', date: '', completed: false },
      { stage: 'Resolved', date: '', completed: false }
    ],
    hasNewMessages: true
  },
  {
    id: 'DISP-002',
    caseNumber: 'GT-2024-002',
    orderId: 'TRX-9247',
    game: 'PUBG Mobile',
    gameImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
    accountLevel: 'Lvl 65 Conqueror',
    seller: '@PubgKing',
    amount: 85000,
    status: 'resolved',
    reason: 'Account banned after purchase',
    description: 'The account was banned shortly after I received it. This suggests it may have been compromised before the sale.',
    createdDate: 'June 10, 2024',
    lastUpdate: 'Jul 28',
    supportThread: 'THREAD-002',
    evidence: {
      screenshots: 5,
      documents: 2,
      videos: 1
    },
    timeline: [
      { stage: 'Filed', date: 'June 10, 2024', completed: true },
      { stage: 'Review', date: 'June 11, 2024', completed: true },
      { stage: 'Response', date: 'June 12, 2024', completed: true },
      { stage: 'Resolved', date: 'June 15, 2024', completed: true }
    ]
  },
  {
    id: 'DISP-003',
    caseNumber: 'GT-2024-003',
    orderId: 'TRX-5621',
    game: 'Free Fire',
    gameImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop',
    accountLevel: 'Lvl 80 Heroic',
    seller: '@FFMaster',
    amount: 45000,
    status: 'open',
    reason: 'Missing skins as advertised',
    description: 'The account is missing several skins and characters that were clearly listed in the original advertisement.',
    createdDate: 'June 22, 2024',
    lastUpdate: 'Aug 3',
    supportThread: 'THREAD-003',
    evidence: {
      screenshots: 2,
      documents: 0,
      videos: 0
    },
    timeline: [
      { stage: 'Filed', date: 'June 22, 2024', completed: true },
      { stage: 'Review', date: '', completed: false },
      { stage: 'Response', date: '', completed: false },
      { stage: 'Resolved', date: '', completed: false }
    ]
  },
  {
    id: 'DISP-004',
    caseNumber: 'GT-2024-004',
    orderId: 'TRX-3847',
    game: 'Clash of Clans',
    gameImage: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=100&h=100&fit=crop',
    accountLevel: 'Town Hall 14',
    seller: '@ClashMaster',
    amount: 120000,
    status: 'escalated',
    reason: 'Account recovery by original owner',
    description: 'The original owner recovered the account after the sale was completed. This appears to be a fraudulent transaction.',
    createdDate: 'June 5, 2024',
    lastUpdate: 'Aug 1',
    supportThread: 'THREAD-004',
    evidence: {
      screenshots: 8,
      documents: 3,
      videos: 2
    },
    timeline: [
      { stage: 'Filed', date: 'June 5, 2024', completed: true },
      { stage: 'Review', date: 'June 6, 2024', completed: true },
      { stage: 'Response', date: 'June 8, 2024', completed: true },
      { stage: 'Resolved', date: '', completed: false }
    ],
    hasNewMessages: true
  }
];



const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-500';
    case 'in_review':
      return 'bg-yellow-500';
    case 'resolved':
      return 'bg-green-500';
    case 'escalated':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_review':
      return 'In Review';
    case 'resolved':
      return 'Resolved';
    case 'escalated':
      return 'Escalated';
    default:
      return 'Unknown';
  }
};

const BuyerDisputes: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showSupportThread, setShowSupportThread] = useState(false);
  const [currentThreadDisputeId, setCurrentThreadDisputeId] = useState<string>('');
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const filters = [
    { key: 'all', label: 'All', count: mockDisputes.length },
    { key: 'open', label: 'Open', count: mockDisputes.filter(d => d.status === 'open').length },
    { key: 'in_review', label: 'In Review', count: mockDisputes.filter(d => d.status === 'in_review').length },
    { key: 'resolved', label: 'Resolved', count: mockDisputes.filter(d => d.status === 'resolved').length }
  ];

  const filteredDisputes = mockDisputes.filter(dispute => {
    if (filter === 'all') return true;
    return dispute.status === filter;
  });

  const getProgressPercentage = (timeline: Dispute['timeline']) => {
    const completedStages = timeline.filter(stage => stage.completed).length;
    return (completedStages / timeline.length) * 100;
  };

  const handlePullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    showSuccess('Disputes updated!');
  };

  const handleCardSwipe = (dispute: Dispute, direction: 'left' | 'right') => {
    if (direction === 'left') {
      // Quick escalate
      showInfo(`Escalating dispute ${dispute.caseNumber}...`);
    } else if (direction === 'right' && dispute.status === 'resolved') {
      // Quick mark as resolved
      showSuccess(`Dispute ${dispute.caseNumber} marked as resolved!`);
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      showSuccess('Message sent!');
      setMessageText('');
    }
  };

  // Detect keyboard open/close
  useEffect(() => {
    const handleResize = () => {
      const isOpen = window.visualViewport ? window.visualViewport.height < window.innerHeight * 0.75 : false;
      setIsKeyboardOpen(isOpen);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Desktop Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Disputes</h1>
              <p className="text-gray-400">Track and resolve purchase issues</p>
            </div>
            <div className="flex items-center space-x-4">
              {filters.map((filterItem) => {
                const hasNewMessages = filterItem.key !== 'all' && 
                  mockDisputes.some(d => d.status === filterItem.key && d.hasNewMessages);
                
                return (
                  <motion.button
                    key={filterItem.key}
                    onClick={() => setFilter(filterItem.key)}
                    className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filter === filterItem.key
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {filterItem.label}
                    {filterItem.count > 0 && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        filter === filterItem.key ? 'bg-white/20' : 'bg-gray-600'
                      }`}>
                        {filterItem.count}
                      </span>
                    )}
                    {hasNewMessages && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Desktop Disputes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDisputes.map((dispute, index) => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedDispute(dispute)}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-600">
                    <img 
                      src={dispute.gameImage} 
                      alt={dispute.game}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {dispute.reason}
                    </h3>
                    <p className="text-sm text-gray-400">#{dispute.orderId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    dispute.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                    dispute.status === 'in_review' ? 'bg-yellow-500/20 text-yellow-400' :
                    dispute.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {getStatusText(dispute.status)}
                  </span>
                  {dispute.hasNewMessages && (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
              </div>

              {/* Game Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-300 font-medium">{dispute.game}</p>
                <p className="text-xs text-gray-500">{dispute.accountLevel}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs text-gray-400">{Math.round(getProgressPercentage(dispute.timeline))}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(dispute.timeline)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>

              {/* Amount & Date */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400 font-semibold">₦{dispute.amount.toLocaleString()}</span>
                <span className="text-gray-500">{dispute.lastUpdate}</span>
              </div>

              {/* Evidence Count */}
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <PhotoIcon className="w-4 h-4" />
                  <span>{dispute.evidence.screenshots}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <DocumentIcon className="w-4 h-4" />
                  <span>{dispute.evidence.documents}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <PlayIcon className="w-4 h-4" />
                  <span>{dispute.evidence.videos}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Modal */}
        <AnimatePresence>
          {selectedDispute && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDispute(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-600">
                      <img 
                        src={selectedDispute.gameImage} 
                        alt={selectedDispute.game}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedDispute.reason}</h2>
                      <p className="text-gray-400">#{selectedDispute.orderId} • {selectedDispute.game}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDispute(null)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Transaction Details */}
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <h3 className="font-semibold text-white mb-3">Transaction Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Amount:</span>
                            <span className="text-green-400 font-semibold">₦{selectedDispute.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Seller:</span>
                            <span className="text-white">{selectedDispute.seller}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Date:</span>
                            <span className="text-white">{selectedDispute.createdDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-medium ${
                              selectedDispute.status === 'open' ? 'text-blue-400' :
                              selectedDispute.status === 'in_review' ? 'text-yellow-400' :
                              selectedDispute.status === 'resolved' ? 'text-green-400' :
                              'text-red-400'
                            }`}>
                              {getStatusText(selectedDispute.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <h3 className="font-semibold text-white mb-3">Issue Description</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{selectedDispute.description}</p>
                      </div>

                      {/* Evidence */}
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <h3 className="font-semibold text-white mb-3">Evidence</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <PhotoIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <p className="text-sm text-gray-400">{selectedDispute.evidence.screenshots} Screenshots</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <DocumentIcon className="w-6 h-6 text-green-400" />
                            </div>
                            <p className="text-sm text-gray-400">{selectedDispute.evidence.documents} Documents</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <PlayIcon className="w-6 h-6 text-purple-400" />
                            </div>
                            <p className="text-sm text-gray-400">{selectedDispute.evidence.videos} Videos</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Progress Timeline */}
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <h3 className="font-semibold text-white mb-4">Progress Timeline</h3>
                        <div className="space-y-4">
                          {selectedDispute.timeline.map((stage, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                stage.completed ? 'bg-green-500' : 'bg-gray-600'
                              }`}>
                                {stage.completed ? (
                                  <CheckIcon className="w-4 h-4 text-white" />
                                ) : (
                                  <span className="text-xs text-gray-400">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  stage.completed ? 'text-white' : 'text-gray-400'
                                }`}>
                                  {stage.stage}
                                </p>
                                {stage.date && (
                                  <p className="text-xs text-gray-500">{stage.date}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <h3 className="font-semibold text-white mb-4">Actions</h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              setCurrentThreadDisputeId(selectedDispute.id);
                              setShowSupportThread(true);
                              setSelectedDispute(null);
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                          >
                            <ScaleIcon className="w-5 h-5" />
                            <span>Contact Support</span>
                          </button>
                          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            <span>Upload Evidence</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50">
          <div className="px-4 py-4">
            <div className="flex items-center justify-center mb-3">
              <h1 className="text-xl font-semibold text-white">My Disputes</h1>
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
              >
                <InformationCircleIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 left-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 z-50"
                >
                  Track & resolve purchase issues.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Chips */}
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
              {filters.map((filterItem) => {
                const hasNewMessages = filterItem.key !== 'all' && 
                  mockDisputes.some(d => d.status === filterItem.key && d.hasNewMessages);
                
                return (
                  <motion.button
                    key={filterItem.key}
                    onClick={() => setFilter(filterItem.key)}
                    className={`relative flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filter === filterItem.key
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filterItem.label}
                    {filterItem.count > 0 && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                        filter === filterItem.key ? 'bg-white/20' : 'bg-gray-600'
                      }`}>
                        {filterItem.count}
                      </span>
                    )}
                    {hasNewMessages && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pull to Refresh */}
        <div className="relative">
          {isRefreshing && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
              <ArrowPathIcon className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          )}

          {/* Dispute Cards */}
          <div 
            ref={scrollRef}
            className="px-4 py-4 space-y-3 overflow-y-auto"
            style={{ height: 'calc(100vh - 140px)' }}
            onTouchStart={(e) => {
              const startY = e.touches[0].clientY;
              const scrollTop = scrollRef.current?.scrollTop || 0;
              
              if (scrollTop === 0) {
                const handleTouchMove = (e: TouchEvent) => {
                  const currentY = e.touches[0].clientY;
                  const diff = currentY - startY;
                  
                  if (diff > 100) {
                    handlePullToRefresh();
                    document.removeEventListener('touchmove', handleTouchMove);
                  }
                };
                
                document.addEventListener('touchmove', handleTouchMove, { once: true });
              }
            }}
          >
            <AnimatePresence>
               {filteredDisputes.map((dispute, index) => {
                 return (
                  <motion.div
                    key={dispute.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: swipeDirection === 'left' ? -300 : 300 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: -100, right: 100 }}
                      onDragEnd={(_, info: PanInfo) => {
                        if (Math.abs(info.offset.x) > 50) {
                          const direction = info.offset.x > 0 ? 'right' : 'left';
                          setSwipeDirection(direction);
                          handleCardSwipe(dispute, direction);
                        }
                      }}
                      className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 active:scale-95 transition-transform"
                      onClick={() => setSelectedDispute(dispute)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Game Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-600">
                            <img 
                              src={dispute.gameImage} 
                              alt={dispute.game}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {dispute.hasNewMessages && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white truncate pr-2">
                              {dispute.reason}
                            </h3>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(dispute.status)}`} />
                              <span className="text-xs text-gray-400">{getStatusText(dispute.status)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>#{dispute.orderId}</span>
                            <span>{dispute.lastUpdate}</span>
                          </div>
                        </div>

                        {/* Chevron */}
                        <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty State */}
            {filteredDisputes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ScaleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No disputes found</h3>
                <p className="text-gray-400 text-sm">
                  {filter !== 'all' ? 'Try a different filter.' : 'No disputes have been filed.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Fallback - Show original design */}
      <div className="hidden md:block">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                  <ScaleIcon className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight">My Disputes</h1>
                  <p className="text-gray-400 text-lg mt-1">Track and resolve issues related to your account purchases</p>
                </div>
              </div>
            </motion.div>
            
            <div className="text-center py-20">
              <p className="text-gray-400">Please use mobile view for the optimized disputes experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Drawer */}
      <AnimatePresence>
        {selectedDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setSelectedDispute(null)}
          >
            <motion.div
              ref={drawerRef}
              initial={{ y: '100%' }}
              animate={{ y: '10%' }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  setSelectedDispute(null);
                }
              }}
              className="absolute inset-x-0 bottom-0 bg-gray-900 rounded-t-3xl shadow-2xl overflow-hidden"
              style={{ height: isKeyboardOpen ? '60%' : '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-gray-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-600">
                    <img 
                      src={selectedDispute.gameImage} 
                      alt={selectedDispute.game}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">{selectedDispute.reason}</h2>
                    <p className="text-sm text-gray-400">#{selectedDispute.orderId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6" style={{ height: isKeyboardOpen ? 'calc(60vh - 200px)' : 'calc(90vh - 200px)' }}>
                {/* Transaction Summary - Collapsed by default */}
                <motion.div
                  initial={{ height: 'auto' }}
                  className="bg-gray-800/30 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Transaction Summary</h3>
                    <button className="text-gray-400">
                      <EllipsisHorizontalIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Game</p>
                      <p className="text-white">{selectedDispute.game}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-green-400 font-medium">₦{selectedDispute.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Your Complaint */}
                <div className="bg-gray-800/30 rounded-xl p-4">
                  <h3 className="font-medium text-white mb-3">Your Complaint</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedDispute.description}</p>
                </div>

                {/* Progress Tracker */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/30 rounded-xl p-4"
                >
                  <h3 className="font-medium text-white mb-4">Progress</h3>
                  <div className="flex items-center justify-between mb-4">
                    {selectedDispute.timeline.map((stage, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${
                          stage.completed 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-600 bg-gray-800'
                        }`}>
                          {stage.completed && <CheckIcon className="w-4 h-4 text-white" />}
                        </div>
                        <p className={`text-xs text-center ${
                          stage.completed ? 'text-white' : 'text-gray-400'
                        }`}>
                          {stage.stage}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage(selectedDispute.timeline)}%` }}
                      transition={{ duration: 1 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Evidence Carousel */}
                <div className="bg-gray-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Evidence</h3>
                    <button className="text-blue-400 text-sm">View All</button>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex-1 text-center p-3 bg-gray-700/50 rounded-lg">
                      <PhotoIcon className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                      <p className="text-white text-sm font-medium">{selectedDispute.evidence.screenshots}</p>
                      <p className="text-gray-400 text-xs">Photos</p>
                    </div>
                    <div className="flex-1 text-center p-3 bg-gray-700/50 rounded-lg">
                      <DocumentIcon className="w-6 h-6 text-green-400 mx-auto mb-1" />
                      <p className="text-white text-sm font-medium">{selectedDispute.evidence.documents}</p>
                      <p className="text-gray-400 text-xs">Docs</p>
                    </div>
                    <div className="flex-1 text-center p-3 bg-gray-700/50 rounded-lg">
                      <PlayIcon className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <p className="text-white text-sm font-medium">{selectedDispute.evidence.videos}</p>
                      <p className="text-gray-400 text-xs">Videos</p>
                    </div>
                  </div>
                </div>

                {/* Support Thread Preview */}
                <div className="bg-gray-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Support Thread</h3>
                    <button 
                      onClick={() => {
                        setCurrentThreadDisputeId(selectedDispute.id);
                        setShowSupportThread(true);
                        setSelectedDispute(null);
                      }}
                      className="text-blue-400 text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">GT</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">We're reviewing your case and will update you within 24 hours.</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">You</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">I've uploaded additional screenshots showing the issue.</p>
                        <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Input */}
              <div className="border-t border-gray-700/50 p-4 bg-gray-900">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={() => showInfo('Upload evidence...')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowUpTrayIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="p-3 bg-blue-500 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {selectedDispute.status !== 'resolved' && (
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        showInfo('Escalating to human agent...');
                        setSelectedDispute(null);
                      }}
                      className="w-full py-2 text-yellow-400 text-sm font-medium hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      Escalate to Human Agent
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Thread Modal */}
      <SupportThread
        disputeId={currentThreadDisputeId}
        isOpen={showSupportThread}
        onClose={() => {
          setShowSupportThread(false);
          setCurrentThreadDisputeId('');
        }}
      />
    </div>
  );
};

export default BuyerDisputes;