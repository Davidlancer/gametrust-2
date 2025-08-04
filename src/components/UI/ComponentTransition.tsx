import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComponentTransitionProps {
  children: React.ReactNode;
  show: boolean;
  type?: 'fade' | 'slide' | 'scale' | 'slideUp';
  className?: string;
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
};

const ComponentTransition: React.FC<ComponentTransitionProps> = ({ 
  children, 
  show, 
  type = 'fade',
  className = ''
}) => {
  const variants = transitionVariants[type];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComponentTransition;