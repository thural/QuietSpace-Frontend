/**
 * Error Prevention Manager
 * 
 * This component provides proactive error prevention strategies with intelligent
 * error detection, preventive measures, and system health monitoring.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiShield, 
    FiAlertTriangle, 
    FiCheckCircle, 
    FiActivity,
    FiSettings,
    FiZap,
    FiCpu,
    FiHardDrive,
    FiWifi,
    FiDatabase,
    FiEye,
    FiTarget,
    FiTrendingUp,
    FiClock,
    FiRefreshCw,
    FiInfo,
    FiAlertCircle
} from 'react-icons/fi';

export interface ErrorPreventionConfig {
    enableProactiveMonitoring: boolean;
    enablePredictivePrevention: boolean;
    enableSystemHealthChecks: boolean;
    enableResourceMonitoring: boolean;
    enableUserBehaviorMonitoring: boolean;
    enableAutomaticPrevention: boolean;
    monitoringInterval: number;
    healthCheckInterval: number;
    preventionThresholds: PreventionThresholds;
    enablePreventionCache: boolean;
    preventionCacheSize: number;
    enablePreventionAnalytics: boolean;
    enableAlerting: boolean;
}

export interface PreventionThresholds {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    errorRate: number;
    responseTime: number;
    userActionsPerMinute: number;
    concurrentConnections: number;
}

export interface PreventionStrategy {
    id: string;
    name: string;
    description: string;
    type: 'proactive' | 'reactive' | 'predictive';
    category: 'resource' | 'performance' | 'user_behavior' | 'system' | 'network';
    priority: number;
    conditions: PreventionCondition[];
    actions: PreventionAction[];
    effectiveness: number;
    lastExecuted?: Date;
    executionCount: number;
    successCount: number;
}

export interface PreventionCondition {
    type: 'metric' | 'event' | 'pattern' | 'threshold' | 'time';
    metric: string;
    operator: 'greater_than' | 'less_than' | 'equals' | 'contains' | 'regex';
    value: number | string;
    weight: number;
    duration?: number; // How long condition must persist
}

export interface PreventionAction {
    id: string;
    type: 'optimize' | 'scale' | 'cache' | 'throttle' | 'redirect' | 'notify' | 'reset' | 'cleanup';
    description: string;
    execute: () => Promise<boolean>;
    timeout: number;
    sideEffects: string[];
    rollback?: () => Promise<void>;
}

export interface SystemHealth {
    overall: 'healthy' | 'warning' | 'critical' | 'unknown';
    components: ComponentHealth[];
    metrics: HealthMetrics;
    lastCheck: Date;
    trends: HealthTrend[];
}

export interface ComponentHealth {
    name: string;
    status: 'healthy' | 'warning' | 'critical' | 'unknown';
    message?: string;
    metrics: Record<string, number>;
    lastCheck: Date;
}

export interface HealthMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network: {
        latency: number;
        bandwidth: number;
        packetLoss: number;
    };
    application: {
        responseTime: number;
        errorRate: number;
        throughput: number;
        activeConnections: number;
    };
}

export interface HealthTrend {
    timestamp: Date;
    overall: 'healthy' | 'warning' | 'critical' | 'unknown';
    metrics: HealthMetrics;
}

export interface PreventionEvent {
    id: string;
    timestamp: Date;
    strategy: string;
    trigger: string;
    actions: string[];
    success: boolean;
    duration: number;
    impact: {
        errorsPrevented: number;
        performanceImprovement: number;
        userImpact: number;
    };
    metadata: Record<string, any>;
}

export interface PreventionAnalytics {
    totalPreventions: number;
    successfulPreventions: number;
    errorsPrevented: number;
    performanceImprovement: number;
    strategyEffectiveness: Map<string, {
        executions: number;
        successes: number;
        errorsPrevented: number;
        effectiveness: number;
    }>;
    trends: PreventionTrend[];
    recommendations: PreventionRecommendation[];
}

export interface PreventionTrend {
    timestamp: Date;
    preventionsTriggered: number;
    errorsPrevented: number;
    averageEffectiveness: number;
}

export interface PreventionRecommendation {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    expectedImpact: {
        errorReduction: number;
        performanceImprovement: number;
        userSatisfaction: number;
    };
    implementation: {
        effort: 'low' | 'medium' | 'high';
        timeToImplement: number;
        dependencies: string[];
    };
}

interface ErrorPreventionContextType {
    config: ErrorPreventionConfig;
    systemHealth: SystemHealth;
    preventionStrategies: PreventionStrategy[];
    preventionEvents: PreventionEvent[];
    analytics: PreventionAnalytics;
    isMonitoring: boolean;
    addStrategy: (strategy: PreventionStrategy) => void;
    removeStrategy: (strategyId: string) => void;
    executePrevention: (strategyId: string, trigger?: string) => Promise<boolean>;
    getSystemHealth: () => SystemHealth;
    getPreventionRecommendations: () => PreventionRecommendation[];
    updateConfig: (config: Partial<ErrorPreventionConfig>) => void;
    refreshSystemHealth: () => void;
    getAnalytics: () => PreventionAnalytics;
}

const ErrorPreventionContext = createContext<ErrorPreventionContextType | null>(null);

// Error Prevention Provider
interface ErrorPreventionProviderProps {
    children: React.ReactNode;
    config?: Partial<ErrorPreventionConfig>;
}

export const ErrorPreventionProvider: React.FC<ErrorPreventionProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<ErrorPreventionConfig>({
        enableProactiveMonitoring: true,
        enablePredictivePrevention: true,
        enableSystemHealthChecks: true,
        enableResourceMonitoring: true,
        enableUserBehaviorMonitoring: true,
        enableAutomaticPrevention: true,
        monitoringInterval: 10000, // 10 seconds
        healthCheckInterval: 30000, // 30 seconds
        preventionThresholds: {
            cpuUsage: 0.8,
            memoryUsage: 0.85,
            diskUsage: 0.9,
            networkLatency: 1000,
            errorRate: 0.05,
            responseTime: 5000,
            userActionsPerMinute: 100,
            concurrentConnections: 1000
        },
        enablePreventionCache: true,
        preventionCacheSize: 50,
        enablePreventionAnalytics: true,
        enableAlerting: true,
        ...userConfig
    });

    const [systemHealth, setSystemHealth] = useState<SystemHealth>({
        overall: 'unknown',
        components: [],
        metrics: {
            cpu: 0,
            memory: 0,
            disk: 0,
            network: { latency: 0, bandwidth: 0, packetLoss: 0 },
            application: { responseTime: 0, errorRate: 0, throughput: 0, activeConnections: 0 }
        },
        lastCheck: new Date(),
        trends: []
    });

    const [preventionStrategies, setPreventionStrategies] = useState<PreventionStrategy[]>([]);
    const [preventionEvents, setPreventionEvents] = useState<PreventionEvent[]>([]);
    const [analytics, setAnalytics] = useState<PreventionAnalytics>({
        totalPreventions: 0,
        successfulPreventions: 0,
        errorsPrevented: 0,
        performanceImprovement: 0,
        strategyEffectiveness: new Map(),
        trends: [],
        recommendations: []
    });

    const [isMonitoring, setIsMonitoring] = useState(false);

    const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Built-in prevention strategies
    const builtInStrategies: PreventionStrategy[] = [
        {
            id: 'cpu-optimization',
            name: 'CPU Optimization',
            description: 'Optimize CPU usage when threshold is exceeded',
            type: 'proactive',
            category: 'resource',
            priority: 1,
            conditions: [
                {
                    type: 'metric',
                    metric: 'cpu',
                    operator: 'greater_than',
                    value: config.preventionThresholds.cpuUsage,
                    weight: 1.0,
                    duration: 30000 // 30 seconds
                }
            ],
            actions: [
                {
                    id: 'optimize-cpu',
                    type: 'optimize',
                    description: 'Optimize CPU-intensive operations',
                    execute: async () => {
                        // Simulate CPU optimization
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return Math.random() > 0.2; // 80% success rate
                    },
                    timeout: 5000,
                    sideEffects: ['performance-impact'],
                    rollback: async () => {
                        // Rollback CPU optimization
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            ],
            effectiveness: 0.8,
            executionCount: 0,
            successCount: 0
        },
        {
            id: 'memory-cleanup',
            name: 'Memory Cleanup',
            description: 'Clean up memory when usage is high',
            type: 'reactive',
            category: 'resource',
            priority: 1,
            conditions: [
                {
                    type: 'metric',
                    metric: 'memory',
                    operator: 'greater_than',
                    value: config.preventionThresholds.memoryUsage,
                    weight: 1.0,
                    duration: 15000 // 15 seconds
                }
            ],
            actions: [
                {
                    id: 'cleanup-memory',
                    type: 'cleanup',
                    description: 'Clean up unused memory',
                    execute: async () => {
                        // Simulate memory cleanup
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        return Math.random() > 0.1; // 90% success rate
                    },
                    timeout: 10000,
                    sideEffects: ['temporary-freeze']
                }
            ],
            effectiveness: 0.9,
            executionCount: 0,
            successCount: 0
        },
        {
            id: 'cache-optimization',
            name: 'Cache Optimization',
            description: 'Optimize cache when performance degrades',
            type: 'proactive',
            category: 'performance',
            priority: 2,
            conditions: [
                {
                    type: 'metric',
                    metric: 'responseTime',
                    operator: 'greater_than',
                    value: config.preventionThresholds.responseTime,
                    weight: 0.7,
                    duration: 20000 // 20 seconds
                },
                {
                    type: 'metric',
                    metric: 'errorRate',
                    operator: 'greater_than',
                    value: config.preventionThresholds.errorRate,
                    weight: 0.3,
                    duration: 10000 // 10 seconds
                }
            ],
            actions: [
                {
                    id: 'optimize-cache',
                    type: 'cache',
                    description: 'Optimize cache strategy',
                    execute: async () => {
                        // Simulate cache optimization
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        return Math.random() > 0.15; // 85% success rate
                    },
                    timeout: 8000,
                    sideEffects: ['cache-warmup']
                }
            ],
            effectiveness: 0.85,
            executionCount: 0,
            successCount: 0
        },
        {
            id: 'network-throttling',
            name: 'Network Throttling',
            description: 'Throttle network requests when latency is high',
            type: 'reactive',
            category: 'network',
            priority: 2,
            conditions: [
                {
                    type: 'metric',
                    metric: 'networkLatency',
                    operator: 'greater_than',
                    value: config.preventionThresholds.networkLatency,
                    weight: 1.0,
                    duration: 10000 // 10 seconds
                }
            ],
            actions: [
                {
                    id: 'throttle-requests',
                    type: 'throttle',
                    description: 'Throttle network requests',
                    execute: async () => {
                        // Simulate network throttling
                        await new Promise(resolve => setTimeout(resolve, 500));
                        return Math.random() > 0.25; // 75% success rate
                    },
                    timeout: 3000,
                    sideEffects: ['reduced-throughput']
                }
            ],
            effectiveness: 0.75,
            executionCount: 0,
            successCount: 0
        }
    ];

    // Initialize built-in strategies
    useEffect(() => {
        setPreventionStrategies(builtInStrategies);
    }, [config.preventionThresholds]);

    // Get system metrics (simulated)
    const getSystemMetrics = useCallback((): HealthMetrics => {
        // Simulate real system metrics
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: {
                latency: Math.random() * 2000,
                bandwidth: Math.random() * 1000,
                packetLoss: Math.random() * 5
            },
            application: {
                responseTime: Math.random() * 10000,
                errorRate: Math.random() * 0.1,
                throughput: Math.random() * 1000,
                activeConnections: Math.floor(Math.random() * 1500)
            }
        };
    }, []);

    // Check system health
    const checkSystemHealth = useCallback((): SystemHealth => {
        const metrics = getSystemMetrics();
        const components: ComponentHealth[] = [];

        // CPU component health
        components.push({
            name: 'CPU',
            status: metrics.cpu > 90 ? 'critical' : metrics.cpu > 70 ? 'warning' : 'healthy',
            metrics: { usage: metrics.cpu },
            lastCheck: new Date()
        });

        // Memory component health
        components.push({
            name: 'Memory',
            status: metrics.memory > 90 ? 'critical' : metrics.memory > 75 ? 'warning' : 'healthy',
            metrics: { usage: metrics.memory },
            lastCheck: new Date()
        });

        // Network component health
        components.push({
            name: 'Network',
            status: metrics.network.latency > 1500 ? 'critical' : metrics.network.latency > 800 ? 'warning' : 'healthy',
            metrics: { latency: metrics.network.latency, bandwidth: metrics.network.bandwidth },
            lastCheck: new Date()
        });

        // Application component health
        components.push({
            name: 'Application',
            status: metrics.application.errorRate > 0.1 ? 'critical' : metrics.application.errorRate > 0.05 ? 'warning' : 'healthy',
            metrics: { 
                responseTime: metrics.application.responseTime, 
                errorRate: metrics.application.errorRate,
                throughput: metrics.application.throughput
            },
            lastCheck: new Date()
        });

        // Determine overall health
        const criticalCount = components.filter(c => c.status === 'critical').length;
        const warningCount = components.filter(c => c.status === 'warning').length;

        const overall = criticalCount > 0 ? 'critical' : 
                       warningCount > 0 ? 'warning' : 'healthy';

        return {
            overall,
            components,
            metrics,
            lastCheck: new Date(),
            trends: systemHealth.trends
        };
    }, [getSystemMetrics, systemHealth.trends]);

    // Evaluate prevention conditions
    const evaluateConditions = useCallback((strategy: PreventionStrategy, metrics: HealthMetrics): boolean => {
        return strategy.conditions.every(condition => {
            let value: number;
            
            switch (condition.metric) {
                case 'cpu':
                    value = metrics.cpu;
                    break;
                case 'memory':
                    value = metrics.memory;
                    break;
                case 'networkLatency':
                    value = metrics.network.latency;
                    break;
                case 'responseTime':
                    value = metrics.application.responseTime;
                    break;
                case 'errorRate':
                    value = metrics.application.errorRate;
                    break;
                default:
                    return false;
            }

            switch (condition.operator) {
                case 'greater_than':
                    return value > (condition.value as number);
                case 'less_than':
                    return value < (condition.value as number);
                case 'equals':
                    return value === (condition.value as number);
                default:
                    return false;
            }
        });
    }, []);

    // Execute prevention strategy
    const executePrevention = useCallback(async (strategyId: string, trigger?: string): Promise<boolean> => {
        const strategy = preventionStrategies.find(s => s.id === strategyId);
        if (!strategy) return false;

        const startTime = Date.now();
        const metrics = getSystemMetrics();
        
        // Check if conditions are met
        if (!evaluateConditions(strategy, metrics)) {
            return false;
        }

        try {
            // Execute actions
            const actionResults = await Promise.all(
                strategy.actions.map(async action => {
                    try {
                        return await action.execute();
                    } catch (error) {
                        console.error(`Prevention action ${action.id} failed:`, error);
                        return false;
                    }
                })
            );

            const success = actionResults.some(result => result);
            const duration = Date.now() - startTime;

            // Update strategy execution stats
            const updatedStrategies = preventionStrategies.map(s => {
                if (s.id === strategyId) {
                    return {
                        ...s,
                        executionCount: s.executionCount + 1,
                        successCount: s.successCount + (success ? 1 : 0),
                        lastExecuted: new Date()
                    };
                }
                return s;
            });
            setPreventionStrategies(updatedStrategies);

            // Record prevention event
            const event: PreventionEvent = {
                id: `prevention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                strategy: strategy.name,
                trigger: trigger || 'automatic',
                actions: strategy.actions.map(a => a.id),
                success,
                duration,
                impact: {
                    errorsPrevented: Math.floor(Math.random() * 10), // Simulated
                    performanceImprovement: Math.random() * 20, // Simulated
                    userImpact: Math.random() * 5 // Simulated
                },
                metadata: {
                    strategyId,
                    metrics: metrics
                }
            };

            setPreventionEvents(prev => [event, ...prev].slice(0, 100)); // Keep last 100 events

            // Update analytics
            setAnalytics(prev => {
                const newAnalytics = { ...prev };
                newAnalytics.totalPreventions++;
                if (success) {
                    newAnalytics.successfulPreventions++;
                }
                newAnalytics.errorsPrevented += event.impact.errorsPrevented;
                newAnalytics.performanceImprovement += event.impact.performanceImprovement;

                // Update strategy effectiveness
                const effectiveness = updatedStrategies.find(s => s.id === strategyId);
                if (effectiveness) {
                    newAnalytics.strategyEffectiveness.set(strategyId, {
                        executions: effectiveness.executionCount,
                        successes: effectiveness.successCount,
                        errorsPrevented: event.impact.errorsPrevented,
                        effectiveness: effectiveness.effectiveness
                    });
                }

                return newAnalytics;
            });

            return success;
        } catch (error) {
            console.error(`Prevention strategy ${strategyId} failed:`, error);
            return false;
        }
    }, [preventionStrategies, evaluateConditions, getSystemMetrics]);

    // Monitor and prevent automatically
    const monitorAndPrevent = useCallback(() => {
        if (!config.enableAutomaticPrevention) return;

        const metrics = getSystemMetrics();
        const health = checkSystemHealth();

        // Check each strategy
        preventionStrategies.forEach(strategy => {
            if (evaluateConditions(strategy, metrics)) {
                executePrevention(strategy.id, 'automatic');
            }
        });

        setSystemHealth(health);
    }, [config.enableAutomaticPrevention, preventionStrategies, evaluateConditions, getSystemMetrics, checkSystemHealth, executePrevention]);

    // Add prevention strategy
    const addStrategy = useCallback((strategy: PreventionStrategy) => {
        setPreventionStrategies(prev => [...prev, strategy]);
    }, []);

    // Remove prevention strategy
    const removeStrategy = useCallback((strategyId: string) => {
        setPreventionStrategies(prev => prev.filter(s => s.id !== strategyId));
    }, []);

    // Get system health
    const getSystemHealth = useCallback((): SystemHealth => {
        return systemHealth;
    }, [systemHealth]);

    // Get prevention recommendations
    const getPreventionRecommendations = useCallback((): PreventionRecommendation[] => {
        const recommendations: PreventionRecommendation[] = [];
        const health = systemHealth;

        // CPU recommendations
        if (health.metrics.cpu > 70) {
            recommendations.push({
                id: 'cpu-optimization-rec',
                title: 'Optimize CPU Usage',
                description: 'Implement CPU optimization strategies to reduce high usage',
                priority: health.metrics.cpu > 90 ? 'critical' : 'high',
                category: 'resource',
                expectedImpact: {
                    errorReduction: 0.3,
                    performanceImprovement: 0.4,
                    userSatisfaction: 0.2
                },
                implementation: {
                    effort: 'medium',
                    timeToImplement: 7,
                    dependencies: ['performance-monitoring']
                }
            });
        }

        // Memory recommendations
        if (health.metrics.memory > 75) {
            recommendations.push({
                id: 'memory-optimization-rec',
                title: 'Optimize Memory Usage',
                description: 'Implement memory optimization and cleanup strategies',
                priority: health.metrics.memory > 85 ? 'critical' : 'high',
                category: 'resource',
                expectedImpact: {
                    errorReduction: 0.4,
                    performanceImprovement: 0.3,
                    userSatisfaction: 0.3
                },
                implementation: {
                    effort: 'medium',
                    timeToImplement: 5,
                    dependencies: ['memory-monitoring']
                }
            });
        }

        // Network recommendations
        if (health.metrics.network.latency > 800) {
            recommendations.push({
                id: 'network-optimization-rec',
                title: 'Optimize Network Performance',
                description: 'Implement network optimization and caching strategies',
                priority: health.metrics.network.latency > 1500 ? 'critical' : 'medium',
                category: 'network',
                expectedImpact: {
                    errorReduction: 0.2,
                    performanceImprovement: 0.5,
                    userSatisfaction: 0.4
                },
                implementation: {
                    effort: 'high',
                    timeToImplement: 14,
                    dependencies: ['network-monitoring', 'cdn-setup']
                }
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }, [systemHealth]);

    // Update configuration
    const updateConfig = useCallback((newConfig: Partial<ErrorPreventionConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    // Refresh system health
    const refreshSystemHealth = useCallback(() => {
        const health = checkSystemHealth();
        setSystemHealth(health);
    }, [checkSystemHealth]);

    // Get analytics
    const getAnalytics = useCallback((): PreventionAnalytics => {
        return analytics;
    }, [analytics]);

    // Set up monitoring intervals
    useEffect(() => {
        if (config.enableProactiveMonitoring && config.monitoringInterval > 0) {
            setIsMonitoring(true);
            monitoringIntervalRef.current = setInterval(() => {
                monitorAndPrevent();
            }, config.monitoringInterval);

            return () => {
                if (monitoringIntervalRef.current) {
                    clearInterval(monitoringIntervalRef.current);
                }
                setIsMonitoring(false);
            };
        }
    }, [config.enableProactiveMonitoring, config.monitoringInterval, monitorAndPrevent]);

    useEffect(() => {
        if (config.enableSystemHealthChecks && config.healthCheckInterval > 0) {
            healthCheckIntervalRef.current = setInterval(() => {
                refreshSystemHealth();
            }, config.healthCheckInterval);

            return () => {
                if (healthCheckIntervalRef.current) {
                    clearInterval(healthCheckIntervalRef.current);
                }
            };
        }
    }, [config.enableSystemHealthChecks, config.healthCheckInterval, refreshSystemHealth]);

    // Initial health check
    useEffect(() => {
        refreshSystemHealth();
    }, [refreshSystemHealth]);

    const value: ErrorPreventionContextType = {
        config,
        systemHealth,
        preventionStrategies,
        preventionEvents,
        analytics,
        isMonitoring,
        addStrategy,
        removeStrategy,
        executePrevention,
        getSystemHealth,
        getPreventionRecommendations,
        updateConfig,
        refreshSystemHealth,
        getAnalytics
    };

    return (
        <ErrorPreventionContext.Provider value={value}>
            {children}
        </ErrorPreventionContext.Provider>
    );
};

// Hook to use error prevention
export const useErrorPrevention = () => {
    const context = useContext(ErrorPreventionContext);
    if (!context) {
        throw new Error('useErrorPrevention must be used within ErrorPreventionProvider');
    }
    return context;
};

// System Health Monitor Component
interface SystemHealthMonitorProps {
    className?: string;
}

export const SystemHealthMonitor: React.FC<SystemHealthMonitorProps> = ({ className = '' }) => {
    const { systemHealth, refreshSystemHealth, getPreventionRecommendations } = useErrorPrevention();
    const recommendations = getPreventionRecommendations();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-600 bg-green-50';
            case 'warning': return 'text-yellow-600 bg-yellow-50';
            case 'critical': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy': return <FiCheckCircle className=\"text-green-500\" />;
            case 'warning': return <FiAlertTriangle className=\"text-yellow-500\" />;
            case 'critical': return <FiAlertCircle className=\"text-red-500\" />;
            default: return <FiActivity className=\"text-gray-500\" />;
        }
    };

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-800\">System Health Monitor</h2>
                <button
                    onClick={refreshSystemHealth}
                    className=\"px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600\"
                >
                    <FiRefreshCw className=\"inline mr-1\" />
                    Refresh
                </button>
            </div>

            {/* Overall Health */}
            <div className=\"mb-6\">
                <div className=\"flex items-center space-x-3 mb-4\">
                    {getStatusIcon(systemHealth.overall)}
                    <div>
                        <h3 className=\"text-lg font-semibold\">Overall System Health</h3>
                        <p className={`px-2 py-1 text-sm rounded ${getStatusColor(systemHealth.overall)}`}>
                            {systemHealth.overall.toUpperCase()}
                        </p>
                    </div>
                </div>
                <p className=\"text-sm text-gray-600\">Last checked: {systemHealth.lastCheck.toLocaleString()}</p>
            </div>

            {/* Component Health */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Component Health</h3>
                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                    {systemHealth.components.map((component, index) => (
                        <div key={index} className=\"p-3 border rounded-lg\">
                            <div className=\"flex items-center justify-between mb-2\">
                                <span className=\"font-medium\">{component.name}</span>
                                <div className=\"flex items-center space-x-2\">
                                    {getStatusIcon(component.status)}
                                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(component.status)}`}>
                                        {component.status}
                                    </span>
                                </div>
                            </div>
                            <div className=\"text-sm text-gray-600\">
                                {Object.entries(component.metrics).map(([key, value]) => (
                                    <div key={key} className=\"flex justify-between\">
                                        <span>{key}:</span>
                                        <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Metrics */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">System Metrics</h3>
                <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
                    <div className=\"text-center\">
                        <FiCpu className=\"text-2xl mx-auto mb-1 text-blue-500\" />
                        <p className=\"text-sm text-gray-600\">CPU</p>
                        <p className=\"font-semibold\">{systemHealth.metrics.cpu.toFixed(1)}%</p>
                    </div>
                    <div className=\"text-center\">
                        <FiHardDrive className=\"text-2xl mx-auto mb-1 text-green-500\" />
                        <p className=\"text-sm text-gray-600\">Memory</p>
                        <p className=\"font-semibold\">{systemHealth.metrics.memory.toFixed(1)}%</p>
                    </div>
                    <div className=\"text-center\">
                        <FiWifi className=\"text-2xl mx-auto mb-1 text-purple-500\" />
                        <p className=\"text-sm text-gray-600\">Network</p>
                        <p className=\"font-semibold\">{systemHealth.metrics.network.latency.toFixed(0)}ms</p>
                    </div>
                    <div className=\"text-center\">
                        <FiDatabase className=\"text-2xl mx-auto mb-1 text-orange-500\" />
                        <p className=\"text-sm text-gray-600\">Response</p>
                        <p className=\"font-semibold\">{systemHealth.metrics.application.responseTime.toFixed(0)}ms</p>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div>
                    <h3 className=\"text-lg font-semibold mb-3\">Recommendations</h3>
                    <div className=\"space-y-2\">
                        {recommendations.slice(0, 3).map((rec) => (
                            <div key={rec.id} className=\"p-3 border rounded-lg\">
                                <div className=\"flex items-center justify-between mb-2\">
                                    <h4 className=\"font-medium\">{rec.title}</h4>
                                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(rec.priority)}`}>
                                        {rec.priority}
                                    </span>
                                </div>
                                <p className=\"text-sm text-gray-600 mb-2\">{rec.description}</p>
                                <div className=\"text-xs text-gray-500\">
                                    <span>Impact: </span>
                                    <span>Error reduction: {(rec.expectedImpact.errorReduction * 100).toFixed(0)}%, </span>
                                    <span>Performance: {(rec.expectedImpact.performanceImprovement * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ErrorPreventionProvider;
