import React, { useState } from 'react';
import { Menu, X, Shield, User, Search } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', key: 'home' },
    { name: 'Marketplace', key: 'marketplace' },
    { name: 'Sell', key: 'sell' },
    { name: 'Platforms', key: 'platforms' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Shield className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold text-white">GameTrust</span>
            <span className="text-sm text-gray-400 hidden sm:block">by GameBox Arena</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.key
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onNavigate('auth')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onNavigate('sell')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Start Selling
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-sm rounded-lg mt-2">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    currentPage === item.key
                      ? 'text-indigo-400 bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-gray-700 pt-3 mt-3">
                <button 
                  onClick={() => {
                    onNavigate('auth');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    onNavigate('sell');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md font-medium transition-colors"
                >
                  Start Selling
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;