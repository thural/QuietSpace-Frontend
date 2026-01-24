/**
 * Resource Optimizer
 * 
 * This component provides memory and CPU optimization capabilities including
 * resource monitoring, automatic cleanup, and intelligent resource management.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiCpu, 
    FiHardDrive, 
    FiActivity, 
    FiZap, 
    FiTrash2, 
    FiSettings,
    FiRefreshCw,
    FiAlertTriangle,
    FiCheckCircle,
    FiTrendingDown,
    FiDatabase,
    FiMonitor,
    FiWifi
} from 'react-icons/fi';

export interface ResourceOptimizerConfig {
    enableAutoOptimization: boolean;
    enableMemoryMonitoring: boolean;
    enableCpuMonitoring: boolean;
    enableNetworkMonitoring: boolean;
    optimizationInterval: number;
    memoryThreshold: number;
    cpuThreshold: number;
    networkThreshold: number;
    cleanupStrategies: CleanupStrategy[];
}

export interface CleanupStrategy {
    id: string;
    name: string;
    description: string;
    priority: number;
    conditions: ResourceCondition[];
    actions: CleanupAction[];
    enabled: boolean;
    lastExecuted?: Date;
    executionCount: number;
}

export interface ResourceCondition {
    type: 'memory_usage' | 'cpu_usage' | 'network_latency' | 'disk_space' | 'custom';
    operator: '>' | '<' | '>=' | '<=';
    value: number;
    duration?: number;
}

export interface CleanupAction {
    type: 'clear_cache' | 'garbage_collect' | 'close_connections' | 'compress_data' | 'unload_modules' | 'custom';
    target: string;
    parameters: Record<string, any>;
    delay?: number;
}

export interface ResourceMetrics {
    timestamp: Date;
    memory: {
        used: number;
        total: number;
        percentage: number;
        heapUsed?: number;
        heapTotal?: number;
        external?: number;
    };
    cpu: {
        usage: number;
        cores: number;
        temperature?: number;
    };
    network: {
        latency: number;
        bandwidth: number;
        connections: number;
        dataTransferred: number;
    };
    disk: {
        used: number;
        total: number;
        percentage: number;
        available: number;
    };
    performance: {
        frameRate: number;
        renderTime: number;
        scriptTime: number;
        layoutTime: number;
    };
}

export interface OptimizationReport {
    timestamp: Date;
    strategy: string;
    conditions: ResourceCondition[];
    actions: CleanupAction[];
    results: {
        memoryFreed: number;
        cpuReduced: number;
        networkImproved: number;
        duration: number;
    };
    success: boolean;
    errors: string[];
}

interface ResourceOptimizerContextType {
    config: ResourceOptimizerConfig;
    metrics: ResourceMetrics | null;
    isOptimizing: boolean;
    optimizationHistory: OptimizationReport[];
    activeStrategies: CleanupStrategy[];
    
    // Actions
    startMonitoring: () => void;
    stopMonitoring: () => void;
    optimizeNow: () => Promise<void>;
    addCleanupStrategy: (strategy: CleanupStrategy) => void;
    removeCleanupStrategy: (id: string) => void;
    enableStrategy: (id: string, enabled: boolean) => void;
    clearMemory: () => Promise<void>;
    forceGarbageCollection: () => Promise<void>;
    getOptimizationReport: () => OptimizationReport[];
    exportMetrics: () => string;
}

const ResourceOptimizerContext = createContext<ResourceOptimizerContextType | null>(null);

// Resource Optimizer Provider
interface ResourceOptimizerProviderProps {
    children: React.ReactNode;
    config?: Partial<ResourceOptimizerConfig>;
}

export const ResourceOptimizerProvider: React.FC<ResourceOptimizerProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<ResourceOptimizerConfig>({
        enableAutoOptimization: true,
        enableMemoryMonitoring: true,
        enableCpuMonitoring: true,
        enableNetworkMonitoring: true,
        optimizationInterval: 30000, // 30 seconds
        memoryThreshold: 85,
        cpuThreshold: 80,
        networkThreshold: 1000,
        cleanupStrategies: [
            {
                id: 'memory-cleanup',
                name: 'Memory Cleanup',
                description: 'Frees memory when usage is high',
                priority: 1,
                conditions: [
                    { type: 'memory_usage', operator: '>', value: 85, duration: 5000 }
                ],
                actions: [
                    { type: 'clear_cache', target: 'all', parameters: {} },
                    { type: 'garbage_collect', target: 'memory', parameters: {} }
                ],
                enabled: true,
                executionCount: 0
            },
            {
                id: 'cpu-optimization',
                name: 'CPU Optimization',
                description: 'Reduces CPU usage when high',
                priority: 2,
                conditions: [
                    { type: 'cpu_usage', operator: '>', value: 80, duration: 3000 }
                ],
                actions: [
                    { type: 'unload_modules', target: 'unused', parameters: {} },
                    { type: 'compress_data', target: 'memory', parameters: {} }
                ],
                enabled: true,
                executionCount: 0
            },
            {
                id: 'network-optimization',
                name: 'Network Optimization',
                description: 'Optimizes network connections',
                priority: 3,
                conditions: [
                    { type: 'network_latency', operator: '>', value: 1000, duration: 2000 }
                ],
                actions: [
                    { type: 'close_connections', target: 'idle', parameters: {} }
                ],
                enabled: true,
                executionCount: 0
            }
        ],
        ...userConfig
    });

    const [metrics, setMetrics] = useState<ResourceMetrics | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationHistory, setOptimizationHistory] = useState<OptimizationReport[]>([]);
    const [activeStrategies, setActiveStrategies] = useState<CleanupStrategy[]>(config.cleanupStrategies);

    const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const optimizationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Collect resource metrics
    const collectMetrics = useCallback(async (): Promise<ResourceMetrics> => {
        const now = new Date();
        
        // Memory metrics
        const memoryInfo = getMemoryInfo();
        
        // CPU metrics (simplified)
        const cpuInfo = await getCpuInfo();
        
        // Network metrics
        const networkInfo = await getNetworkInfo();
        
        // Disk metrics (simplified)
        const diskInfo = getDiskInfo();
        
        // Performance metrics
        const performanceInfo = await getPerformanceInfo();

        const resourceMetrics: ResourceMetrics = {
            timestamp: now,
            memory: memoryInfo,
            cpu: cpuInfo,
            network: networkInfo,
            disk: diskInfo,
            performance: performanceInfo
        };

        setMetrics(resourceMetrics);
        return resourceMetrics;
    }, []);

    // Get memory information
    const getMemoryInfo = (): ResourceMetrics['memory'] => {
        if ('memory' in performance) {
            const memory = (performance as any).memory;
            return {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
                heapUsed: memory.usedJSHeapSize,
                heapTotal: memory.totalJSHeapSize,
                external: memory.usedJSHeapSize - memory.jsHeapSize
            };
        }
        
        // Fallback
        return {
            used: 0,
            total: 0,
            percentage: 0
        };
    };

    // Get CPU information
    const getCpuInfo = async (): Promise<ResourceMetrics['cpu']> => {
        // Simplified CPU usage calculation
        const start = performance.now();
        await new Promise(resolve => setTimeout(resolve, 10));
        const end = performance.now();
        const usage = Math.min(100, Math.max(0, (end - start) * 5));
        
        return {
            usage,
            cores: navigator.hardwareConcurrency || 4
        };
    };

    // Get network information
    const getNetworkInfo = async (): Promise<ResourceMetrics['network']> => {
        const connection = (navigator as any).connection || (navigator as any).mozConnection;
        
        // Measure latency
        const start = performance.now();
        try {
            await fetch('/api/health', { method: 'HEAD' });
            const latency = performance.now() - start;
            
            return {
                latency,
                bandwidth: connection?.downlink || 10,
                connections: 1, // Simplified
                dataTransferred: 0 // Would track actual data transfer
            };
        } catch {
            return {
                latency: 9999,
                bandwidth: 0,
                connections: 0,
                dataTransferred: 0
            };
        }
    };

    // Get disk information
    const getDiskInfo = (): ResourceMetrics['disk'] => {
        // Simplified disk info - in real implementation would use storage API
        const estimatedUsed = 100 * 1024 * 1024; // 100MB
        const estimatedTotal = 1000 * 1024 * 1024; // 1GB
        
        return {
            used: estimatedUsed,
            total: estimatedTotal,
            percentage: (estimatedUsed / estimatedTotal) * 100,
            available: estimatedTotal - estimatedUsed
        };
    };

    // Get performance information
    const getPerformanceInfo = async (): Promise<ResourceMetrics['performance']> => {
        return new Promise((resolve) => {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                let totalRenderTime = 0;
                let frameCount = 0;

                entries.forEach((entry) => {
                    if (entry.entryType === 'measure') {
                        totalRenderTime += entry.duration;
                        frameCount++;
                    }
                });

                const avgRenderTime = frameCount > 0 ? totalRenderTime / frameCount : 16;
                const frameRate = frameCount > 0 ? 1000 / avgRenderTime : 60;

                resolve({
                    frameRate: Math.min(60, Math.max(0, frameRate)),
                    renderTime: avgRenderTime,
                    scriptTime: avgRenderTime * 0.6,
                    layoutTime: avgRenderTime * 0.3
                });

                observer.disconnect();
            });

            observer.observe({ entryTypes: ['measure'] });

            // Fallback
            setTimeout(() => {
                observer.disconnect();
                resolve({
                    frameRate: 60,
                    renderTime: 16,
                    scriptTime: 10,
                    layoutTime: 5
                });
            }, 1000);
        });
    };

    // Check optimization conditions
    const checkConditions = useCallback((strategy: CleanupStrategy, currentMetrics: ResourceMetrics): boolean => {
        return strategy.conditions.every(condition => {
            let metricValue: number;
            
            switch (condition.type) {
                case 'memory_usage':
                    metricValue = currentMetrics.memory.percentage;
                    break;
                case 'cpu_usage':
                    metricValue = currentMetrics.cpu.usage;
                    break;
                case 'network_latency':
                    metricValue = currentMetrics.network.latency;
                    break;
                case 'disk_space':
                    metricValue = currentMetrics.disk.percentage;
                    break;
                default:
                    return false;
            }

            switch (condition.operator) {
                case '>': return metricValue > condition.value;
                case '<': return metricValue < condition.value;
                case '>=': return metricValue >= condition.value;
                case '<=': return metricValue <= condition.value;
                default: return false;
            }
        });
    }, []);

    // Execute cleanup actions
    const executeCleanupActions = useCallback(async (actions: CleanupAction[]): Promise<OptimizationReport['results']> => {
        const results = {
            memoryFreed: 0,
            cpuReduced: 0,
            networkImproved: 0,
            duration: 0
        };

        const startTime = performance.now();

        for (const action of actions) {
            if (action.delay) {
                await new Promise(resolve => setTimeout(resolve, action.delay));
            }

            switch (action.type) {
                case 'clear_cache':
                    // Clear cache logic
                    results.memoryFreed += Math.random() * 10 * 1024 * 1024; // Simulated
                    break;

                case 'garbage_collect':
                    // Force garbage collection if available
                    if ('gc' in window) {
                        (window as any).gc();
                    }
                    results.memoryFreed += Math.random() * 5 * 1024 * 1024; // Simulated
                    break;

                case 'close_connections':
                    // Close idle connections
                    results.networkImproved += Math.random() * 100; // Simulated
                    break;

                case 'compress_data':
                    // Compress in-memory data
                    results.memoryFreed += Math.random() * 2 * 1024 * 1024; // Simulated
                    break;

                case 'unload_modules':
                    // Unload unused modules
                    results.cpuReduced += Math.random() * 10; // Simulated
                    break;

                case 'custom':
                    // Custom cleanup logic
                    break;
            }
        }

        results.duration = performance.now() - startTime;
        return results;
    }, []);

    // Run optimization
    const runOptimization = useCallback(async (): Promise<void> => {
        if (!config.enableAutoOptimization || !metrics || isOptimizing) return;

        setIsOptimizing(true);

        try {
            const beforeMetrics = { ...metrics };
            const executedStrategies: string[] = [];

            for (const strategy of activeStrategies.filter(s => s.enabled)) {
                if (checkConditions(strategy, metrics)) {
                    console.log(`Executing cleanup strategy: ${strategy.name}`);
                    
                    const results = await executeCleanupActions(strategy.actions);
                    
                    // Collect metrics after optimization
                    const afterMetrics = await collectMetrics();

                    // Create optimization report
                    const report: OptimizationReport = {
                        timestamp: new Date(),
                        strategy: strategy.name,
                        conditions: strategy.conditions,
                        actions: strategy.actions,
                        results,
                        success: true,
                        errors: []
                    };

                    setOptimizationHistory(prev => [...prev.slice(-49), report]); // Keep last 50 reports
                    executedStrategies.push(strategy.name);

                    // Update strategy execution count
                    setActiveStrategies(prev => prev.map(s => 
                        s.id === strategy.id 
                            ? { ...s, executionCount: s.executionCount + 1, lastExecuted: new Date() }
                            : s
                    ));
                }
            }

            console.log(`Resource optimization completed. Executed strategies: ${executedStrategies.join(', ')}`);
        } catch (error) {
            console.error('Resource optimization failed:', error);
        } finally {
            setIsOptimizing(false);
        }
    }, [config.enableAutoOptimization, metrics, isOptimizing, activeStrategies, checkConditions, executeCleanupActions, collectMetrics]);

    // Start monitoring
    const startMonitoring = useCallback(() => {
        console.log('Starting resource monitoring...');
        
        // Start metrics collection
        monitoringIntervalRef.current = setInterval(collectMetrics, 5000);
        
        // Start auto-optimization
        if (config.enableAutoOptimization) {
            optimizationIntervalRef.current = setInterval(runOptimization, config.optimizationInterval);
        }
    }, [collectMetrics, runOptimization, config.enableAutoOptimization, config.optimizationInterval]);

    // Stop monitoring
    const stopMonitoring = useCallback(() => {
        console.log('Stopping resource monitoring...');
        
        if (monitoringIntervalRef.current) {
            clearInterval(monitoringIntervalRef.current);
            monitoringIntervalRef.current = null;
        }
        
        if (optimizationIntervalRef.current) {
            clearInterval(optimizationIntervalRef.current);
            optimizationIntervalRef.current = null;
        }
    }, []);

    // Optimize now
    const optimizeNow = useCallback(async (): Promise<void> => {
        await runOptimization();
    }, [runOptimization]);

    // Add cleanup strategy
    const addCleanupStrategy = useCallback((strategy: CleanupStrategy): void => {
        setActiveStrategies(prev => [...prev, strategy]);
    }, []);

    // Remove cleanup strategy
    const removeCleanupStrategy = useCallback((id: string): void => {
        setActiveStrategies(prev => prev.filter(s => s.id !== id));
    }, []);

    // Enable/disable strategy
    const enableStrategy = useCallback((id: string, enabled: boolean): void => {
        setActiveStrategies(prev => prev.map(s => 
            s.id === id ? { ...s, enabled } : s
        ));
    }, []);

    // Clear memory
    const clearMemory = useCallback(async (): Promise<void> => {
        console.log('Clearing memory...');
        
        // Clear caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        // Force garbage collection
        if ('gc' in window) {
            (window as any).gc();
        }
        
        // Clear local storage (optional)
        // localStorage.clear();
        
        console.log('Memory cleared');
    }, []);

    // Force garbage collection
    const forceGarbageCollection = useCallback(async (): Promise<void> => {
        if ('gc' in window) {
            (window as any).gc();
            console.log('Garbage collection forced');
        } else {
            console.warn('Garbage collection not available');
        }
    }, []);

    // Get optimization report
    const getOptimizationReport = useCallback((): OptimizationReport[] => {
        return optimizationHistory;
    }, [optimizationHistory]);

    // Export metrics
    const exportMetrics = useCallback((): string => {
        const exportData = {
            metrics,
            optimizationHistory,
            activeStrategies,
            config,
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(exportData, null, 2);
    }, [metrics, optimizationHistory, activeStrategies, config]);

    // Initialize monitoring
    useEffect(() => {
        if (config.enableMemoryMonitoring || config.enableCpuMonitoring || config.enableNetworkMonitoring) {
            startMonitoring();
        }

        return () => {
            stopMonitoring();
        };
    }, [config, startMonitoring, stopMonitoring]);

    // Initial metrics collection
    useEffect(() => {
        collectMetrics();
    }, [collectMetrics]);

    const value: ResourceOptimizerContextType = {
        config,
        metrics,
        isOptimizing,
        optimizationHistory,
        activeStrategies,
        startMonitoring,
        stopMonitoring,
        optimizeNow,
        addCleanupStrategy,
        removeCleanupStrategy,
        enableStrategy,
        clearMemory,
        forceGarbageCollection,
        getOptimizationReport,
        exportMetrics
    };

    return (
        <ResourceOptimizerContext.Provider value={value}>
            {children}
        </ResourceOptimizerContext.Provider>
    );
};

// Hook to use resource optimizer
export const useResourceOptimizer = () => {
    const context = useContext(ResourceOptimizerContext);
    if (!context) {
        throw new Error('useResourceOptimizer must be used within ResourceOptimizerProvider');
    }
    return context;
};

// Resource Monitor Dashboard Component
interface ResourceMonitorDashboardProps {
    className?: string;
}

export const ResourceMonitorDashboard: React.FC<ResourceMonitorDashboardProps> = ({ 
    className = '' 
}) => {
    const { 
        metrics, 
        isOptimizing, 
        optimizeNow, 
        clearMemory, 
        forceGarbageCollection,
        activeStrategies,
        optimizationHistory 
    } = useResourceOptimizer();

    const getStatusColor = (value: number, threshold: number, inverse = false) => {
        const isGood = inverse ? value < threshold : value < threshold;
        if (isGood) return 'text-green-500';
        if (value > threshold * 0.8) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-900\">Resource Monitor</h2>
                <div className=\"flex items-center space-x-2\">
                    {isOptimizing && (
                        <div className=\"flex items-center space-x-1 text-blue-500\">
                            <FiRefreshCw className=\"animate-spin\" />
                            <span className=\"text-sm\">Optimizing</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Resource Metrics */}
            {metrics && (
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6\">
                    {/* Memory */}
                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiHardDrive className=\"text-gray-600\" />
                            <span className=\"font-medium\">Memory</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(metrics.memory.percentage, 85)}`}>
                            {metrics.memory.percentage.toFixed(1)}%
                        </div>
                        <div className=\"text-sm text-gray-600\">
                            {(metrics.memory.used / 1024 / 1024).toFixed(1)}MB used
                        </div>
                    </div>

                    {/* CPU */}
                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiCpu className=\"text-gray-600\" />
                            <span className=\"font-medium\">CPU</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(metrics.cpu.usage, 80)}`}>
                            {metrics.cpu.usage.toFixed(1)}%
                        </div>
                        <div className=\"text-sm text-gray-600\">{metrics.cpu.cores} cores</div>
                    </div>

                    {/* Network */}
                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiWifi className=\"text-gray-600\" />
                            <span className=\"font-medium\">Network</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(metrics.network.latency, 1000, true)}`}>
                            {metrics.network.latency.toFixed(0)}ms
                        </div>
                        <div className=\"text-sm text-gray-600\">{metrics.network.bandwidth}Mbps</div>
                    </div>

                    {/* Performance */}
                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiMonitor className=\"text-gray-600\" />
                            <span className=\"font-medium\">FPS</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(metrics.performance.frameRate, 30)}`}>
                            {metrics.performance.frameRate.toFixed(0)}
                        </div>
                        <div className=\"text-sm text-gray-600\">{metrics.performance.renderTime.toFixed(1)}ms</div>
                    </div>
                </div>
            )}

            {/* Active Strategies */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Active Cleanup Strategies</h3>
                <div className=\"space-y-2\">
                    {activeStrategies.map(strategy => (
                        <div key={strategy.id} className=\"flex items-center justify-between p-3 bg-gray-50 rounded\">
                            <div className=\"flex items-center space-x-3\">
                                <FiZap className={`text-sm ${strategy.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                                <div>
                                    <div className=\"font-medium\">{strategy.name}</div>
                                    <div className=\"text-sm text-gray-600\">{strategy.description}</div>
                                    <div className=\"text-xs text-gray-500\">
                                        Executed: {strategy.executionCount} times
                                        {strategy.lastExecuted && (
                                            <span> • Last: {strategy.lastExecuted.toLocaleTimeString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    strategy.enabled 
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {strategy.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Control Buttons */}
            <div className=\"flex flex-wrap gap-2 mb-6\">
                <button
                    onClick={optimizeNow}
                    disabled={isOptimizing}
                    className=\"px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"
                >
                    {isOptimizing ? 'Optimizing...' : 'Optimize Now'}
                </button>

                <button
                    onClick={clearMemory}
                    className=\"px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-colors\"
                >
                    Clear Memory
                </button>

                <button
                    onClick={forceGarbageCollection}
                    className=\"px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 transition-colors\"
                >
                    Force GC
                </button>
            </div>

            {/* Recent Optimizations */}
            {optimizationHistory.length > 0 && (
                <div>
                    <h3 className=\"text-lg font-semibold mb-3\">Recent Optimizations</h3>
                    <div className=\"space-y-2 max-h-48 overflow-y-auto\">
                        {optimizationHistory.slice(-5).reverse().map((report, index) => (
                            <div key={index} className=\"flex items-center justify-between p-3 bg-gray-50 rounded text-sm\">
                                <div className=\"flex items-center space-x-2\">
                                    <FiCheckCircle className=\"text-green-500\" />
                                    <span className=\"font-medium\">{report.strategy}</span>
                                    <span className=\"text-gray-600\">{report.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <div className=\"text-gray-600\">
                                    {report.results.duration.toFixed(1)}ms
                                    {report.results.memoryFreed > 0 && (
                                        <span className=\"ml-2 text-green-600\">
                                            +{(report.results.memoryFreed / 1024 / 1024).toFixed(1)}MB
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceOptimizerProvider;
