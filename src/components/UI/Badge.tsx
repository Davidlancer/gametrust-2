import React from 'react';
import { Shield, Link, AlertTriangle } from 'lucide-react';

interface BadgeProps {
  type: 'verified' | 'escrow' | 'linked' | 'unlinked' | 'warning';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ type, text, size = 'md' }) => {
  const getStyles = () => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';
    
    const sizeStyles = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    const typeStyles = {
      verified: 'bg-green-500/20 text-green-400 border border-green-500/30',
      escrow: 'bg-green-500/20 text-green-400 border border-green-500/30',
      linked: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      unlinked: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
      warning: 'bg-red-500/20 text-red-400 border border-red-500/30'
    };

    return `${baseStyles} ${sizeStyles[size]} ${typeStyles[type]}`;
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
    
    switch (type) {
      case 'verified':
        return <Shield className={`${iconSize} mr-1`} />;
      case 'escrow':
        return <Shield className={`${iconSize} mr-1`} />;
      case 'linked':
        return <Link className={`${iconSize} mr-1`} />;
      case 'unlinked':
        return <Link className={`${iconSize} mr-1 opacity-50`} />;
      case 'warning':
        return <AlertTriangle className={`${iconSize} mr-1`} />;
      default:
        return null;
    }
  };

  const getText = () => {
    if (text) return text;
    
    switch (type) {
      case 'verified':
        return 'Verified';
      case 'escrow':
        return 'Escrow';
      case 'linked':
        return 'Linked';
      case 'unlinked':
        return 'Unlinkable';
      case 'warning':
        return 'Warning';
      default:
        return '';
    }
  };

  return (
    <span className={getStyles()}>
      {getIcon()}
      {getText()}
    </span>
  );
};

export default Badge;