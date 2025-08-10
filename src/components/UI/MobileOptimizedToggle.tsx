import React from 'react';
import { motion } from 'framer-motion';

interface MobileOptimizedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

const MobileOptimizedToggle: React.FC<MobileOptimizedToggleProps> = ({
  checked,
  onChange,
  size = 'md',
  disabled = false,
  label,
  description,
  className = ''
}) => {
  const sizeConfig = {
    sm: {
      container: 'h-5 w-9',
      thumb: 'h-3 w-3',
      translate: checked ? 'translate-x-4' : 'translate-x-1'
    },
    md: {
      container: 'h-7 w-12', // Increased from h-6 w-11 for better mobile touch
      thumb: 'h-5 w-5', // Increased from h-4 w-4
      translate: checked ? 'translate-x-5' : 'translate-x-1'
    },
    lg: {
      container: 'h-8 w-14',
      thumb: 'h-6 w-6',
      translate: checked ? 'translate-x-6' : 'translate-x-1'
    }
  };

  const config = sizeConfig[size];

  const toggleButton = (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex ${config.container} items-center rounded-full 
        transition-colors duration-200 focus:outline-none 
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${checked 
          ? 'bg-blue-500 focus:ring-blue-500' 
          : 'bg-gray-600 focus:ring-gray-500'
        }
        ${className}
        // Enhanced mobile touch target
        min-h-[44px] min-w-[44px] flex items-center justify-center
        md:min-h-0 md:min-w-0
      `}
      disabled={disabled}
      aria-checked={checked}
      role="switch"
      aria-label={label || 'Toggle switch'}
    >
      <motion.span
        animate={{ 
          x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 24) : 4
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`
          inline-block ${config.thumb} transform rounded-full bg-white 
          shadow-lg transition-transform
        `}
      />
    </motion.button>
  );

  if (label || description) {
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {label && (
            <label className="text-sm font-medium text-white cursor-pointer"
                   onClick={() => !disabled && onChange(!checked)}>
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {toggleButton}
        </div>
      </div>
    );
  }

  return toggleButton;
};

export default MobileOptimizedToggle;