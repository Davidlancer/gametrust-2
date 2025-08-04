import React, { useState } from 'react';
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

  const navigation = [
    { name: 'Home', key: 'home' },
    { name: 'Marketplace', key: 'marketplace' },
    // { name: 'Sell', key: 'sell' },
    { name: 'Referrals', key: 'referral-program' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-1 sm:space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Shield className="h-6 sm:h-8 w-6 sm:w-8 text-indigo-400" />
            <span className="text-lg sm:text-xl font-bold text-white">GameTrust</span>
            <span className="text-xs sm:text-sm text-gray-400 hidden md:block">by GameBox Arena</span>
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
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
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
              <>
                <button 
                  onClick={() => onNavigate('auth')}
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate('auth')}
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-5 sm:h-6 w-5 sm:w-6" /> : <Menu className="h-5 sm:h-6 w-5 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
            <div className="px-2 sm:px-4 pt-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2.5 text-sm sm:text-base font-medium rounded-md transition-colors ${
                    currentPage === item.key
                      ? 'text-indigo-400 bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-gray-700 pt-3 mt-3 space-y-2">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => {
                        const currentRole = localStorage.getItem('userRole') || 'buyer';
                        onNavigate(currentRole === 'buyer' ? 'buyer-dashboard' : 'seller-dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate('wallet');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors"
                    >
                      Wallet
                    </button>
                    <button 
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        onNavigate('auth');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2.5 text-sm sm:text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate('auth');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;