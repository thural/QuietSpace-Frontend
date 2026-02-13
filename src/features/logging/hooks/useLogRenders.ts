/**
 * useLogRenders Hook
 * 
 * React hook for monitoring component render performance.
 * Tracks render counts, render times, and excessive re-renders.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useLogger } from './useLogger';

/**
 * Render monitoring options
 */
export interface UseLogRendersOptions {
  /** Component name for logging */
  componentName: string;
  /** Enable render time tracking */
  trackRenderTime?: boolean;
  /** Enable render count tracking */
  trackRenderCount?: boolean;
  /** Threshold for warning about excessive renders (per second) */
  excessiveRenderThreshold?: number;
  /** Threshold for warning about slow renders (ms) */
  slowRenderThreshold?: number;
  /** Enable detailed logging */
  detailedLogging?: boolean;
}

/**
 * Render statistics
 */
export interface RenderStats {
  /** Total render count */
  totalRenders: number;
  /** Renders in current second */
  rendersPerSecond: number;
  /** Average render time */
  averageRenderTime: number;
  /** Last render time */
  lastRenderTime: number;
  /** Maximum render time */
  maxRenderTime: number;
  /** Whether excessive renders detected */
  excessiveRenders: boolean;
  /** Whether slow renders detected */
  slowRenders: boolean;
}

/**
 * Hook for monitoring component renders
 */
export function useLogRenders(options: UseLogRendersOptions): {
  stats: RenderStats;
  resetStats: () => void;
  logRenderInfo: () => void;
} {
  const {
    componentName,
    trackRenderTime = true,
    trackRenderCount = true,
    excessiveRenderThreshold = 10,
    slowRenderThreshold = 16, // 60fps = 16.67ms per frame
    detailedLogging = false
  } = options;

  const logger = useLogger({
    category: `app.components.${componentName}`,
    autoComponentContext: true,
    enablePerformanceMonitoring: true
  });

  // Render tracking state
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const lastRenderTimeRef = useRef<number>(0);
  const rendersInCurrentSecondRef = useRef<number[]>([]);
  const maxRenderTimeRef = useRef(0);
  const excessiveRendersDetectedRef = useRef(false);
  const slowRendersDetectedRef = useRef(false);

  // State for external access
  const [stats, setStats] = useState<RenderStats>({
    totalRenders: 0,
    rendersPerSecond: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    maxRenderTime: 0,
    excessiveRenders: false,
    slowRenders: false
  });

  // Clean up old render times (keep only last 100)
  const cleanupRenderTimes = useCallback(() => {
    if (renderTimesRef.current.length > 100) {
      renderTimesRef.current = renderTimesRef.current.slice(-100);
    }
  }, []);

  // Clean up old renders per second data
  const cleanupRendersPerSecond = useCallback(() => {
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    rendersInCurrentSecondRef.current = rendersInCurrentSecondRef.current.filter(
      timestamp => timestamp > oneSecondAgo
    );
  }, []);

  // Calculate statistics
  const calculateStats = useCallback((): RenderStats => {
    cleanupRenderTimes();
    cleanupRendersPerSecond();

    const totalRenders = renderCountRef.current;
    const rendersPerSecond = rendersInCurrentSecondRef.current.length;
    
    let averageRenderTime = 0;
    let lastRenderTime = 0;
    let maxRenderTime = maxRenderTimeRef.current;

    if (renderTimesRef.current.length > 0) {
      const sum = renderTimesRef.current.reduce((a, b) => a + b, 0);
      averageRenderTime = sum / renderTimesRef.current.length;
      lastRenderTime = renderTimesRef.current[renderTimesRef.current.length - 1];
    }

    const excessiveRenders = rendersPerSecond > excessiveRenderThreshold;
    const slowRenders = lastRenderTime > slowRenderThreshold;

    return {
      totalRenders,
      rendersPerSecond,
      averageRenderTime,
      lastRenderTime,
      maxRenderTime,
      excessiveRenders,
      slowRenders
    };
  }, [cleanupRenderTimes, cleanupRendersPerSecond, excessiveRenderThreshold, slowRenderThreshold]);

  // Update stats state
  const updateStats = useCallback(() => {
    const newStats = calculateStats();
    setStats(newStats);
    return newStats;
  }, [calculateStats]);

  // Log render performance
  const logRenderPerformance = useCallback((renderTime: number, currentStats: RenderStats) => {
    const context = {
      component: componentName,
      renderCount: currentStats.totalRenders,
      renderTime,
      rendersPerSecond: currentStats.rendersPerSecond,
      averageRenderTime: currentStats.averageRenderTime
    };

    // Check for excessive renders
    if (currentStats.excessiveRenders && !excessiveRendersDetectedRef.current) {
      excessiveRendersDetectedRef.current = true;
      logger.warn(
        context,
        'Excessive renders detected: {} renders in last second for component {}',
        currentStats.rendersPerSecond,
        componentName
      );
    } else if (!currentStats.excessiveRenders) {
      excessiveRendersDetectedRef.current = false;
    }

    // Check for slow renders
    if (currentStats.slowRenders && !slowRendersDetectedRef.current) {
      slowRendersDetectedRef.current = true;
      logger.warn(
        context,
        'Slow render detected: {}ms for component {} (threshold: {}ms)',
        renderTime.toFixed(2),
        componentName,
        slowRenderThreshold
      );
    } else if (!currentStats.slowRenders) {
      slowRendersDetectedRef.current = false;
    }

    // Detailed logging
    if (detailedLogging) {
      logger.metrics(
        context,
        'Component {} rendered in {}ms (total: {}, avg: {}ms, rps: {})',
        componentName,
        renderTime.toFixed(2),
        currentStats.totalRenders,
        currentStats.averageRenderTime.toFixed(2),
        currentStats.rendersPerSecond
      );
    }
  }, [logger, componentName, detailedLogging, slowRenderThreshold]);

  // Render effect
  useEffect(() => {
    if (!trackRenderCount && !trackRenderTime) {
      return;
    }

    const startTime = performance.now();
    
    // Increment render count
    if (trackRenderCount) {
      renderCountRef.current++;
      rendersInCurrentSecondRef.current.push(Date.now());
    }

    // Measure render time
    if (trackRenderTime) {
      // Use requestAnimationFrame to measure after render completes
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        renderTimesRef.current.push(renderTime);
        lastRenderTimeRef.current = renderTime;
        
        if (renderTime > maxRenderTimeRef.current) {
          maxRenderTimeRef.current = renderTime;
        }

        const currentStats = updateStats();
        logRenderPerformance(renderTime, currentStats);
      });
    } else {
      const currentStats = updateStats();
      logRenderPerformance(0, currentStats);
    }
  });

  // Reset statistics
  const resetStats = useCallback(() => {
    renderCountRef.current = 0;
    renderTimesRef.current = [];
    lastRenderTimeRef.current = 0;
    rendersInCurrentSecondRef.current = [];
    maxRenderTimeRef.current = 0;
    excessiveRendersDetectedRef.current = false;
    slowRendersDetectedRef.current = false;
    
    setStats({
      totalRenders: 0,
      rendersPerSecond: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
      maxRenderTime: 0,
      excessiveRenders: false,
      slowRenders: false
    });

    logger.info(
      { component: componentName },
      'Render statistics reset for component {}',
      componentName
    );
  }, [logger, componentName]);

  // Log render info
  const logRenderInfo = useCallback(() => {
    const currentStats = calculateStats();
    
    logger.info(
      { component: componentName },
      'Render statistics for {}: total={}, avg={}ms, max={}ms, rps={}',
      componentName,
      currentStats.totalRenders,
      currentStats.averageRenderTime.toFixed(2),
      currentStats.maxRenderTime.toFixed(2),
      currentStats.rendersPerSecond
    );
  }, [logger, componentName, calculateStats]);

  return {
    stats,
    resetStats,
    logRenderInfo
  };
}

/**
 * Hook for detecting render cycles
 */
export function useRenderCycleDetection(componentName: string, threshold: number = 5): {
  renderCycleDetected: boolean;
  cycleCount: number;
  resetCycleDetection: () => void;
} {
  const logger = useLogger({
    category: `app.components.${componentName}`,
    autoComponentContext: true
  });

  const renderTimesRef = useRef<number[]>([]);
  const [renderCycleDetected, setRenderCycleDetected] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    const now = Date.now();
    renderTimesRef.current.push(now);

    // Keep only last 10 renders
    if (renderTimesRef.current.length > 10) {
      renderTimesRef.current = renderTimesRef.current.slice(-10);
    }

    // Check for render cycle (many renders in short time)
    if (renderTimesRef.current.length >= threshold) {
      const timeSpan = renderTimesRef.current[renderTimesRef.current.length - 1] - renderTimesRef.current[0];
      
      if (timeSpan < 100) { // Less than 100ms for threshold renders
        setRenderCycleDetected(true);
        setCycleCount(prev => prev + 1);
        
        logger.warn(
          { component: componentName },
          'Render cycle detected in component {}: {} renders in {}ms',
          componentName,
          threshold,
          timeSpan
        );
      }
    }
  });

  const resetCycleDetection = useCallback(() => {
    renderTimesRef.current = [];
    setRenderCycleDetected(false);
    setCycleCount(0);
    
    logger.info(
      { component: componentName },
      'Render cycle detection reset for component {}',
      componentName
    );
  }, [logger, componentName]);

  return {
    renderCycleDetected,
    cycleCount,
    resetCycleDetection
  };
}
