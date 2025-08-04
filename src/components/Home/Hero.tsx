import React from 'react';
import Button from '../UI/Button';
import { ArrowRight, Shield } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-4 md:left-10 w-16 h-16 md:w-20 md:h-20 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 md:top-40 right-4 md:right-20 w-20 h-20 md:w-32 md:h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 md:bottom-40 left-4 md:left-20 w-18 h-18 md:w-24 md:h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Text Content */}
          <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <div className="flex items-center space-x-2 bg-indigo-500/10 px-3 py-2 rounded-full border border-indigo-500/20">
                <Shield className="h-4 w-4 text-indigo-400" />
                <span className="text-indigo-300 text-xs sm:text-sm font-medium">Trusted by 50,000+ Gamers</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Buy & Sell Game Accounts
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Safely with Escrow
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
              GameTrust connects verified gamers and protects your funds during transactions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center md:justify-start mb-8 md:mb-12">
              <Button 
                size="lg" 
                onClick={() => onNavigate('marketplace')}
                className="group hover:bg-indigo-600 hover:shadow-lg transition-all duration-300 w-full md:w-auto"
              >
                Explore Marketplace
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats - Mobile optimized */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto md:mx-0">
              <div className="text-center md:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">$2.5M+</div>
                <div className="text-xs sm:text-sm text-gray-400">Transactions</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-xs sm:text-sm text-gray-400">Users</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">99.8%</div>
                <div className="text-xs sm:text-sm text-gray-400">Success</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="relative">
              {/* Gaming themed illustration placeholder */}
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                <div className="text-center">
                  <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 bg-indigo-500/30 rounded-full flex items-center justify-center">
                    <Shield className="h-10 w-10 md:h-16 md:w-16 text-indigo-300" />
                  </div>
                  <p className="text-indigo-300 text-sm md:text-base font-medium">Secure Gaming Marketplace</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/30 rounded-full animate-bounce delay-300"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-indigo-500/30 rounded-full animate-bounce delay-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-2 md:h-3 bg-gray-400 rounded-full mt-1 md:mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;