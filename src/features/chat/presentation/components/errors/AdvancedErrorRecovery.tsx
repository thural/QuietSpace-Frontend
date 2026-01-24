/**
 * Advanced Error Recovery Manager
 * 
 * This component provides sophisticated error recovery mechanisms with intelligent
 * retry strategies, fallback options, and comprehensive recovery orchestration.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiRefreshCw, 
    FiAlertTriangle, 
    FiCheckCircle, 
    FiClock,
    FiSettings,
    FiWifi,
    FiDatabase,
    FiShield,
    FiZap,
    FiActivity,
    FiTrendingUp,
    FiAlertCircle
} from 'react-icons/fi';

export interface AdvancedErrorRecoveryConfig {
    enableIntelligentRetry: boolean;
    enableFallbackStrategies: boolean;
    enableRecoveryAnalytics: boolean;
    maxRetryAttempts: number;
    baseRetryDelay: number;
    maxRetryDelay: number;
    exponentialBackoff: boolean;
    enableCircuitBreaker: boolean;
    circuitBreakerThreshold: number;
    circuitBreakerTimeout: number;
    enableRecoveryCache: boolean;
    recoveryCacheSize: number;
    enablePredictiveRecovery: boolean;
    predictiveAccuracyThreshold: number;
}

export interface RecoveryStrategy {
    id: string;
    name: string;
    description: string;
    priority: number;
    conditions: string[];
    actions: RecoveryAction[];
    fallbackStrategies: string[];
    successRate: number;
    averageRecoveryTime: number;
    lastUsed?: Date;
}

export interface RecoveryAction {
    id: string;
    type: 'retry' | 'fallback' | 'reset' | 'refresh' | 'reconnect' | 'clear' | 'rebuild';
    description: string;
    execute: () => Promise<boolean>;
    timeout: number;
    retryable: boolean;
    sideEffects: string[];
}

export interface RecoveryContext {
    errorId: string;
    errorType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: Date;
    attempts: number;
    strategies: RecoveryStrategy[];
    currentStrategy?: RecoveryStrategy;
    history: RecoveryAttempt[];
    circuitBreakerState: 'closed' | 'open' | 'half-open';
    predictiveSuggestions: PredictiveSuggestion[];
}

export interface RecoveryAttempt {
    id: string;
    timestamp: Date;
    strategy: string;
    action: string;
    success: boolean;
    duration: number;
    error?: string;
    metrics: {
        cpuUsage?: number;
        memoryUsage?: number;
        networkLatency?: number;
        responseTime?: number;
    };
}

export interface PredictiveSuggestion {
    strategy: string;
    confidence: number;
    reasoning: string;
    expectedSuccessRate: number;
    estimatedRecoveryTime: number;
}

export interface RecoveryAnalytics {
    totalRecoveries: number;
    successfulRecoveries: number;
    averageRecoveryTime: number;
    successRate: number;
    strategyPerformance: Map<string, {
        attempts: number;
        successes: number;
        averageTime: number;
        successRate: number;
    }>;
    errorPatterns: Map<string, {
        frequency: number;
        averageRecoveryTime: number;
        bestStrategy: string;
        successRate: number;
    }>;
    predictiveAccuracy: number;
    circuitBreakerEvents: number;
}

interface AdvancedErrorRecoveryContextType {
    config: AdvancedErrorRecoveryConfig;
    analytics: RecoveryAnalytics;
    activeRecoveries: Map<string, RecoveryContext>;
    recoveryCache: Map<string, RecoveryStrategy[]>;
    circuitBreakers: Map<string, CircuitBreakerState>;
    initiateRecovery: (error: Error, context: any) => Promise<string>;
    executeRecovery: (recoveryId: string, strategyId?: string) => Promise<boolean>;
    cancelRecovery: (recoveryId: string) => void;
    getRecoverySuggestions: (errorType: string, context: any) => PredictiveSuggestion[];
    updateConfig: (config: Partial<AdvancedErrorRecoveryConfig>) => void;
    getAnalytics: () => RecoveryAnalytics;
    resetAnalytics: () => void;
}

interface CircuitBreakerState {
    state: 'closed' | 'open' | 'half-open';
    failures: number;
    lastFailureTime?: Date;
    nextAttemptTime?: Date;
    timeout: number;
    threshold: number;
}

const AdvancedErrorRecoveryContext = createContext<AdvancedErrorRecoveryContextType | null>(null);

// Advanced Error Recovery Provider
interface AdvancedErrorRecoveryProviderProps {
    children: React.ReactNode;
    config?: Partial<AdvancedErrorRecoveryConfig>;
}

export const AdvancedErrorRecoveryProvider: React.FC<AdvancedErrorRecoveryProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<AdvancedErrorRecoveryConfig>({
        enableIntelligentRetry: true,
        enableFallbackStrategies: true,
        enableRecoveryAnalytics: true,
        maxRetryAttempts: 3,
        baseRetryDelay: 1000,
        maxRetryDelay: 30000,
        exponentialBackoff: true,
        enableCircuitBreaker: true,
        circuitBreakerThreshold: 5,
        circuitBreakerTimeout: 60000,
        enableRecoveryCache: true,
        recoveryCacheSize: 100,
        enablePredictiveRecovery: true,
        predictiveAccuracyThreshold: 0.7,
        ...userConfig
    });

    const [analytics, setAnalytics] = useState<RecoveryAnalytics>({
        totalRecoveries: 0,
        successfulRecoveries: 0,
        averageRecoveryTime: 0,
        successRate: 0,
        strategyPerformance: new Map(),
        errorPatterns: new Map(),
        predictiveAccuracy: 0,
        circuitBreakerEvents: 0
    });

    const [activeRecoveries, setActiveRecoveries] = useState<Map<string, RecoveryContext>>(new Map());
    const [recoveryCache, setRecoveryCache] = useState<Map<string, RecoveryStrategy[]>>(new Map());
    const [circuitBreakers, setCircuitBreakers] = useState<Map<string, CircuitBreakerState>>(new Map());

    const recoveryTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Built-in recovery strategies
    const builtInStrategies: RecoveryStrategy[] = [
        {
            id: 'network-retry',
            name: 'Network Retry',
            description: 'Retry network operations with exponential backoff',
            priority: 1,
            conditions: ['network', 'timeout', 'connection'],
            actions: [
                {
                    id: 'retry-request',
                    type: 'retry',
                    description: 'Retry the failed network request',
                    execute: async () => {
                        // Simulate network retry
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return Math.random() > 0.3; // 70% success rate
                    },
                    timeout: 5000,
                    retryable: true,
                    sideEffects: ['network-traffic']
                }
            ],
            fallbackStrategies: ['offline-mode', 'cached-data'],
            successRate: 0.7,
            averageRecoveryTime: 2000
        },
        {
            id: 'component-refresh',
            name: 'Component Refresh',
            description: 'Refresh the affected component',
            priority: 2,
            conditions: ['runtime', 'render', 'state'],
            actions: [
                {
                    id: 'refresh-component',
                    type: 'refresh',
                    description: 'Force component re-render',
                    execute: async () => {
                        // Simulate component refresh
                        await new Promise(resolve => setTimeout(resolve, 500));
                        return Math.random() > 0.2; // 80% success rate
                    },
                    timeout: 2000,
                    retryable: true,
                    sideEffects: ['ui-update']
                }
            ],
            fallbackStrategies: ['component-rebuild', 'fallback-ui'],
            successRate: 0.8,
            averageRecoveryTime: 1000
        },
        {
            id: 'cache-clear',
            name: 'Cache Clear',
            description: 'Clear application cache and retry',
            priority: 3,
            conditions: ['cache', 'storage', 'data'],
            actions: [
                {
                    id: 'clear-cache',
                    type: 'clear',
                    description: 'Clear application cache',
                    execute: async () => {
                        // Simulate cache clear
                        await new Promise(resolve => setTimeout(resolve, 300));
                        return Math.random() > 0.1; // 90% success rate
                    },
                    timeout: 1000,
                    retryable: false,
                    sideEffects: ['data-loss', 're-fetch']
                }
            ],
            fallbackStrategies: ['hard-reset', 'rebuild-cache'],
            successRate: 0.9,
            averageRecoveryTime: 500
        },
        {
            id: 'session-reconnect',
            name: 'Session Reconnect',
            description: 'Reconnect user session',
            priority: 1,
            conditions: ['session', 'auth', 'token'],
            actions: [
                {
                    id: 'reconnect-session',
                    type: 'reconnect',
                    description: 'Reconnect user session',
                    execute: async () => {
                        // Simulate session reconnect
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        return Math.random() > 0.4; // 60% success rate
                    },
                    timeout: 10000,
                    retryable: true,
                    sideEffects: ['session-refresh', 'token-refresh']
                }
            ],
            fallbackStrategies: ['force-login', 'guest-mode'],
            successRate: 0.6,
            averageRecoveryTime: 3000
        }
    ];

    // Calculate retry delay with exponential backoff
    const calculateRetryDelay = useCallback((attempt: number): number => {
        if (!config.exponentialBackoff) {
            return config.baseRetryDelay;
        }
        
        const delay = config.baseRetryDelay * Math.pow(2, attempt - 1);
        return Math.min(delay, config.maxRetryDelay);
    }, [config]);

    // Check circuit breaker state
    const checkCircuitBreaker = useCallback((key: string): boolean => {
        if (!config.enableCircuitBreaker) return true;

        const breaker = circuitBreakers.get(key);
        if (!breaker) return true;

        const now = Date.now();
        
        if (breaker.state === 'open') {
            if (breaker.nextAttemptTime && now < breaker.nextAttemptTime.getTime()) {
                return false; // Circuit breaker is still open
            }
            // Transition to half-open
            setCircuitBreakers(prev => {
                const newBreakers = new Map(prev);
                newBreakers.set(key, {
                    ...breaker,
                    state: 'half-open'
                });
                return newBreakers;
            });
        }
        
        return true;
    }, [circuitBreakers, config.enableCircuitBreaker]);

    // Update circuit breaker
    const updateCircuitBreaker = useCallback((key: string, success: boolean) => {
        if (!config.enableCircuitBreaker) return;

        const breaker = circuitBreakers.get(key);
        if (!breaker) return;

        if (success) {
            // Reset circuit breaker on success
            setCircuitBreakers(prev => {
                const newBreakers = new Map(prev);
                newBreakers.set(key, {
                    state: 'closed',
                    failures: 0,
                    timeout: breaker.timeout,
                    threshold: breaker.threshold
                });
                return newBreakers;
            });
        } else {
            // Increment failures
            const newFailures = breaker.failures + 1;
            
            if (newFailures >= breaker.threshold) {
                // Open circuit breaker
                setCircuitBreakers(prev => {
                    const newBreakers = new Map(prev);
                    newBreakers.set(key, {
                        state: 'open',
                        failures: newFailures,
                        lastFailureTime: new Date(),
                        nextAttemptTime: new Date(Date.now() + breaker.timeout),
                        timeout: breaker.timeout,
                        threshold: breaker.threshold
                    });
                    return newBreakers;
                });

                // Update analytics
                setAnalytics(prev => ({
                    ...prev,
                    circuitBreakerEvents: prev.circuitBreakerEvents + 1
                }));
            } else {
                // Update failure count
                setCircuitBreakers(prev => {
                    const newBreakers = new Map(prev);
                    newBreakers.set(key, {
                        ...breaker,
                        failures: newFailures
                    });
                    return newBreakers;
                });
            }
        }
    }, [circuitBreakers, config.enableCircuitBreaker]);

    // Get recovery strategies for error
    const getRecoveryStrategies = useCallback((error: Error, context: any): RecoveryStrategy[] => {
        const errorType = error.constructor.name;
        const errorMessage = error.message.toLowerCase();
        
        // Check cache first
        if (config.enableRecoveryCache) {
            const cacheKey = `${errorType}:${errorMessage.substring(0, 50)}`;
            const cached = recoveryCache.get(cacheKey);
            if (cached) return cached;
        }

        // Filter strategies based on error conditions
        const applicableStrategies = builtInStrategies.filter(strategy => {
            return strategy.conditions.some(condition => 
                errorMessage.includes(condition) || 
                errorType.toLowerCase().includes(condition)
            );
        });

        // Sort by priority and success rate
        const sortedStrategies = applicableStrategies.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return b.successRate - a.successRate;
        });

        // Cache the result
        if (config.enableRecoveryCache && sortedStrategies.length > 0) {
            const cacheKey = `${errorType}:${errorMessage.substring(0, 50)}`;
            setRecoveryCache(prev => {
                const newCache = new Map(prev);
                if (newCache.size >= config.recoveryCacheSize) {
                    // Remove oldest entry
                    const firstKey = newCache.keys().next().value;
                    newCache.delete(firstKey);
                }
                newCache.set(cacheKey, sortedStrategies);
                return newCache;
            });
        }

        return sortedStrategies;
    }, [builtInStrategies, recoveryCache, config]);

    // Get predictive suggestions
    const getRecoverySuggestions = useCallback((errorType: string, context: any): PredictiveSuggestion[] => {
        if (!config.enablePredictiveRecovery) return [];

        const errorPattern = analytics.errorPatterns.get(errorType);
        if (!errorPattern) return [];

        return [
            {
                strategy: errorPattern.bestStrategy,
                confidence: errorPattern.successRate,
                reasoning: `Based on ${errorPattern.frequency} previous occurrences`,
                expectedSuccessRate: errorPattern.successRate,
                estimatedRecoveryTime: errorPattern.averageRecoveryTime
            }
        ].filter(suggestion => suggestion.confidence >= config.predictiveAccuracyThreshold);
    }, [analytics, config]);

    // Execute recovery action
    const executeRecoveryAction = useCallback(async (action: RecoveryAction): Promise<boolean> => {
        const startTime = Date.now();
        
        try {
            const result = await Promise.race([
                action.execute(),
                new Promise<boolean>((_, reject) => 
                    setTimeout(() => reject(new Error('Action timeout')), action.timeout)
                )
            ]);

            const duration = Date.now() - startTime;
            
            if (result) {
                // Success - update analytics
                setAnalytics(prev => {
                    const newAnalytics = { ...prev };
                    const performance = newAnalytics.strategyPerformance.get(action.type) || {
                        attempts: 0,
                        successes: 0,
                        averageTime: 0,
                        successRate: 0
                    };
                    
                    performance.attempts++;
                    performance.successes++;
                    performance.averageTime = (performance.averageTime * (performance.attempts - 1) + duration) / performance.attempts;
                    performance.successRate = performance.successes / performance.attempts;
                    
                    newAnalytics.strategyPerformance.set(action.type, performance);
                    return newAnalytics;
                });
            }

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            
            // Failure - update analytics
            setAnalytics(prev => {
                const newAnalytics = { ...prev };
                const performance = newAnalytics.strategyPerformance.get(action.type) || {
                    attempts: 0,
                    successes: 0,
                    averageTime: 0,
                    successRate: 0
                };
                
                performance.attempts++;
                performance.averageTime = (performance.averageTime * (performance.attempts - 1) + duration) / performance.attempts;
                performance.successRate = performance.successes / performance.attempts;
                
                newAnalytics.strategyPerformance.set(action.type, performance);
                return newAnalytics;
            });

            return false;
        }
    }, []);

    // Initiate recovery
    const initiateRecovery = useCallback(async (error: Error, context: any): Promise<string> => {
        const recoveryId = `recovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const strategies = getRecoveryStrategies(error, context);
        const predictiveSuggestions = getRecoverySuggestions(error.constructor.name, context);

        const recoveryContext: RecoveryContext = {
            errorId: recoveryId,
            errorType: error.constructor.name,
            severity: 'medium', // Could be determined from error classification
            timestamp: new Date(),
            attempts: 0,
            strategies,
            history: [],
            circuitBreakerState: 'closed',
            predictiveSuggestions
        };

        setActiveRecoveries(prev => new Map(prev).set(recoveryId, recoveryContext));

        // Update analytics
        setAnalytics(prev => ({
            ...prev,
            totalRecoveries: prev.totalRecoveries + 1
        }));

        return recoveryId;
    }, [getRecoveryStrategies, getRecoverySuggestions]);

    // Execute recovery
    const executeRecovery = useCallback(async (recoveryId: string, strategyId?: string): Promise<boolean> => {
        const recovery = activeRecoveries.get(recoveryId);
        if (!recovery) return false;

        const strategy = strategyId 
            ? recovery.strategies.find(s => s.id === strategyId)
            : recovery.strategies[0];

        if (!strategy) return false;

        // Check circuit breaker
        const circuitBreakerKey = `${recovery.errorType}:${strategy.id}`;
        if (!checkCircuitBreaker(circuitBreakerKey)) {
            return false;
        }

        // Update recovery context
        const updatedRecovery = {
            ...recovery,
            currentStrategy: strategy,
            attempts: recovery.attempts + 1,
            circuitBreakerState: circuitBreakers.get(circuitBreakerKey)?.state || 'closed'
        };

        setActiveRecoveries(prev => new Map(prev).set(recoveryId, updatedRecovery));

        // Execute strategy actions
        for (const action of strategy.actions) {
            const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const startTime = Date.now();

            try {
                const success = await executeRecoveryAction(action);
                const duration = Date.now() - startTime;

                const attempt: RecoveryAttempt = {
                    id: attemptId,
                    timestamp: new Date(),
                    strategy: strategy.id,
                    action: action.id,
                    success,
                    duration,
                    metrics: {
                        // Could collect actual metrics
                        cpuUsage: Math.random() * 100,
                        memoryUsage: Math.random() * 100,
                        networkLatency: Math.random() * 1000,
                        responseTime: duration
                    }
                };

                updatedRecovery.history.push(attempt);
                setActiveRecoveries(prev => new Map(prev).set(recoveryId, updatedRecovery));

                if (success) {
                    // Recovery successful
                    updateCircuitBreaker(circuitBreakerKey, true);
                    
                    // Update analytics
                    setAnalytics(prev => {
                        const newAnalytics = { ...prev };
                        newAnalytics.successfulRecoveries++;
                        
                        // Update average recovery time
                        const totalTime = newAnalytics.averageRecoveryTime * (newAnalytics.totalRecoveries - 1) + duration;
                        newAnalytics.averageRecoveryTime = totalTime / newAnalytics.totalRecoveries;
                        newAnalytics.successRate = newAnalytics.successfulRecoveries / newAnalytics.totalRecoveries;
                        
                        // Update error patterns
                        const pattern = newAnalytics.errorPatterns.get(recovery.errorType) || {
                            frequency: 0,
                            averageRecoveryTime: 0,
                            bestStrategy: strategy.id,
                            successRate: 0
                        };
                        
                        pattern.frequency++;
                        pattern.averageRecoveryTime = (pattern.averageRecoveryTime * (pattern.frequency - 1) + duration) / pattern.frequency;
                        if (strategy.successRate > (newAnalytics.strategyPerformance.get(pattern.bestStrategy)?.successRate || 0)) {
                            pattern.bestStrategy = strategy.id;
                        }
                        pattern.successRate = pattern.successRate * 0.9 + 0.1; // Weighted average
                        
                        newAnalytics.errorPatterns.set(recovery.errorType, pattern);
                        
                        return newAnalytics;
                    });

                    // Clear recovery timeout
                    if (recoveryTimeoutsRef.current.has(recoveryId)) {
                        clearTimeout(recoveryTimeoutsRef.current.get(recoveryId));
                        recoveryTimeoutsRef.current.delete(recoveryId);
                    }

                    // Remove from active recoveries
                    setActiveRecoveries(prev => {
                        const newRecoveries = new Map(prev);
                        newRecoveries.delete(recoveryId);
                        return newRecoveries;
                    });

                    return true;
                } else {
                    // Action failed, try next action or fallback
                    updateCircuitBreaker(circuitBreakerKey, false);
                    continue;
                }
            } catch (error) {
                const duration = Date.now() - startTime;
                
                const attempt: RecoveryAttempt = {
                    id: attemptId,
                    timestamp: new Date(),
                    strategy: strategy.id,
                    action: action.id,
                    success: false,
                    duration,
                    error: error instanceof Error ? error.message : String(error),
                    metrics: {
                        cpuUsage: Math.random() * 100,
                        memoryUsage: Math.random() * 100,
                        networkLatency: Math.random() * 1000,
                        responseTime: duration
                    }
                };

                updatedRecovery.history.push(attempt);
                setActiveRecoveries(prev => new Map(prev).set(recoveryId, updatedRecovery));
                
                updateCircuitBreaker(circuitBreakerKey, false);
                continue;
            }
        }

        // All actions failed, try fallback strategies
        if (strategy.fallbackStrategies.length > 0 && recovery.attempts < config.maxRetryAttempts) {
            // Schedule retry with fallback
            const delay = calculateRetryDelay(recovery.attempts);
            
            const timeout = setTimeout(() => {
                const fallbackStrategy = builtInStrategies.find(s => s.id === strategy.fallbackStrategies[0]);
                if (fallbackStrategy) {
                    executeRecovery(recoveryId, fallbackStrategy.id);
                }
            }, delay);
            
            recoveryTimeoutsRef.current.set(recoveryId, timeout);
        }

        return false;
    }, [activeRecoveries, builtInStrategies, checkCircuitBreaker, updateCircuitBreaker, executeRecoveryAction, calculateRetryDelay, config.maxRetryAttempts]);

    // Cancel recovery
    const cancelRecovery = useCallback((recoveryId: string) => {
        if (recoveryTimeoutsRef.current.has(recoveryId)) {
            clearTimeout(recoveryTimeoutsRef.current.get(recoveryId));
            recoveryTimeoutsRef.current.delete(recoveryId);
        }

        setActiveRecoveries(prev => {
            const newRecoveries = new Map(prev);
            newRecoveries.delete(recoveryId);
            return newRecoveries;
        });
    }, []);

    // Update configuration
    const updateConfig = useCallback((newConfig: Partial<AdvancedErrorRecoveryConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    // Get analytics
    const getAnalytics = useCallback((): RecoveryAnalytics => {
        return analytics;
    }, [analytics]);

    // Reset analytics
    const resetAnalytics = useCallback(() => {
        setAnalytics({
            totalRecoveries: 0,
            successfulRecoveries: 0,
            averageRecoveryTime: 0,
            successRate: 0,
            strategyPerformance: new Map(),
            errorPatterns: new Map(),
            predictiveAccuracy: 0,
            circuitBreakerEvents: 0
        });
    }, []);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            recoveryTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        };
    }, []);

    const value: AdvancedErrorRecoveryContextType = {
        config,
        analytics,
        activeRecoveries,
        recoveryCache,
        circuitBreakers,
        initiateRecovery,
        executeRecovery,
        cancelRecovery,
        getRecoverySuggestions,
        updateConfig,
        getAnalytics,
        resetAnalytics
    };

    return (
        <AdvancedErrorRecoveryContext.Provider value={value}>
            {children}
        </AdvancedErrorRecoveryContext.Provider>
    );
};

// Hook to use advanced error recovery
export const useAdvancedErrorRecovery = () => {
    const context = useContext(AdvancedErrorRecoveryContext);
    if (!context) {
        throw new Error('useAdvancedErrorRecovery must be used within AdvancedErrorRecoveryProvider');
    }
    return context;
};

// Recovery Status Component
interface RecoveryStatusProps {
    recoveryId: string;
    className?: string;
}

export const RecoveryStatus: React.FC<RecoveryStatusProps> = ({ recoveryId, className = '' }) => {
    const { activeRecoveries, cancelRecovery } = useAdvancedErrorRecovery();
    const recovery = activeRecoveries.get(recoveryId);

    if (!recovery) return null;

    const getStatusIcon = () => {
        switch (recovery.circuitBreakerState) {
            case 'open': return <FiAlertCircle className=\"text-red-500\" />;
            case 'half-open': return <FiAlertTriangle className=\"text-yellow-500\" />;
            default: return <FiActivity className=\"text-blue-500\" />;
        }
    };

    const getStatusColor = () => {
        switch (recovery.circuitBreakerState) {
            case 'open': return 'border-red-500 bg-red-50';
            case 'half-open': return 'border-yellow-500 bg-yellow-50';
            default: return 'border-blue-500 bg-blue-50';
        }
    };

    return (
        <div className={`p-4 rounded-lg border ${getStatusColor()} ${className}`}>
            <div className=\"flex items-center justify-between mb-2\">
                <div className=\"flex items-center space-x-2\">
                    {getStatusIcon()}
                    <span className=\"font-medium\">Error Recovery</span>
                </div>
                <button
                    onClick={() => cancelRecovery(recoveryId)}
                    className=\"text-gray-500 hover:text-gray-700\"
                    title=\"Cancel recovery\"
                >
                    <FiX />
                </button>
            </div>
            
            <div className=\"text-sm text-gray-600 mb-2\">
                <p><strong>Error:</strong> {recovery.errorType}</p>
                <p><strong>Strategy:</strong> {recovery.currentStrategy?.name || 'None'}</p>
                <p><strong>Attempts:</strong> {recovery.attempts}</p>
                <p><strong>Circuit Breaker:</strong> {recovery.circuitBreakerState}</p>
            </div>

            {recovery.predictiveSuggestions.length > 0 && (
                <div className=\"mt-2\">
                    <p className=\"text-sm font-medium text-gray-700 mb-1\">Predictive Suggestions:</p>
                    {recovery.predictiveSuggestions.map((suggestion, index) => (
                        <div key={index} className=\"text-xs text-gray-600 bg-gray-100 rounded p-1 mb-1\">
                            <span className=\"font-medium\">{suggestion.strategy}</span>
                            <span className=\"ml-2\">({Math.round(suggestion.confidence * 100)}% confidence)</span>
                        </div>
                    ))}
                </div>
            )}

            {recovery.history.length > 0 && (
                <div className=\"mt-2\">
                    <p className=\"text-sm font-medium text-gray-700 mb-1\">Recent Attempts:</p>
                    {recovery.history.slice(-3).map((attempt, index) => (
                        <div key={attempt.id} className=\"text-xs text-gray-600 flex items-center space-x-2\">
                            {attempt.success ? (
                                <FiCheckCircle className=\"text-green-500\" />
                            ) : (
                                <FiAlertTriangle className=\"text-red-500\" />
                            )}
                            <span>{attempt.action}</span>
                            <span>({attempt.duration}ms)</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdvancedErrorRecoveryProvider;
