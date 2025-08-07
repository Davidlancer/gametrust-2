import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import Button from './Button';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  amount,
  autoClose = true,
  autoCloseDelay = 4000
}) => {
  const [countdown, setCountdown] = useState(autoCloseDelay / 1000);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Trigger animation after a brief delay
      setTimeout(() => setIsVisible(true), 50);
      
      if (autoClose) {
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              handleClose();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => {
          clearInterval(countdownInterval);
          document.body.style.overflow = 'unset';
        };
      }
    } else {
      document.body.style.overflow = 'unset';
      setIsVisible(false);
      setCountdown(autoCloseDelay / 1000);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200); // Wait for fade out animation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop with blur */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className={`relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-md transform transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Content */}
          <div className="p-8 text-center">
            {/* Success Icon with animation */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="h-8 w-8 text-white animate-bounce" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Payment Held in Escrow
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              The payment has been successfully secured. You'll be notified once delivery is confirmed.
            </p>
            
            {/* Amount display (if provided) */}
            {amount && (
              <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Amount Secured</p>
                <p className="text-xl font-semibold text-green-400">
                  ₦{amount.toLocaleString()}
                </p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0"
              >
                {autoClose ? `Close (${countdown}s)` : 'Okay'}
              </Button>
              
              {autoClose && (
                <p className="text-xs text-gray-500">
                  This modal will close automatically in {countdown} seconds
                </p>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;