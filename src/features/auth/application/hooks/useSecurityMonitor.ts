import { useState, useEffect } from 'react';
import { EnterpriseSecurityService } from '../../../../core/auth/security/EnterpriseSecurityService';

interface SecurityData {
  blockedIPs: string[];
  rateLimitEntries: number;
  totalBlockedIPs: number;
}

export const useSecurityMonitor = (refreshInterval: number = 30000) => {
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const securityService = new EnterpriseSecurityService();

  const fetchSecurityData = () => {
    try {
      const data = securityService.getSecurityMonitoringData();
      setSecurityData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security data');
    } finally {
      setLoading(false);
    }
  };

  const unblockIP = (ipAddress: string) => {
    try {
      securityService.unblockIP(ipAddress);
      fetchSecurityData(); // Refresh data after unblocking
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unblock IP');
    }
  };

  const getBlockedIPs = () => {
    return securityService.getBlockedIPs();
  };

  useEffect(() => {
    fetchSecurityData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchSecurityData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return {
    securityData,
    loading,
    error,
    refetch: fetchSecurityData,
    unblockIP,
    getBlockedIPs
  };
};
