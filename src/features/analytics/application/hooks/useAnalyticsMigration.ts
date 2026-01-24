/**
 * Analytics Migration Hook
 * 
 * Provides backward compatibility during migration from legacy analytics hooks to enterprise analytics hooks
 * Allows gradual migration with feature flags and fallback mechanisms
 */

import { useEffect, useState } from 'react';
import { useEnterpriseAnalytics } from './useEnterpriseAnalytics';
import { useAnalytics } from './useAnalytics';
import { useAnalyticsDashboard } from './useAnalyticsDashboard';
import { useRealtimeAnalytics } from './useRealtimeAnalytics';

/**
 * Migration configuration
 */
interface AnalyticsMigrationConfig {
  useEnterpriseHooks: boolean;
  enableFallback: boolean;
  logMigrationEvents: boolean;
  dataProcessingLevel: 'basic' | 'enhanced' | 'maximum';
  realTimeLevel: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Migration state
 */
interface AnalyticsMigrationState {
  isUsingEnterprise: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterpriseHookTime: number;
    legacyHookTime: number;
    dataProcessingTime: number;
    realTimeConnectionTime: number;
  };
  features: {
    realTimeEnabled: boolean;
    dataProcessingEnabled: boolean;
    advancedReportingEnabled: boolean;
    predictiveAnalyticsEnabled: boolean;
  };
}

/**
 * Analytics Migration Hook
 * 
 * Provides seamless migration between legacy and enterprise analytics hooks
 * with feature flags, performance monitoring, and error handling
 */
export const useAnalyticsMigration = (config: AnalyticsMigrationConfig = {
  useEnterpriseHooks: true,
  enableFallback: true,
  logMigrationEvents: true,
  dataProcessingLevel: 'enhanced',
  realTimeLevel: 'enhanced'
}) => {
  const [migrationState, setMigrationState] = useState<AnalyticsMigrationState>({
    isUsingEnterprise: config.useEnterpriseHooks,
    migrationErrors: [],
    performanceMetrics: {
      enterpriseHookTime: 0,
      legacyHookTime: 0,
      dataProcessingTime: 0,
      realTimeConnectionTime: 0
    },
    features: {
      realTimeEnabled: false,
      dataProcessingEnabled: false,
      advancedReportingEnabled: false,
      predictiveAnalyticsEnabled: false
    }
  });

  // Enterprise hooks
  const enterpriseAnalytics = useEnterpriseAnalytics();
  const legacyAnalytics = useAnalytics();
  const dashboardAnalytics = useAnalyticsDashboard();
  const realtimeAnalytics = useRealtimeAnalytics();

  // Performance monitoring
  useEffect(() => {
    if (config.logMigrationEvents) {
      const startTime = performance.now();
      
      // Simulate performance measurement
      setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        setMigrationState(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            enterpriseHookTime: duration
          }
        }));
        
        console.log(`📊 Enterprise analytics hook performance: ${duration.toFixed(2)}ms`);
      }, 0);
    }
  }, [config.logMigrationEvents]);

  // Error handling and fallback
  useEffect(() => {
    const errors: string[] = [];
    
    if (enterpriseAnalytics.error) {
      errors.push(`Enterprise analytics error: ${enterpriseAnalytics.error}`);
    }
    
    if (legacyAnalytics.error) {
      errors.push(`Legacy analytics error: ${legacyAnalytics.error}`);
    }
    
    if (errors.length > 0) {
      setMigrationState(prev => ({
        ...prev,
        migrationErrors: errors
      }));
      
      if (config.logMigrationEvents) {
        console.warn('📊 Analytics migration errors:', errors);
      }
    }
  }, [
    enterpriseAnalytics.error,
    legacyAnalytics.error,
    config.logMigrationEvents
  ]);

  // Feature monitoring
  useEffect(() => {
    setMigrationState(prev => ({
      ...prev,
      features: {
        realTimeEnabled: enterpriseAnalytics.realTimeEnabled || false,
        dataProcessingEnabled: enterpriseAnalytics.processingStatus !== 'idle',
        advancedReportingEnabled: !!enterpriseAnalytics.reports,
        predictiveAnalyticsEnabled: true // Always enabled in enterprise
      }
    }));
  }, [
    enterpriseAnalytics.realTimeEnabled,
    enterpriseAnalytics.processingStatus,
    enterpriseAnalytics.reports
  ]);

  // Determine which hooks to use based on configuration and errors
  const shouldUseEnterprise = config.useEnterpriseHooks && 
    (migrationState.migrationErrors.length === 0 || !config.enableFallback);

  // Update migration state
  useEffect(() => {
    setMigrationState(prev => ({
      ...prev,
      isUsingEnterprise: shouldUseEnterprise
    }));
  }, [shouldUseEnterprise]);

  // Return appropriate hook data based on migration state and feature levels
  if (shouldUseEnterprise) {
    if (config.dataProcessingLevel === 'maximum' && config.realTimeLevel === 'enhanced') {
      // Use full enterprise analytics with all features
      return {
        // Enterprise analytics data
        metrics: enterpriseAnalytics.metrics,
        dashboards: enterpriseAnalytics.dashboards,
        reports: enterpriseAnalytics.reports,
        insights: enterpriseAnalytics.insights,
        funnels: enterpriseAnalytics.funnels,
        goals: enterpriseAnalytics.goals,
        selectedDashboard: enterpriseAnalytics.selectedDashboard,
        selectedReport: enterpriseAnalytics.selectedReport,
        isLoading: enterpriseAnalytics.isLoading,
        error: enterpriseAnalytics.error,
        dateRange: enterpriseAnalytics.dateRange,
        filters: enterpriseAnalytics.filters,
        realTimeEnabled: enterpriseAnalytics.realTimeEnabled,
        processingStatus: enterpriseAnalytics.processingStatus,
        lastUpdateTime: enterpriseAnalytics.lastUpdateTime,
        cacheHitRate: enterpriseAnalytics.cacheHitRate,
        dataFreshness: enterpriseAnalytics.dataFreshness,

        // Enterprise analytics actions
        fetchMetrics: enterpriseAnalytics.fetchMetrics,
        fetchDashboards: enterpriseAnalytics.fetchDashboards,
        fetchReports: enterpriseAnalytics.fetchReports,
        fetchInsights: enterpriseAnalytics.fetchInsights,
        fetchFunnels: enterpriseAnalytics.fetchFunnels,
        fetchGoals: enterpriseAnalytics.fetchGoals,
        refreshAllData: enterpriseAnalytics.refreshAllData,
        trackEvent: enterpriseAnalytics.trackEvent,
        trackPageView: enterpriseAnalytics.trackPageView,
        trackContentView: enterpriseAnalytics.trackContentView,
        trackUserAction: enterpriseAnalytics.trackUserAction,
        trackBatchEvents: enterpriseAnalytics.trackBatchEvents,
        createDashboard: enterpriseAnalytics.createDashboard,
        updateDashboard: enterpriseAnalytics.updateDashboard,
        deleteDashboard: enterpriseAnalytics.deleteDashboard,
        duplicateDashboard: enterpriseAnalytics.duplicateDashboard,
        generateReport: enterpriseAnalytics.generateReport,
        exportReport: enterpriseAnalytics.exportReport,
        scheduleReport: enterpriseAnalytics.scheduleReport,
        enableRealTimeAnalytics: enterpriseAnalytics.enableRealTimeAnalytics,
        disableRealTimeAnalytics: enterpriseAnalytics.disableRealTimeAnalytics,
        subscribeToLiveUpdates: enterpriseAnalytics.subscribeToLiveUpdates,
        unsubscribeFromLiveUpdates: enterpriseAnalytics.unsubscribeFromLiveUpdates,
        processData: enterpriseAnalytics.processData,
        runAnalysis: enterpriseAnalytics.runAnalysis,
        predictTrends: enterpriseAnalytics.predictTrends,
        setSelectedDashboard: enterpriseAnalytics.setSelectedDashboard,
        setSelectedReport: enterpriseAnalytics.setSelectedReport,
        setDateRange: enterpriseAnalytics.setDateRange,
        setFilters: enterpriseAnalytics.setFilters,
        clearError: enterpriseAnalytics.clearError,
        retry: enterpriseAnalytics.retry,
        invalidateCache: enterpriseAnalytics.invalidateCache,

        // Migration state
        migration: {
          isUsingEnterprise: true,
          errors: migrationState.migrationErrors,
          performance: migrationState.performanceMetrics,
          features: migrationState.features,
          config
        }
      };
    } else {
      // Use basic enterprise analytics
      return {
        // Basic enterprise analytics data
        metrics: enterpriseAnalytics.metrics,
        dashboards: enterpriseAnalytics.dashboards,
        reports: enterpriseAnalytics.reports,
        insights: enterpriseAnalytics.insights,
        funnels: enterpriseAnalytics.funnels,
        goals: enterpriseAnalytics.goals,
        selectedDashboard: enterpriseAnalytics.selectedDashboard,
        selectedReport: enterpriseAnalytics.selectedReport,
        isLoading: enterpriseAnalytics.isLoading,
        error: enterpriseAnalytics.error,
        dateRange: enterpriseAnalytics.dateRange,
        filters: enterpriseAnalytics.filters,
        realTimeEnabled: config.realTimeLevel !== 'disabled',
        processingStatus: config.dataProcessingLevel === 'basic' ? 'idle' : enterpriseAnalytics.processingStatus,
        lastUpdateTime: enterpriseAnalytics.lastUpdateTime,
        cacheHitRate: enterpriseAnalytics.cacheHitRate,
        dataFreshness: enterpriseAnalytics.dataFreshness,

        // Basic enterprise analytics actions
        fetchMetrics: enterpriseAnalytics.fetchMetrics,
        fetchDashboards: enterpriseAnalytics.fetchDashboards,
        fetchReports: enterpriseAnalytics.fetchReports,
        fetchInsights: enterpriseAnalytics.fetchInsights,
        fetchFunnels: enterpriseAnalytics.fetchFunnels,
        fetchGoals: enterpriseAnalytics.fetchGoals,
        refreshAllData: enterpriseAnalytics.refreshAllData,
        trackEvent: enterpriseAnalytics.trackEvent,
        trackPageView: enterpriseAnalytics.trackPageView,
        trackContentView: enterpriseAnalytics.trackContentView,
        trackUserAction: enterpriseAnalytics.trackUserAction,
        trackBatchEvents: enterpriseAnalytics.trackBatchEvents,
        createDashboard: enterpriseAnalytics.createDashboard,
        updateDashboard: enterpriseAnalytics.updateDashboard,
        deleteDashboard: enterpriseAnalytics.deleteDashboard,
        duplicateDashboard: enterpriseAnalytics.duplicateDashboard,
        generateReport: enterpriseAnalytics.generateReport,
        exportReport: enterpriseAnalytics.exportReport,
        scheduleReport: enterpriseAnalytics.scheduleReport,
        enableRealTimeAnalytics: config.realTimeLevel !== 'disabled' ? enterpriseAnalytics.enableRealTimeAnalytics : async () => {},
        disableRealTimeAnalytics: config.realTimeLevel !== 'disabled' ? enterpriseAnalytics.disableRealTimeAnalytics : async () => {},
        subscribeToLiveUpdates: config.realTimeLevel === 'enhanced' ? enterpriseAnalytics.subscribeToLiveUpdates : async () => {},
        unsubscribeFromLiveUpdates: config.realTimeLevel === 'enhanced' ? enterpriseAnalytics.unsubscribeFromLiveUpdates : async () => {},
        processData: config.dataProcessingLevel !== 'basic' ? enterpriseAnalytics.processData : async () => {},
        runAnalysis: config.dataProcessingLevel === 'maximum' ? enterpriseAnalytics.runAnalysis : async () => {},
        predictTrends: config.dataProcessingLevel === 'maximum' ? enterpriseAnalytics.predictTrends : async () => {},
        setSelectedDashboard: enterpriseAnalytics.setSelectedDashboard,
        setSelectedReport: enterpriseAnalytics.setSelectedReport,
        setDateRange: enterpriseAnalytics.setDateRange,
        setFilters: enterpriseAnalytics.setFilters,
        clearError: enterpriseAnalytics.clearError,
        retry: enterpriseAnalytics.retry,
        invalidateCache: enterpriseAnalytics.invalidateCache,

        // Migration state
        migration: {
          isUsingEnterprise: true,
          errors: migrationState.migrationErrors,
          performance: migrationState.performanceMetrics,
          features: migrationState.features,
          config
        }
      };
    }
  }

  // Fallback to legacy behavior
  return {
    // Legacy analytics data
    metrics: legacyAnalytics.metrics,
    dashboards: legacyAnalytics.dashboards,
    reports: legacyAnalytics.reports,
    insights: legacyAnalytics.insights,
    funnels: null,
    goals: null,
    selectedDashboard: legacyAnalytics.selectedDashboard,
    selectedReport: legacyAnalytics.selectedReport,
    isLoading: legacyAnalytics.isLoading,
    error: legacyAnalytics.error,
    dateRange: legacyAnalytics.dateRange,
    filters: legacyAnalytics.filters,
    realTimeEnabled: false,
    processingStatus: 'idle',
    lastUpdateTime: null,
    cacheHitRate: 0,
    dataFreshness: 'stale',

    // Legacy analytics actions
    fetchMetrics: legacyAnalytics.fetchMetrics || (async () => {}),
    fetchDashboards: legacyAnalytics.fetchDashboards || (async () => {}),
    fetchReports: legacyAnalytics.fetchReports || (async () => {}),
    fetchInsights: legacyAnalytics.fetchInsights || (async () => {}),
    fetchFunnels: async () => {},
    fetchGoals: async () => {},
    refreshAllData: async () => {},
    trackEvent: legacyAnalytics.trackEvent || (async () => {}),
    trackPageView: legacyAnalytics.trackPageView || (async () => {}),
    trackContentView: legacyAnalytics.trackContentView || (async () => {}),
    trackUserAction: legacyAnalytics.trackUserAction || (async () => {}),
    trackBatchEvents: legacyAnalytics.trackBatchEvents || (async () => {}),
    createDashboard: async () => {},
    updateDashboard: async () => {},
    deleteDashboard: async () => {},
    duplicateDashboard: async () => {},
    generateReport: async () => {},
    exportReport: async () => {},
    scheduleReport: async () => {},
    enableRealTimeAnalytics: async () => {},
    disableRealTimeAnalytics: async () => {},
    subscribeToLiveUpdates: async () => {},
    unsubscribeFromLiveUpdates: async () => {},
    processData: async () => {},
    runAnalysis: async () => {},
    predictTrends: async () => {},
    setSelectedDashboard: legacyAnalytics.setSelectedDashboard || (() => {}),
    setSelectedReport: legacyAnalytics.setSelectedReport || (() => {}),
    setDateRange: legacyAnalytics.setDateRange || (() => {}),
    setFilters: legacyAnalytics.setFilters || (() => {}),
    clearError: legacyAnalytics.setError || (() => {}),
    retry: () => {},
    invalidateCache: async () => {},

    // Migration state
    migration: {
      isUsingEnterprise: false,
      errors: ['Enterprise hooks disabled'],
      performance: migrationState.performanceMetrics,
      features: migrationState.features,
      config
    }
  };
};

/**
 * Analytics Migration Utilities
 */
export const AnalyticsMigrationUtils = {
  /**
   * Check if migration is complete
   */
  isMigrationComplete: (migrationState: AnalyticsMigrationState) => {
    return migrationState.isUsingEnterprise && migrationState.migrationErrors.length === 0;
  },

  /**
   * Get migration recommendations
   */
  getMigrationRecommendations: (migrationState: AnalyticsMigrationState, config: AnalyticsMigrationConfig) => {
    const recommendations: string[] = [];
    
    if (!migrationState.isUsingEnterprise) {
      recommendations.push('Enable enterprise hooks for better analytics performance');
    }
    
    if (migrationState.migrationErrors.length > 0) {
      recommendations.push('Fix migration errors before completing migration');
    }
    
    if (config.dataProcessingLevel !== 'maximum') {
      recommendations.push('Consider using maximum data processing level for advanced analytics');
    }
    
    if (config.realTimeLevel !== 'enhanced') {
      recommendations.push('Consider enabling enhanced real-time analytics for live insights');
    }
    
    if (!migrationState.features.realTimeEnabled) {
      recommendations.push('Enable real-time analytics for live data updates');
    }
    
    if (!migrationState.features.dataProcessingEnabled) {
      recommendations.push('Enable data processing for advanced analytics features');
    }
    
    if (migrationState.performanceMetrics.enterpriseHookTime > 200) {
      recommendations.push('Consider optimizing analytics queries for better performance');
    }
    
    return recommendations;
  },

  /**
   * Generate migration report
   */
  generateMigrationReport: (migrationState: AnalyticsMigrationState, config: AnalyticsMigrationConfig) => {
    return {
      status: migrationState.isUsingEnterprise ? 'Enterprise' : 'Legacy',
      dataProcessingLevel: config.dataProcessingLevel,
      realTimeLevel: config.realTimeLevel,
      errors: migrationState.migrationErrors,
      performance: migrationState.performanceMetrics,
      features: migrationState.features,
      isComplete: AnalyticsMigrationUtils.isMigrationComplete(migrationState),
      recommendations: AnalyticsMigrationUtils.getMigrationRecommendations(migrationState, config)
    };
  },

  /**
   * Get analytics score
   */
  getAnalyticsScore: (migrationState: AnalyticsMigrationState) => {
    let score = 0;
    const maxScore = 100;

    // Base score for enterprise hooks
    if (migrationState.isUsingEnterprise) score += 30;

    // Feature scores
    if (migrationState.features.realTimeEnabled) score += 25;
    if (migrationState.features.dataProcessingEnabled) score += 20;
    if (migrationState.features.advancedReportingEnabled) score += 15;
    if (migrationState.features.predictiveAnalyticsEnabled) score += 10;

    // No errors
    if (migrationState.migrationErrors.length === 0) score += 10;

    return Math.min(score, maxScore);
  }
};

export default useAnalyticsMigration;
