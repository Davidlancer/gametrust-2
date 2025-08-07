import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  message: string;
}

const useLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: 'Loading...'
  });

  const showLoading = useCallback((message: string = 'Loading...') => {
    setLoadingState({ isLoading: true, message });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const withLoading = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    message: string = 'Loading...'
  ): Promise<T> => {
    showLoading(message);
    try {
      const result = await asyncOperation();
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return {
    isLoading: loadingState.isLoading,
    message: loadingState.message,
    showLoading,
    hideLoading,
    withLoading
  };
};

export default useLoading;