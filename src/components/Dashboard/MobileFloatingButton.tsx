import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { DashboardPage } from '../../types/dashboard';

interface MobileFloatingButtonProps {
  handlePageChange: (page: DashboardPage) => void;
}

const MobileFloatingButton: React.FC<MobileFloatingButtonProps> = ({ handlePageChange }) => {
  return (
    <div className="lg:hidden fixed bottom-8 right-8 z-30">
      <button
        onClick={() => handlePageChange('create')}
        className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-110 transition-all duration-300 hover:rotate-90 ring-4 ring-indigo-500/20 hover:ring-indigo-500/40"
      >
        <PlusIcon className="w-7 h-7 text-white font-bold" />
      </button>
    </div>
  );
};

export default MobileFloatingButton;