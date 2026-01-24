/**
 * Performance Optimization Components Index
 * 
 * This file exports all performance optimization components and utilities for easy importing
 * throughout the chat feature.
 */

// Main Performance Optimization Components
export { default as PerformanceTunerProvider } from './PerformanceTuner';
export { default as AdvancedCacheManagerProvider } from './AdvancedCacheManager';
export { default as ResourceOptimizerProvider } from './ResourceOptimizer';
export { default as AdvancedPerformanceMonitorProvider } from './AdvancedPerformanceMonitor';

// Legacy Performance Components
export { default as CacheStrategySelector } from './CacheStrategySelector';
export { default as PerformanceMonitor } from './PerformanceMonitor';
export { default as CacheAnalytics } from './CacheAnalytics';

// Re-export for convenience
export {
    PerformanceTunerProvider as ChatPerformanceTunerProvider,
    AdvancedCacheManagerProvider as ChatAdvancedCacheManagerProvider,
    ResourceOptimizerProvider as ChatResourceOptimizerProvider,
    AdvancedPerformanceMonitorProvider as ChatAdvancedPerformanceMonitorProvider
} from './AdvancedPerformanceMonitor';

// Dashboard Components
export { PerformanceDashboard } from './PerformanceTuner';
export { CacheAnalyticsDashboard } from './AdvancedCacheManager';
export { ResourceMonitorDashboard } from './ResourceOptimizer';
export { PerformanceMonitorDashboard } from './AdvancedPerformanceMonitor';

// Lazy Loading Components
export { 
    LazyLoadWrapper,
    withLazyLoad,
    createLazyComponent,
    LazyLoadOnScroll,
    LazyLoadWithRetry,
    LazyLoadConfigProvider,
    useLazyLoadConfig,
    createLazyComponentFactory,
    LazyLoadingPatterns,
    preloadComponent,
    preloadComponents,
    useIntersectionObserver,
    useLazyLoad,
    useLazyLoadPerformance,
    type LazyLoadConfig
} from './LazyLoadingComponents';

// Types and Interfaces
export type { 
    PerformanceTunerConfig, 
    PerformanceMetrics, 
    OptimizationStrategy, 
    QualityLevel 
} from './PerformanceTuner';

export type { 
    CacheConfig, 
    CacheTier, 
    CacheEntry, 
    CacheAnalytics, 
    CacheInvalidationStrategy 
} from './AdvancedCacheManager';

export type { 
    ResourceOptimizerConfig, 
    ResourceMetrics, 
    CleanupStrategy, 
    OptimizationReport 
} from './ResourceOptimizer';

export type { 
    PerformanceMonitorConfig, 
    PerformanceAlert, 
    DetailedMetrics, 
    PerformanceReport 
} from './AdvancedPerformanceMonitor';

// Hooks
export { usePerformanceTuner } from './PerformanceTuner';
export { useAdvancedCacheManager } from './AdvancedCacheManager';
export { useResourceOptimizer } from './ResourceOptimizer';
export { useAdvancedPerformanceMonitor } from './AdvancedPerformanceMonitor';

// Utilities
export const PerformanceOptimizationUtils = {
    // Performance analysis utilities
    analyzePerformance: (metrics: any) => {
        const score = calculatePerformanceScore(metrics);
        const recommendations = generateOptimizationRecommendations(metrics);
        return { score, recommendations };
    },
    
    // Cache optimization utilities
    optimizeCacheStrategy: (usage: any) => {
        const strategy = determineOptimalCacheStrategy(usage);
        return strategy;
    },
    
    // Resource optimization utilities
    optimizeResourceUsage: (resources: any) => {
        const optimizations = identifyResourceOptimizations(resources);
        return optimizations;
    },
    
    // Performance monitoring utilities
    setupMonitoring: (config: any) => {
        const monitoring = configurePerformanceMonitoring(config);
        return monitoring;
    },
    
    // Alert management utilities
    manageAlerts: (alerts: any) => {
        const managed = processAlerts(alerts);
        return managed;
    }
};

// Helper functions
function calculatePerformanceScore(metrics: any): number {
    let score = 100;
    
    if (metrics.cpu?.usage > 80) score -= 20;
    if (metrics.memory?.percentage > 85) score -= 20;
    if (metrics.network?.latency > 1000) score -= 15;
    if (metrics.rendering?.frameRate < 30) score -= 25;
    
    return Math.max(0, score);
}

function generateOptimizationRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];
    
    if (metrics.cpu?.usage > 80) {
        recommendations.push('Consider CPU optimization strategies');
    }
    
    if (metrics.memory?.percentage > 85) {
        recommendations.push('Implement memory cleanup procedures');
    }
    
    if (metrics.network?.latency > 1000) {
        recommendations.push('Optimize network requests and caching');
    }
    
    if (metrics.rendering?.frameRate < 30) {
        recommendations.push('Optimize rendering performance');
    }
    
    return recommendations;
}

function determineOptimalCacheStrategy(usage: any): any {
    return {
        strategy: usage.hitRate > 80 ? 'aggressive' : 'conservative',
        ttl: usage.hitRate > 80 ? 600000 : 300000,
        maxSize: usage.frequency > 100 ? 100 : 50
    };
}

function identifyResourceOptimizations(resources: any): any[] {
    const optimizations: any[] = [];
    
    if (resources.memory > 85) {
        optimizations.push({ type: 'memory', action: 'cleanup' });
    }
    
    if (resources.cpu > 80) {
        optimizations.push({ type: 'cpu', action: 'throttle' });
    }
    
    return optimizations;
}

function configurePerformanceMonitoring(config: any): any {
    return {
        enabled: true,
        interval: config.interval || 5000,
        alerts: config.alerts || true,
        metrics: ['cpu', 'memory', 'network', 'rendering']
    };
}

function processAlerts(alerts: any): any {
    return {
        total: alerts.length,
        critical: alerts.filter((a: any) => a.type === 'critical').length,
        warning: alerts.filter((a: any) => a.type === 'warning').length,
        acknowledged: alerts.filter((a: any) => a.acknowledged).length,
        resolved: alerts.filter((a: any) => a.resolved).length
    };
}

export default PerformanceOptimizationUtils;
export {
    // Cache Strategy
    CacheStrategySelector as ChatCacheStrategySelector,
    
    // Performance Monitoring
    PerformanceMonitor as ChatPerformanceMonitor,
    
    // Cache Analytics
    CacheAnalytics as ChatCacheAnalytics,
    
    // Lazy Loading
    LazyLoadWrapper as ChatLazyLoadWrapper,
    withLazyLoad as withChatLazyLoad,
    createLazyComponent as createChatLazyComponent,
    LazyLoadOnScroll as ChatLazyLoadOnScroll,
    LazyLoadWithRetry as ChatLazyLoadWithRetry,
    LazyLoadConfigProvider as ChatLazyLoadConfigProvider,
    useLazyLoadConfig as useChatLazyLoadConfig,
    createLazyComponentFactory as createChatLazyComponentFactory,
    LazyLoadingPatterns as ChatLazyLoadingPatterns,
    preloadComponent as preloadChatComponent,
    preloadComponents as preloadChatComponents,
    useIntersectionObserver as useChatIntersectionObserver,
    useLazyLoad as useChatLazyLoad,
    useLazyLoadPerformance as useChatLazyLoadPerformance
} from './LazyLoadingComponents';

// Types
export type {
    CacheStrategy,
    CachePerformanceData,
    CacheKeyStats,
    CacheOptimization
} from './CacheStrategySelector';

export type {
    PerformanceMetrics,
    PerformanceAlert
} from './PerformanceMonitor';

export type {
    CacheAnalyticsData,
    LazyLoadConfig
} from './CacheAnalytics';
