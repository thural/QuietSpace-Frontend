import React from 'react';
import { useTokenRefresh } from '@/shared/hooks/useTokenRefresh';

/**
 * Example component demonstrating the use of createTokenRefreshManager
 * 
 * This component shows how to use the factory-based token refresh manager
 * for scenarios where you need more control over token refresh lifecycle
 * or want to avoid the static class approach.
 */
export const TokenRefreshExample: React.FC = () => {
  const {
    startTokenRefresh,
    stopTokenRefresh,
    isActive
  } = useTokenRefresh({
    autoStart: true,
    refreshInterval: 300000, // 5 minutes for demo purposes
    onSuccess: (data) => {
      console.log('Token refreshed successfully:', data);
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
    }
  });

  const handleManualStart = async () => {
    await startTokenRefresh();
  };

  const handleManualStop = () => {
    stopTokenRefresh();
  };

  return (
    <div className="token-refresh-example">
      <h3>Token Refresh Manager Example</h3>
      
      <div className="status">
        <p>Refresh Status: {isActive ? 'Active' : 'Inactive'}</p>
      </div>

      <div className="controls">
        <button 
          onClick={handleManualStart} 
          disabled={isActive}
        >
          Start Token Refresh
        </button>
        
        <button 
          onClick={handleManualStop} 
          disabled={!isActive}
        >
          Stop Token Refresh
        </button>
      </div>

      <div className="info">
        <p>This example uses the createTokenRefreshManager utility.</p>
        <p>Check the console for refresh activity logs.</p>
      </div>
    </div>
  );
};

export default TokenRefreshExample;
