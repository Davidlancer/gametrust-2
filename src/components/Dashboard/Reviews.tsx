import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  FireIcon,
  BoltIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckBadgeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, ShieldCheckIcon as ShieldCheckIconSolid } from '@heroicons/react/24/solid';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface Review {
  id: string;
  buyerUsername: string;
  buyerAvatar: string;
  listingTitle: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  sellerReply?: string;
  sellerReplyAt?: string;
  isVerifiedPurchase: boolean;
  tags: string[];
  buyerTier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  isTopBuyer?: boolean;
  purchaseValue?: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    buyerUsername: 'gamer_pro',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'CODM Legendary Account - Mythic Weapons',
    orderId: 'ORD_12345',
    rating: 5,
    comment: 'Amazing account! Everything was exactly as described. The seller was very professional and the transaction was smooth. Highly recommended! The mythic weapons collection is incredible and the account stats are perfect.',
    createdAt: '2024-01-20T14:30:00Z',
    sellerReply: 'Thank you for the positive feedback! Enjoy the account and feel free to reach out if you need anything.',
    sellerReplyAt: '2024-01-20T16:45:00Z',
    isVerifiedPurchase: true,
    tags: ['fast delivery', 'as described', 'professional'],
    buyerTier: 'diamond',
    isTopBuyer: true,
    purchaseValue: 299
  },
  {
    id: '2',
    buyerUsername: 'mobile_gamer',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'PUBG Mobile Conqueror Account',
    orderId: 'ORD_12346',
    rating: 4,
    comment: 'Good account with all the promised items. Delivery was quick. Only minor issue was that some skins were different from what I expected, but overall satisfied with the purchase.',
    createdAt: '2024-01-18T10:15:00Z',
    isVerifiedPurchase: true,
    tags: ['quick delivery', 'good value'],
    buyerTier: 'gold',
    purchaseValue: 149
  },
  {
    id: '3',
    buyerUsername: 'ff_player',
    buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Free Fire Grandmaster Account',
    orderId: 'ORD_12347',
    rating: 5,
    comment: 'Perfect transaction! The account had even more items than listed. Seller went above and beyond. Will definitely buy again! This is exactly what I was looking for.',
    createdAt: '2024-01-16T09:20:00Z',
    sellerReply: 'Thank you so much! I always try to exceed expectations. Looking forward to serving you again!',
    sellerReplyAt: '2024-01-16T11:30:00Z',
    isVerifiedPurchase: true,
    tags: ['exceeded expectations', 'trustworthy', 'bonus items'],
    buyerTier: 'platinum',
    isTopBuyer: true,
    purchaseValue: 199
  },
  {
    id: '4',
    buyerUsername: 'casual_player',
    buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Valorant Immortal Account',
    orderId: 'ORD_12348',
    rating: 3,
    comment: 'Account was okay but took longer than expected to receive. Some of the agent unlocks were missing initially but seller fixed it promptly.',
    createdAt: '2024-01-14T16:45:00Z',
    sellerReply: 'Sorry for the delay and the initial issue. I\'ve made sure to double-check everything now. Thank you for your patience!',
    sellerReplyAt: '2024-01-14T18:20:00Z',
    isVerifiedPurchase: true,
    tags: ['resolved issues', 'patient seller'],
    buyerTier: 'silver',
    purchaseValue: 89
  },
  {
    id: '5',
    buyerUsername: 'esports_fan',
    buyerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Apex Legends Predator Account',
    orderId: 'ORD_12349',
    rating: 5,
    comment: 'Incredible account! All the rare skins and heirlooms were there. Seller provided detailed screenshots and was very communicative throughout the entire process.',
    createdAt: '2024-01-12T13:10:00Z',
    isVerifiedPurchase: true,
    tags: ['communicative', 'detailed', 'rare items'],
    buyerTier: 'platinum',
    purchaseValue: 349
  },
  {
    id: '6',
    buyerUsername: 'new_gamer',
    buyerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Fortnite Account with Rare Skins',
    orderId: 'ORD_12350',
    rating: 4,
    comment: 'Great account for the price. Seller was helpful in explaining how to secure the account properly. Would recommend to others looking for quality accounts.',
    createdAt: '2024-01-10T11:25:00Z',
    sellerReply: 'Thank you! I always make sure buyers know how to keep their accounts secure. Enjoy the rare skins!',
    sellerReplyAt: '2024-01-10T14:15:00Z',
    isVerifiedPurchase: true,
    tags: ['helpful', 'good price', 'security tips'],
    buyerTier: 'bronze',
    purchaseValue: 79
  }
];

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg'; showNumber?: boolean }> = ({ 
  rating, 
  size = 'md', 
  showNumber = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div 
          key={star} 
          className="relative"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {star <= rating ? (
            <StarIconSolid className={`${sizeClasses[size]} text-yellow-400 drop-shadow-sm`} />
          ) : (
            <StarIcon className={`${sizeClasses[size]} text-gray-600`} />
          )}
        </motion.div>
      ))}
      {showNumber && (
        <span className="ml-2 text-sm font-semibold text-white">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

const TierBadge: React.FC<{ tier: string; isTopBuyer?: boolean }> = ({ tier, isTopBuyer }) => {
  const tierConfig = {
    bronze: { color: 'from-amber-600 to-amber-800', icon: ShieldCheckIcon, text: 'Bronze' },
    silver: { color: 'from-gray-400 to-gray-600', icon: ShieldCheckIcon, text: 'Silver' },
    gold: { color: 'from-yellow-400 to-yellow-600', icon: TrophyIcon, text: 'Gold' },
    platinum: { color: 'from-blue-400 to-blue-600', icon: SparklesIcon, text: 'Platinum' },
    diamond: { color: 'from-purple-400 to-purple-600', icon: StarIcon, text: 'Diamond' }
  };

  const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.bronze;
  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-1">
      <div className={`bg-gradient-to-r ${config.color} p-1 rounded-full`}>
        <Icon className="w-3 h-3 text-white" />
      </div>
      <span className="text-xs font-medium text-gray-300">{config.text}</span>
      {isTopBuyer && (
        <div className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] p-1 rounded-full ml-1">
          <FireIcon className="w-3 h-3 text-black" />
        </div>
      )}
    </div>
  );
};

const FilterTab: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
  count?: number;
}> = ({ active, onClick, children, count }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black shadow-lg shadow-[#00FFB2]/25' 
          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {count !== undefined && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            active ? 'bg-black/20 text-black' : 'bg-gray-700 text-gray-300'
          }`}>
            {count}
          </span>
        )}
      </div>
      {active && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] rounded-lg opacity-20"
          layoutId="activeTab"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const reviewsPerPage = 5;

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || 
      (filter === 'positive' && review.rating >= 4) ||
      (filter === 'neutral' && review.rating === 3) ||
      (filter === 'negative' && review.rating <= 2) ||
      (filter === 'replied' && review.sellerReply) ||
      (filter === 'unreplied' && !review.sellerReply);
    
    const matchesSearch = 
      review.buyerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setReviews(prev => prev.map(review => 
        review.id === reviewId
          ? {
              ...review,
              sellerReply: replyText,
              sellerReplyAt: new Date().toISOString()
            }
          : review
      ));
      setReplyingTo(null);
      setReplyText('');
      setIsLoading(false);
    }, 1000);
  };

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const getTimeAgo = (dateString: string) => {
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

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
  }));

  const filterCounts = {
    all: reviews.length,
    positive: reviews.filter(r => r.rating >= 4).length,
    neutral: reviews.filter(r => r.rating === 3).length,
    negative: reviews.filter(r => r.rating <= 2).length,
    replied: reviews.filter(r => r.sellerReply).length,
    unreplied: reviews.filter(r => !r.sellerReply).length
  };

  const unrepliedCount = reviews.filter(r => !r.sellerReply).length;
  const responseRate = totalReviews > 0 ? ((reviews.filter(r => r.sellerReply).length / totalReviews) * 100) : 0;
  const fiveStarRate = totalReviews > 0 ? ((reviews.filter(r => r.rating === 5).length / totalReviews) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFB2]/5 to-[#00A8E8]/5 rounded-2xl" />
        <Card className="relative bg-gray-900/80 backdrop-blur-sm border-gray-700/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] rounded-xl">
                  <TrophyIcon className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Reviews & Reputation
                  </h1>
                  <p className="text-gray-400 text-lg">Your arena of trust and excellence</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00FFB2]">{averageRating.toFixed(1)}</div>
                <StarRating rating={Math.round(averageRating)} size="sm" />
                <div className="text-sm text-gray-400 mt-1">Average Rating</div>
              </div>
              <div className="w-px h-16 bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalReviews}</div>
                <div className="text-sm text-gray-400 mt-1">Total Reviews</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Elite Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
          <Card className="relative bg-gray-900/90 backdrop-blur-sm border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{fiveStarRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">5-Star Rate</div>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${fiveStarRate}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
          <Card className="relative bg-gray-900/90 backdrop-blur-sm border-blue-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">{responseRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Response Rate</div>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${responseRate}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
          <Card className="relative bg-gray-900/90 backdrop-blur-sm border-yellow-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">{unrepliedCount}</div>
                <div className="text-sm text-gray-400">Pending Replies</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <BoltIcon className="w-4 h-4" />
              <span>Avg Response: 2.4h</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
          <Card className="relative bg-gray-900/90 backdrop-blur-sm border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <ShieldCheckIconSolid className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{reviews.filter(r => r.isVerifiedPurchase).length}</div>
                <div className="text-sm text-gray-400">Verified Reviews</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <CheckBadgeIcon className="w-4 h-4" />
              <span>100% Authentic</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Rating Breakdown & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
              Rating Distribution
            </h3>
            <div className="space-y-4">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <motion.div
                  key={rating}
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rating * 0.1 }}
                >
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-white font-medium">{rating}</span>
                    <StarIconSolid className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-full h-3 relative overflow-hidden">
                    <motion.div
                      className={`h-3 rounded-full ${
                        rating === 5 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        rating === 4 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                        rating === 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        rating === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(percentage, 2)}%` }}
                      transition={{ duration: 1, delay: rating * 0.1 }}
                    />
                  </div>
                  <div className="flex items-center space-x-3 w-20">
                    <span className="text-sm text-gray-400">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <SparklesIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
              Trust Metrics
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Elite Buyers</span>
                <span className="text-[#00FFB2] font-semibold">
                  {reviews.filter(r => r.isTopBuyer).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg Purchase Value</span>
                <span className="text-white font-semibold">
                  ${Math.round(reviews.reduce((sum, r) => sum + (r.purchaseValue || 0), 0) / reviews.length)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-semibold">
                  {reviews.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] bg-clip-text text-transparent">
                    GLADIATOR
                  </div>
                  <div className="text-sm text-gray-400">Seller Tier</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <FilterTab 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
              count={filterCounts.all}
            >
              All Reviews
            </FilterTab>
            <FilterTab 
              active={filter === 'positive'} 
              onClick={() => setFilter('positive')}
              count={filterCounts.positive}
            >
              Positive
            </FilterTab>
            <FilterTab 
              active={filter === 'neutral'} 
              onClick={() => setFilter('neutral')}
              count={filterCounts.neutral}
            >
              Neutral
            </FilterTab>
            <FilterTab 
              active={filter === 'negative'} 
              onClick={() => setFilter('negative')}
              count={filterCounts.negative}
            >
              Negative
            </FilterTab>
            <FilterTab 
              active={filter === 'unreplied'} 
              onClick={() => setFilter('unreplied')}
              count={filterCounts.unreplied}
            >
              Unreplied
            </FilterTab>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent transition-all duration-200 w-full lg:w-80"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {paginatedReviews.map((review, index) => {
              const isExpanded = expandedReviews.has(review.id);
              const shouldTruncate = review.comment.length > 150;
              
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-700/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  <Card className="relative bg-gray-800/40 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 p-6">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={review.buyerAvatar}
                            alt={review.buyerUsername}
                            className="w-14 h-14 rounded-full border-2 border-gray-600 group-hover:border-[#00FFB2]/50 transition-colors duration-300"
                          />
                          {review.isTopBuyer && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] rounded-full flex items-center justify-center">
                              <FireIcon className="w-3 h-3 text-black" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-white font-bold text-lg">{review.buyerUsername}</h4>
                            {review.isVerifiedPurchase && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs px-2 py-1">
                                <ShieldCheckIconSolid className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {review.buyerTier && (
                              <TierBadge tier={review.buyerTier} isTopBuyer={review.isTopBuyer} />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm font-medium mb-2">{review.listingTitle}</p>
                          <div className="flex items-center space-x-4">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-xs text-gray-500 flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {getTimeAgo(review.createdAt)}
                            </span>
                            {review.purchaseValue && (
                              <span className="text-xs text-[#00FFB2] font-semibold">
                                ${review.purchaseValue}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-6">
                      <motion.p 
                        className="text-gray-300 leading-relaxed text-base"
                        initial={false}
                        animate={{ height: 'auto' }}
                      >
                        {shouldTruncate && !isExpanded 
                          ? `${review.comment.substring(0, 150)}...` 
                          : review.comment
                        }
                      </motion.p>
                      
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpanded(review.id)}
                          className="mt-2 text-[#00FFB2] hover:text-[#00A8E8] text-sm font-medium flex items-center transition-colors duration-200"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUpIcon className="w-4 h-4 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon className="w-4 h-4 mr-1" />
                              Read More
                            </>
                          )}
                        </button>
                      )}
                      
                      {review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {review.tags.map((tag, tagIndex) => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: tagIndex * 0.1 }}
                              className="bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-600/50 hover:border-[#00FFB2]/30 transition-colors duration-200"
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Seller Reply */}
                    {review.sellerReply ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-[#00FFB2]/10 to-[#00A8E8]/10 rounded-xl p-4 border-l-4 border-[#00FFB2]"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] rounded-full flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 text-black" />
                          </div>
                          <span className="text-sm font-bold text-[#00FFB2]">Your Reply</span>
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(review.sellerReplyAt!)}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.sellerReply}</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {replyingTo === review.id ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Craft your professional response..."
                              rows={4}
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent resize-none transition-all duration-200"
                            />
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleReply(review.id)}
                                disabled={!replyText.trim() || isLoading}
                                className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-semibold hover:shadow-lg hover:shadow-[#00FFB2]/25 transition-all duration-200"
                              >
                                {isLoading ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                                  />
                                ) : (
                                  <BoltIcon className="w-4 h-4 mr-2" />
                                )}
                                Send Reply
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                                className="border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
                              >
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReplyingTo(review.id)}
                            className="border-[#00FFB2]/30 text-[#00FFB2] hover:bg-[#00FFB2]/10 hover:border-[#00FFB2] transition-all duration-200"
                          >
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                            Reply to Review
                          </Button>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-gray-600 text-gray-300 hover:border-[#00FFB2] hover:text-[#00FFB2]"
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page 
                  ? "bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black" 
                  : "border-gray-600 text-gray-300 hover:border-[#00FFB2] hover:text-[#00FFB2]"
                }
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-gray-600 text-gray-300 hover:border-[#00FFB2] hover:text-[#00FFB2]"
            >
              Next
            </Button>
          </div>
        )}

        {filteredReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <StarIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No Reviews Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria to find more reviews.' 
                : 'Your reputation arena awaits. Customer reviews will appear here after your first victorious sale.'}
            </p>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default Reviews;