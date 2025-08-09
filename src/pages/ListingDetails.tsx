import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Shield, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Flag,
  CheckCircle,
  Lock,
  Unlock,
  Eye,
  User,
  GamepadIcon,
  Crown,
  Zap,
  MessageCircle
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import PaymentSuccessModal from '../components/UI/PaymentSuccessModal';
import ChatPopup from '../components/UI/ChatPopup';
import { featuredListings } from '../data/mockData';
import { useEscrow } from '../hooks/useEscrow';
import { alertUtils } from '../utils/alertMigration';

interface ListingDetailsProps {
  listingId?: string;
  onNavigate: (page: string, id?: string) => void;
}

const ListingDetails: React.FC<ListingDetailsProps> = ({ listingId = '1', onNavigate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { createEscrowTransaction, escrow } = useEscrow();


  // Mock data - in real app, fetch from API
  const listing = featuredListings.find(l => l.id === listingId) || featuredListings[0];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const getSocialLinkageStatus = (platform: string, isLinked: boolean, isUnlinkable: boolean) => {
    if (!isLinked) return { color: 'text-gray-400', icon: Unlock, text: 'Not linked' };
    if (!isUnlinkable) return { color: 'text-red-400', icon: Lock, text: 'Permanently linked' };
    return { color: 'text-green-400', icon: Unlock, text: 'Can be unlinked' };
  };

  const handleBuyNow = () => {
    try {
      // Check if user is authenticated (in a real app, this would be from auth context)
      const mockUser = JSON.parse(localStorage.getItem('mockUser') || '{}');
      if (!mockUser.isAuthenticated) {
        alertUtils.error('Please log in to purchase this account.');
        onNavigate('auth');
        return;
      }

      // Create escrow transaction
      const escrowData = {
        buyerId: mockUser.id || 'BUYER_001',
        sellerId: listing.seller.id,
        accountId: listing.id,
        listingTitle: listing.title,
        amount: listing.price
      };

      createEscrowTransaction(escrowData);
      
      setShowBuyModal(false);
      setShowPaymentSuccessModal(true);
      
      // In development mode, show additional info
      if (import.meta.env.MODE === 'development') {
        console.log('Escrow Transaction Created:', escrowData);
      }
      
    } catch (error) {
      console.error('Error creating escrow:', error);
      alertUtils.error('There was an error processing your purchase. Please try again.');
    }
  };

  const handleChatWithSeller = () => {
    try {
      // Check if user is authenticated
      const mockUser = JSON.parse(localStorage.getItem('mockUser') || '{}');
      if (!mockUser.isAuthenticated) {
        alertUtils.error('Please log in to chat with the seller.');
        onNavigate('auth');
        return;
      }

      // Open chat popup
      setShowChatPopup(true);
      
    } catch (error) {
      console.error('Error opening chat:', error);
      alertUtils.error('There was an error opening the chat. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading account details...</p>
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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - All scrollable content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Main Image Display */}
            <Card padding="none" className="overflow-hidden">
              <div className="relative aspect-video bg-gray-800">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </>
                )}

                {/* Full Screen Button */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              </div>

              {/* Thumbnail Carousel */}
              {listing.images.length > 1 && (
                <div className="p-2 sm:p-4 bg-gray-800/50">
                  <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? 'border-indigo-500'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Account Details Grid */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <GamepadIcon className="h-6 w-6 mr-2 text-indigo-400" />
                Account Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">{listing.level}</div>
                  <div className="text-sm text-gray-400">Game Level</div>
                </div>
                
                <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">{listing.features.length}</div>
                  <div className="text-sm text-gray-400">Premium Features</div>
                </div>
                
                <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">2</div>
                  <div className="text-sm text-gray-400">Days Ago</div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-3">Account Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-700/20 rounded-lg">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Linkage Status */}
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-3">Account Linkage</h4>
                <div className="space-y-3">
                  {listing.linkedAccounts.map((account, index) => {
                    const status = getSocialLinkageStatus(account.platform, account.isLinked, account.isUnlinkable);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {account.platform.charAt(0)}
                            </span>
                          </div>
                          <span className="text-white font-medium">{account.platform}</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${status.color}`}>
                          <status.icon className="h-4 w-4" />
                          <span className="text-sm">{status.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
              <p className="text-gray-300 leading-relaxed">{listing.description}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* Escrow Information */}
            <Card className="bg-green-500/10 border-green-500/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-green-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Escrow Protected Purchase</h3>
                  <p className="text-green-300/80 mb-4">
                    Your payment is held securely until you confirm the account works as described. 
                    100% refund guarantee if the account doesn't match the listing.
                  </p>
                  <button
                    onClick={() => setShowEscrowModal(true)}
                    className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center"
                  >
                    Learn how escrow works
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Sticky Payment Container */}
          <div className="lg:col-span-1">
            <div className="relative lg:sticky lg:top-24 lg:self-start">
              {/* Purchase Card */}
              <Card>
              <div className="space-y-6">
                {/* Game Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <GamepadIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-white">{listing.game}</h2>
                    <p className="text-sm text-gray-400">{listing.platform}</p>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{listing.title}</h1>
                  <div className="flex items-center flex-wrap gap-2">
                    {listing.isVerified && <Badge type="verified" size="sm" />}
                    {listing.hasEscrow && <Badge type="escrow" size="sm" />}
                  </div>
                </div>

                {/* Price */}
                <div className="text-center py-3 sm:py-4 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">${listing.price}</div>
                  <div className="text-xs sm:text-sm text-gray-400">One-time payment</div>
                </div>

                {/* Action Buttons */}
                {escrow && escrow.accountId === listing.id ? (
                  <div className="w-full bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">Purchase In Progress</span>
                    </div>
                    <p className="text-yellow-300 text-sm">
                      ₦{escrow.amount.toLocaleString()} is held in escrow
                    </p>
                    <p className="text-yellow-200 text-xs mt-1">
                      Waiting for seller to provide account details
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <Button
                      size="lg"
                      onClick={() => setShowBuyModal(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                    >
                      <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Buy with Escrow
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleChatWithSeller}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                      <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Chat with Seller
                    </Button>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Ask questions before buying. Seller typically replies within 24 hours.
                    </p>
                  </div>
                )}

                {/* Trust Indicators */}
                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                    <span>Escrow protection included</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                    <span>Account verified by GameTrust</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
              </Card>

              {/* Seller Card */}
              <Card className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Seller Information</h3>
                
                <div className="flex items-center space-x-4">
                  <img
                    src={listing.seller.avatar}
                    alt={listing.seller.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-white">{listing.seller.username}</h4>
                      {listing.seller.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{listing.seller.rating} rating</span>
                      <span>•</span>
                      <span>{listing.seller.totalSales} sales</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onNavigate('seller-profile', listing.seller.id)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              </Card>

              {/* Similar Listings */}
              <Card className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Similar Listings</h3>
              <div className="space-y-3">
                {(() => {
                  // Get current listing info
                  const { id, game, price } = listing;
                  
                  // Filter for similar listings
                  const similarListings = featuredListings.filter((item) => 
                    item.id !== id && 
                    item.game === game && 
                    Math.abs(item.price - price) <= 10000
                  );
                  
                  return similarListings.length > 0 ? (
                    similarListings.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center space-x-3 p-3 bg-gray-700/20 rounded-lg hover:bg-gray-700/40 transition-colors cursor-pointer"
                        onClick={() => onNavigate('listing-details', item.id)}
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.title}</p>
                          <p className="text-xs text-gray-400">₦{item.price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No similar listings available.</p>
                  );
                })()}
              </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 p-4 z-40">
        {escrow && escrow.accountId === listing.id ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">${listing.price}</p>
              <p className="text-sm text-gray-400">Escrow Protected</p>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded px-4 py-2">
              <p className="text-yellow-400 text-sm font-medium">In Escrow</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-white font-semibold">${listing.price}</p>
              <p className="text-sm text-gray-400">Escrow Protected</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowBuyModal(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
              >
                <Shield className="mr-1 h-4 w-4" />
                Buy Now
              </Button>
              <Button
                onClick={handleChatWithSeller}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-sm"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="xl"
      >
        <div className="relative">
          <img
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          {listing.images.length > 1 && (
            <div className="flex justify-center space-x-4 mt-4">
              <Button variant="outline" onClick={prevImage}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={nextImage}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Escrow Info Modal */}
      <Modal
        isOpen={showEscrowModal}
        onClose={() => setShowEscrowModal(false)}
        title="How Escrow Protection Works"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { step: 1, title: 'You Pay Safely', desc: 'Your payment is held securely in escrow', icon: Shield },
              { step: 2, title: 'Seller Delivers', desc: 'Account credentials are provided to you', icon: Zap },
              { step: 3, title: 'You Verify', desc: 'Test the account and confirm it works', icon: Eye },
              { step: 4, title: 'Payment Released', desc: 'Seller receives payment after confirmation', icon: CheckCircle }
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-green-400">100% Protection Guarantee</span>
            </div>
            <p className="text-sm text-green-300/80">
              If the account doesn't work as described or the seller fails to deliver, 
              you get a full refund. No questions asked.
            </p>
          </div>
        </div>
      </Modal>

      {/* Buy Modal */}
      <Modal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        title="Complete Your Purchase"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Account</span>
              <span className="text-white font-semibold">{listing.title}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Price</span>
              <span className="text-white font-semibold">${listing.price}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-600 pt-4">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-white">${listing.price}</span>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-green-400">Escrow Protected</span>
            </div>
            <p className="text-sm text-green-300/80">
              Your payment will be held securely until you confirm the account works perfectly.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleBuyNow}
            >
              Confirm Purchase
            </Button>
            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Escrow Policy
            </p>
            {import.meta.env.MODE === 'development' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-400 text-xs font-medium mb-1">🧪 Development Mode</p>
                <p className="text-blue-300 text-xs">
                  This will create a simulated escrow transaction using localStorage
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={showPaymentSuccessModal}
        onClose={() => setShowPaymentSuccessModal(false)}
        amount={listing.price}
        autoClose={true}
        autoCloseDelay={4000}
      />

      {/* Chat Popup */}
      <ChatPopup
        isOpen={showChatPopup}
        onClose={() => setShowChatPopup(false)}
        seller={{
          id: listing.seller.id,
          username: listing.seller.username,
          avatar: listing.seller.avatar,
          isOnline: true, // Default to online for demo
          lastSeen: '2 hours ago' // Default last seen time
        }}
        onSendMessage={(message) => {
          console.log('Message sent:', message);
          // Here you would typically send the message to your backend
          // For now, we'll just log it
        }}
      />
    </div>
  );
};

export default ListingDetails;