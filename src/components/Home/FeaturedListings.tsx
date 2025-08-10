import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Eye, TrendingUp, Zap } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { apiService } from '../../services/api';
import { GameAccount } from '../../types';

interface FeaturedListingsProps {
  onNavigate: (page: string, listingId?: string) => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ onNavigate }) => {
  const [listings, setListings] = useState<GameAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        setLoading(true);
        const response = await apiService.products.getAll({ featured: true, limit: 6 });
        // Defensive coding: ensure we always have an array
        const listingsData = response?.data;
        if (Array.isArray(listingsData)) {
          setListings(listingsData.slice(0, 6)); // Limit to 6 featured items
        } else {
          console.warn('API returned non-array data:', listingsData);
          setListings([]);
        }
      } catch (err) {
        console.error('Error fetching featured listings:', err);
        setError('Failed to load featured listings');
        setListings([]); // Ensure listings is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Listings</h2>
            <p className="text-lg text-gray-600">Loading premium gaming accounts...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Listings</h2>
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Listings</h2>
            <p className="text-lg text-gray-600 mb-4">No featured listings available at the moment.</p>
            <Button onClick={() => onNavigate('marketplace')} variant="primary">
              Browse All Listings
            </Button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 sm:mb-12 lg:mb-16 space-y-6 lg:space-y-0">
          <div className="space-y-4 w-full lg:w-auto">
            <div className="flex flex-col items-center space-y-3 sm:space-y-0 sm:flex-row sm:justify-center lg:justify-start sm:space-x-3">
              <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex-shrink-0">
                <TrendingUp className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
              </div>
              <div className="flex items-center space-x-2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                  Featured Listings
                </h2>
                <Zap className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 text-yellow-400 animate-pulse flex-shrink-0" />
              </div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed text-center lg:text-left px-4 sm:px-0">
              Discover premium gaming accounts from our most trusted sellers, 
              <span className="text-indigo-400 font-semibold"> handpicked for excellence</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Verified Quality</span>
              </div>
            </div>
          </div>
          <Button 
            variant="primary"
            onClick={() => onNavigate('marketplace')}
            className="hidden sm:flex group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25"
          >
            <span>Explore All</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {listings.map((listing: GameAccount, index: number) => (
            <Card 
              key={listing.id} 
              hover 
              className="group transform transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-gray-800/90 via-gray-800 to-gray-900 border border-gray-600/30 hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/20 rounded-xl overflow-hidden h-full flex flex-col backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Image */}
              <div className="relative overflow-hidden mb-0 shadow-lg group-hover:shadow-indigo-500/25 transition-shadow duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-48 md:h-44 xl:h-40 object-cover group-hover:scale-105 transition-transform duration-500 filter group-hover:brightness-110"
                />
                
                {/* Floating badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                  {/* Featured badge for first listing */}
                  {index === 0 && (
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-2.5 py-1 rounded-lg text-white text-xs font-bold shadow-lg backdrop-blur-sm border border-yellow-400/30 animate-pulse">
                      ⭐ Featured
                    </div>
                  )}
                  {/* Hot Deal badge for second listing */}
                  {index === 1 && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 px-2.5 py-1 rounded-lg text-white text-xs font-bold shadow-lg backdrop-blur-sm border border-red-400/30">
                      🔥 Hot Deal
                    </div>
                  )}
                  {/* New badge for third listing */}
                  {index === 2 && (
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-2.5 py-1 rounded-lg text-white text-xs font-bold shadow-lg backdrop-blur-sm border border-purple-400/30">
                      ✨ New
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {listing.isVerified && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-0.5 rounded-md text-white text-xs font-semibold shadow-md backdrop-blur-sm border border-green-400/30">
                        ✓ Verified
                      </div>
                    )}
                    {listing.hasEscrow && (
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-0.5 rounded-md text-white text-xs font-semibold shadow-md backdrop-blur-sm border border-blue-400/30">
                        🛡️ Escrow
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Price tag with enhanced styling */}
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm border border-indigo-400/30">
                    <span className="text-white font-bold text-sm md:text-base">${listing.price}</span>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              </div>

              {/* Content - Flexible grow area */}
              <div className="flex flex-col flex-grow p-4 md:p-5">
                {/* Main content area */}
                <div className="flex-grow space-y-3 md:space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base md:text-lg xl:text-base leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    
                    {/* Game info with enhanced styling */}
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <div className="flex items-center space-x-1.5 bg-gradient-to-r from-gray-700 to-gray-600 px-2.5 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-200 font-medium truncate">{listing.game}</span>
                      </div>
                      <div className="flex items-center bg-gradient-to-r from-gray-700 to-gray-600 px-2.5 py-1 rounded-full">
                        <span className="text-yellow-400 font-bold">Lv.{listing.level}</span>
                      </div>
                      <div className="flex items-center bg-gradient-to-r from-gray-700 to-gray-600 px-2.5 py-1 rounded-full">
                        <span className="text-gray-200 truncate">{listing.platform}</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced features section */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Key Features</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {listing.features?.slice(0, 2).map((feature: string, featureIndex: number) => (
                        <div 
                          key={featureIndex}
                          className="px-2 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs rounded-md font-medium backdrop-blur-sm hover:from-indigo-500/30 hover:to-purple-500/30 transition-all duration-200"
                        >
                          {feature}
                        </div>
                      ))}
                      {listing.features.length > 2 && (
                        <div className="px-2 py-1 bg-gradient-to-r from-gray-600/30 to-gray-500/30 border border-gray-500/30 text-gray-300 text-xs rounded-md font-medium backdrop-blur-sm">
                          +{listing.features.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer - Always at bottom */}
                <div className="mt-3 md:mt-4 pt-3 border-t border-gray-600/50">
                  {/* Seller Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={listing.seller.avatar} 
                          alt={listing.seller.username}
                          className="w-8 h-8 rounded-full border-2 border-indigo-500/50 shadow-lg"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-semibold text-white truncate">{listing.seller.username}</span>
                          {listing.seller.isVerified && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-2.5 w-2.5 ${
                                  i < Math.floor(listing.seller.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-600'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">{listing.seller.rating}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">{listing.seller.totalSales} sales</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Always aligned at bottom */}
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="primary"
                      onClick={() => onNavigate('listing-details', listing.id)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 group transition-all duration-200 text-xs md:text-sm py-2.5 min-h-[44px]"
                    >
                      <span>View Details</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    {listing.hasEscrow && (
                      <Button 
                        variant="secondary"
                        onClick={() => onNavigate('listing-details', listing.id)}
                        className="w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-300 hover:bg-gradient-to-r hover:from-green-600/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-200 group text-xs md:text-sm py-2.5 min-h-[44px]"
                      >
                        <span>🛡️ Buy with Escrow</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced mobile CTA */}
        <div className="mt-12 sm:mt-16 text-center px-4 sm:px-0">
          <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Explore More Premium Listings
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
              Discover thousands of verified gaming accounts, rare items, and exclusive content from trusted sellers worldwide.
            </p>
            <Button 
              variant="primary"
              onClick={() => onNavigate('marketplace')}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Browse All Listings</span>
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;