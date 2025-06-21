import React from 'react';
import { ArrowRight, Star, Eye, TrendingUp, Zap } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { featuredListings } from '../../data/mockData';

interface FeaturedListingsProps {
  onNavigate: (page: string, listingId?: string) => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-16">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Featured Listings
                </h2>
                <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              Discover premium gaming accounts from our most trusted sellers, 
              <span className="text-indigo-400 font-semibold"> handpicked for excellence</span>
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map((listing, index) => (
            <Card 
              key={listing.id} 
              hover 
              className="group transform transition-all duration-500 hover:scale-105 hover:rotate-1 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-600/50 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl mb-6 shadow-2xl group-hover:shadow-indigo-500/20 transition-shadow duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
                />
                
                {/* Floating badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                  {listing.isVerified && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-lg backdrop-blur-sm border border-green-400/30">
                      ✓ Verified
                    </div>
                  )}
                  {listing.hasEscrow && (
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-lg backdrop-blur-sm border border-blue-400/30">
                      🛡️ Escrow
                    </div>
                  )}
                </div>
                
                {/* Price tag with enhanced styling */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-400/30">
                    <span className="text-white font-bold text-lg">${listing.price}</span>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              </div>

              {/* Content */}
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-white text-xl leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 mb-2">
                    {listing.title}
                  </h3>
                  
                  {/* Game info with enhanced styling */}
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-600 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <span className="text-gray-200 font-medium">{listing.game}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-600 px-3 py-1 rounded-full">
                      <span className="text-yellow-400 font-bold">Lv.{listing.level}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-600 px-3 py-1 rounded-full">
                      <span className="text-gray-200">{listing.platform}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced features section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Key Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.slice(0, 2).map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="px-3 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs rounded-lg font-medium backdrop-blur-sm hover:from-indigo-500/30 hover:to-purple-500/30 transition-all duration-200"
                      >
                        {feature}
                      </div>
                    ))}
                    {listing.features.length > 2 && (
                      <div className="px-3 py-2 bg-gradient-to-r from-gray-600/30 to-gray-500/30 border border-gray-500/30 text-gray-300 text-xs rounded-lg font-medium backdrop-blur-sm">
                        +{listing.features.length - 2} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Seller Info */}
                <div className="pt-4 border-t border-gradient-to-r from-gray-600 to-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={listing.seller.avatar} 
                          alt={listing.seller.username}
                          className="w-10 h-10 rounded-full border-2 border-indigo-500/50 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-white">{listing.seller.username}</span>
                          {listing.seller.isVerified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
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
                  
                  <Button 
                    variant="primary"
                    onClick={() => onNavigate('listing-details', listing.id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 group"
                  >
                    <span>View Details</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced mobile CTA */}
        <div className="text-center mt-16 sm:hidden">
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Discover more premium accounts</p>
            <Button 
              variant="primary"
              onClick={() => onNavigate('marketplace')}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 px-8 py-3"
            >
              <span>Explore All Listings</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;