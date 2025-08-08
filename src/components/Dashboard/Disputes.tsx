import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  ArrowUpTrayIcon,
  ShieldCheckIcon,
  FireIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon, BoltIcon } from '@heroicons/react/24/solid';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import StatusBadge from '../UI/StatusBadge';

interface DisputeEvidence {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  uploadedAt: string;
}

interface DisputeMessage {
  id: string;
  sender: 'seller' | 'buyer' | 'admin';
  message: string;
  timestamp: string;
  attachments?: DisputeEvidence[];
}

interface Dispute {
  id: string;
  orderId: string;
  buyerUsername: string;
  buyerAvatar: string;
  listingTitle: string;
  reason: string;
  description: string;
  amount: number;
  status: 'active' | 'resolved' | 'escalated' | 'closed';
  createdAt: string;
  resolvedAt?: string;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  adminNotes?: string;
}

const mockDisputes: Dispute[] = [
  {
    id: 'DIS_001',
    orderId: 'ORD_12345',
    buyerUsername: 'gamer_pro',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'CODM Legendary Account - Mythic Weapons',
    reason: 'Account credentials not working',
    description: 'The login credentials provided do not work. I have tried multiple times but cannot access the account.',
    amount: 45000,
    status: 'active',
    createdAt: '2024-01-18T10:30:00Z',
    evidence: [
      {
        id: 'ev1',
        type: 'image',
        url: '/evidence/screenshot1.jpg',
        name: 'Login Error Screenshot',
        uploadedAt: '2024-01-18T10:35:00Z'
      }
    ],
    messages: [
      {
        id: 'msg1',
        sender: 'buyer',
        message: 'The credentials you provided are not working. I keep getting an error message.',
        timestamp: '2024-01-18T10:30:00Z'
      },
      {
        id: 'msg2',
        sender: 'seller',
        message: 'I have double-checked the credentials. They were working when I last tested them. Can you try again?',
        timestamp: '2024-01-18T11:15:00Z'
      },
      {
        id: 'msg3',
        sender: 'admin',
        message: 'We are reviewing this case. Please provide any additional evidence you may have.',
        timestamp: '2024-01-18T14:20:00Z'
      }
    ]
  },
  {
    id: 'DIS_002',
    orderId: 'ORD_12346',
    buyerUsername: 'mobile_gamer',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'PUBG Mobile Conqueror Account',
    reason: 'Account banned after purchase',
    description: 'The account was banned shortly after I received it. This suggests it may have been compromised.',
    amount: 28500,
    status: 'resolved',
    createdAt: '2024-01-15T14:20:00Z',
    resolvedAt: '2024-01-17T16:45:00Z',
    evidence: [
      {
        id: 'ev2',
        type: 'image',
        url: '/evidence/ban_notice.jpg',
        name: 'Account Ban Notice',
        uploadedAt: '2024-01-15T14:25:00Z'
      }
    ],
    messages: [
      {
        id: 'msg4',
        sender: 'buyer',
        message: 'The account got banned just 2 hours after I received it. This is unacceptable.',
        timestamp: '2024-01-15T14:20:00Z'
      },
      {
        id: 'msg5',
        sender: 'seller',
        message: 'I am not responsible for bans that occur after the sale. The account was clean when sold.',
        timestamp: '2024-01-15T15:30:00Z'
      },
      {
        id: 'msg6',
        sender: 'admin',
        message: 'After investigation, we found evidence of prior violations. Refund has been processed.',
        timestamp: '2024-01-17T16:45:00Z'
      }
    ],
    adminNotes: 'Account showed signs of previous violations. Buyer refunded.'
  },
  {
    id: 'DIS_003',
    orderId: 'ORD_12347',
    buyerUsername: 'ff_player',
    buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Free Fire Grandmaster Account',
    reason: 'Missing items from description',
    description: 'The account is missing several skins and characters that were listed in the description.',
    amount: 15000,
    status: 'resolved',
    createdAt: '2024-01-12T09:15:00Z',
    resolvedAt: '2024-01-14T11:30:00Z',
    evidence: [
      {
        id: 'ev3',
        type: 'video',
        url: '/evidence/account_showcase.mp4',
        name: 'Account Showcase Video',
        uploadedAt: '2024-01-12T12:00:00Z'
      }
    ],
    messages: [
      {
        id: 'msg7',
        sender: 'buyer',
        message: 'The account is missing the Alok character and several weapon skins mentioned in your listing.',
        timestamp: '2024-01-12T09:15:00Z'
      },
      {
        id: 'msg8',
        sender: 'seller',
        message: 'I have provided a video showing all items. Please check the inventory carefully.',
        timestamp: '2024-01-12T12:00:00Z'
      },
      {
        id: 'msg9',
        sender: 'admin',
        message: 'Video evidence confirms all listed items are present. Dispute resolved in favor of seller.',
        timestamp: '2024-01-14T11:30:00Z'
      }
    ],
    adminNotes: 'Seller provided comprehensive video evidence. All items confirmed present.'
  },
  {
    id: 'DIS_004',
    orderId: 'ORD_12348',
    buyerUsername: 'apex_legend',
    buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Apex Legends Predator Account',
    reason: 'Account recovery attempted by original owner',
    description: 'The original owner is trying to recover the account. This is a serious security issue.',
    amount: 75000,
    status: 'escalated',
    createdAt: '2024-01-20T16:45:00Z',
    evidence: [
      {
        id: 'ev4',
        type: 'image',
        url: '/evidence/recovery_attempt.jpg',
        name: 'Account Recovery Email',
        uploadedAt: '2024-01-20T17:00:00Z'
      }
    ],
    messages: [
      {
        id: 'msg10',
        sender: 'buyer',
        message: 'Someone is trying to recover this account! I got an email about password reset attempts.',
        timestamp: '2024-01-20T16:45:00Z'
      },
      {
        id: 'msg11',
        sender: 'seller',
        message: 'This is impossible. The account was legitimately obtained and I have all the proof.',
        timestamp: '2024-01-20T17:30:00Z'
      },
      {
        id: 'msg12',
        sender: 'admin',
        message: 'This case has been escalated to our security team for investigation. Please do not attempt to access the account.',
        timestamp: '2024-01-20T18:15:00Z'
      }
    ]
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
          <ClockIcon className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case 'resolved':
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Resolved
        </Badge>
      );
    case 'escalated':
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Escalated
        </Badge>
      );
    case 'closed':
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 border">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Closed
        </Badge>
      );
    default:
      return null;
  }
};

const getEvidenceIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <PhotoIcon className="w-5 h-5" />;
    case 'video':
      return <VideoCameraIcon className="w-5 h-5" />;
    case 'document':
      return <DocumentTextIcon className="w-5 h-5" />;
    default:
      return <PaperClipIcon className="w-5 h-5" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const Disputes: React.FC = () => {
  const [disputes, setDisputes] = useState(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [uploadingEvidence, setUploadingEvidence] = useState(false);


  const tabs = [
    { id: 'all', label: 'All', count: disputes.length },
    { id: 'active', label: 'Active', count: disputes.filter(d => d.status === 'active').length },
    { id: 'resolved', label: 'Resolved', count: disputes.filter(d => d.status === 'resolved').length },
    { id: 'escalated', label: 'Escalated', count: disputes.filter(d => d.status === 'escalated').length }
  ];

  const filteredDisputes = disputes.filter(dispute => {
    const matchesFilter = activeTab === 'all' || dispute.status === activeTab;
    const matchesSearch = 
      dispute.buyerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getChatNotice = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return "✅ This dispute has been resolved. You can no longer send messages.";
      case 'escalated':
        return "⚠️ This dispute has been escalated to our support team. Chat is temporarily locked.";
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedDispute) return;

    const message: DisputeMessage = {
      id: Date.now().toString(),
      sender: 'seller',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setDisputes(prev => prev.map(dispute => 
      dispute.id === selectedDispute.id
        ? { ...dispute, messages: [...dispute.messages, message] }
        : dispute
    ));

    setSelectedDispute(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message]
    } : null);

    setNewMessage('');
  };

  const handleUploadEvidence = () => {
    setUploadingEvidence(true);
    // Simulate file upload
    setTimeout(() => {
      if (selectedDispute) {
        const evidence: DisputeEvidence = {
          id: Date.now().toString(),
          type: 'image',
          url: '/evidence/new_evidence.jpg',
          name: 'Additional Evidence',
          uploadedAt: new Date().toISOString()
        };

        setDisputes(prev => prev.map(dispute => 
          dispute.id === selectedDispute.id
            ? { ...dispute, evidence: [...dispute.evidence, evidence] }
            : dispute
        ));

        setSelectedDispute(prev => prev ? {
          ...prev,
          evidence: [...prev.evidence, evidence]
        } : null);
      }
      setUploadingEvidence(false);
    }, 2000);
  };

  const openDisputes = disputes.filter(d => d.status === 'active' || d.status === 'escalated').length;
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved').length;
  const winRate = disputes.length > 0 ? (disputes.filter(d => d.status === 'resolved').length / disputes.length * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">Dispute Center</h1>
              <p className="text-gray-400 text-lg">Track your active and resolved disputes. Our support team has your back.</p>
            </div>
            
            {/* Animated Tabs */}
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:space-x-1 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-1 sm:space-x-2 flex-1 sm:flex-initial justify-center sm:justify-start min-w-0 ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#00FFB2]/10 border border-[#00FFB2]/30 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 truncate">{tab.label}</span>
                    <span className={`relative z-10 px-1.5 sm:px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-[#00FFB2]/20 text-[#00FFB2]'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Open Disputes</p>
                    <p className="text-2xl font-bold text-white">{openDisputes}</p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800/30 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Resolved</p>
                    <p className="text-2xl font-bold text-white">{resolvedDisputes}</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800/30 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Disputes List */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/30 backdrop-blur-sm border border-white/10">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 w-full mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white whitespace-nowrap">All Disputes</h3>
                  <div className="flex flex-wrap items-center gap-2 min-w-0 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search disputes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent w-full sm:w-64"
                      />
                    </div>
                  </div>
                </div>

                {/* Dispute Cards */}
                <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
                  <AnimatePresence>
                    {filteredDisputes.map((dispute, index) => (
                      <motion.div
                        key={dispute.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ delay: index * 0.1, type: "spring", bounce: 0.3 }}
                        onClick={() => setSelectedDispute(dispute)}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedDispute?.id === dispute.id
                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                            : 'bg-gray-800/30 border-white/10 hover:bg-gray-800/50 hover:border-white/20'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="w-full rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 bg-transparent border-inherit">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10 gap-2 sm:gap-0">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm text-white truncate">
                                Order #{dispute.orderId}
                              </h3>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {formatDate(dispute.createdAt)}
                              </p>
                            </div>
                            <div className="flex-shrink-0 self-start sm:self-center">
                              <StatusBadge status={dispute.status} />
                            </div>
                          </div>

                          <div className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-300">
                            <p className="line-clamp-2 leading-relaxed">
                              {dispute.reason || "No summary provided."}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-2 sm:py-3 border-t border-white/10 gap-2 sm:gap-0">
                            <div className="text-xs text-gray-400 order-2 sm:order-1">
                              Updated: {formatDate(dispute.resolvedAt || dispute.createdAt)}
                            </div>
                            <div className="font-medium text-blue-400 hover:text-blue-300 transition cursor-pointer text-sm order-1 sm:order-2 self-end sm:self-auto">
                              View Details →
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredDisputes.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ExclamationTriangleIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">No disputes found</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        {searchTerm || activeTab !== 'all' 
                          ? 'Try adjusting your search or filter criteria.'
                          : 'No disputes have been filed. Keep up the great work!'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </div>

            {/* Dispute Details */}
            <div className="lg:col-span-2 mt-6 lg:mt-0">
              <AnimatePresence>
                {selectedDispute ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", bounce: 0.3 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Dispute Header */}
                    <Card className="bg-gray-800/20 backdrop-blur-sm border border-white/10">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            <div className="relative self-start sm:self-auto">
                              <img
                                src={selectedDispute.buyerAvatar}
                                alt={selectedDispute.buyerUsername}
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/10"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                <ExclamationTriangleIcon className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 line-clamp-2">{selectedDispute.listingTitle}</h3>
                              <p className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base">Dispute with @{selectedDispute.buyerUsername}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                                  <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>Filed {new Date(selectedDispute.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg sm:text-2xl font-bold text-[#00FFB2]">₦{selectedDispute.amount.toLocaleString()}</span>
                                  <Badge className="bg-[#00FFB2]/20 text-[#00FFB2] border-[#00FFB2]/30 border">
                                    <span className="text-xs font-medium">DISPUTED</span>
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end sm:justify-start space-x-3 self-end sm:self-auto">
                            {getStatusBadge(selectedDispute.status)}
                            <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                              <FireIcon className="w-4 h-4 mr-2" />
                              Escalate
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-2 sm:mb-3 flex items-center">
                                <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-yellow-400" />
                                Dispute Reason
                              </h4>
                              <div className="p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-white/10">
                                <p className="text-white font-medium text-sm sm:text-base">{selectedDispute.reason}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-2 sm:mb-3 flex items-center">
                                <DocumentTextIcon className="w-4 h-4 mr-2 text-blue-400" />
                                Description
                              </h4>
                              <div className="p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-white/10">
                                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{selectedDispute.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 sm:space-y-4">
                            <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                  <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold text-sm sm:text-base">Dispute Protection</h4>
                                  <p className="text-blue-300 text-xs sm:text-sm">Your funds are secured</p>
                                </div>
                              </div>
                              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                Our team is reviewing this case. Funds will remain in escrow until resolution.
                              </p>
                            </div>

                            {selectedDispute.adminNotes && (
                              <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl">
                                <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                                  Admin Resolution
                                </h4>
                                <p className="text-green-300 text-xs sm:text-sm leading-relaxed">{selectedDispute.adminNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Evidence */}
                    <Card className="bg-gray-800/20 backdrop-blur-sm border border-white/10">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-white">Evidence & Proof</h3>
                              <p className="text-gray-400 text-xs sm:text-sm">Upload supporting documents</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUploadEvidence}
                            disabled={uploadingEvidence || selectedDispute.status === 'resolved' || selectedDispute.status === 'closed'}
                            className="border-[#00FFB2]/30 text-[#00FFB2] hover:bg-[#00FFB2]/10 self-start sm:self-auto"
                          >
                            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                            {uploadingEvidence ? 'Uploading...' : 'Add Evidence'}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {selectedDispute.evidence.map((evidence, index) => (
                            <motion.div
                              key={evidence.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex-shrink-0 p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                                {getEvidenceIcon(evidence.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-xs sm:text-sm truncate group-hover:text-blue-300 transition-colors">{evidence.name}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                  {new Date(evidence.uploadedAt).toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-2 mt-1 sm:mt-2">
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                                    Verified
                                  </Badge>
                                  <EyeIcon className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {selectedDispute.evidence.length === 0 && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 sm:py-12"
                          >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                              <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                            </div>
                            <h4 className="text-base sm:text-lg font-semibold text-white mb-2">No Evidence Yet</h4>
                            <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">
                              Upload screenshots, videos, or documents to support your case and help resolve this dispute faster.
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </Card>

                    {/* Messages */}
                    <Card className="bg-gray-800/20 backdrop-blur-sm border border-white/10">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">Communication</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">Chat with buyer and support team</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 overflow-y-auto mb-4 sm:mb-6 pr-1 sm:pr-2">
                          {selectedDispute.messages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg ${
                                  message.sender === 'seller'
                                    ? 'bg-gradient-to-r from-[#00FFB2]/20 to-[#00A8E8]/20 text-white border border-[#00FFB2]/30'
                                    : message.sender === 'admin'
                                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-gray-700/50 text-white border border-gray-600/50'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1 sm:mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-semibold capitalize">
                                      {message.sender === 'seller' ? 'You' : message.sender}
                                    </span>
                                    {message.sender === 'admin' && (
                                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-xs">
                                        <ShieldCheckIcon className="w-3 h-3 mr-1" />
                                        Support
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm leading-relaxed">{message.message}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Status Badge */}
                        <div className="mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-400">Status:</span>
                            <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              selectedDispute.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              selectedDispute.status === 'resolved' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              selectedDispute.status === 'escalated' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {selectedDispute.status === 'active' && '🟢'}
                              {selectedDispute.status === 'resolved' && '✅'}
                              {selectedDispute.status === 'escalated' && '⚠️'}
                              {selectedDispute.status === 'closed' && '🔒'}
                              {' '}{selectedDispute.status}
                            </span>
                          </div>
                        </div>

                        {/* Chat Input or Notice */}
                        {['resolved', 'escalated', 'closed'].includes(selectedDispute.status.toLowerCase()) ? (
                          <div className="text-center py-4 sm:py-6">
                            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/50 rounded-full mb-2 sm:mb-3">
                              {selectedDispute.status === 'resolved' && <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />}
                              {selectedDispute.status === 'escalated' && <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />}
                              {selectedDispute.status === 'closed' && <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400 italic max-w-md mx-auto leading-relaxed px-4">
                              {getChatNotice(selectedDispute.status)}
                              {selectedDispute.status === 'escalated' && (
                                <><br /><span className="text-xs text-gray-500 mt-2 block">Support will reply shortly. You'll be notified via email.</span></>
                              )}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-[#00FFB2]/50 transition-all duration-300 text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                            </div>
                            <Button
                              variant="primary"
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim()}
                              className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:scale-105 transition-all duration-300"
                            >
                              <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Support CTA */}
                    <Card className="bg-gradient-to-r from-[#00FFB2]/10 to-[#00A8E8]/10 backdrop-blur-sm border border-[#00FFB2]/20">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="p-2 sm:p-3 bg-[#00FFB2]/20 rounded-xl">
                              <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00FFB2]" />
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Need Help?</h3>
                              <p className="text-gray-300 text-xs sm:text-sm">Our support team is here to help resolve your dispute quickly and fairly.</p>
                            </div>
                          </div>
                          <Button 
                            variant="primary" 
                            className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black text-sm font-medium py-2 px-4 rounded-lg hover:scale-105 transition-all duration-300 self-start sm:self-auto"
                          >
                            <BoltIcon className="w-4 h-4 mr-2" />
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full"
                  >
                    <Card className="h-full flex items-center justify-center bg-gray-800/20 backdrop-blur-sm border border-white/10">
                      <div className="text-center py-12 sm:py-20 px-4">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                          <ExclamationTriangleIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">Select a Dispute</h3>
                        <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
                          Choose a dispute from the list to view details, evidence, and communicate with all parties involved.
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
           </div>
         </div>


       </div>
     </div>
   );
 };

export default Disputes;