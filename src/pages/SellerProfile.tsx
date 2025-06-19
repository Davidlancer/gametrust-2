import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Shield, 
  Calendar, 
  MapPin, 
  MessageCircle,
  ExternalLink,
  Flag,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  Filter,
  Grid,
  List,
  Heart,
  UserPlus,
  Award,
  AlertTriangle,
  Eye,
  ThumbsUp,
  Zap
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { featuredListings, mockSeller } from '../data/mockData';

interface SellerProfileProps {
  sellerId?: string;
  onNavigate: (page: string, listingId?: string) => void;
}

const SellerProfile: React.FC<SellerProfileProps> = ({ sellerId = '1', onNavigate }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gameFilter, setGameFilter] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, fetch from API
  const seller = mockSeller;
  const sellerListings = featuredListings.filter(listing => listing.seller.id === sellerId);
  
  const sellerStats = {
    totalSales: 134,
    averageRating: 4.8,
    totalReviews: 92,
    disputeRate: 1.4,
    avgDeliveryTime: '2 hours',
    activeListings: sellerListings.length,
    lastSeen: '2 hours ago',
    joinedDate: 'January 2023',
    responseRate: 98,
    completionRate: 99.2
  };

  const reviews = [
    {
      id: '1',
      buyer: 'GamerX_2024',
      rating: 5,
      comment: 'Amazing seller! Account was exactly as described. Fast delivery and great communication throughout.',
      accountPurchased: 'Legendary CODM Account',
      timeAgo: '3 days ago',
      verified: true
    },
    {
      id: '2',
      buyer: 'PUBGPro_99',
      rating: 5,
      comment: 'Very professional. Account works perfectly and all features were as promised. Highly recommend!',
      accountPurchased: 'Conqueror PUBG Account',
      timeAgo: '1 week ago',
      verified: true
    },
    {
      id: '3',
      buyer: 'FireFighter_X',
      rating: 4,
      comment: 'Good account, minor delay in delivery but seller communicated well. Overall satisfied.',
      accountPurchased: 'Grandmaster Free Fire',
      timeAgo: '2 weeks ago',
      verified: true
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredListings = gameFilter 
    ? sellerListings.filter(listing => listing.game === gameFilter)
    : sellerListings;

  const getDisputeRateColor = (rate: number) => {
    if (rate <= 2) return 'text-green-400';
    if (rate <= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => onNavigate('marketplace')}
          className="flex items-center text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Marketplace
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Seller Header Card */}
        <Card className="mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={seller.avatar}
                  alt={seller.username}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-700 shadow-xl"
                />
                {seller.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-gray-800">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-white">{seller.username}</h1>
                      {seller.isVerified && (
                        <Badge type="verified" text="Verified Seller" />
                      )}
                    </div>
                    <p className="text-gray-400 mb-2">
                      "Your trusted gaming account specialist. Quality accounts, fast delivery, 100% satisfaction guaranteed."
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {sellerStats.joinedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Nigeria</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Last seen {sellerStats.lastSeen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <Button
                      variant={isFollowing ? "secondary" : "primary"}
                      onClick={() => setIsFollowing(!isFollowing)}
                      className="flex items-center"
                    >
                      {isFollowing ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Follow Seller
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="md">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="ghost" size="md">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-400">Discord: GamerPlug#2024</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Trust & Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{sellerStats.averageRating}</div>
            <div className="text-xs text-gray-400">Rating ({sellerStats.totalReviews})</div>
          </Card>

          <Card className="text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center mb-2">
              <Package className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{sellerStats.totalSales}</div>
            <div className="text-xs text-gray-400">Total Sales</div>
          </Card>

          <Card className="text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className={`h-6 w-6 ${getDisputeRateColor(sellerStats.disputeRate)}`} />
            </div>
            <div className={`text-2xl font-bold mb-1 ${getDisputeRateColor(sellerStats.disputeRate)}`}>
              {sellerStats.disputeRate}%
            </div>
            <div className="text-xs text-gray-400">Dispute Rate</div>
          </Card>

          <Card className="text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{sellerStats.avgDeliveryTime}</div>
            <div className="text-xs text-gray-400">Avg Delivery</div>
          </Card>

          <Card className="text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{sellerStats.activeListings}</div>
            <div className="text-xs text-gray-400">Active Listings</div>
          </Card>

          <Card className="text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center mb-2">
              <ThumbsUp className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{sellerStats.responseRate}%</div>
            <div className="text-xs text-gray-400">Response Rate</div>
          </Card>
        </div>

        {/* Promo Banner */}
        <Card className="mb-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-400">🔥 Limited Time Offer</h3>
                <p className="text-orange-300/80">10% off all PUBG accounts until June 30th - Use code PUBG10</p>
              </div>
            </div>
            <Button variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
              View Deals
            </Button>
          </div>
        </Card>

        {/* Listings Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Active Listings</h2>
              <p className="text-gray-400">{filteredListings.length} accounts available</p>
            </div>

            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* Game Filter */}
              <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Games</option>
                <option value="Call of Duty Mobile">CODM</option>
                <option value="PUBG Mobile">PUBG</option>
                <option value="Free Fire">Free Fire</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredListings.map((listing) => (
              <Card key={listing.id} hover className="group">
                <div className={viewMode === 'list' ? 'flex space-x-6' : ''}>
                  {/* Image */}
                  <div className={`relative overflow-hidden rounded-lg ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-48 mb-4'}`}>
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {listing.isVerified && <Badge type="verified" size="sm" />}
                      {listing.hasEscrow && <Badge type="escrow" size="sm" />}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span className="text-white font-semibold text-sm">${listing.price}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-indigo-400 transition-colors">
                      {listing.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{listing.game}</span>
                      <span>•</span>
                      <span>Level {listing.level}</span>
                      <span>•</span>
                      <span>{listing.platform}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {listing.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-400">24 views</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onNavigate('listing-details', listing.id)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Customer Reviews</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-white font-medium">{sellerStats.averageRating}</span>
                  <span className="text-gray-400">({sellerStats.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowReviews(!showReviews)}
            >
              {showReviews ? 'Hide Reviews' : 'Show All Reviews'}
            </Button>
          </div>

          {showReviews && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {review.buyer.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-white">{review.buyer}</span>
                        {review.verified && (
                          <Badge type="verified" size="sm" text="Verified Purchase" />
                        )}
                        <span className="text-sm text-gray-400">{review.timeAgo}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">• {review.accountPurchased}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 p-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">{sellerStats.activeListings} Active Listings</p>
            <p className="text-sm text-gray-400">⭐ {sellerStats.averageRating} Rating</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 px-8">
            View Listings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;