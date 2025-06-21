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

type Page = 'home' | 'marketplace' | 'sell' | 'auth' | 'platforms' | 'listing-details' | 'seller-profile' | 'seller-dashboard' | 'buyer-dashboard' | 'onboarding';

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
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleNavigate = (page: string, id?: string) => {
    if (page === 'listing-details' && id) {
      setSelectedListingId(id);
    }
    if (page === 'seller-profile' && id) {
      setSelectedSellerId(id);
    }
    setCurrentPage(page as Page);
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    setUserOnboarded(true);
    // Store in localStorage for persistence
    localStorage.setItem('userOnboarded', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(data));
  };

  // Check authentication and onboarding status on app load
  useEffect(() => {
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const userData = JSON.parse(mockUser);
      if (userData.isAuthenticated) {
        setIsAuthenticated(true);
      }
    }
    
    const onboarded = localStorage.getItem('userOnboarded');
    const storedData = localStorage.getItem('onboardingData');
    if (onboarded === 'true' && storedData) {
      setUserOnboarded(true);
      setOnboardingData(JSON.parse(storedData));
    }
  }, []);

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
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  // Redirect to auth if not authenticated (except for public pages)
  const publicPages = ['home', 'marketplace', 'platforms', 'auth'];
  if (!isAuthenticated && !publicPages.includes(currentPage)) {
    setCurrentPage('auth');
  }

  // Show onboarding for authenticated users who haven't completed it
  const shouldShowOnboarding = isAuthenticated && !userOnboarded && currentPage !== 'auth' && currentPage !== 'onboarding';

  if (shouldShowOnboarding) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Onboarding onComplete={handleOnboardingComplete} onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {currentPage !== 'onboarding' && (
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} />
      )}
      <main>
        {renderPage()}
      </main>
      {currentPage !== 'onboarding' && <Footer />}
    </div>
  );
}

export default App;