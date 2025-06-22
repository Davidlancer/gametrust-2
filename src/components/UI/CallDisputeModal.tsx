import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

interface CallDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CallDisputeModal: React.FC<CallDisputeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl w-full max-w-md p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Call Dispute</h2>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Are you sure you want to raise a dispute for this transaction? This action will:
                </p>
                <ul className="text-sm text-gray-400 space-y-2 ml-4">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Freeze the escrow funds</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Notify our admin team for review</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Require evidence and documentation</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border border-red-500/50"
                >
                  Raise Dispute
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CallDisputeModal;