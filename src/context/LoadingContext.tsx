import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import LoadingScreen from '../components/UI/LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  message: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  withLoading: (asyncOperation: () => Promise<unknown>, message?: string) => Promise<unknown>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const showLoading = useCallback((loadingMessage: string = 'Loading...') => {
    setMessage(loadingMessage);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async (
    asyncOperation: () => Promise<unknown>,
    loadingMessage: string = 'Loading...'
  ): Promise<unknown> => {
    showLoading(loadingMessage);
    try {
      const result = await asyncOperation();
      return result;
    } finally {
      // Add a small delay to prevent flashing
      setTimeout(hideLoading, 300);
    }
  }, [showLoading, hideLoading]);

  const contextValue: LoadingContextType = {
    isLoading,
    message,
    showLoading,
    hideLoading,
    withLoading
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {isLoading && <LoadingScreen message={message} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;