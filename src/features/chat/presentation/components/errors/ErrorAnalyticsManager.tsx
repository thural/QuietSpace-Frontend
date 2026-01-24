/**
 * Error Analytics Manager
 * 
 * This component provides deep error analysis and reporting capabilities with
 * intelligent error aggregation, pattern recognition, and comprehensive analytics.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiTrendingUp, 
    FiActivity, 
    FiAlertTriangle, 
    FiBarChart2, 
    FiPieChart, 
    FiClock,
    FiFilter,
    FiDownload,
    FiRefreshCw,
    FiEye,
    FiTarget,
    FiZap,
    FiCpu,
    FiHardDrive,
    FiWifi,
    FiDatabase
} from 'react-icons/fi';

export interface ErrorAnalyticsConfig {
    enableRealTimeAnalysis: boolean;
    enablePatternRecognition: boolean;
    enablePredictiveAnalytics: boolean;
    enablePerformanceMetrics: boolean;
    enableUserBehaviorAnalysis: boolean;
    analysisInterval: number;
    maxErrorHistory: number;
    enableAggregation: boolean;
    aggregationWindow: number;
    enableAlerting: boolean;
    alertThresholds: AlertThresholds;
    enableExport: boolean;
    retentionPeriod: number;
}

export interface AlertThresholds {
    errorRate: number;
    criticalErrors: number;
    recoveryFailureRate: number;
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
}

export interface ErrorAnalytics {
    totalErrors: number;
    errorRate: number;
    criticalErrors: number;
    recoveryRate: number;
    averageResponseTime: number;
    errorTrends: ErrorTrend[];
    errorPatterns: ErrorPattern[];
    performanceMetrics: PerformanceMetrics;
    userBehaviorMetrics: UserBehaviorMetrics;
    alerts: ErrorAlert[];
    predictions: ErrorPrediction[];
    lastUpdated: Date;
}

export interface ErrorTrend {
    timestamp: Date;
    totalErrors: number;
    criticalErrors: number;
    errorRate: number;
    recoveryRate: number;
    responseTime: number;
}

export interface ErrorPattern {
    id: string;
    name: string;
    description: string;
    frequency: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    conditions: PatternCondition[];
    suggestedActions: string[];
    relatedErrors: string[];
    firstSeen: Date;
    lastSeen: Date;
    trend: 'increasing' | 'decreasing' | 'stable';
    impact: {
        usersAffected: number;
        sessionsLost: number;
        downtime: number;
    };
}

export interface PatternCondition {
    type: 'error_type' | 'error_message' | 'user_agent' | 'url' | 'time' | 'frequency';
    operator: 'equals' | 'contains' | 'regex' | 'greater_than' | 'less_than';
    value: string | number;
    weight: number;
}

export interface PerformanceMetrics {
    responseTime: {
        average: number;
        median: number;
        p95: number;
        p99: number;
    };
    throughput: {
        requestsPerSecond: number;
        errorsPerSecond: number;
        successesPerSecond: number;
    };
    resourceUsage: {
        cpu: number;
        memory: number;
        network: number;
        storage: number;
    };
    cachePerformance: {
        hitRate: number;
        missRate: number;
        evictionRate: number;
    };
}

export interface UserBehaviorMetrics {
    totalUsers: number;
    activeUsers: number;
    affectedUsers: number;
    userSatisfaction: number;
    sessionDuration: {
        average: number;
        median: number;
    };
    errorEncounterRate: number;
    recoverySuccessRate: number;
    featureUsage: Map<string, number>;
    userPaths: UserPath[];
}

export interface UserPath {
    id: string;
    userId: string;
    path: string[];
    errors: string[];
    duration: number;
    completed: boolean;
    timestamp: Date;
}

export interface ErrorAlert {
    id: string;
    type: 'error_spike' | 'critical_error' | 'performance_degradation' | 'pattern_detected' | 'prediction';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    timestamp: Date;
    acknowledged: boolean;
    resolved: boolean;
    metadata: Record<string, any>;
}

export interface ErrorPrediction {
    id: string;
    type: 'error_likelihood' | 'performance_issue' | 'system_failure';
    confidence: number;
    timeframe: number; // minutes
    description: string;
    factors: PredictionFactor[];
    recommendedActions: string[];
    estimatedImpact: {
        usersAffected: number;
        downtime: number;
        revenue: number;
    };
}

export interface PredictionFactor {
    name: string;
    value: number;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
}

interface ErrorAnalyticsContextType {
    config: ErrorAnalyticsConfig;
    analytics: ErrorAnalytics;
    errorHistory: ErrorRecord[];
    isAnalyzing: boolean;
    recordError: (error: ErrorRecord) => void;
    getAnalytics: () => ErrorAnalytics;
    getErrorPatterns: () => ErrorPattern[];
    getPredictions: () => ErrorPrediction[];
    acknowledgeAlert: (alertId: string) => void;
    resolveAlert: (alertId: string) => void;
    exportAnalytics: (format: 'json' | 'csv' | 'pdf') => void;
    updateConfig: (config: Partial<ErrorAnalyticsConfig>) => void;
    refreshAnalytics: () => void;
}

export interface ErrorRecord {
    id: string;
    timestamp: Date;
    error: {
        name: string;
        message: string;
        stack?: string;
        type: string;
    };
    context: {
        userId?: string;
        sessionId?: string;
        url: string;
        userAgent: string;
        component?: string;
        action?: string;
    };
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
    recoveryAttempts: number;
    recoveryTime?: number;
    impact: {
        usersAffected: number;
        sessionsLost: number;
    };
    metrics: {
        responseTime: number;
        memoryUsage: number;
        cpuUsage: number;
        networkLatency: number;
    };
}

const ErrorAnalyticsContext = createContext<ErrorAnalyticsContextType | null>(null);

// Error Analytics Provider
interface ErrorAnalyticsProviderProps {
    children: React.ReactNode;
    config?: Partial<ErrorAnalyticsConfig>;
}

export const ErrorAnalyticsProvider: React.FC<ErrorAnalyticsProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<ErrorAnalyticsConfig>({
        enableRealTimeAnalysis: true,
        enablePatternRecognition: true,
        enablePredictiveAnalytics: true,
        enablePerformanceMetrics: true,
        enableUserBehaviorAnalysis: true,
        analysisInterval: 30000,
        maxErrorHistory: 10000,
        enableAggregation: true,
        aggregationWindow: 300000,
        enableAlerting: true,
        alertThresholds: {
            errorRate: 0.05,
            criticalErrors: 10,
            recoveryFailureRate: 0.3,
            responseTime: 5000,
            memoryUsage: 0.8,
            cpuUsage: 0.8
        },
        enableExport: true,
        retentionPeriod: 86400000 * 30,
        ...userConfig
    });

    const [analytics, setAnalytics] = useState<ErrorAnalytics>({
        totalErrors: 0,
        errorRate: 0,
        criticalErrors: 0,
        recoveryRate: 0,
        averageResponseTime: 0,
        errorTrends: [],
        errorPatterns: [],
        performanceMetrics: {
            responseTime: { average: 0, median: 0, p95: 0, p99: 0 },
            throughput: { requestsPerSecond: 0, errorsPerSecond: 0, successesPerSecond: 0 },
            resourceUsage: { cpu: 0, memory: 0, network: 0, storage: 0 },
            cachePerformance: { hitRate: 0, missRate: 0, evictionRate: 0 }
        },
        userBehaviorMetrics: {
            totalUsers: 0,
            activeUsers: 0,
            affectedUsers: 0,
            userSatisfaction: 0,
            sessionDuration: { average: 0, median: 0 },
            errorEncounterRate: 0,
            recoverySuccessRate: 0,
            featureUsage: new Map(),
            userPaths: []
        },
        alerts: [],
        predictions: [],
        lastUpdated: new Date()
    });

    const [errorHistory, setErrorHistory] = useState<ErrorRecord[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Record error
    const recordError = useCallback((error: ErrorRecord) => {
        setErrorHistory(prev => {
            const newHistory = [error, ...prev];
            if (newHistory.length > config.maxErrorHistory) {
                return newHistory.slice(0, config.maxErrorHistory);
            }
            return newHistory;
        });

        if (config.enableRealTimeAnalysis) {
            performAnalysis();
        }
    }, [config]);

    // Perform analysis (simplified)
    const performAnalysis = useCallback(() => {
        setIsAnalyzing(true);
        try {
            const totalErrors = errorHistory.length;
            const criticalErrors = errorHistory.filter(e => e.severity === 'critical').length;
            const resolvedErrors = errorHistory.filter(e => e.resolved).length;
            const recoveryRate = totalErrors > 0 ? resolvedErrors / totalErrors : 0;
            
            const timeWindow = config.aggregationWindow;
            const recentErrors = errorHistory.filter(error => 
                Date.now() - error.timestamp.getTime() < timeWindow
            );
            const errorRate = recentErrors.length / (timeWindow / 60000);

            const responseTimes = errorHistory.map(e => e.metrics.responseTime).filter(t => t > 0);
            const averageResponseTime = responseTimes.length > 0 
                ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
                : 0;

            setAnalytics(prev => ({
                ...prev,
                totalErrors,
                errorRate,
                criticalErrors,
                recoveryRate,
                averageResponseTime,
                lastUpdated: new Date()
            }));
        } catch (error) {
            console.error('Error during analytics analysis:', error);
        } finally {
            setIsAnalyzing(false);
        }
    }, [errorHistory, config]);

    const getAnalytics = useCallback((): ErrorAnalytics => analytics, [analytics]);
    const getErrorPatterns = useCallback((): ErrorPattern[] => analytics.errorPatterns, [analytics]);
    const getPredictions = useCallback((): ErrorPrediction[] => analytics.predictions, [analytics]);

    const acknowledgeAlert = useCallback((alertId: string) => {
        setAnalytics(prev => ({
            ...prev,
            alerts: prev.alerts.map(alert => 
                alert.id === alertId ? { ...alert, acknowledged: true } : alert
            )
        }));
    }, []);

    const resolveAlert = useCallback((alertId: string) => {
        setAnalytics(prev => ({
            ...prev,
            alerts: prev.alerts.map(alert => 
                alert.id === alertId ? { ...alert, resolved: true } : alert
            )
        }));
    }, []);

    const exportAnalytics = useCallback((format: 'json' | 'csv' | 'pdf') => {
        const data = { analytics, errorHistory, exportedAt: new Date().toISOString() };
        
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `error-analytics-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }, [analytics, errorHistory]);

    const updateConfig = useCallback((newConfig: Partial<ErrorAnalyticsConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    const refreshAnalytics = useCallback(() => {
        performAnalysis();
    }, [performAnalysis]);

    const value: ErrorAnalyticsContextType = {
        config,
        analytics,
        errorHistory,
        isAnalyzing,
        recordError,
        getAnalytics,
        getErrorPatterns,
        getPredictions,
        acknowledgeAlert,
        resolveAlert,
        exportAnalytics,
        updateConfig,
        refreshAnalytics
    };

    return (
        <ErrorAnalyticsContext.Provider value={value}>
            {children}
        </ErrorAnalyticsContext.Provider>
    );
};

// Hook to use error analytics
export const useErrorAnalytics = () => {
    const context = useContext(ErrorAnalyticsContext);
    if (!context) {
        throw new Error('useErrorAnalytics must be used within ErrorAnalyticsProvider');
    }
    return context;
};

// Analytics Dashboard Component
interface AnalyticsDashboardProps {
    className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
    const { analytics, acknowledgeAlert, resolveAlert, exportAnalytics } = useErrorAnalytics();

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-800\">Error Analytics Dashboard</h2>
                <div className=\"flex space-x-2\">
                    <button
                        onClick={() => exportAnalytics('json')}
                        className=\"px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600\"
                    >
                        <FiDownload className=\"inline mr-1\" />
                        Export
                    </button>
                </div>
            </div>

            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6\">
                <div className=\"p-4 bg-blue-50 rounded-lg\">
                    <div className=\"flex items-center justify-between\">
                        <div>
                            <p className=\"text-sm text-gray-600\">Total Errors</p>
                            <p className=\"text-2xl font-bold text-blue-600\">{analytics.totalErrors}</p>
                        </div>
                        <FiBarChart2 className=\"text-3xl text-blue-500\" />
                    </div>
                </div>
                
                <div className=\"p-4 bg-red-50 rounded-lg\">
                    <div className=\"flex items-center justify-between\">
                        <div>
                            <p className=\"text-sm text-gray-600\">Error Rate</p>
                            <p className=\"text-2xl font-bold text-red-600\">{(analytics.errorRate * 100).toFixed(2)}%</p>
                        </div>
                        <FiTrendingUp className=\"text-3xl text-red-500\" />
                    </div>
                </div>
                
                <div className=\"p-4 bg-green-50 rounded-lg\">
                    <div className=\"flex items-center justify-between\">
                        <div>
                            <p className=\"text-sm text-gray-600\">Recovery Rate</p>
                            <p className=\"text-2xl font-bold text-green-600\">{(analytics.recoveryRate * 100).toFixed(2)}%</p>
                        </div>
                        <FiCheckCircle className=\"text-3xl text-green-500\" />
                    </div>
                </div>
                
                <div className=\"p-4 bg-yellow-50 rounded-lg\">
                    <div className=\"flex items-center justify-between\">
                        <div>
                            <p className=\"text-sm text-gray-600\">Avg Response Time</p>
                            <p className=\"text-2xl font-bold text-yellow-600\">{analytics.averageResponseTime.toFixed(0)}ms</p>
                        </div>
                        <FiClock className=\"text-3xl text-yellow-500\" />
                    </div>
                </div>
            </div>

            {analytics.alerts.length > 0 && (
                <div className=\"mb-6\">
                    <h3 className=\"text-lg font-semibold mb-3\">Active Alerts</h3>
                    <div className=\"space-y-2\">
                        {analytics.alerts.slice(0, 5).map((alert) => (
                            <div key={alert.id} className=\"p-3 border rounded-lg flex items-center justify-between\">
                                <div>
                                    <p className=\"font-medium\">{alert.title}</p>
                                    <p className=\"text-sm text-gray-600\">{alert.message}</p>
                                </div>
                                <div className=\"flex space-x-2\">
                                    {!alert.acknowledged && (
                                        <button
                                            onClick={() => acknowledgeAlert(alert.id)}
                                            className=\"px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600\"
                                        >
                                            Acknowledge
                                        </button>
                                    )}
                                    {!alert.resolved && (
                                        <button
                                            onClick={() => resolveAlert(alert.id)}
                                            className=\"px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600\"
                                        >
                                            Resolve
                                        </button>
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

export default ErrorAnalyticsProvider;
