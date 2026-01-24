import React from 'react';
import { useSecurityMonitor } from '@auth/application/hooks/useSecurityMonitor';

export const SecurityMonitor: React.FC = () => {
  const { securityData, loading, error, unblockIP } = useSecurityMonitor();

  if (loading) {
    return <div className="security-monitor loading">Loading security data...</div>;
  }

  if (error) {
    return <div className="security-monitor error">Error: {error}</div>;
  }

  if (!securityData) {
    return <div className="security-monitor error">No security data available</div>;
  }

  return (
    <div className="security-monitor">
      <h3>Security Monitoring Dashboard</h3>
      
      <div className="security-stats">
        <div className="stat-card">
          <h4>Blocked IPs</h4>
          <span className="stat-value">{securityData.totalBlockedIPs}</span>
        </div>
        
        <div className="stat-card">
          <h4>Rate Limit Entries</h4>
          <span className="stat-value">{securityData.rateLimitEntries}</span>
        </div>
      </div>

      {securityData.blockedIPs.length > 0 && (
        <div className="blocked-ips">
          <h4>Currently Blocked IPs:</h4>
          <ul>
            {securityData.blockedIPs.map((ip, index) => (
              <li key={index} className="blocked-ip">
                {ip}
                <button 
                  onClick={() => unblockIP(ip)}
                  className="unblock-btn"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {securityData.blockedIPs.length === 0 && (
        <div className="no-blocked-ips">
          <p>No IPs are currently blocked</p>
        </div>
      )}
    </div>
  );
};
