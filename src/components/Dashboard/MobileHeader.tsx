import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface MobileHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  setSidebarOpen
}) => {
  return (
    <div className="lg:hidden flex items-center justify-between h-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50 flex-shrink-0 relative z-30 pt-12 shadow-lg">
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all duration-300 hover:scale-105"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-black font-bold text-sm">GT</span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          GameTrust
        </span>
      </div>
      

    </div>
  );
};

export default MobileHeader;