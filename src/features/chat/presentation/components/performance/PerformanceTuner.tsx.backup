/**
 * Performance Tuner
 * 
 * This component provides dynamic performance adjustment and optimization
 * capabilities for the chat feature.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { FiCpu, FiActivity, FiZap, FiSettings, FiRefreshCw } from 'react-icons/fi';

export interface PerformanceTunerConfig {
    enableAutoOptimization: boolean;
    enableProfiling: boolean;
    optimizationInterval: number;
    performanceThresholds: {
        cpuUsage: number;
        memoryUsage: number;
        networkLatency: number;
        renderTime: number;
    };
}

export interface PerformanceMetrics {
    timestamp: Date;
    cpu: { usage: number; cores: number };
    memory: { used: number; total: number; percentage: number };
    network: { latency: number; bandwidth: number; online: boolean };
    rendering: { fps: number; renderTime: number };
}

export interface OptimizationStrategy {
    id: string;
    name: string;
    conditions: Array<{
        metric: keyof PerformanceMetrics;
        operator: '>' | '<';
        value: number;
    }>;
    actions: Array<{
        type: 'adjust_quality' | 'clear_cache';
        value: any;
    }>;
    enabled: boolean;
}

interface PerformanceTunerContextType {
    config: PerformanceTunerConfig;
    metrics: PerformanceMetrics | null;
    isOptimizing: boolean;
    isProfiling: boolean;
    optimizePerformance: () => Promise<void>;
    startProfiling: () => void;
    stopProfiling: () => void;
}

const PerformanceTunerContext = createContext<PerformanceTunerContextType | null>(null);

interface PerformanceTunerProviderProps {
    children: React.ReactNode;
    config?: Partial<PerformanceTunerConfig>;
}

export const PerformanceTunerProvider: React.FC<PerformanceTunerProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config] = useState<PerformanceTunerConfig>({
        enableAutoOptimization: true,
        enableProfiling: true,
        optimizationInterval: 30000,
        performanceThresholds: {
            cpuUsage: 80,
            memoryUsage: 85,
            networkLatency: 1000,
            renderTime: 16
        },
        ...userConfig
    });

    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isProfiling, setIsProfiling] = useState(false);

    const collectMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
        const now = new Date();
        
        // Simplified metrics collection
        const cpuUsage = Math.random() * 100; // Simulated
        const memoryInfo = 'memory' in performance ? (performance as any).memory : { usedJSHeapSize: 0, totalJSHeapSize: 0 };
        
        const metrics: PerformanceMetrics = {
            timestamp: now,
            cpu: { usage: cpuUsage, cores: navigator.hardwareConcurrency || 4 },
            memory: {
                used: memoryInfo.usedJSHeapSize,
                total: memoryInfo.totalJSHeapSize,
                percentage: memoryInfo.totalJSHeapSize > 0 ? (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0
            },
            network: {
                latency: Math.random() * 500,
                bandwidth: 10,
                online: navigator.onLine
            },
            rendering: {
                fps: 60 - Math.random() * 20,
                renderTime: 16 + Math.random() * 10
            }
        };

        setMetrics(metrics);
        return metrics;
    }, []);

    const optimizePerformance = useCallback(async (): Promise<void> => {
        if (!config.enableAutoOptimization || !metrics || isOptimizing) return;

        setIsOptimizing(true);
        try {
            console.log('Running performance optimization...');
            // Optimization logic would go here
            await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
            setIsOptimizing(false);
        }
    }, [config.enableAutoOptimization, metrics, isOptimizing]);

    const startProfiling = useCallback(() => {
        if (isProfiling) return;
        setIsProfiling(true);
        console.log('Starting performance profiling...');
    }, [isProfiling]);

    const stopProfiling = useCallback(() => {
        if (!isProfiling) return;
        setIsProfiling(false);
        console.log('Stopping performance profiling...');
    }, [isProfiling]);

    // Auto-optimization
    useEffect(() => {
        if (config.enableAutoOptimization) {
            const interval = setInterval(() => {
                collectMetrics().then(optimizePerformance);
            }, config.optimizationInterval);

            return () => clearInterval(interval);
        }
    }, [config.enableAutoOptimization, config.optimizationInterval, collectMetrics, optimizePerformance]);

    // Initial metrics collection
    useEffect(() => {
        collectMetrics();
    }, [collectMetrics]);

    const value: PerformanceTunerContextType = {
        config,
        metrics,
        isOptimizing,
        isProfiling,
        optimizePerformance,
        startProfiling,
        stopProfiling
    };

    return (
        <PerformanceTunerContext.Provider value={value}>
            {children}
        </PerformanceTunerContext.Provider>
    );
};

export const usePerformanceTuner = () => {
    const context = useContext(PerformanceTunerContext);
    if (!context) {
        throw new Error('usePerformanceTuner must be used within PerformanceTunerProvider');
    }
    return context;
};

// Performance Dashboard Component
interface PerformanceDashboardProps {
    className?: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ 
    className = '' 
}) => {
    const { 
        metrics, 
        isOptimizing, 
        isProfiling, 
        startProfiling, 
        stopProfiling, 
        optimizePerformance 
    } = usePerformanceTuner();

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-900\">Performance Dashboard</h2>
                <div className=\"flex items-center space-x-2\">
                    {isProfiling && (
                        <div className=\"flex items-center space-x-1 text-red-500\">
                            <FiActivity className=\"animate-pulse\" />
                            <span className=\"text-sm\">Profiling</span>
                        </div>
                    )}
                    {isOptimizing && (
                        <div className=\"flex items-center space-x-1 text-blue-500\">
                            <FiRefreshCw className=\"animate-spin\" />
                            <span className=\"text-sm\">Optimizing</span>
                        </div>
                    )}
                </div>
            </div>

            {metrics && (
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6\">
                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiCpu className=\"text-gray-600\" />
                            <span className=\"font-medium\">CPU</span>
                        </div>
                        <div className=\"text-2xl font-bold text-blue-500\">
                            {metrics.cpu.usage.toFixed(1)}%
                        </div>
                        <div className=\"text-sm text-gray-600\">{metrics.cpu.cores} cores</div>
                    </div>

                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiActivity className=\"text-gray-600\" />
                            <span className=\"font-medium\">Memory</span>
                        </div>
                        <div className=\"text-2xl font-bold text-green-500\">
                            {metrics.memory.percentage.toFixed(1)}%
                        </div>
                        <div className=\"text-sm text-gray-600\">
                            {(metrics.memory.used / 1024 / 1024).toFixed(1)}MB
                        </div>
                    </div>

                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiSettings className=\"text-gray-600\" />
                            <span className=\"font-medium\">Network</span>
                        </div>
                        <div className=\"text-2xl font-bold text-yellow-500\">
                            {metrics.network.latency.toFixed(0)}ms
                        </div>
                        <div className=\"text-sm text-gray-600\">{metrics.network.online ? 'Online' : 'Offline'}</div>
                    </div>

                    <div className=\"p-4 bg-gray-50 rounded-lg\">
                        <div className=\"flex items-center space-x-2 mb-2\">
                            <FiZap className=\"text-gray-600\" />
                            <span className=\"font-medium\">FPS</span>
                        </div>
                        <div className=\"text-2xl font-bold text-purple-500\">
                            {metrics.rendering.fps.toFixed(0)}
                        </div>
                        <div className=\"text-sm text-gray-600\">{metrics.rendering.renderTime.toFixed(1)}ms</div>
                    </div>
                </div>
            )}

            <div className=\"flex flex-wrap gap-2\">
                <button
                    onClick={isProfiling ? stopProfiling : startProfiling}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                        isProfiling 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isProfiling ? 'Stop Profiling' : 'Start Profiling'}
                </button>
                
                <button
                    onClick={optimizePerformance}
                    disabled={isOptimizing}
                    className=\"px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"
                >
                    {isOptimizing ? 'Optimizing...' : 'Optimize Now'}
                </button>
            </div>
        </div>
    );
};

export default PerformanceTunerProvider;
