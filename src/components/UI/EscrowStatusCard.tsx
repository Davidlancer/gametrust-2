import React from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface EscrowStatusCardProps {
  status: 'in_escrow' | 'released' | 'disputed' | 'refunded';
  amount?: number;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const EscrowStatusCard: React.FC<EscrowStatusCardProps> = ({ 
  status, 
  amount, 
  className = '', 
  showIcon = true, 
  size = 'md' 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_escrow':
        return {
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/30',
          icon: ClockIcon,
          label: 'In Escrow'
        };
      case 'released':
        return {
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          icon: CheckCircleIcon,
          label: 'Released'
        };
      case 'disputed':
        return {
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          icon: ExclamationTriangleIcon,
          label: 'Disputed'
        };
      case 'refunded':
        return {
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30',
          icon: ArrowPathIcon,
          label: 'Refunded'
        };
      default:
        return {
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/30',
          icon: ClockIcon,
          label: 'Unknown'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'w-3 h-3',
          text: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-3 text-base',
          icon: 'w-5 h-5',
          text: 'text-base'
        };
      default: // md
        return {
          container: 'px-3 py-2 text-sm',
          icon: 'w-4 h-4',
          text: 'text-sm'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center space-x-2 rounded-lg border font-semibold
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses.container}
        ${className}
      `}
    >
      {showIcon && (
        <Icon className={`${sizeClasses.icon} ${config.textColor}`} />
      )}
      <span className={sizeClasses.text}>
        {config.label}
        {amount && (
          <span className="ml-1 font-bold">
            (₦{amount.toLocaleString()})
          </span>
        )}
      </span>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <span className="ml-2 px-1 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
          SIM
        </span>
      )}
    </motion.div>
  );
};

export default EscrowStatusCard;