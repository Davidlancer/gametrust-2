import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onCardClick?: () => void;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'md',
  onCardClick,
  style
}) => {
  const baseStyles = 'bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200';
  const hoverStyles = hover ? 'hover:shadow-xl hover:border-gray-600 hover:-translate-y-1' : '';
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const classes = `${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`;

  return (
    <div className={classes} onClick={onCardClick} style={style}>
      {children}
    </div>
  );
};

export default Card;