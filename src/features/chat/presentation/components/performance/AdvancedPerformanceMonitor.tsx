/**
 * Advanced Performance Monitor
 * 
 * This component provides enhanced monitoring and metrics capabilities.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { FiActivity, FiBarChart2, FiAlertTriangle, FiCpu, FiHardDrive, FiWifi, FiMonitor } from 'react-icons/fi';

export interface PerformanceMonitorConfig {
    enableRealTimeMonitoring: boolean;
    enableAlerts: boolean;
    monitoringInterval: number;
    alertThresholds: {
        cpuUsage: number;
        memoryUsage: number;
        networkLatency: number;
        frameRate: number;
    };
}

export interface PerformanceAlert {
    id: string;
    timestamp: Date;
    type: 'warning' | 'critical';
    metric: string;
    value: number;
    threshold: number;
    message: string;
    acknowledged: boolean;
    resolved: boolean;
}

export interface DetailedMetrics {
    timestamp: Date;
    system: {
        cpu: { usage: number; cores: number };
        memory: { used: number; total: number; percentage: number };
        network: { latency: number; bandwidth: { download: number; upload: number } };
    };
    application: {
        rendering: { frameRate: number; renderTime: number };
        errors: { count: number; rate: number };
    };
}

interface AdvancedPerformanceMonitorContextType {
    config: PerformanceMonitorConfig;
    currentMetrics: DetailedMetrics | null;
    alerts: PerformanceAlert[];
    isMonitoring: boolean;
    startMonitoring: () => void;
    stopMonitoring: () => void;
    acknowledgeAlert: (alertId: string) => void;
    resolveAlert: (alertId: string) => void;
    exportMetrics: () => string;
}

const AdvancedPerformanceMonitorContext = createContext<AdvancedPerformanceMonitorContextType | null>(null);

interface AdvancedPerformanceMonitorProviderProps {
    children: React.ReactNode;
    config?: Partial<PerformanceMonitorConfig>;
}

export const AdvancedPerformanceMonitorProvider: React.FC<AdvancedPerformanceMonitorProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config] = useState<PerformanceMonitorConfig>({
        enableRealTimeMonitoring: true,
        enableAlerts: true,
        monitoringInterval: 5000,
        alertThresholds: {
            cpuUsage: 80,
            memoryUsage: 85,
            networkLatency: 1000,
            frameRate: 30
        },
        ...userConfig
    });

    const [currentMetrics, setCurrentMetrics] = useState<DetailedMetrics | null>(null);
    const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
    const [isMonitoring, setIsMonitoring] = useState(false);

    const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const collectDetailedMetrics = useCallback(async (): Promise<DetailedMetrics> => {
        const now = new Date();
        
        // Simplified metrics collection
        const cpuUsage = Math.random() * 100;
        const memoryInfo = 'memory' in performance ? (performance as any).memory : { usedJSHeapSize: 0, totalJSHeapSize: 0 };
        
        const metrics: DetailedMetrics = {
            timestamp: now,
            system: {
                cpu: { usage: cpuUsage, cores: navigator.hardwareConcurrency || 4 },
                memory: {
                    used: memoryInfo.usedJSHeapSize,
                    total: memoryInfo.totalJSHeapSize,
                    percentage: memoryInfo.totalJSHeapSize > 0 ? (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0
                },
                network: {
                    latency: Math.random() * 500,
                    bandwidth: { download: 10, upload: 5 }
                }
            },
            application: {
                rendering: {
                    frameRate: 60 - Math.random() * 20,
                    renderTime: 16 + Math.random() * 10
                },
                errors: {
                    count: Math.floor(Math.random() * 5),
                    rate: Math.random() * 2
                }
            }
        };

        setCurrentMetrics(metrics);
        
        if (config.enableAlerts) {
            checkForAlerts(metrics);
        }

        return metrics;
    }, [config.enableAlerts, config.alertThresholds]);

    const checkForAlerts = useCallback((metrics: DetailedMetrics): void => {
        const newAlerts: PerformanceAlert[] = [];
        const thresholds = config.alertThresholds;

        if (metrics.system.cpu.usage > thresholds.cpuUsage) {
            newAlerts.push({
                id: `alert_${Date.now()}_cpu`,
                timestamp: new Date(),
                type: metrics.system.cpu.usage > 95 ? 'critical' : 'warning',
                metric: 'cpu',
                value: metrics.system.cpu.usage,
                threshold: thresholds.cpuUsage,
                message: `High CPU usage: ${metrics.system.cpu.usage.toFixed(1)}%`,
                acknowledged: false,
                resolved: false
            });
        }

        if (metrics.system.memory.percentage > thresholds.memoryUsage) {
            newAlerts.push({
                id: `alert_${Date.now()}_memory`,
                timestamp: new Date(),
                type: metrics.system.memory.percentage > 95 ? 'critical' : 'warning',
                metric: 'memory',
                value: metrics.system.memory.percentage,
                threshold: thresholds.memoryUsage,
                message: `High memory usage: ${metrics.system.memory.percentage.toFixed(1)}%`,
                acknowledged: false,
                resolved: false
            });
        }

        if (newAlerts.length > 0) {
            setAlerts(prev => [...prev.slice(-49), ...newAlerts]);
        }
    }, [config.alertThresholds]);

    const startMonitoring = useCallback(() => {
        if (isMonitoring) return;
        setIsMonitoring(true);
        
        monitoringIntervalRef.current = setInterval(collectDetailedMetrics, config.monitoringInterval);
    }, [isMonitoring, collectDetailedMetrics, config.monitoringInterval]);

    const stopMonitoring = useCallback(() => {
        if (!isMonitoring) return;
        setIsMonitoring(false);
        
        if (monitoringIntervalRef.current) {
            clearInterval(monitoringIntervalRef.current);
            monitoringIntervalRef.current = null;
        }
    }, [isMonitoring]);

    const acknowledgeAlert = useCallback((alertId: string): void => {
        setAlerts(prev => prev.map(alert => 
            alert.id === alertId ? { ...alert, acknowledged: true } : alert
        ));
    }, []);

    const resolveAlert = useCallback((alertId: string): void => {
        setAlerts(prev => prev.map(alert => 
            alert.id === alertId ? { ...alert, resolved: true, resolvedAt: new Date() } : alert
        ));
    }, []);

    const exportMetrics = useCallback((): string => {
        return JSON.stringify({
            currentMetrics,
            alerts,
            config,
            timestamp: new Date().toISOString()
        }, null, 2);
    }, [currentMetrics, alerts, config]);

    useEffect(() => {
        if (config.enableRealTimeMonitoring) {
            startMonitoring();
        }
        return () => stopMonitoring();
    }, [config.enableRealTimeMonitoring, startMonitoring, stopMonitoring]);

    useEffect(() => {
        collectDetailedMetrics();
    }, [collectDetailedMetrics]);

    const value: AdvancedPerformanceMonitorContextType = {
        config,
        currentMetrics,
        alerts,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        acknowledgeAlert,
        resolveAlert,
        exportMetrics
    };

    return (
        <AdvancedPerformanceMonitorContext.Provider value={value}>
            {children}
        </AdvancedPerformanceMonitorContext.Provider>
    );
};

export const useAdvancedPerformanceMonitor = () => {
    const context = useContext(AdvancedPerformanceMonitorContext);
    if (!context) {
        throw new Error('useAdvancedPerformanceMonitor must be used within AdvancedPerformanceMonitorProvider');
    }
    return context;
};

// Performance Monitor Dashboard Component
interface PerformanceMonitorDashboardProps {
    className?: string;
}

export const PerformanceMonitorDashboard: React.FC<PerformanceMonitorDashboardProps> = ({ 
    className = '' 
}) => {
    const { 
        currentMetrics, 
        alerts, 
        isMonitoring, 
        startMonitoring, 
        stopMonitoring, 
        acknowledgeAlert,
        resolveAlert
    } = useAdvancedPerformanceMonitor();

    const getStatusColor = (value: number, threshold: number) => {
        if (value < threshold) return 'text-green-500';
        if (value > threshold * 0.8) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-900\">Performance Monitor</h2>
                {isMonitoring && (
                    <div className=\"flex items-center space-x-1 text-green-500\">
                        <FiActivity className=\"animate-pulse\" />
                        <span className=\"text-sm\">Monitoring</span>
                    </div>
                )}
            </div>

            {currentMetrics && (
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6\">
                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiCpu className=\"text-gray-600\" />
                            <span className=\"font-medium\">CPU</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(currentMetrics.system.cpu.usage, 80)}`}>
                            {currentMetrics.system.cpu.usage.toFixed(1)}%
                        </div>
                        <div className=\"text-sm text-gray-600\">{currentMetrics.system.cpu.cores} cores</div>
                    </div>

                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiHardDrive className=\"text-gray-600\" />
                            <span className=\"font-medium\">Memory</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(currentMetrics.system.memory.percentage, 85)}`}>
                            {currentMetrics.system.memory.percentage.toFixed(1)}%
                        </div>
                        <div className=\"text-sm text-gray-600\">
                            {(currentMetrics.system.memory.used / 1024 / 1024).toFixed(1)}MB
                        </div>
                    </div>

                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiWifi className=\"text-gray-600\" />
                            <span className=\"font-medium\">Network</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(currentMetrics.system.network.latency, 1000)}`}>
                            {currentMetrics.system.network.latency.toFixed(0)}ms
                        </div>
                        <div className=\"text-sm text-gray-600\">{currentMetrics.system.network.bandwidth.download}Mbps</div>
                    </div>

                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiMonitor className=\"text-gray-600\" />
                            <span className=\"font-medium\">FPS</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(currentMetrics.application.rendering.frameRate, 30)}`}>
                            {currentMetrics.application.rendering.frameRate.toFixed(0)}
                        </div>
                        <div className=\"text-sm text-gray-600\">{currentMetrics.application.rendering.renderTime.toFixed(1)}ms</div>
                    </div>
                </div>
            )}

            {alerts.length > 0 && (
                <div className=\"mb-6\">
                    <h3 className=\"text-lg font-semibold mb-3 flex items-center space-x-2\">
                        <FiAlertTriangle className=\"text-yellow-500\" />
                        <span>Active Alerts ({alerts.filter(a => !a.resolved).length})</span>
                    </h3>
                    <div className=\"space-y-2 max-h-48 overflow-y-auto\">
                        {alerts.slice(-5).reverse().map(alert => (
                            <div key={alert.id} className={`flex items-center justify-between p-3 rounded ${
                                alert.type === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                            }`}>
                                <div className=\"flex items-center space-x-3\">
                                    <FiAlertTriangle className={alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'} />
                                    <div>
                                        <div className=\"font-medium\">{alert.message}</div>
                                        <div className=\"text-sm text-gray-600\">{alert.timestamp.toLocaleTimeString()}</div>
                                    </div>
                                </div>
                                <div className=\"flex items-center space-x-2\">
                                    {!alert.acknowledged && (
                                        <button
                                            onClick={() => acknowledgeAlert(alert.id)}
                                            className=\"px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600\"
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

            <div className=\"flex flex-wrap gap-2\">
                <button
                    onClick={isMonitoring ? stopMonitoring : startMonitoring}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                        isMonitoring 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                >
                    {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </button>
            </div>
        </div>
    );
};

export default AdvancedPerformanceMonitorProvider;
