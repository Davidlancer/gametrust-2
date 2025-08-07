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
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Open
        </Badge>
      );
    case 'under_review':
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">
          <ClockIcon className="w-3 h-3 mr-1" />
          Under Review
        </Badge>
      );
    case 'resolved_seller':
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Seller Won
        </Badge>
      );
    case 'resolved_buyer':
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Buyer Refunded
        </Badge>
      );
    case 'closed':
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 border">
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
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">Dispute Center</h1>
              <p className="text-gray-400 text-lg">Track your active and resolved disputes. Our support team has your back.</p>
            </div>
            
            {/* Animated Tabs */}
            <div className="mt-8">
              <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 ${
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
                    <span className="relative z-10">{tab.label}</span>
                    <span className={`relative z-10 px-2 py-0.5 text-xs rounded-full ${
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Disputes List */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/30 backdrop-blur-sm border border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-4">
                  <h3 className="text-xl font-semibold text-white whitespace-nowrap">All Disputes</h3>
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search disputes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent w-full md:w-64"
                      />
                    </div>
                  </div>
                </div>

                {/* Dispute Cards */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {filteredDisputes.map((dispute, index) => (
                      <motion.div
                        key={dispute.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ delay: index * 0.1, type: "spring", bounce: 0.3 }}
                        onClick={() => setSelectedDispute(dispute)}
                        className={`group p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedDispute?.id === dispute.id
                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                            : 'bg-gray-800/30 border-white/10 hover:bg-gray-800/50 hover:border-white/20'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={dispute.buyerAvatar}
                                alt={dispute.buyerUsername}
                                className="w-12 h-12 rounded-full border-2 border-white/10"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{dispute.buyerUsername}</p>
                              <p className="text-gray-400 text-sm">{dispute.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(dispute.status)}
                            <EyeIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-white font-medium mb-2 group-hover:text-blue-300 transition-colors">
                            {dispute.listingTitle}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                            {dispute.reason}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center space-x-4">
                            <span className="text-blue-400 font-semibold text-lg">
                              ₦{dispute.amount.toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {new Date(dispute.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <span className="text-gray-400 text-sm">Active</span>
                          </div>
                        </div>
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
            <div className="lg:col-span-2">
              <AnimatePresence>
                {selectedDispute ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", bounce: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Dispute Header */}
                    <Card className="bg-gray-800/20 backdrop-blur-sm border border-white/10">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={selectedDispute.buyerAvatar}
                                alt={selectedDispute.buyerUsername}
                                className="w-16 h-16 rounded-full border-2 border-white/10"
                              />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                <ExclamationTriangleIcon className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-1">{selectedDispute.listingTitle}</h3>
                              <p className="text-gray-400 mb-3">Dispute with @{selectedDispute.buyerUsername}</p>
                              <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>Filed {new Date(selectedDispute.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-2xl font-bold text-[#00FFB2]">₦{selectedDispute.amount.toLocaleString()}</span>
                                  <Badge className="bg-[#00FFB2]/20 text-[#00FFB2] border-[#00FFB2]/30 border">
                                    <span className="text-xs font-medium">DISPUTED</span>
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(selectedDispute.status)}
                            <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                              <FireIcon className="w-4 h-4 mr-2" />
                              Escalate
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                                <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-yellow-400" />
                                Dispute Reason
                              </h4>
                              <div className="p-4 bg-gray-800/50 rounded-xl border border-white/10">
                                <p className="text-white font-medium">{selectedDispute.reason}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                                <DocumentTextIcon className="w-4 h-4 mr-2 text-blue-400" />
                                Description
                              </h4>
                              <div className="p-4 bg-gray-800/50 rounded-xl border border-white/10">
                                <p className="text-gray-300 leading-relaxed">{selectedDispute.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                  <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">Dispute Protection</h4>
                                  <p className="text-blue-300 text-sm">Your funds are secured</p>
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                Our team is reviewing this case. Funds will remain in escrow until resolution.
                              </p>
                            </div>

                            {selectedDispute.adminNotes && (
                              <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl">
                                <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                                  Admin Resolution
                                </h4>
                                <p className="text-green-300 text-sm leading-relaxed">{selectedDispute.adminNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Evidence */}
                    <Card className="bg-gray-800/20 backdrop-blur-sm border border-white/10">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <DocumentTextIcon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">Evidence & Proof</h3>
                              <p className="text-gray-400 text-sm">Upload supporting documents</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUploadEvidence}
                            disabled={uploadingEvidence || selectedDispute.status === 'resolved' || selectedDispute.status === 'closed'}
                            className="border-[#00FFB2]/30 text-[#00FFB2] hover:bg-[#00FFB2]/10"
                          >
                            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                            {uploadingEvidence ? 'Uploading...' : 'Add Evidence'}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedDispute.evidence.map((evidence, index) => (
                            <motion.div
                              key={evidence.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                                {getEvidenceIcon(evidence.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate group-hover:text-blue-300 transition-colors">{evidence.name}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                  {new Date(evidence.uploadedAt).toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
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
                            className="text-center py-12"
                          >
                            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                              <DocumentTextIcon className="w-10 h-10 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">No Evidence Yet</h4>
                            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                              Upload screenshots, videos, or documents to support your case and help resolve this dispute faster.
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </Card>

                    {/* Messages */}
                    <Card className="bg-gray-800/20 backdrop-blur-sm border border-white/10">
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Communication</h3>
                            <p className="text-gray-400 text-sm">Chat with buyer and support team</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2">
                          {selectedDispute.messages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                                  message.sender === 'seller'
                                    ? 'bg-gradient-to-r from-[#00FFB2]/20 to-[#00A8E8]/20 text-white border border-[#00FFB2]/30'
                                    : message.sender === 'admin'
                                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-gray-700/50 text-white border border-gray-600/50'
                                }`}
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-xs font-semibold capitalize">
                                    {message.sender === 'seller' ? 'You' : message.sender}
                                  </span>
                                  {message.sender === 'admin' && (
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-xs">
                                      <ShieldCheckIcon className="w-3 h-3 mr-1" />
                                      Support
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed">{message.message}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {(selectedDispute.status === 'active' || selectedDispute.status === 'escalated') && (
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-[#00FFB2]/50 transition-all duration-300"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                            </div>
                            <Button
                              variant="primary"
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim()}
                              className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                            >
                              <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Support CTA */}
                    <Card className="bg-gradient-to-r from-[#00FFB2]/10 to-[#00A8E8]/10 backdrop-blur-sm border border-[#00FFB2]/20">
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#00FFB2]/20 rounded-xl">
                              <HeartIcon className="w-6 h-6 text-[#00FFB2]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1">Need Help?</h3>
                              <p className="text-gray-300 text-sm">Our support team is here to help resolve your dispute quickly and fairly.</p>
                            </div>
                          </div>
                          <Button 
                            variant="primary" 
                            className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                          >
                            <BoltIcon className="w-5 h-5 mr-2" />
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
                      <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Select a Dispute</h3>
                        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
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

         {/* Sticky Support CTA */}
         <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1 }}
           className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
         >
           <Card className="bg-gradient-to-r from-[#00FFB2]/90 to-[#00A8E8]/90 backdrop-blur-sm border border-[#00FFB2]/30 shadow-2xl shadow-[#00FFB2]/20">
             <div className="px-6 py-4">
               <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-white/20 rounded-lg">
                     <HeartIcon className="w-5 h-5 text-white" />
                   </div>
                   <div>
                     <p className="text-white font-semibold text-sm">Need urgent help?</p>
                     <p className="text-white/80 text-xs">Our support team is standing by</p>
                   </div>
                 </div>
                 <Button 
                   variant="secondary" 
                   size="sm"
                   className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                 >
                   <BoltIcon className="w-4 h-4 mr-2" />
                   Contact Support
                 </Button>
               </div>
             </div>
           </Card>
         </motion.div>
       </div>
     </div>
   );
 };

export default Disputes;