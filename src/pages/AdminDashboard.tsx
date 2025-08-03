import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminTopbar from '../components/Admin/AdminTopbar';
import DashboardHome from '../components/Admin/DashboardHome';
import UsersPage from '../components/Admin/UsersPage';
import ListingsPage from '../components/Admin/ListingsPage';
import DisputesPage from '../components/Admin/DisputesPage';
import VerificationsPage from '../components/Admin/VerificationsPage';
import RevenuePage from '../components/Admin/RevenuePage';
import DisputesPanel from '../components/Admin/DisputesPanel';
import VerificationsPanel from '../components/Admin/VerificationsPanel';
import ManageUsersPanel from '../components/Admin/ManageUsersPanel';
import RevenueReportPanel from '../components/Admin/RevenueReportPanel';

type AdminPage = 'dashboard' | 'users' | 'listings' | 'disputes' | 'verifications' | 'revenue';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const handleLogout = () => {
    localStorage.removeItem('current_user');
    onNavigate('admin-login');
  };
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [activePanel, setActivePanel] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderCurrentPage = () => {
    // If a panel is active, render the panel instead
    if (activePanel) {
      switch (activePanel) {
        case 'disputes':
          return <DisputesPanel onClose={() => setActivePanel('')} />;
        case 'verifications':
          return <VerificationsPanel onClose={() => setActivePanel('')} />;
        case 'users':
          return <ManageUsersPanel onClose={() => setActivePanel('')} />;
        case 'revenue':
          return <RevenueReportPanel onClose={() => setActivePanel('')} />;
        default:
          return <DashboardHome setActivePanel={setActivePanel} />;
      }
    }
    
    // Otherwise render the current page
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome setActivePanel={setActivePanel} />;
      case 'users':
        return <UsersPage />;
      case 'listings':
        return <ListingsPage />;
      case 'disputes':
        return <DisputesPage />;
      case 'verifications':
        return <VerificationsPage />;
      case 'revenue':
        return <RevenuePage />;
      default:
        return <DashboardHome setActivePanel={setActivePanel} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white mt-0 pt-0 admin-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && !isDesktop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isDesktop={isDesktop}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`flex-1 ${isDesktop ? 'lg:ml-64 xl:ml-72' : ''}`}>
        {/* Top Navigation */}
        <AdminTopbar
          setSidebarOpen={setSidebarOpen}
          isDesktop={isDesktop}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="pt-0 mt-0 p-4 lg:p-6 xl:p-8 overflow-hidden">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentPage()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;