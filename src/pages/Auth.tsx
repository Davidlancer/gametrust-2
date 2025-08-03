import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

interface AuthProps {
  onNavigate: (page: string) => void;
}

// DEVELOPMENT MODE - Mock Authentication
const MOCK_CREDENTIALS = {
  buyer: {
    email: 'buyer@gametrust.gg',
    password: 'password123'
  },
  seller: {
    email: 'test@gametrust.gg',
    password: 'password123'
  },
  admin: {
    email: 'admin@gametrust.com',
    password: 'admin123'
  }
};

// const DEV_MODE = true; // Toggle for testing mode - currently unused

const Auth: React.FC<AuthProps> = ({ onNavigate }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isSignUp) {
      // Mock sign up - always successful


      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      // Store mock user data
      localStorage.setItem('mockUser', JSON.stringify({
        email: formData.email,
        username: formData.username,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      }));
      
      // Clear onboarding for new user
      localStorage.removeItem('userOnboarded');
      localStorage.removeItem('onboardingData');
      
      setIsLoading(false);
      onNavigate('onboarding');
    } else {
      // Mock sign in - check test credentials
      const isBuyer = formData.email === MOCK_CREDENTIALS.buyer.email && formData.password === MOCK_CREDENTIALS.buyer.password;
      const isSeller = formData.email === MOCK_CREDENTIALS.seller.email && formData.password === MOCK_CREDENTIALS.seller.password;
      const isAdmin = formData.email === MOCK_CREDENTIALS.admin.email && formData.password === MOCK_CREDENTIALS.admin.password;
      
      if (isBuyer || isSeller || isAdmin) {
        if (isAdmin) {
          // Store admin user data
          const fakeAdmin = {
            id: "ADMIN001",
            username: "admin",
            role: "admin",
            name: "Admin User",
            email: "admin@gametrust.com",
            isAuthenticated: true
          };
          localStorage.setItem('current_user', JSON.stringify(fakeAdmin));
          
          setIsLoading(false);
          onNavigate('admin-dashboard');
        } else {
          const userType = isBuyer ? 'buyer' : 'seller';
          
          // Store mock user data
          localStorage.setItem('mockUser', JSON.stringify({
            email: formData.email,
            username: isBuyer ? 'BuyerUser' : 'TestUser',
            userType,
            isAuthenticated: true,
            loginTime: new Date().toISOString()
          }));
          
          // Store mock login flag
          localStorage.setItem('mockLogin', 'true');
          
          setIsLoading(false);
          
          // Check if user has completed onboarding
          const onboarded = localStorage.getItem('onboardingComplete');
          if (onboarded === 'true') {
            // Route based on user type
            if (isBuyer) {
              onNavigate('buyer-dashboard');
            } else {
              onNavigate('seller-dashboard');
            }
          } else {
            onNavigate('onboarding');
          }
        }
      } else {
        setError('Invalid credentials. Use buyer@gametrust.gg / password123, test@gametrust.gg / password123, or admin@gametrust.com / admin123');
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <Card className="backdrop-blur-sm bg-gray-800/90">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400">
              {isSignUp 
                ? 'Join GameTrust to start trading safely' 
                : 'Sign in to your GameTrust account'
              }
            </p>
            
            {/* Development Mode Banner */}
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-yellow-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Testing Mode Active</span>
              </div>
              <p className="text-xs text-yellow-300 mt-1">
                Buyer: buyer@gametrust.gg / password123<br/>
                Seller: test@gametrust.gg / password123
              </p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex mb-6 bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                !isSignUp 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                isSignUp 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {!isSignUp && (
            <div className="text-center mt-4">
              <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm">
                Forgot your password?
              </a>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>✓ Verified</span>
              <span>•</span>
              <span>🛡️ Protected</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;