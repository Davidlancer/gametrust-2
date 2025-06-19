import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Shield, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Flag,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  Calendar,
  User,
  GamepadIcon,
  Crown,
  Zap
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import { featuredListings } from '../data/mockData';

interface ListingDetailsProps {
  listingId?: string;
  onNavigate: (page: string) => void;
}

const ListingDetails: React.FC<ListingDetailsProps> = ({ listingId = '1', onNavigate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media Section */}
          <div className="lg:col-span-2 space-y-6">
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
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Full Screen Button */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              </div>

              {/* Thumbnail Carousel */}
              {listing.images.length > 1 && (
                <div className="p-4 bg-gray-800/50">
                  <div className="flex space-x-3 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

          {/* Right Column - Purchase Section */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-24">
              <div className="space-y-6">
                {/* Game Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <GamepadIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{listing.game}</h2>
                    <p className="text-gray-400">{listing.platform}</p>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{listing.title}</h1>
                  <div className="flex items-center space-x-2">
                    {listing.isVerified && <Badge type="verified" size="sm" />}
                    {listing.hasEscrow && <Badge type="escrow" size="sm" />}
                  </div>
                </div>

                {/* Price */}
                <div className="text-center py-4 bg-gray-700/30 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-1">${listing.price}</div>
                  <div className="text-sm text-gray-400">One-time payment</div>
                </div>

                {/* Buy Button */}
                <Button
                  size="lg"
                  onClick={() => setShowBuyModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Buy Now with Escrow
                </Button>

                {/* Trust Indicators */}
                <div className="space-y-3 pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Escrow protection included</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Account verified by GameTrust</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Seller Card */}
            <Card>
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
                  <Button variant="outline" size="sm" className="flex-1">
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
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Similar Listings</h3>
              <div className="space-y-3">
                {featuredListings.slice(0, 3).map((similar) => (
                  <div key={similar.id} className="flex items-center space-x-3 p-3 bg-gray-700/20 rounded-lg hover:bg-gray-700/40 transition-colors cursor-pointer">
                    <img
                      src={similar.images[0]}
                      alt={similar.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{similar.title}</p>
                      <p className="text-xs text-gray-400">${similar.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 p-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">${listing.price}</p>
            <p className="text-sm text-gray-400">Escrow Protected</p>
          </div>
          <Button
            onClick={() => setShowBuyModal(true)}
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            Buy Now
          </Button>
        </div>
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
              onClick={() => onNavigate('auth')}
            >
              Continue to Payment
            </Button>
            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Escrow Policy
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListingDetails;