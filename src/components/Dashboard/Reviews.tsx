import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  TrophyIcon,
  HeartIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
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
}

const mockReviews: Review[] = [
  {
    id: '1',
    buyerUsername: 'gamer_pro',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'CODM Legendary Account - Mythic Weapons',
    orderId: 'ORD_12345',
    rating: 5,
    comment: 'Amazing account! Everything was exactly as described. The seller was very professional and the transaction was smooth. Highly recommended!',
    createdAt: '2024-01-20T14:30:00Z',
    sellerReply: 'Thank you for the positive feedback! Enjoy the account and feel free to reach out if you need anything.',
    sellerReplyAt: '2024-01-20T16:45:00Z',
    isVerifiedPurchase: true,
    tags: ['fast delivery', 'as described', 'professional']
  },
  {
    id: '2',
    buyerUsername: 'mobile_gamer',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'PUBG Mobile Conqueror Account',
    orderId: 'ORD_12346',
    rating: 4,
    comment: 'Good account with all the promised items. Delivery was quick. Only minor issue was that some skins were different from what I expected, but overall satisfied.',
    createdAt: '2024-01-18T10:15:00Z',
    isVerifiedPurchase: true,
    tags: ['quick delivery', 'good value']
  },
  {
    id: '3',
    buyerUsername: 'ff_player',
    buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Free Fire Grandmaster Account',
    orderId: 'ORD_12347',
    rating: 5,
    comment: 'Perfect transaction! The account had even more items than listed. Seller went above and beyond. Will definitely buy again!',
    createdAt: '2024-01-16T09:20:00Z',
    sellerReply: 'Thank you so much! I always try to exceed expectations. Looking forward to serving you again!',
    sellerReplyAt: '2024-01-16T11:30:00Z',
    isVerifiedPurchase: true,
    tags: ['exceeded expectations', 'trustworthy', 'bonus items']
  },
  {
    id: '4',
    buyerUsername: 'casual_player',
    buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Valorant Immortal Account',
    orderId: 'ORD_12348',
    rating: 3,
    comment: 'Account was okay but took longer than expected to receive. Some of the agent unlocks were missing initially but seller fixed it.',
    createdAt: '2024-01-14T16:45:00Z',
    sellerReply: 'Sorry for the delay and the initial issue. I\'ve made sure to double-check everything now. Thank you for your patience!',
    sellerReplyAt: '2024-01-14T18:20:00Z',
    isVerifiedPurchase: true,
    tags: ['resolved issues', 'patient seller']
  },
  {
    id: '5',
    buyerUsername: 'esports_fan',
    buyerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Apex Legends Predator Account',
    orderId: 'ORD_12349',
    rating: 5,
    comment: 'Incredible account! All the rare skins and heirlooms were there. Seller provided detailed screenshots and was very communicative throughout.',
    createdAt: '2024-01-12T13:10:00Z',
    isVerifiedPurchase: true,
    tags: ['communicative', 'detailed', 'rare items']
  },
  {
    id: '6',
    buyerUsername: 'new_gamer',
    buyerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Fortnite Account with Rare Skins',
    orderId: 'ORD_12350',
    rating: 4,
    comment: 'Great account for the price. Seller was helpful in explaining how to secure the account properly. Would recommend to others.',
    createdAt: '2024-01-10T11:25:00Z',
    sellerReply: 'Thank you! I always make sure buyers know how to keep their accounts secure. Enjoy the rare skins!',
    sellerReplyAt: '2024-01-10T14:15:00Z',
    isVerifiedPurchase: true,
    tags: ['helpful', 'good price', 'security tips']
  }
];

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="relative">
          {star <= rating ? (
            <StarIconSolid className={`${sizeClasses[size]} text-yellow-400`} />
          ) : (
            <StarIcon className={`${sizeClasses[size]} text-gray-600`} />
          )}
        </div>
      ))}
    </div>
  );
};

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || 
      (filter === 'replied' && review.sellerReply) ||
      (filter === 'unreplied' && !review.sellerReply) ||
      (filter === '5' && review.rating === 5) ||
      (filter === '4' && review.rating === 4) ||
      (filter === '3' && review.rating === 3) ||
      (filter === '2' && review.rating === 2) ||
      (filter === '1' && review.rating === 1);
    
    const matchesSearch = 
      review.buyerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return;

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
  };

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
  }));

  // Most common tags
  const allTags = reviews.flatMap(review => review.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  const unrepliedCount = reviews.filter(r => !r.sellerReply).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reviews & Ratings</h1>
        <p className="text-gray-400">Manage customer feedback and build your reputation</p>
      </div>

      {/* Section 1: Ratings Overview - 4-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Average Rating */}
        <Card className="bg-[#1f2937] p-4 rounded-lg border border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <StarIcon className="w-8 h-8 text-[#00FFB2] mr-2" />
            </div>
            <p className="text-sm text-gray-400 mb-1">Average Rating</p>
            <p className="text-4xl font-bold text-white mb-2">{averageRating.toFixed(1)}</p>
            <div className="flex justify-center">
              <StarRating rating={Math.round(averageRating)} size="sm" />
            </div>
          </div>
        </Card>

        {/* Total Reviews */}
        <Card className="bg-[#1f2937] p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Reviews</p>
              <p className="text-lg font-bold text-white">{totalReviews}</p>
            </div>
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
          </div>
        </Card>

        {/* Pending Replies */}
        <Card className="bg-[#facc15]/10 p-4 rounded-lg border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending Replies</p>
              <p className="text-lg font-bold text-yellow-400">{unrepliedCount}</p>
            </div>
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
          </div>
        </Card>

        {/* 5-Star Rate */}
        <Card className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">5-Star Rate</p>
              <p className="text-lg font-bold text-green-400">
                {totalReviews > 0 ? ((reviews.filter(r => r.rating === 5).length / totalReviews) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <TrophyIcon className="w-6 h-6 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Section 2: Rating Breakdown + Keywords - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rating Breakdown */}
        <Card className="bg-[#1f2937] p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Rating Breakdown</h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm text-white">{rating}</span>
                  <StarIconSolid className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Common Keywords */}
        <Card className="bg-[#1f2937] p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Common Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(({ tag, count }, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700 text-sm text-white px-3 py-1 rounded-md inline-flex items-center space-x-2"
              >
                <span className="capitalize">{tag}</span>
                <span className="bg-gray-600 text-xs px-1.5 py-0.5 rounded">{count}</span>
              </motion.span>
            ))}
          </div>
          
          {topTags.length === 0 && (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <HeartIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm">No keywords yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Section 3: Quick Stats Panel */}
      <Card className="bg-[#111827] p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Response & Activity Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex justify-between">
            <p className="text-gray-400 text-sm">Response Rate</p>
            <p className="text-green-400 font-semibold text-sm">
              {totalReviews > 0 ? ((reviews.filter(r => r.sellerReply).length / totalReviews) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-400 text-sm">This Month</p>
            <p className="text-white font-semibold text-sm">
              {reviews.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-400 text-sm">Verified Purchases</p>
            <p className="text-white font-semibold text-sm">
              {reviews.filter(r => r.isVerifiedPurchase).length}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-400 text-sm">Avg Response Time</p>
            <p className="text-white font-semibold text-sm">2.4 hours</p>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-white">Customer Reviews</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
            >
              <option value="all">All Reviews</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
              <option value="replied">Replied</option>
              <option value="unreplied">Unreplied</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={review.buyerAvatar}
                    alt={review.buyerUsername}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-semibold">{review.buyerUsername}</h4>
                      {review.isVerifiedPurchase && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{review.listingTitle}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                
                {review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.tags.map((tag) => (
                      <Badge key={tag} className="bg-gray-700 text-gray-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Seller Reply */}
              {review.sellerReply ? (
                <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-[#00FFB2]">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-[#00FFB2]">Your Reply</span>
                    <span className="text-xs text-gray-500">
                      {new Date(review.sellerReplyAt!).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{review.sellerReply}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {replyingTo === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent resize-none"
                      />
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText.trim()}
                          className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black"
                        >
                          Send Reply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyingTo(review.id)}
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      Reply to Review
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No reviews found</h3>
            <p className="text-gray-400">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Customer reviews will appear here after your first sale.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reviews;