import React, { useState } from 'react';
import PendingOrdersModal from './PendingOrdersModal';
import Button from '../UI/Button';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const PendingOrdersDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Pending Orders Demo</h2>
        <p className="text-gray-400 mb-6">
          Click the button below to open the Pending Orders modal and see all your active escrow-based orders.
        </p>
        
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="w-full bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] hover:from-[#00FFB2]/80 hover:to-[#00A8E8]/80"
        >
          <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
          Open Pending Orders
        </Button>
      </div>

      <PendingOrdersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PendingOrdersDemo;