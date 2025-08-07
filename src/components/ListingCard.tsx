import React from 'react';
import { Star, Shield } from 'lucide-react';
import Card from './UI/Card';
import Badge from './UI/Badge';
import Button from './UI/Button';

interface Listing {
  id: string;
  title: string;
  game: string;
  platform: string;
  level: number;
  rank?: string;
  price: number;
  images: string[];
  thumbnail?: string;
  isVerified: boolean;
  hasEscrow: boolean;
  features: string[];
  tags?: string[];
  seller: {
    username: string;
    avatar: string;
    rating: number;
    totalSales: number;
    isVerified: boolean;
  };
  views?: number;
  isHot?: boolean;
  isNew?: boolean;
}

interface ListingCardProps {
  listing: Listing;
  onNavigate: (page: string, listingId?: string) => void;
  viewMode?: 'grid' | 'list';
  index?: number;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onNavigate, 
  viewMode = 'grid',
  index = 0 
}) => {
  const handleViewDetails = () => {
    onNavigate('listing-details', listing.id);
  };

  return (
    <Card 
      hover 
      className={`group overflow-hidden bg-gray-800 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 ${
        viewMode === 'list' 
          ? 'hover:scale-[1.01] flex-row' 
          : 'hover:scale-[1.02]'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={viewMode === 'list' ? 'flex gap-4 sm:gap-6' : ''}>
        {/* Image Section */}
        <div className={`relative overflow-hidden ${
          viewMode === 'list' 
            ? 'w-32 sm:w-48 md:w-56 h-24 sm:h-32 md:h-36 flex-shrink-0' 
            : 'w-full h-40 sm:h-48 mb-4'
        } rounded-lg`}>
          <img 
            src={listing.thumbnail || listing.images[0]} 
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {listing.isNew && (
              <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-green-400/50 shadow-sm text-xs font-medium px-2 py-0.5">
                New
              </Badge>
            )}
            {listing.isHot && (
              <Badge className="bg-red-500/90 text-white backdrop-blur-sm border-red-400/50 shadow-sm text-xs font-medium px-2 py-0.5">
                Hot
              </Badge>
            )}
            {listing.isVerified && (
              <Badge type="verified" size="sm" className="bg-blue-500/90 backdrop-blur-sm border-blue-400/50 shadow-sm" />
            )}
            {listing.hasEscrow && (
              <Badge type="escrow" size="sm" className="bg-purple-500/90 backdrop-blur-sm border-purple-400/50 shadow-sm" />
            )}
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-600/50">
            <span className="text-white font-bold text-sm">${listing.price.toLocaleString()}</span>
          </div>
          
          {/* Quick Action Overlay - Only for Grid View */}
          {viewMode === 'grid' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                size="sm" 
                className="bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-sm border border-indigo-400/50 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-white font-medium"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`flex-1 space-y-3 ${
          viewMode === 'list' ? 'py-1' : 'p-4'
        }`}>
          {/* Title and Game */}
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-base sm:text-lg leading-tight group-hover:text-indigo-400 transition-colors cursor-pointer truncate">
              {listing.title}
            </h3>
            <p className="text-indigo-400 font-medium text-sm truncate">
              {listing.game}
            </p>
          </div>

          {/* Stats Grid */}
          <div className={`grid gap-2 text-center ${
            viewMode === 'list' 
              ? 'grid-cols-2 sm:grid-cols-3' 
              : 'grid-cols-3'
          }`}>
            <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/50">
              <div className="text-white font-semibold text-sm">
                Level {listing.level}
              </div>
              <div className="text-gray-400 text-xs">
                Character
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/50">
              <div className="text-white font-semibold text-sm truncate">
                {listing.platform}
              </div>
              <div className="text-gray-400 text-xs">
                Platform
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/50">
              <div className="text-yellow-400 font-semibold text-sm flex items-center justify-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {listing.seller.rating}
              </div>
              <div className="text-gray-400 text-xs">
                Rating
              </div>
            </div>
          </div>

          {/* Features/Tags - Only show in grid view or larger list view */}
          {(viewMode === 'grid' || (viewMode === 'list' && typeof window !== 'undefined' && window.innerWidth > 768)) && (
            <div className="flex flex-wrap gap-1.5">
              {listing.features.slice(0, viewMode === 'list' ? 4 : 3).map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/30 hover:border-indigo-500/30 transition-colors truncate"
                >
                  {feature}
                </span>
              ))}
              {listing.features.length > (viewMode === 'list' ? 4 : 3) && (
                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full border border-indigo-500/30">
                  +{listing.features.length - (viewMode === 'list' ? 4 : 3)}
                </span>
              )}
            </div>
          )}

          {/* Seller Info and CTA */}
          <div className={`flex items-center justify-between pt-3 border-t border-gray-700/50 ${
            viewMode === 'list' ? 'mt-auto' : ''
          }`}>
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <img 
                  src={listing.seller.avatar} 
                  alt={listing.seller.username}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-600 group-hover:border-indigo-500 transition-colors"
                />
                {listing.seller.isVerified && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <Shield className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
                  {listing.seller.username}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {listing.seller.totalSales} sales
                </p>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="flex-shrink-0 ml-2">
              <Button 
                size="sm" 
                variant="outline"
                className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400 transition-all text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                onClick={handleViewDetails}
              >
                {viewMode === 'list' ? 'View' : 'View Details'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ListingCard;