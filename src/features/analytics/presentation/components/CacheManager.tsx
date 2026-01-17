import * as React from 'react';
import { useAnalyticsDI } from '../../application/services/AnalyticsServiceDI';
import { styles } from './CacheManager.styles.ts';

interface CacheManagerProps {
  userId: string;
  className?: string;
}

interface CacheEntry {
  key: string;
  type: 'memory' | 'redis' | 'database';
  size: number;
  ttl: number;
  hits: number;
  misses: number;
  lastAccessed: Date;
  status: 'active' | 'expired' | 'evicted';
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionRate: number;
  avgResponseTime: number;
  memoryUsage: number;
}

export const CacheManager: React.FC<CacheManagerProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { metrics, trackEvent } = useAnalyticsDI(userId);
  const [selectedCache, setSelectedCache] = React.useState<'memory' | 'redis' | 'database'>('memory');
  const [isManaging, setIsManaging] = React.useState(false);

  // Sample cache data
  const [cacheStats, setCacheStats] = React.useState<Record<string, CacheStats>>({
    memory: {
      totalEntries: 1247,
      totalSize: 45.8,
      hitRate: 94.2,
      missRate: 5.8,
      evictionRate: 2.1,
      avgResponseTime: 0.8,
      memoryUsage: 68
    },
    redis: {
      totalEntries: 3421,
      totalSize: 128.5,
      hitRate: 89.7,
      missRate: 10.3,
      evictionRate: 1.8,
      avgResponseTime: 2.3,
      memoryUsage: 42
    },
    database: {
      totalEntries: 892,
      totalSize: 234.7,
      hitRate: 76.4,
      missRate: 23.6,
      evictionRate: 0.5,
      avgResponseTime: 12.5,
      memoryUsage: 15
    }
  });

  const [cacheEntries, setCacheEntries] = React.useState<CacheEntry[]>([
    {
      key: 'user:123:profile',
      type: 'memory',
      size: 2.4,
      ttl: 3600,
      hits: 145,
      misses: 3,
      lastAccessed: new Date(Date.now() - 5 * 60 * 1000),
      status: 'active'
    },
    {
      key: 'analytics:daily:2024-01-15',
      type: 'redis',
      size: 8.7,
      ttl: 86400,
      hits: 89,
      misses: 1,
      lastAccessed: new Date(Date.now() - 15 * 60 * 1000),
      status: 'active'
    },
    {
      key: 'content:article:456',
      type: 'database',
      size: 15.2,
      ttl: 7200,
      hits: 234,
      misses: 12,
      lastAccessed: new Date(Date.now() - 30 * 60 * 1000),
      status: 'active'
    },
    {
      key: 'search:results:query123',
      type: 'memory',
      size: 1.8,
      ttl: 1800,
      hits: 67,
      misses: 8,
      lastAccessed: new Date(Date.now() - 45 * 60 * 1000),
      status: 'expired'
    }
  ]);

  const [cachePolicies, setCachePolicies] = React.useState([
    {
      name: 'User Profile Cache',
      type: 'memory',
      ttl: 3600,
      maxSize: 100,
      evictionPolicy: 'LRU',
      enabled: true
    },
    {
      name: 'Analytics Data Cache',
      type: 'redis',
      ttl: 86400,
      maxSize: 1000,
      evictionPolicy: 'LFU',
      enabled: true
    },
    {
      name: 'Content Cache',
      type: 'database',
      ttl: 7200,
      maxSize: 500,
      evictionPolicy: 'TTL',
      enabled: true
    }
  ]);

  // Simulate real-time updates
  React.useEffect(() => {
    if (!isManaging) return;

    const interval = setInterval(() => {
      setCacheStats(prev => Object.entries(prev).reduce((acc, [key, stats]) => ({
        ...acc,
        [key]: {
          ...stats,
          hitRate: Math.max(0, Math.min(100, stats.hitRate + (Math.random() - 0.5) * 2)),
          memoryUsage: Math.max(0, Math.min(100, stats.memoryUsage + (Math.random() - 0.5) * 5))
        }
      }), {}));
    }, 3000);

    return () => clearInterval(interval);
  }, [isManaging]);

  const handleClearCache = (cacheType: string) => {
    console.log(`Clearing ${cacheType} cache`);
    // In real implementation, this would clear the cache
  };

  const handleInvalidateKey = (key: string) => {
    console.log(`Invalidating cache key: ${key}`);
    // In real implementation, this would invalidate the specific key
  };

  const handleUpdatePolicy = (policyIndex: number, updates: any) => {
    setCachePolicies(prev => prev.map((policy, index) => 
      index === policyIndex ? { ...policy, ...updates } : policy
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'expired': return '#ffc107';
      case 'evicted': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPerformanceColor = (value: number, type: 'hitRate' | 'responseTime' | 'memory') => {
    if (type === 'hitRate') {
      if (value >= 90) return '#28a745';
      if (value >= 75) return '#ffc107';
      return '#dc3545';
    }
    if (type === 'responseTime') {
      if (value <= 1) return '#28a745';
      if (value <= 5) return '#ffc107';
      return '#dc3545';
    }
    if (type === 'memory') {
      if (value <= 70) return '#28a745';
      if (value <= 85) return '#ffc107';
      return '#dc3545';
    }
    return '#6c757d';
  };

  const formatSize = (size: number) => {
    if (size < 1) return `${(size * 1024).toFixed(0)} KB`;
    return `${size.toFixed(1)} MB`;
  };

  const currentStats = cacheStats[selectedCache];

  return (
    <div className={`cache-manager ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Cache Management</h2>
          <span style={styles.subtitle}>
            Multi-level caching strategies and optimization
          </span>
        </div>
        <div style={styles.headerRight}>
          <button
            style={{
              ...styles.toggleButton,
              ...(isManaging ? styles.toggleButtonActive : {})
            }}
            onClick={() => setIsManaging(!isManaging)}
          >
            {isManaging ? '🔧 Managing' : '📊 View Only'}
          </button>
        </div>
      </div>

      {/* Cache Type Selection */}
      <div style={styles.cacheSelection}>
        <div style={styles.cacheTabs}>
          {(['memory', 'redis', 'database'] as const).map(cacheType => (
            <button
              key={cacheType}
              style={{
                ...styles.cacheTab,
                ...(selectedCache === cacheType ? styles.cacheTabActive : {})
              }}
              onClick={() => setSelectedCache(cacheType)}
            >
              {cacheType === 'memory' && '💾 Memory Cache'}
              {cacheType === 'redis' && '🔴 Redis Cache'}
              {cacheType === 'database' && '🗄️ Database Cache'}
            </button>
          ))}
        </div>
      </div>

      {/* Cache Statistics */}
      <div style={styles.statsSection}>
        <h3 style={styles.sectionTitle}>{selectedCache.charAt(0).toUpperCase() + selectedCache.slice(1)} Cache Statistics</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Total Entries</span>
              <span style={styles.statIcon}>📊</span>
            </div>
            <div style={styles.statValue}>{currentStats.totalEntries.toLocaleString()}</div>
            <div style={styles.statDescription}>Items in cache</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Cache Size</span>
              <span style={styles.statIcon}>💾</span>
            </div>
            <div style={styles.statValue}>{formatSize(currentStats.totalSize)}</div>
            <div style={styles.statDescription}>Total memory used</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Hit Rate</span>
              <span style={styles.statIcon}>🎯</span>
            </div>
            <div style={{ 
              ...styles.statValue,
              color: getPerformanceColor(currentStats.hitRate, 'hitRate')
            }}>
              {currentStats.hitRate.toFixed(1)}%
            </div>
            <div style={styles.statDescription}>Cache effectiveness</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Response Time</span>
              <span style={styles.statIcon}>⚡</span>
            </div>
            <div style={{ 
              ...styles.statValue,
              color: getPerformanceColor(currentStats.avgResponseTime, 'responseTime')
            }}>
              {currentStats.avgResponseTime.toFixed(1)}ms
            </div>
            <div style={styles.statDescription}>Average response time</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Memory Usage</span>
              <span style={styles.statIcon}>📈</span>
            </div>
            <div style={{ 
              ...styles.statValue,
              color: getPerformanceColor(currentStats.memoryUsage, 'memory')
            }}>
              {currentStats.memoryUsage.toFixed(1)}%
            </div>
            <div style={styles.statDescription}>Memory utilization</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Eviction Rate</span>
              <span style={styles.statIcon}>🗑️</span>
            </div>
            <div style={styles.statValue}>{currentStats.evictionRate.toFixed(1)}%</div>
            <div style={styles.statDescription}>Items evicted</div>
          </div>
        </div>
      </div>

      {/* Cache Entries */}
      <div style={styles.entriesSection}>
        <h3 style={styles.sectionTitle}>Cache Entries</h3>
        <div style={styles.entriesTable}>
          <div style={styles.tableHeader}>
            <div style={styles.tableCell}>Key</div>
            <div style={styles.tableCell}>Type</div>
            <div style={styles.tableCell}>Size</div>
            <div style={styles.tableCell}>Hits/Misses</div>
            <div style={styles.tableCell}>Status</div>
            <div style={styles.tableCell}>Actions</div>
          </div>
          {cacheEntries
            .filter(entry => selectedCache === 'memory' || selectedCache === 'redis' || selectedCache === 'database' ? entry.type === selectedCache : true)
            .map(entry => (
            <div key={entry.key} style={styles.tableRow}>
              <div style={styles.tableCell}>
                <div style={styles.cacheKey}>{entry.key}</div>
              </div>
              <div style={styles.tableCell}>
                <span style={styles.cacheType}>
                  {entry.type === 'memory' && '💾'}
                  {entry.type === 'redis' && '🔴'}
                  {entry.type === 'database' && '🗄️'}
                  {entry.type}
                </span>
              </div>
              <div style={styles.tableCell}>{formatSize(entry.size)}</div>
              <div style={styles.tableCell}>
                <div style={styles.hitMissRatio}>
                  <span style={styles.hits}>{entry.hits}</span>
                  <span style={styles.separator}>/</span>
                  <span style={styles.misses}>{entry.misses}</span>
                </div>
              </div>
              <div style={styles.tableCell}>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(entry.status)
                }}>
                  {entry.status}
                </span>
              </div>
              <div style={styles.tableCell}>
                <button
                  style={styles.actionButton}
                  onClick={() => handleInvalidateKey(entry.key)}
                >
                  🗑️ Invalidate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cache Policies */}
      <div style={styles.policiesSection}>
        <h3 style={styles.sectionTitle}>Cache Policies</h3>
        <div style={styles.policiesGrid}>
          {cachePolicies.map((policy, index) => (
            <div key={index} style={styles.policyCard}>
              <div style={styles.policyHeader}>
                <div style={styles.policyName}>{policy.name}</div>
                <div style={styles.policyType}>
                  {policy.type === 'memory' && '💾'}
                  {policy.type === 'redis' && '🔴'}
                  {policy.type === 'database' && '🗄️'}
                  {policy.type}
                </div>
              </div>
              <div style={styles.policySettings}>
                <div style={styles.setting}>
                  <label style={styles.settingLabel}>TTL</label>
                  <input
                    type="number"
                    value={policy.ttl}
                    onChange={(e) => handleUpdatePolicy(index, { ttl: parseInt(e.target.value) })}
                    style={styles.settingInput}
                    disabled={!isManaging}
                  />
                  <span style={styles.settingUnit}>seconds</span>
                </div>
                <div style={styles.setting}>
                  <label style={styles.settingLabel}>Max Size</label>
                  <input
                    type="number"
                    value={policy.maxSize}
                    onChange={(e) => handleUpdatePolicy(index, { maxSize: parseInt(e.target.value) })}
                    style={styles.settingInput}
                    disabled={!isManaging}
                  />
                  <span style={styles.settingUnit}>entries</span>
                </div>
                <div style={styles.setting}>
                  <label style={styles.settingLabel}>Eviction</label>
                  <select
                    value={policy.evictionPolicy}
                    onChange={(e) => handleUpdatePolicy(index, { evictionPolicy: e.target.value })}
                    style={styles.settingSelect}
                    disabled={!isManaging}
                  >
                    <option value="LRU">LRU</option>
                    <option value="LFU">LFU</option>
                    <option value="TTL">TTL</option>
                    <option value="FIFO">FIFO</option>
                  </select>
                </div>
                <div style={styles.setting}>
                  <label style={styles.settingLabel}>Enabled</label>
                  <input
                    type="checkbox"
                    checked={policy.enabled}
                    onChange={(e) => handleUpdatePolicy(index, { enabled: e.target.checked })}
                    style={styles.settingCheckbox}
                    disabled={!isManaging}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cache Actions */}
      <div style={styles.actionsSection}>
        <h3 style={styles.sectionTitle}>Cache Actions</h3>
        <div style={styles.actionsGrid}>
          <button
            style={styles.actionCard}
            onClick={() => handleClearCache(selectedCache)}
          >
            <div style={styles.actionIcon}>🗑️</div>
            <div style={styles.actionTitle}>Clear {selectedCache} Cache</div>
            <div style={styles.actionDescription}>Remove all entries</div>
          </button>

          <button
            style={styles.actionCard}
            onClick={() => console.log('Warming up cache...')}
          >
            <div style={styles.actionIcon}>🔥</div>
            <div style={styles.actionTitle}>Warm Up Cache</div>
            <div style={styles.actionDescription}>Preload common data</div>
          </button>

          <button
            style={styles.actionCard}
            onClick={() => console.log('Optimizing cache...')}
          >
            <div style={styles.actionIcon}>⚡</div>
            <div style={styles.actionTitle}>Optimize Cache</div>
            <div style={styles.actionDescription}>Improve performance</div>
          </button>

          <button
            style={styles.actionCard}
            onClick={() => console.log('Exporting cache stats...')}
          >
            <div style={styles.actionIcon}>📊</div>
            <div style={styles.actionTitle}>Export Statistics</div>
            <div style={styles.actionDescription}>Download cache metrics</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CacheManager;
