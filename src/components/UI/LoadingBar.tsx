import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../../styles/nprogress-custom.css';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.1,
  trickleSpeed: 200
});

interface LoadingBarProps {
  isLoading: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }

    return () => {
      NProgress.done();
    };
  }, [isLoading]);

  return null;
};

export default LoadingBar;