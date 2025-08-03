import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Sell from './pages/Sell';
import Auth from './pages/Auth';
import Platforms from './pages/Platforms';
import ListingDetails from './pages/ListingDetails';
import SellerProfile from './pages/SellerProfile';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Onboarding from './pages/Onboarding';
import ReferralProgram from './pages/ReferralProgram';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { AlertTriangle } from 'lucide-react';
import ToastProvider from './components/UI/ToastProvider';
import RoleSwitcher from './components/UI/RoleSwitcher';
import NotificationDevTools, { DevModeToggle } from './components/UI/NotificationDevTools';
import NotificationServiceProvider from './components/UI/NotificationServiceProvider';
import { ActivityLogProvider } from './context/ActivityLogContext';
import './utils/testRoleSwitcher'; // Load test utilities

type Page = 'home' | 'marketplace' | 'sell' | 'auth' | 'platforms' | 'listing-details' | 'seller-profile' | 'seller-dashboard' | 'buyer-dashboard' | 'onboarding' | 'referral-program' | 'admin-dashboard' | 'admin-login';

interface OnboardingData {
  roles: string[];
  games: string[];
  completedAt: Date;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedListingId, setSelectedListingId] = useState<string>('1');
  const [selectedSellerId, setSelectedSellerId] = useState<string>('1');
  const [userOnboarded, setUserOnboarded] = useState<boolean>(false);
  const [, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [, setUserType] = useState<string>('buyer');
  const [devMode] = useState<boolean>(true); // Testing mode toggle

  // Initialize mock user for escrow functionality
  useEffect(() => {
    const mockUser = {
      id: 'USER_001',
      isAuthenticated: true,
      role: 'buyer',
      name: 'Test User',
      email: 'test@gametrust.com'
    };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setIsAuthenticated(true);
  }, []);

  const handleNavigate = (page: string, id?: string) => {
    // Parse URL with query parameters
    let targetPage = page;
    let queryString = '';
    
    if (page.includes('?')) {
      const [pageName, query] = page.split('?');
      targetPage = pageName;
      queryString = query;
    }
    
    if (targetPage === 'listing-details' && id) {
      setSelectedListingId(id);
    }
    if (targetPage === 'seller-profile' && id) {
      setSelectedSellerId(id);
    }
    
    // Handle wallet navigation based on current user role
    if (targetPage === 'wallet') {
      const currentRole = localStorage.getItem('userRole') || 'buyer';
      if (currentRole === 'seller') {
        setCurrentPage('seller-dashboard');
        // Set wallet as the active page in seller dashboard
        setTimeout(() => {
          const event = new CustomEvent('navigateToWallet');
          window.dispatchEvent(event);
        }, 100);
      } else {
        setCurrentPage('buyer-dashboard');
        // Set wallet as the active page in buyer dashboard
        setTimeout(() => {
          const event = new CustomEvent('navigateToWallet');
          window.dispatchEvent(event);
        }, 100);
      }
      return;
    }
    
    // Update browser URL with query parameters
    const newUrl = queryString ? `/${targetPage}?${queryString}` : `/${targetPage}`;
    window.history.pushState({}, '', newUrl);
    
    setCurrentPage(targetPage as Page);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserOnboarded(false);
    setOnboardingData(null);
    localStorage.removeItem('mockUser');
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('onboardingData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoles');
    setCurrentPage('home');
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    setUserOnboarded(true);
    // Store in localStorage for persistence
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(data));
    
    // Set up user roles for RoleSwitcher
    const validRoles = data.roles.filter(role => role === 'buyer' || role === 'seller');
    if (validRoles.length > 0) {
      localStorage.setItem('userRoles', JSON.stringify(validRoles));
      // Set default current role
      const defaultRole = validRoles.includes('buyer') ? 'buyer' : 'seller';
      localStorage.setItem('userRole', defaultRole);
    }
    
    // Route based on selected roles
    if (data.roles.includes('buyer') && !data.roles.includes('seller')) {
      setCurrentPage('buyer-dashboard');
    } else if (data.roles.includes('seller') && !data.roles.includes('buyer')) {
      setCurrentPage('seller-dashboard');
    } else {
      // Both roles - default to buyer dashboard
      setCurrentPage('buyer-dashboard');
    }
  };

  // Handle browser navigation and initial URL parsing
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'home';
      setCurrentPage(path as Page);
    };
    
    // Parse initial URL
    const initialPath = window.location.pathname.slice(1) || 'home';
    if (initialPath !== 'home') {
      setCurrentPage(initialPath as Page);
    }
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check authentication and onboarding status on app load
  useEffect(() => {
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const userData = JSON.parse(mockUser);
      if (userData.isAuthenticated) {
        setIsAuthenticated(true);
        setUserType(userData.userType || 'buyer');
      }
    }
    
    const onboarded = localStorage.getItem('onboardingComplete');
    const storedData = localStorage.getItem('onboardingData');
    if (onboarded === 'true' && storedData) {
      setUserOnboarded(true);
      setOnboardingData(JSON.parse(storedData));
    }
  }, []);

  // Update user type when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        const userData = JSON.parse(mockUser);
        setUserType(userData.userType || 'buyer');
      }
    }
  }, [isAuthenticated]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'marketplace':
        return <Marketplace onNavigate={handleNavigate} />;
      case 'sell':
        return <Sell />;
      case 'auth':
        return <Auth onNavigate={handleNavigate} />;
      case 'platforms':
        return <Platforms onNavigate={handleNavigate} />;
      case 'listing-details':
        return <ListingDetails listingId={selectedListingId} onNavigate={handleNavigate} />;
      case 'seller-profile':
        return <SellerProfile sellerId={selectedSellerId} onNavigate={handleNavigate} />;
      case 'seller-dashboard':
        return <SellerDashboard onNavigate={handleNavigate} />;
      case 'buyer-dashboard':
        return <BuyerDashboard onNavigate={handleNavigate} />;
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} onNavigate={handleNavigate} />;
      case 'referral-program':
        return <ReferralProgram />;
      case 'admin-dashboard': {
        // Check if user is authenticated as admin
        const currentUser = localStorage.getItem('current_user');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          if (user.role === 'admin') {
            return <AdminDashboard onNavigate={handleNavigate} />;
          }
        }
        // Redirect to admin login if not authenticated as admin
        setCurrentPage('admin-login');
        return <AdminLogin onNavigate={handleNavigate} />;
      }
      case 'admin-login':
        return <AdminLogin onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  // Redirect to auth if not authenticated (except for public pages)
  useEffect(() => {
    const publicPages = ['home', 'marketplace', 'platforms', 'auth'];
    if (!isAuthenticated && !publicPages.includes(currentPage)) {
      setCurrentPage('auth');
    }
  }, [isAuthenticated, currentPage]);

  // Show onboarding for authenticated users who haven't completed it (except admins)
  const isAdmin = () => {
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.role === 'admin';
    }
    return false;
  };
  
  const shouldShowOnboarding = isAuthenticated && !userOnboarded && currentPage !== 'auth' && currentPage !== 'onboarding' && !isAdmin();

  if (shouldShowOnboarding) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Onboarding onComplete={handleOnboardingComplete} onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <ActivityLogProvider>
      <ToastProvider>
        <NotificationServiceProvider>
        <div className="min-h-screen bg-gray-900">
          {/* Testing Mode Banner */}
          {devMode && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-600 text-black px-4 py-2">
              <div className="flex items-center justify-center space-x-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                <span>🧪 Testing Mode Active - Frontend Only Demo</span>
              </div>
            </div>
          )}
          
          <div className={devMode ? 'pt-10' : ''}>
            {currentPage !== 'onboarding' && currentPage !== 'admin-dashboard' && currentPage !== 'admin-login' && (
              <Navbar 
                currentPage={currentPage} 
                onNavigate={handleNavigate} 
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
            )}
            <main className={currentPage === 'admin-dashboard' || currentPage === 'admin-login' ? '' : 'pt-16'}>
              {renderPage()}
            </main>
            {isAuthenticated && currentPage !== 'onboarding' && currentPage !== 'admin-dashboard' && currentPage !== 'admin-login' && (
              <RoleSwitcher 
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                currentPage={currentPage}
                mobileOnly={true}
              />
            )}
            {currentPage !== 'onboarding' && currentPage !== 'admin-dashboard' && currentPage !== 'admin-login' && <Footer />}
          </div>
          
          {/* Notification Dev Tools */}
          <NotificationDevTools />
          <DevModeToggle />
        </div>
        </NotificationServiceProvider>
      </ToastProvider>
    </ActivityLogProvider>
  );
 }

export default App;