import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Search } from 'lucide-react';
import RoleSwitcher from '../UI/RoleSwitcher';
import NotificationBell from '../UI/NotificationBell';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigation = [
    { name: 'Home', key: 'home' },
    { name: 'Marketplace', key: 'marketplace' },
    { name: 'Referrals', key: 'referral-program' }
  ];

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('nav')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-700' 
        : 'bg-gray-900/90 backdrop-blur-lg border-b border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group transition-transform duration-200 hover:scale-105"
            onClick={() => onNavigate('home')}
          >
            <Shield className="h-7 sm:h-8 w-7 sm:w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-200">GameTrust</span>
              <span className="text-xs text-gray-400 hidden sm:block group-hover:text-gray-300 transition-colors duration-200">by GameBox Arena</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage === item.key
                    ? 'text-indigo-400 bg-indigo-400/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {item.name}
                {currentPage === item.key && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"></div>
                )}
              </button>
            ))}
            
            {/* CTA Button */}
            <button
              onClick={() => onNavigate('marketplace')}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Marketplace
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/20 dark:hover:bg-gray-800/60 hover:backdrop-blur-lg hover:shadow-lg hover:border hover:border-white/30 dark:hover:border-gray-600/50 rounded-lg transition-all duration-200 transform hover:scale-105">
              <Search className="h-5 w-5" />
            </button>
            
            {isAuthenticated && (
              <NotificationBell onNavigate={onNavigate} />
            )}
            
            {isAuthenticated ? (
              <RoleSwitcher 
                onNavigate={onNavigate}
                onLogout={onLogout}
                currentPage={currentPage}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200 hover:bg-gray-800/30"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Search & Notifications */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              <Search className="h-5 w-5" />
            </button>
            
            {isAuthenticated && (
              <NotificationBell onNavigate={onNavigate} />
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/20 dark:hover:bg-gray-800/60 hover:backdrop-blur-lg hover:shadow-lg hover:border hover:border-white/30 dark:hover:border-gray-600/50 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                }`}>
                  <Menu className="h-6 w-6" />
                </span>
                <span className={`absolute inset-0 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
                }`}>
                  <X className="h-6 w-6" />
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white/60 dark:bg-gray-900/85 backdrop-blur-2xl border border-gray-300/40 dark:border-gray-700/60 rounded-b-xl shadow-2xl z-[9999] transition-all duration-300 ease-in-out hover:bg-white/70 hover:dark:bg-gray-900/90 hover:backdrop-blur-3xl ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-4 invisible'
        }`}>
          <div className="p-4 space-y-2">
            {/* Navigation Links */}
            <div className="space-y-1">
              {navigation.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 transform ${
                    currentPage === item.key
                      ? 'text-indigo-400 bg-indigo-400/10 border-l-4 border-indigo-400 backdrop-blur-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-800/60 hover:backdrop-blur-lg hover:translate-x-1 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </button>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onNavigate('marketplace');
                  setIsMenuOpen(false);
                }}
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:backdrop-blur-lg hover:shadow-xl"
              >
                Explore Marketplace
              </button>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-300/30 dark:border-gray-700/50 pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      const currentRole = localStorage.getItem('userRole') || 'buyer';
                      onNavigate(currentRole === 'buyer' ? 'buyer-dashboard' : 'seller-dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full bg-blue-600/90 hover:bg-blue-700/90 text-white px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 hover:backdrop-blur-lg hover:shadow-lg"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      onNavigate('wallet');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full bg-gray-600/90 hover:bg-gray-700/90 text-white px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 hover:backdrop-blur-lg hover:shadow-lg"
                  >
                    Wallet
                  </button>
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full bg-red-600/90 hover:bg-red-700/90 text-white px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 hover:backdrop-blur-lg hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      onNavigate('auth');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-800/60 hover:backdrop-blur-lg rounded-xl transition-all duration-200 transform hover:translate-x-1 hover:shadow-lg"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      onNavigate('auth');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:backdrop-blur-lg hover:shadow-xl"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;