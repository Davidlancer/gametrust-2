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
import ChatPopup from '../components/UI/ChatPopup';
import ErrorBoundary from '../components/UI/ErrorBoundary';
import { featuredListings, mockSeller, mockTransactions, mockCurrentUser, mockReviews, mockReportedSellers } from '../data/mockData';
import StarRating from '../components/UI/StarRating';
import Modal from '../components/UI/Modal';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportComment, setReportComment] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [hasReportedSeller, setHasReportedSeller] = useState(false);

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

  // Check if current user can leave a review
  const canLeaveReview = () => {
    if (!mockCurrentUser.isAuthenticated) return false;
    
    // Check if user has completed transactions with this seller
    const userTransactions = mockTransactions.filter(
      txn => txn.buyerId === mockCurrentUser.id && 
             txn.sellerId === sellerId && 
             txn.status === 'completed' && 
             txn.escrowReleased && 
             !txn.hasReviewed
    );
    
    return userTransactions.length > 0;
  };

  // Get reviews for this seller
  const reviews = mockReviews.filter(review => review.sellerId === sellerId);
  
  // Calculate time ago helper
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return '1 week ago';
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reviewRating === 0) {
      alert('Please select a rating');
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, make POST request to /api/review
      console.log('Review submitted:', {
        buyerId: mockCurrentUser.id,
        sellerId,
        rating: reviewRating,
        comment: reviewComment
      });
      
      // Reset form
      setReviewRating(0);
      setReviewComment('');
      setShowReviewForm(false);
      
      alert('Review submitted successfully!');
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Check if user has already reported this seller
  const checkIfReported = () => {
    if (!mockCurrentUser.isAuthenticated) return false;
    
    const existingReport = mockReportedSellers.find(
      report => report.reporterId === mockCurrentUser.id && report.sellerId === sellerId
    );
    
    return !!existingReport;
  };

  // Handle report submission
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }
    
    setIsSubmittingReport(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, make POST request to /api/report-seller
      const reportData = {
        reporterId: mockCurrentUser.id,
        sellerId,
        reason: reportReason,
        comment: reportComment,
        timestamp: new Date()
      };
      
      console.log('Report submitted:', reportData);
      
      // Reset form and close modal
      setReportReason('');
      setReportComment('');
      setShowReportModal(false);
      setHasReportedSeller(true);
      
      alert('Report submitted successfully. Our moderators will review it.');
    } catch (error) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    // Check if user has already reported this seller
    setHasReportedSeller(checkIfReported());
    
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
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <Button
                      variant={isFollowing ? "secondary" : "primary"}
                      size="md"
                      onClick={() => setIsFollowing(!isFollowing)}
                      className="flex items-center justify-center min-w-[140px] h-10"
                    >
                      {isFollowing ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Follow Seller</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="md"
                      onClick={() => setIsChatOpen(true)}
                      className="flex items-center justify-center min-w-[120px] h-10"
                    >
                      <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">Message</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="md"
                      onClick={() => {
                        if (!mockCurrentUser.isAuthenticated) {
                          alert('Please log in to report a seller');
                          return;
                        }
                        if (hasReportedSeller) {
                          alert('You have already reported this seller');
                          return;
                        }
                        setShowReportModal(true);
                      }}
                      className={`flex items-center justify-center w-10 h-10 ${hasReportedSeller ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={hasReportedSeller}
                      title="Report Seller"
                    >
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
                  <StarRating rating={sellerStats.averageRating} readonly size="sm" />
                  <span className="text-white font-medium">{sellerStats.averageRating}</span>
                  <span className="text-gray-400">({reviews.length} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {canLeaveReview() && (
                <Button 
                  variant="primary"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancel Review' : 'Leave a Review'}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => setShowReviews(!showReviews)}
              >
                {showReviews ? 'Hide Reviews' : 'Show All Reviews'}
              </Button>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && canLeaveReview() && (
            <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">Leave a Review</h4>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-white">Rate this seller:</label>
                  <StarRating 
                    rating={reviewRating} 
                    onChange={setReviewRating}
                    size="lg"
                  />
                </div>
                
                <div className="mb-4">
                  <textarea 
                    placeholder="Leave a short review (optional)"
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    maxLength={500}
                  />
                  <div className="text-right text-sm text-gray-400 mt-1">
                    {reviewComment.length}/500
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    type="submit" 
                    disabled={reviewRating === 0 || isSubmittingReview}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewRating(0);
                      setReviewComment('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {showReviews && (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {review.buyerUsername.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-white">{review.buyerUsername}</span>
                          {review.verified && (
                            <Badge type="verified" size="sm" text="Verified Purchase" />
                          )}
                          <span className="text-sm text-gray-400">{getTimeAgo(review.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <StarRating rating={review.rating} readonly size="sm" />
                          <span className="text-sm text-gray-400">• {review.accountPurchased}</span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">No Reviews Yet</h4>
                  <p className="text-gray-400">Be the first to leave a review for this seller!</p>
                </div>
              )}
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
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => setIsChatOpen(true)}
              className="px-4"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 px-6">
              View Listings
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Popup */}
      <ErrorBoundary
        fallback={
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
              <div className="text-red-600 text-lg font-semibold mb-2">
                Chat Error
              </div>
              <p className="text-gray-600 mb-4">
                The chat failed to load. Please try again.
              </p>
              <button
                onClick={() => setIsChatOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close Chat
              </button>
            </div>
          </div>
        }
      >
        <ChatPopup
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          seller={{
            id: seller.id,
            username: seller.username,
            avatar: seller.avatar,
            isOnline: true,
            lastSeen: sellerStats.lastSeen
          }}
          onSendMessage={(message) => {
            console.log('Message sent:', message);
            // Here you would typically send the message to your backend
          }}
        />

        {/* Report Seller Modal */}
        <Modal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportReason('');
            setReportComment('');
          }}
          title="Report Seller"
          size="md"
        >
          <form onSubmit={handleSubmitReport}>
            <p className="mb-4 text-gray-300">
              Tell us why you're reporting this seller. Our moderators will review it.
            </p>

            <select 
              className="w-full mb-4 p-3 rounded-md bg-[#1e1e1e] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              required
            >
              <option value="">Select reason</option>
              <option value="scam">Scam / fraud</option>
              <option value="abusive">Abusive behavior</option>
              <option value="fake_info">Fake account information</option>
              <option value="spam">Spam or irrelevant listings</option>
              <option value="other">Other</option>
            </select>

            <textarea 
              placeholder="Add any details (optional)"
              className="w-full p-3 rounded-md bg-[#1e1e1e] text-white border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              rows={4}
              value={reportComment}
              onChange={(e) => setReportComment(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportComment('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmittingReport || !reportReason}
                className="flex-1"
              >
                {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </Modal>
      </ErrorBoundary>
    </div>
  );
};

export default SellerProfile;