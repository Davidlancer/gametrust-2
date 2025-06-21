import React from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';

const TestingBanner: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 flex-shrink-0 bg-gradient-to-r from-yellow-600/95 to-orange-600/95 backdrop-blur-md border-b border-yellow-400/50 z-50 shadow-lg">
      <div className="flex items-center justify-center py-3 px-6">
        <BeakerIcon className="h-5 w-5 text-yellow-100 mr-3" />
        <span className="text-yellow-100 text-sm font-semibold tracking-wide">
          Testing Mode Active - Mock Data Only
        </span>
      </div>
    </div>
  );
};

export default TestingBanner;