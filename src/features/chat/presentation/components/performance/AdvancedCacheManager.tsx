/**
 * Advanced Cache Manager
 * 
 * This component provides sophisticated caching strategies including multi-tier caching,
 * intelligent cache warming, and advanced cache invalidation patterns.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiDatabase, 
    FiHardDrive, 
    FiWifi, 
    FiRefreshCw, 
    FiTrash2, 
    FiBarChart2,
    FiActivity,
    FiZap,
    FiSettings,
    FiTrendingUp,
    FiClock,
    FiDownload,
    FiUpload
} from 'react-icons/fi';

export interface CacheConfig {
    enableMultiTier: boolean;
    enableIntelligentWarming: boolean;
    enableAdaptiveSizing: boolean;
    enableCompression: boolean;
    enableEncryption: boolean;
    defaultTTL: number;
    maxMemorySize: number;
    maxDiskSize: number;
    compressionThreshold: number;
    warmingStrategies: WarmingStrategy[];
}

export interface WarmingStrategy {
    id: string;
    name: string;
    description: string;
    priority: number;
    conditions: WarmingCondition[];
    actions: WarmingAction[];
    enabled: boolean;
}

export interface WarmingCondition {
    type: 'time_based' | 'user_activity' | 'data_access' | 'system_load';
    parameters: Record<string, any>;
}

export interface WarmingAction {
    type: 'preload_data' | 'prefetch_related' | 'cache_prediction' | 'background_sync';
    target: string;
    parameters: Record<string, any>;
}

export interface CacheTier {
    name: string;
    type: 'memory' | 'disk' | 'network' | 'cdn';
    size: number;
    maxSize: number;
    hitRate: number;
    accessCount: number;
    evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'random';
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
}

export interface CacheEntry {
    key: string;
    value: any;
    size: number;
    tier: string;
    createdAt: Date;
    lastAccessed: Date;
    ttl: number;
    accessCount: number;
    metadata: Record<string, any>;
    compressed: boolean;
    encrypted: boolean;
}

export interface CacheAnalytics {
    totalHits: number;
    totalMisses: number;
    hitRate: number;
    totalSize: number;
    evictionCount: number;
    compressionRatio: number;
    averageAccessTime: number;
    tierPerformance: Record<string, {
        hits: number;
        misses: number;
        hitRate: number;
        avgAccessTime: number;
    }>;
    hotKeys: Array<{
        key: string;
        accessCount: number;
        lastAccessed: Date;
    }>;
    coldKeys: Array<{
        key: string;
        lastAccessed: Date;
        size: number;
    }>;
}

export interface CacheInvalidationStrategy {
    id: string;
    name: string;
    description: string;
    pattern: string | RegExp;
    strategy: 'immediate' | 'delayed' | 'batched' | 'conditional';
    conditions: InvalidationCondition[];
    actions: InvalidationAction[];
}

export interface InvalidationCondition {
    type: 'time_based' | 'event_based' | 'dependency_based' | 'size_based';
    parameters: Record<string, any>;
}

export interface InvalidationAction {
    type: 'invalidate' | 'refresh' | 'archive' | 'compress';
    target: string;
    parameters: Record<string, any>;
}

interface AdvancedCacheManagerContextType {
    config: CacheConfig;
    tiers: CacheTier[];
    analytics: CacheAnalytics;
    invalidationStrategies: CacheInvalidationStrategy[];
    isWarming: boolean;
    isOptimizing: boolean;
    
    // Actions
    get: (key: string) => Promise<any>;
    set: (key: string, value: any, options?: CacheOptions) => Promise<void>;
    invalidate: (pattern: string | RegExp) => Promise<void>;
    clear: (tier?: string) => Promise<void>;
    warmCache: (strategy?: WarmingStrategy) => Promise<void>;
    optimizeCache: () => Promise<void>;
    getAnalytics: () => CacheAnalytics;
    exportCache: () => Promise<string>;
    importCache: (data: string) => Promise<void>;
    addInvalidationStrategy: (strategy: CacheInvalidationStrategy) => void;
    removeInvalidationStrategy: (id: string) => void;
}

export interface CacheOptions {
    ttl?: number;
    tier?: string;
    compress?: boolean;
    encrypt?: boolean;
    metadata?: Record<string, any>;
}

const AdvancedCacheManagerContext = createContext<AdvancedCacheManagerContextType | null>(null);

// Advanced Cache Manager Provider
interface AdvancedCacheManagerProviderProps {
    children: React.ReactNode;
    config?: Partial<CacheConfig>;
}

export const AdvancedCacheManagerProvider: React.FC<AdvancedCacheManagerProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<CacheConfig>({
        enableMultiTier: true,
        enableIntelligentWarming: true,
        enableAdaptiveSizing: true,
        enableCompression: true,
        enableEncryption: false,
        defaultTTL: 300000, // 5 minutes
        maxMemorySize: 100 * 1024 * 1024, // 100MB
        maxDiskSize: 500 * 1024 * 1024, // 500MB
        compressionThreshold: 1024, // 1KB
        warmingStrategies: [
            {
                id: 'user-based-warming',
                name: 'User-Based Cache Warming',
                description: 'Preloads data based on user behavior patterns',
                priority: 1,
                conditions: [
                    { type: 'user_activity', parameters: { action: 'login', frequency: 'daily' } }
                ],
                actions: [
                    { type: 'preload_data', target: 'user_profile', parameters: { depth: 2 } },
                    { type: 'prefetch_related', target: 'recent_chats', parameters: { limit: 10 } }
                ],
                enabled: true
            },
            {
                id: 'time-based-warming',
                name: 'Time-Based Cache Warming',
                description: 'Preloads data at specific times',
                priority: 2,
                conditions: [
                    { type: 'time_based', parameters: { hour: 9, minute: 0 } } // 9 AM
                ],
                actions: [
                    { type: 'preload_data', target: 'dashboard_data', parameters: {} },
                    { type: 'background_sync', target: 'notifications', parameters: {} }
                ],
                enabled: true
            }
        ],
        ...userConfig
    });

    const [tiers, setTiers] = useState<CacheTier[]>([
        {
            name: 'memory',
            type: 'memory',
            size: 0,
            maxSize: config.maxMemorySize,
            hitRate: 0,
            accessCount: 0,
            evictionPolicy: 'lru',
            compressionEnabled: config.enableCompression,
            encryptionEnabled: config.enableEncryption
        },
        {
            name: 'disk',
            type: 'disk',
            size: 0,
            maxSize: config.maxDiskSize,
            hitRate: 0,
            accessCount: 0,
            evictionPolicy: 'lfu',
            compressionEnabled: config.enableCompression,
            encryptionEnabled: config.enableEncryption
        }
    ]);

    const [analytics, setAnalytics] = useState<CacheAnalytics>({
        totalHits: 0,
        totalMisses: 0,
        hitRate: 0,
        totalSize: 0,
        evictionCount: 0,
        compressionRatio: 0,
        averageAccessTime: 0,
        tierPerformance: {},
        hotKeys: [],
        coldKeys: []
    });

    const [invalidationStrategies, setInvalidationStrategies] = useState<CacheInvalidationStrategy[]>([
        {
            id: 'user-data-invalidation',
            name: 'User Data Invalidation',
            description: 'Invalidates user-related cache entries on profile updates',
            pattern: /^user_*/,
            strategy: 'immediate',
            conditions: [
                { type: 'event_based', parameters: { event: 'user_profile_updated' } }
            ],
            actions: [
                { type: 'invalidate', target: 'user_*', parameters: {} },
                { type: 'refresh', target: 'user_profile', parameters: { priority: 'high' } }
            ]
        },
        {
            id: 'chat-message-invalidation',
            name: 'Chat Message Invalidation',
            description: 'Invalidates chat cache when new messages arrive',
            pattern: /^chat_.*_messages$/,
            strategy: 'conditional',
            conditions: [
                { type: 'event_based', parameters: { event: 'new_message' } }
            ],
            actions: [
                { type: 'refresh', target: 'chat_*_messages', parameters: { incremental: true } }
            ]
        }
    ]);

    const [isWarming, setIsWarming] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const cacheStoreRef = useRef<Map<string, CacheEntry>>(new Map());
    const accessTimesRef = useRef<Map<string, number>>(new Map());

    // Get cache entry
    const get = useCallback(async (key: string): Promise<any> => {
        const startTime = performance.now();
        const entry = cacheStoreRef.current.get(key);
        
        if (!entry) {
            updateAnalytics('miss', 'memory', performance.now() - startTime);
            return null;
        }

        // Check TTL
        if (Date.now() - entry.createdAt.getTime() > entry.ttl) {
            cacheStoreRef.current.delete(key);
            updateAnalytics('miss', 'memory', performance.now() - startTime);
            return null;
        }

        // Update access info
        entry.lastAccessed = new Date();
        entry.accessCount++;
        accessTimesRef.current.set(key, Date.now());

        updateAnalytics('hit', entry.tier, performance.now() - startTime);
        
        return entry.value;
    }, []);

    // Set cache entry
    const set = useCallback(async (key: string, value: any, options: CacheOptions = {}): Promise<void> => {
        const ttl = options.ttl || config.defaultTTL;
        const tierName = options.tier || 'memory';
        const shouldCompress = options.compress !== false && config.enableCompression;
        const shouldEncrypt = options.encrypt || config.enableEncryption;

        let processedValue = value;
        let size = JSON.stringify(value).length;

        // Compression
        if (shouldCompress && size > config.compressionThreshold) {
            // In real implementation, would use actual compression
            processedValue = { _compressed: true, data: processedValue };
            size = Math.floor(size * 0.7); // Simulate 30% compression
        }

        // Encryption
        if (shouldEncrypt) {
            // In real implementation, would use actual encryption
            processedValue = { _encrypted: true, data: processedValue };
        }

        const entry: CacheEntry = {
            key,
            value: processedValue,
            size,
            tier: tierName,
            createdAt: new Date(),
            lastAccessed: new Date(),
            ttl,
            accessCount: 1,
            metadata: options.metadata || {},
            compressed: shouldCompress,
            encrypted: shouldEncrypt
        };

        // Check tier capacity
        const tier = tiers.find(t => t.name === tierName);
        if (tier && tier.size + size > tier.maxSize) {
            await evictFromTier(tierName, size);
        }

        cacheStoreRef.current.set(key, entry);
        accessTimesRef.current.set(key, Date.now());

        updateTiers();
    }, [config, tiers]);

    // Invalidate cache entries
    const invalidate = useCallback(async (pattern: string | RegExp): Promise<void> => {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        const keysToDelete: string[] = [];

        for (const [key] of cacheStoreRef.current) {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => {
            cacheStoreRef.current.delete(key);
            accessTimesRef.current.delete(key);
        });

        console.log(`Invalidated ${keysToDelete.length} cache entries matching pattern:`, pattern);
        updateTiers();
    }, []);

    // Clear cache
    const clear = useCallback(async (tier?: string): Promise<void> => {
        if (tier) {
            const keysToDelete: string[] = [];
            for (const [key, entry] of cacheStoreRef.current) {
                if (entry.tier === tier) {
                    keysToDelete.push(key);
                }
            }
            keysToDelete.forEach(key => {
                cacheStoreRef.current.delete(key);
                accessTimesRef.current.delete(key);
            });
        } else {
            cacheStoreRef.current.clear();
            accessTimesRef.current.clear();
        }

        updateTiers();
        console.log(`Cleared cache${tier ? ` for tier: ${tier}` : ' (all tiers)'}`);
    }, []);

    // Evict from tier
    const evictFromTier = useCallback(async (tierName: string, requiredSize: number): Promise<void> => {
        const tier = tiers.find(t => t.name === tierName);
        if (!tier) return;

        const entries = Array.from(cacheStoreRef.current.entries())
            .filter(([_, entry]) => entry.tier === tierName)
            .sort((a, b) => {
                switch (tier.evictionPolicy) {
                    case 'lru':
                        return a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime();
                    case 'lfu':
                        return a[1].accessCount - b[1].accessCount;
                    case 'fifo':
                        return a[1].createdAt.getTime() - b[1].createdAt.getTime();
                    default:
                        return Math.random() - 0.5;
                }
            });

        let freedSize = 0;
        for (const [key, entry] of entries) {
            cacheStoreRef.current.delete(key);
            accessTimesRef.current.delete(key);
            freedSize += entry.size;
            
            if (freedSize >= requiredSize) break;
        }

        setAnalytics(prev => ({
            ...prev,
            evictionCount: prev.evictionCount + entries.length
        }));
    }, [tiers]);

    // Warm cache
    const warmCache = useCallback(async (strategy?: WarmingStrategy): Promise<void> => {
        if (!config.enableIntelligentWarming || isWarming) return;

        setIsWarming(true);
        try {
            const strategies = strategy ? [strategy] : config.warmingStrategies.filter(s => s.enabled);
            
            for (const warmingStrategy of strategies) {
                console.log(`Executing warming strategy: ${warmingStrategy.name}`);
                
                // Check conditions
                const shouldExecute = warmingStrategy.conditions.every(condition => {
                    switch (condition.type) {
                        case 'time_based':
                            const now = new Date();
                            return now.getHours() === condition.parameters.hour && 
                                   now.getMinutes() === condition.parameters.minute;
                        case 'user_activity':
                            // In real implementation, would check user activity
                            return true;
                        default:
                            return true;
                    }
                });

                if (shouldExecute) {
                    // Execute actions
                    for (const action of warmingStrategy.actions) {
                        await executeWarmingAction(action);
                    }
                }
            }
        } finally {
            setIsWarming(false);
        }
    }, [config.enableIntelligentWarming, config.warmingStrategies, isWarming]);

    // Execute warming action
    const executeWarmingAction = useCallback(async (action: WarmingAction): Promise<void> => {
        switch (action.type) {
            case 'preload_data':
                console.log(`Preloading data for: ${action.target}`);
                // In real implementation, would preload actual data
                break;
            case 'prefetch_related':
                console.log(`Prefetching related data for: ${action.target}`);
                // In real implementation, would prefetch related data
                break;
            case 'cache_prediction':
                console.log(`Cache prediction for: ${action.target}`);
                // In real implementation, would use ML to predict cache needs
                break;
            case 'background_sync':
                console.log(`Background sync for: ${action.target}`);
                // In real implementation, would sync data in background
                break;
        }
    }, []);

    // Optimize cache
    const optimizeCache = useCallback(async (): Promise<void> => {
        if (isOptimizing) return;

        setIsOptimizing(true);
        try {
            console.log('Optimizing cache...');
            
            // Analyze cache performance
            const hotKeys = Array.from(cacheStoreRef.current.entries())
                .sort((a, b) => b[1].accessCount - a[1].accessCount)
                .slice(0, 10)
                .map(([key, entry]) => ({
                    key,
                    accessCount: entry.accessCount,
                    lastAccessed: entry.lastAccessed
                }));

            const coldKeys = Array.from(cacheStoreRef.current.entries())
                .filter(([_, entry]) => entry.accessCount === 1)
                .sort((a, b) => a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime())
                .slice(0, 10)
                .map(([key, entry]) => ({
                    key,
                    lastAccessed: entry.lastAccessed,
                    size: entry.size
                }));

            // Update analytics
            setAnalytics(prev => ({
                ...prev,
                hotKeys,
                coldKeys
            }));

            // Optimize tier sizes if adaptive sizing is enabled
            if (config.enableAdaptiveSizing) {
                await optimizeTierSizes();
            }

        } finally {
            setIsOptimizing(false);
        }
    }, [isOptimizing, config.enableAdaptiveSizing]);

    // Optimize tier sizes
    const optimizeTierSizes = useCallback(async (): Promise<void> => {
        // In real implementation, would analyze access patterns and adjust tier sizes
        console.log('Optimizing tier sizes based on access patterns...');
    }, []);

    // Update analytics
    const updateAnalytics = useCallback((type: 'hit' | 'miss', tier: string, accessTime: number): void => {
        setAnalytics(prev => {
            const newAnalytics = { ...prev };
            
            if (type === 'hit') {
                newAnalytics.totalHits++;
            } else {
                newAnalytics.totalMisses++;
            }

            newAnalytics.hitRate = newAnalytics.totalHits / (newAnalytics.totalHits + newAnalytics.totalMisses);
            newAnalytics.averageAccessTime = (newAnalytics.averageAccessTime + accessTime) / 2;

            // Update tier performance
            if (!newAnalytics.tierPerformance[tier]) {
                newAnalytics.tierPerformance[tier] = {
                    hits: 0,
                    misses: 0,
                    hitRate: 0,
                    avgAccessTime: 0
                };
            }

            const tierPerf = newAnalytics.tierPerformance[tier];
            if (type === 'hit') {
                tierPerf.hits++;
            } else {
                tierPerf.misses++;
            }
            tierPerf.hitRate = tierPerf.hits / (tierPerf.hits + tierPerf.misses);
            tierPerf.avgAccessTime = (tierPerf.avgAccessTime + accessTime) / 2;

            return newAnalytics;
        });
    }, []);

    // Update tiers
    const updateTiers = useCallback(() => {
        setTiers(prev => prev.map(tier => {
            const tierEntries = Array.from(cacheStoreRef.current.values())
                .filter(entry => entry.tier === tier.name);
            
            const size = tierEntries.reduce((sum, entry) => sum + entry.size, 0);
            const accessCount = tierEntries.reduce((sum, entry) => sum + entry.accessCount, 0);
            const hits = tierEntries.filter(entry => entry.accessCount > 1).length;
            const hitRate = tierEntries.length > 0 ? hits / tierEntries.length : 0;

            return {
                ...tier,
                size,
                accessCount,
                hitRate
            };
        }));
    }, []);

    // Get analytics
    const getAnalytics = useCallback((): CacheAnalytics => {
        return analytics;
    }, [analytics]);

    // Export cache
    const exportCache = useCallback(async (): Promise<string> => {
        const cacheData = {
            entries: Array.from(cacheStoreRef.current.entries()),
            analytics,
            config,
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(cacheData);
    }, [analytics, config]);

    // Import cache
    const importCache = useCallback(async (data: string): Promise<void> => {
        try {
            const cacheData = JSON.parse(data);
            cacheStoreRef.current = new Map(cacheData.entries);
            setAnalytics(cacheData.analytics);
            updateTiers();
        } catch (error) {
            console.error('Failed to import cache:', error);
        }
    }, [updateTiers]);

    // Add invalidation strategy
    const addInvalidationStrategy = useCallback((strategy: CacheInvalidationStrategy): void => {
        setInvalidationStrategies(prev => [...prev, strategy]);
    }, []);

    // Remove invalidation strategy
    const removeInvalidationStrategy = useCallback((id: string): void => {
        setInvalidationStrategies(prev => prev.filter(s => s.id !== id));
    }, []);

    // Initialize cache warming
    useEffect(() => {
        if (config.enableIntelligentWarming) {
            warmCache();
        }
    }, [config.enableIntelligentWarming, warmCache]);

    // Periodic optimization
    useEffect(() => {
        const interval = setInterval(() => {
            optimizeCache();
        }, 60000); // Every minute

        return () => clearInterval(interval);
    }, [optimizeCache]);

    const value: AdvancedCacheManagerContextType = {
        config,
        tiers,
        analytics,
        invalidationStrategies,
        isWarming,
        isOptimizing,
        get,
        set,
        invalidate,
        clear,
        warmCache,
        optimizeCache,
        getAnalytics,
        exportCache,
        importCache,
        addInvalidationStrategy,
        removeInvalidationStrategy
    };

    return (
        <AdvancedCacheManagerContext.Provider value={value}>
            {children}
        </AdvancedCacheManagerContext.Provider>
    );
};

// Hook to use advanced cache manager
export const useAdvancedCacheManager = () => {
    const context = useContext(AdvancedCacheManagerContext);
    if (!context) {
        throw new Error('useAdvancedCacheManager must be used within AdvancedCacheManagerProvider');
    }
    return context;
};

// Cache Analytics Dashboard Component
interface CacheAnalyticsDashboardProps {
    className?: string;
}

export const CacheAnalyticsDashboard: React.FC<CacheAnalyticsDashboardProps> = ({ 
    className = '' 
}) => {
    const { 
        analytics, 
        tiers, 
        isWarming, 
        isOptimizing, 
        warmCache, 
        optimizeCache, 
        clear 
    } = useAdvancedCacheManager();

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-900\">Cache Analytics</h2>
                <div className=\"flex items-center space-x-2\">
                    {isWarming && (
                        <div className=\"flex items-center space-x-1 text-orange-500\">
                            <FiDownload className=\"animate-bounce\" />
                            <span className=\"text-sm\">Warming</span>
                        </div>
                    )}
                    {isOptimizing && (
                        <div className=\"flex items-center space-x-1 text-blue-500\">
                            <FiSettings className=\"animate-spin\" />
                            <span className=\"text-sm\">Optimizing</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Overall Analytics */}
            <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4 mb-6\">
                <div className=\"p-4 bg-blue-50 rounded-lg\">
                    <div className=\"flex items-center space-x-2 mb-2\">
                        <FiBarChart2 className=\"text-blue-600\" />
                        <span className=\"font-medium\">Hit Rate</span>
                    </div>
                    <div className=\"text-2xl font-bold text-blue-600\">
                        {(analytics.hitRate * 100).toFixed(1)}%
                    </div>
                    <div className=\"text-sm text-gray-600\">
                        {analytics.totalHits} hits / {analytics.totalMisses} misses
                    </div>
                </div>

                <div className=\"p-4 bg-green-50 rounded-lg\">
                    <div className=\"flex items-center space-x-2 mb-2\">
                        <FiHardDrive className=\"text-green-600\" />
                        <span className=\"font-medium\">Total Size</span>
                    </div>
                    <div className=\"text-2xl font-bold text-green-600\">
                        {(analytics.totalSize / 1024 / 1024).toFixed(1)}MB
                    </div>
                    <div className=\"text-sm text-gray-600\">{analytics.evictionCount} evictions</div>
                </div>

                <div className=\"p-4 bg-purple-50 rounded-lg\">
                    <div className=\"flex items-center space-x-2 mb-2\">
                        <FiClock className=\"text-purple-600\" />
                        <span className=\"font-medium\">Avg Access</span>
                    </div>
                    <div className=\"text-2xl font-bold text-purple-600\">
                        {analytics.averageAccessTime.toFixed(2)}ms
                    </div>
                    <div className=\"text-sm text-gray-600\">Response time</div>
                </div>

                <div className=\"p-4 bg-orange-50 rounded-lg\">
                    <div className=\"flex items-center space-x-2 mb-2\">
                        <FiActivity className=\"text-orange-600\" />
                        <span className=\"font-medium\">Compression</span>
                    </div>
                    <div className=\"text-2xl font-bold text-orange-600\">
                        {(analytics.compressionRatio * 100).toFixed(1)}%
                    </div>
                    <div className=\"text-sm text-gray-600\">Space saved</div>
                </div>
            </div>

            {/* Tier Performance */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Tier Performance</h3>
                <div className=\"space-y-2\">
                    {tiers.map(tier => (
                        <div key={tier.name} className=\"flex items-center justify-between p-3 bg-gray-50 rounded\">
                            <div className=\"flex items-center space-x-3\">
                                <FiDatabase className=\"text-gray-600\" />
                                <div>
                                    <div className=\"font-medium capitalize\">{tier.name} Tier</div>
                                    <div className=\"text-sm text-gray-600\">
                                        {(tier.size / 1024 / 1024).toFixed(1)}MB / {(tier.maxSize / 1024 / 1024).toFixed(1)}MB
                                    </div>
                                </div>
                            </div>
                            <div className=\"text-right\">
                                <div className=\"font-medium\">{(tier.hitRate * 100).toFixed(1)}%</div>
                                <div className=\"text-sm text-gray-600\">{tier.accessCount} accesses</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Control Buttons */}
            <div className=\"flex flex-wrap gap-2\">
                <button
                    onClick={warmCache}
                    disabled={isWarming}
                    className=\"px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"
                >
                    {isWarming ? 'Warming...' : 'Warm Cache'}
                </button>
                
                <button
                    onClick={optimizeCache}
                    disabled={isOptimizing}
                    className=\"px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"
                >
                    {isOptimizing ? 'Optimizing...' : 'Optimize Cache'}
                </button>

                <button
                    onClick={() => clear()}
                    className=\"px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors\"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default AdvancedCacheManagerProvider;
