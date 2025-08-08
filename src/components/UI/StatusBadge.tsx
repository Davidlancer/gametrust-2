import React from 'react';
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const baseStyle = "text-xs px-2 py-1 rounded-md font-medium flex items-center space-x-1";
  
  const variants: Record<string, { style: string; icon: React.ReactNode }> = {
    active: {
      style: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      icon: <ClockIcon className="w-3 h-3" />
    },
    resolved: {
      style: "bg-green-500/20 text-green-400 border border-green-500/30",
      icon: <CheckCircleIcon className="w-3 h-3" />
    },
    escalated: {
      style: "bg-red-500/20 text-red-400 border border-red-500/30",
      icon: <ExclamationTriangleIcon className="w-3 h-3" />
    },
    closed: {
      style: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
      icon: <XCircleIcon className="w-3 h-3" />
    }
  };

  const variant = variants[status.toLowerCase()] || variants.active;

  return (
    <span className={`${baseStyle} ${variant.style}`}>
      {variant.icon}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;