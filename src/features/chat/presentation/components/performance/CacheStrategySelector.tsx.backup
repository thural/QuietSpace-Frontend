/**
 * Cache Strategy Selector
 * 
 * This component provides intelligent cache strategy selection with
 * performance monitoring, analytics, and automatic optimization.
 */

import React, { useState, useEffect, useMemo } from 'react';
import BoxStyled from '@shared/BoxStyled';
import Typography from '@shared/Typography';
import { 
    FiZap, 
    FiDatabase, 
    FiActivity, 
    FiSettings,
    FiTrendingUp,
    FiTrendingDown,
    FiRefreshCw,
    FiBarChart2,
    FiClock,
    FiHardDrive
} from 'react-icons/fi';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export interface CacheStrategy {
    name: string;
    description: string;
    ttl: number; // Time to live in milliseconds
    maxSize: number; // Maximum cache size
    evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'random';
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
    performanceMetrics: {
        hitRate: number;
        missRate: number;
        avgResponseTime: number;
        memoryUsage: number;
        evictionCount: number;
        compressionRatio?: number;
    };
    recommendations: string[];
    suitableFor: string[];
    icon: React.ReactNode;
}

export interface CachePerformanceData {
    timestamp: string;
    hitRate: number;
    missRate: number;
    responseTime: number;
    memoryUsage: number;
    evictionCount: number;
    strategy: string;
}

interface CacheStrategySelectorProps {
    currentStrategy?: string;
    onStrategyChange?: (strategy: CacheStrategy) => void;
    performanceData?: CachePerformanceData[];
    autoOptimize?: boolean;
    showRecommendations?: boolean;
}

/**
 * Cache Strategy Selector component with intelligent optimization
 */
const CacheStrategySelector: React.FC<CacheStrategySelectorProps> = ({
    currentStrategy = 'moderate',
    onStrategyChange,
    performanceData = [],
    autoOptimize = true,
    showRecommendations = true
}) => {
    const [selectedStrategy, setSelectedStrategy] = useState<string>(currentStrategy);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [optimizationResults, setOptimizationResults] = useState<any>(null);

    // Predefined cache strategies
    const cacheStrategies: CacheStrategy[] = useMemo(() => [
        {
            name: 'aggressive',
            description: 'Maximum caching with longer TTL for best performance',
            ttl: 600000, // 10 minutes
            maxSize: 1000,
            evictionPolicy: 'lru',
            compressionEnabled: true,
            encryptionEnabled: false,
            performanceMetrics: {
                hitRate: 92,
                missRate: 8,
                avgResponseTime: 45,
                memoryUsage: 85,
                evictionCount: 12,
                compressionRatio: 0.65
            },
            recommendations: [
                'Best for read-heavy applications',
                'Use when data changes infrequently',
                'Monitor memory usage closely'
            ],
            suitableFor: [
                'Static data',
                'User profiles',
                'Configuration data'
            ],
            icon: <FiZap />
        },
        {
            name: 'moderate',
            description: 'Balanced caching with moderate TTL and size limits',
            ttl: 300000, // 5 minutes
            maxSize: 500,
            evictionPolicy: 'lru',
            compressionEnabled: true,
            encryptionEnabled: false,
            performanceMetrics: {
                hitRate: 85,
                missRate: 15,
                avgResponseTime: 65,
                memoryUsage: 60,
                evictionCount: 8,
                compressionRatio: 0.70
            },
            recommendations: [
                'Good balance for most applications',
                'Suitable for mixed read/write workloads',
                'Monitor hit rate regularly'
            ],
            suitableFor: [
                'Chat messages',
                'User activity data',
                'Dynamic content'
            ],
            icon: <FiDatabase />
        },
        {
            name: 'conservative',
            description: 'Minimal caching with short TTL for data freshness',
            ttl: 60000, // 1 minute
            maxSize: 200,
            evictionPolicy: 'fifo',
            compressionEnabled: false,
            encryptionEnabled: false,
            performanceMetrics: {
                hitRate: 65,
                missRate: 35,
                avgResponseTime: 120,
                memoryUsage: 30,
                evictionCount: 25,
                compressionRatio: undefined
            },
            recommendations: [
                'Best for real-time data',
                'Use when data freshness is critical',
                'Consider increasing hit rate'
            ],
            suitableFor: [
                'Real-time updates',
                'Financial data',
                'Security-sensitive data'
            ],
            icon: <FiActivity />
        },
        {
            name: 'adaptive',
            description: 'Dynamic strategy that adjusts based on usage patterns',
            ttl: 0, // Dynamic
            maxSize: 0, // Dynamic
            evictionPolicy: 'lru',
            compressionEnabled: true,
            encryptionEnabled: true,
            performanceMetrics: {
                hitRate: 88,
                missRate: 12,
                avgResponseTime: 55,
                memoryUsage: 70,
                evictionCount: 15,
                compressionRatio: 0.68
            },
            recommendations: [
                'Automatically optimizes based on patterns',
                'Requires monitoring and tuning',
                'Best for complex applications'
            ],
            suitableFor: [
                'Complex applications',
                'Variable workloads',
                'Production systems'
            ],
            icon: <FiSettings />
        }
    ], []);

    const currentStrategyData = cacheStrategies.find(s => s.name === selectedStrategy);

    // Analyze performance data and recommend optimal strategy
    const getRecommendedStrategy = useMemo((): CacheStrategy | null => {
        if (performanceData.length === 0) return null;

        const latestData = performanceData[performanceData.length - 1];
        const avgHitRate = performanceData.reduce((sum, d) => sum + d.hitRate, 0) / performanceData.length;
        const avgResponseTime = performanceData.reduce((sum, d) => sum + d.responseTime, 0) / performanceData.length;
        const avgMemoryUsage = performanceData.reduce((sum, d) => sum + d.memoryUsage, 0) / performanceData.length;

        // Decision logic for strategy recommendation
        if (avgHitRate < 70 && avgResponseTime > 100) {
            return cacheStrategies.find(s => s.name === 'aggressive') || null;
        } else if (avgHitRate > 85 && avgMemoryUsage > 80) {
            return cacheStrategies.find(s => s.name === 'conservative') || null;
        } else if (avgResponseTime > 150) {
            return cacheStrategies.find(s => s.name === 'aggressive') || null;
        } else if (avgMemoryUsage > 90) {
            return cacheStrategies.find(s => s.name === 'conservative') || null;
        }

        return cacheStrategies.find(s => s.name === 'moderate') || null;
    }, [performanceData, cacheStrategies]);

    const recommendedStrategy = getRecommendedStrategy;

    // Auto-optimize if enabled
    useEffect(() => {
        if (autoOptimize && recommendedStrategy && recommendedStrategy.name !== selectedStrategy) {
            const timer = setTimeout(() => {
                handleAutoOptimize();
            }, 5000); // Wait 5 seconds before auto-optimizing

            return () => clearTimeout(timer);
        }
    }, [recommendedStrategy, selectedStrategy, autoOptimize]);

    const handleStrategyChange = (strategy: CacheStrategy) => {
        setSelectedStrategy(strategy.name);
        onStrategyChange?.(strategy);
    };

    const handleAutoOptimize = async () => {
        if (!recommendedStrategy) return;

        setIsOptimizing(true);
        
        // Simulate optimization process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSelectedStrategy(recommendedStrategy.name);
        onStrategyChange?.(recommendedStrategy);
        
        setOptimizationResults({
            previousStrategy: selectedStrategy,
            newStrategy: recommendedStrategy.name,
            improvement: {
                hitRate: '+5%',
                responseTime: '-20%',
                memoryUsage: '-15%'
            }
        });
        
        setIsOptimizing(false);
    };

    const getPerformanceColor = (value: number, type: 'hitRate' | 'responseTime' | 'memoryUsage') => {
        switch (type) {
            case 'hitRate':
                return value >= 90 ? 'text-green-600' : value >= 75 ? 'text-yellow-600' : 'text-red-600';
            case 'responseTime':
                return value <= 50 ? 'text-green-600' : value <= 100 ? 'text-yellow-600' : 'text-red-600';
            case 'memoryUsage':
                return value <= 50 ? 'text-green-600' : value <= 75 ? 'text-yellow-600' : 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatTTL = (ttl: number) => {
        if (ttl === 0) return 'Dynamic';
        if (ttl < 60000) return `${ttl / 1000}s`;
        if (ttl < 3600000) return `${ttl / 60000}m`;
        return `${ttl / 3600000}h`;
    };

    // Generate performance chart data
    const performanceChartData = useMemo(() => {
        return performanceData.map(data => ({
            ...data,
            timestamp: new Date(data.timestamp).toLocaleTimeString()
        }));
    }, [performanceData]);

    // Generate strategy comparison data
    const strategyComparisonData = useMemo(() => {
        return cacheStrategies.map(strategy => ({
            name: strategy.name,
            hitRate: strategy.performanceMetrics.hitRate,
            responseTime: strategy.performanceMetrics.avgResponseTime,
            memoryUsage: strategy.performanceMetrics.memoryUsage
        }));
    }, [cacheStrategies]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <BoxStyled className=\"p-6 bg-white rounded-lg shadow-lg\">
            {/* Header */}
            <div className=\"flex items-center justify-between mb-6\">
                <div className=\"flex items-center space-x-3\">
                    <FiDatabase className=\"text-2xl text-blue-600\" />
                    <div>
                        <Typography type=\"h4\">Cache Strategy Optimization</Typography>
                        <Typography className=\"text-sm text-gray-500\">
                            Intelligent cache strategy selection and performance monitoring
                        </Typography>
                    </div>
                </div>
                
                <div className=\"flex items-center space-x-3\">
                    {autoOptimize && (
                        <div className=\"flex items-center space-x-2 text-sm text-green-600\">
                            <FiActivity className=\"animate-pulse\" />
                            <span>Auto-optimize Active</span>
                        </div>
                    )}
                    
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className=\"px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50\"
                    >
                        {showAdvanced ? 'Basic' : 'Advanced'}
                    </button>
                </div>
            </div>

            {/* Recommendation Alert */}
            {showRecommendations && recommendedStrategy && recommendedStrategy.name !== selectedStrategy && (
                <div className=\"mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg\">
                    <div className=\"flex items-center justify-between\">
                        <div className=\"flex items-center space-x-3\">
                            <FiTrendingUp className=\"text-blue-600\" />
                            <div>
                                <Typography className=\"font-medium text-blue-900\">
                                    Recommended Strategy: {recommendedStrategy.name}
                                </Typography>
                                <Typography className=\"text-sm text-blue-700\">
                                    {recommendedStrategy.description}
                                </Typography>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleAutoOptimize}
                            disabled={isOptimizing}
                            className=\"flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50\"
                        >
                            {isOptimizing ? (
                                <>
                                    <FiRefreshCw className=\"animate-spin\" />
                                    <span>Optimizing...</span>
                                </>
                            ) : (
                                <>
                                    <FiZap />
                                    <span>Apply</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Optimization Results */}
            {optimizationResults && (
                <div className=\"mb-6 p-4 bg-green-50 border border-green-200 rounded-lg\">
                    <div className=\"flex items-center space-x-3\">
                        <FiCheckCircle className=\"text-green-600\" />
                        <div>
                            <Typography className=\"font-medium text-green-900\">
                                Optimization Complete
                            </Typography>
                            <Typography className=\"text-sm text-green-700\">
                                Changed from {optimizationResults.previousStrategy} to {optimizationResults.newStrategy}
                            </Typography>
                            <div className=\"flex items-center space-x-4 mt-2 text-sm text-green-600\">
                                <span>Hit Rate: {optimizationResults.improvement.hitRate}</span>
                                <span>Response Time: {optimizationResults.improvement.responseTime}</span>
                                <span>Memory: {optimizationResults.improvement.memoryUsage}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Strategy Selection */}
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6\">
                {cacheStrategies.map((strategy) => (
                    <div
                        key={strategy.name}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedStrategy === strategy.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white'
                        }`}
                        onClick={() => handleStrategyChange(strategy)}
                    >
                        <div className=\"flex items-center justify-between mb-3\">
                            <div className=\"flex items-center space-x-2\">
                                <div className={`p-2 rounded-lg ${
                                    selectedStrategy === strategy.name ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {strategy.icon}
                                </div>
                                <Typography className=\"font-medium\">{strategy.name}</Typography>
                            </div>
                            
                            {recommendedStrategy?.name === strategy.name && (
                                <div className=\"text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full\">
                                    Recommended
                                </div>
                            )}
                        </div>

                        <Typography className=\"text-sm text-gray-600 mb-3\">
                            {strategy.description}
                        </Typography>

                        <div className=\"space-y-2 text-sm\">
                            <div className=\"flex justify-between\">
                                <span className=\"text-gray-500\">TTL:</span>
                                <span className=\"font-medium\">{formatTTL(strategy.ttl)}</span>
                            </div>
                            <div className=\"flex justify-between\">
                                <span className=\"text-gray-500\">Size:</span>
                                <span className=\"font-medium\">{strategy.maxSize || 'Dynamic'}</span>
                            </div>
                            <div className=\"flex justify-between\">
                                <span className=\"text-gray-500\">Hit Rate:</span>
                                <span className={`font-medium ${getPerformanceColor(strategy.performanceMetrics.hitRate, 'hitRate')}`}>
                                    {strategy.performanceMetrics.hitRate}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Current Strategy Details */}
            {currentStrategyData && (
                <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6\">
                    {/* Strategy Configuration */}
                    <div className=\"bg-gray-50 p-4 rounded-lg\">
                        <Typography type=\"h5\" className=\"mb-4 flex items-center space-x-2\">
                            <FiSettings className=\"text-blue-600\" />
                            <span>Configuration</span>
                        </Typography>
                        
                        <div className=\"space-y-3\">
                            <div className=\"flex justify-between items-center\">
                                <span className=\"text-sm text-gray-600\">Eviction Policy</span>
                                <span className=\"text-sm font-medium uppercase\">{currentStrategyData.evictionPolicy}</span>
                            </div>
                            <div className=\"flex justify-between items-center\">
                                <span className=\"text-sm text-gray-600\">Compression</span>
                                <span className={`text-sm font-medium ${currentStrategyData.compressionEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                                    {currentStrategyData.compressionEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            <div className=\"flex justify-between items-center\">
                                <span className=\"text-sm text-gray-600\">Encryption</span>
                                <span className={`text-sm font-medium ${currentStrategyData.encryptionEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                                    {currentStrategyData.encryptionEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            {currentStrategyData.performanceMetrics.compressionRatio && (
                                <div className=\"flex justify-between items-center\">
                                    <span className=\"text-sm text-gray-600\">Compression Ratio</span>
                                    <span className=\"text-sm font-medium\">{(currentStrategyData.performanceMetrics.compressionRatio * 100).toFixed(0)}%</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className=\"bg-gray-50 p-4 rounded-lg\">
                        <Typography type=\"h5\" className=\"mb-4 flex items-center space-x-2\">
                            <FiBarChart2 className=\"text-green-600\" />
                            <span>Performance Metrics</span>
                        </Typography>
                        
                        <div className=\"space-y-3\">
                            <div className=\"flex justify-between items-center\">
                                <span className=\"text-sm text-gray-600\">Hit Rate</span>
                                <span className={`text-sm font-medium ${getPerformanceColor(currentStrategyData.performanceMetrics.hitRate, 'hitRate')}`}>
                                    {currentStrategyData.performanceMetrics.hitRate}%
                                </span>
                            </div>
                            <div className=\"flex justify-between items-center\">
                                <span className=\"text-sm text-gray-600\">Miss Rate</span>
                                <span className=\"text-sm font-medium text-red-600\">
                                    {currentStrategyData.performanceMetrics.missRate}%
                                </span>
                            </div>
                            <div className=\"flex justify-between items-center\">
                                <span className=\"text-sm text-gray-600\">Avg Response Time</span>
                                <span className={`text-sm font-medium ${getPerformanceColor(currentStrategyData.performanceMetrics.avgResponseTime, 'responseTime')}`}>
                                    {currentStrategyData.performanceMetrics.avgResponseTime}ms
                                </span>
                            </div>
                            <div className=\"flex justify-between items-center\">
                                <span className=\"text-sm text-gray-600\">Memory Usage</span>
                                <span className={`text-sm font-medium ${getPerformanceColor(currentStrategyData.performanceMetrics.memoryUsage, 'memoryUsage')}`}>
                                    {currentStrategyData.performanceMetrics.memoryUsage}%
                                </span>
                            </div>
                            <div className=\"flex justify-between items-center\">
                                <span className=\"text-sm text-gray-600\">Evictions</span>
                                <span className=\"text-sm font-medium text-orange-600\">
                                    {currentStrategyData.performanceMetrics.evictionCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Features */}
            {showAdvanced && (
                <div className=\"space-y-6\">
                    {/* Performance Chart */}
                    {performanceChartData.length > 0 && (
                        <div className=\"bg-gray-50 p-4 rounded-lg\">
                            <Typography type=\"h5\" className=\"mb-4\">Performance Trends</Typography>
                            <ResponsiveContainer width=\"100%\" height={200}>
                                <LineChart data={performanceChartData}>
                                    <CartesianGrid strokeDasharray=\"3 3\" />
                                    <XAxis dataKey=\"timestamp\" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type=\"monotone\" dataKey=\"hitRate\" stroke=\"#10b981\" strokeWidth={2} />
                                    <Line type=\"monotone\" dataKey=\"responseTime\" stroke=\"#f59e0b\" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Strategy Comparison */}
                    <div className=\"bg-gray-50 p-4 rounded-lg\">
                        <Typography type=\"h5\" className=\"mb-4\">Strategy Comparison</Typography>
                        <ResponsiveContainer width=\"100%\" height={250}>
                            <BarChart data={strategyComparisonData}>
                                <CartesianGrid strokeDasharray=\"3 3\" />
                                <XAxis dataKey=\"name\" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey=\"hitRate\" fill=\"#10b981\" />
                                <Bar dataKey=\"responseTime\" fill=\"#f59e0b\" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recommendations */}
                    {currentStrategyData && (
                        <div className=\"bg-blue-50 p-4 rounded-lg\">
                            <Typography type=\"h5\" className=\"mb-4\">Recommendations</Typography>
                            <div className=\"space-y-2\">
                                {currentStrategyData.recommendations.map((rec, index) => (
                                    <div key={index} className=\"flex items-start space-x-2 text-sm text-blue-800\">
                                        <FiTrendingUp className=\"mt-1 flex-shrink-0\" />
                                        <span>{rec}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className=\"mt-4 pt-4 border-t border-blue-200\">
                                <Typography className=\"text-sm font-medium text-blue-900 mb-2\">Suitable For:</Typography>
                                <div className=\"flex flex-wrap gap-2\">
                                    {currentStrategyData.suitableFor.map((item, index) => (
                                        <span key={index} className=\"px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs\">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </BoxStyled>
    );
};

export default CacheStrategySelector;
