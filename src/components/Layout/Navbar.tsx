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

  const getUserDashboard = () => {
    const userType = localStorage.getItem('userType') || 'buyer';
    return userType === 'seller' ? 'seller-dashboard' : 'buyer-dashboard';
  };

  const navigation = [
    { name: 'Home', key: 'home' },
    { name: 'Marketplace', key: 'marketplace' },
    // { name: 'Sell', key: 'sell' },
    { name: 'Platforms', key: 'platforms' },
    { name: 'Referrals', key: 'referral-program' }
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
                  className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
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
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => {
                        const currentRole = localStorage.getItem('userRole') || 'buyer';
                        onNavigate(currentRole === 'buyer' ? 'buyer-dashboard' : 'seller-dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-medium transition-colors"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate('wallet');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md font-medium transition-colors"
                    >
                      Wallet
                    </button>
                    <button 
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md font-medium transition-colors"
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
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate('auth');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-medium transition-colors"
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