/**
 * Performance Utilities
 * 
 * Performance measurement and monitoring utilities for logging.
 * Provides timing, memory usage, and performance metrics collection.
 */

/**
 * Performance measurement interface
 */
export interface IPerformanceMeasurement {
  /** Measurement name */
  name: string;
  /** Start timestamp */
  startTime: number;
  /** End timestamp */
  endTime?: number;
  /** Duration in milliseconds */
  duration?: number;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Memory usage information
 */
export interface IMemoryUsage {
  /** Used memory in bytes */
  used: number;
  /** Total memory in bytes */
  total: number;
  /** Used memory percentage */
  usedPercentage: number;
  /** Formatted memory usage */
  formatted: {
    used: string;
    total: string;
  };
}

/**
 * Performance metrics
 */
export interface IPerformanceMetrics {
  /** Total measurements */
  totalMeasurements: number;
  /** Average duration */
  averageDuration: number;
  /** Minimum duration */
  minDuration: number;
  /** Maximum duration */
  maxDuration: number;
  /** Total duration */
  totalDuration: number;
  /** Measurements per second */
  measurementsPerSecond: number;
  /** Memory usage */
  memoryUsage?: IMemoryUsage;
}

/**
 * Performance utilities class
 */
export class PerformanceUtils {
  private static measurements: Map<string, IPerformanceMeasurement[]> = new Map();
  private static activeMeasurements: Map<string, IPerformanceMeasurement> = new Map();

  /**
   * Start performance measurement
   */
  static startMeasurement(name: string, metadata?: Record<string, any>): string {
    const id = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const measurement: IPerformanceMeasurement = {
      name,
      startTime: performance.now(),
      metadata
    };

    PerformanceUtils.activeMeasurements.set(id, measurement);

    // Initialize measurements array if not exists
    if (!PerformanceUtils.measurements.has(name)) {
      PerformanceUtils.measurements.set(name, []);
    }

    return id;
  }

  /**
   * End performance measurement
   */
  static endMeasurement(id: string): IPerformanceMeasurement | null {
    const measurement = PerformanceUtils.activeMeasurements.get(id);
    if (!measurement) {
      return null;
    }

    measurement.endTime = performance.now();
    measurement.duration = measurement.endTime - measurement.startTime;

    // Move to completed measurements
    const measurements = PerformanceUtils.measurements.get(measurement.name);
    if (measurements) {
      measurements.push(measurement);
      
      // Keep only last 1000 measurements per name
      if (measurements.length > 1000) {
        measurements.splice(0, measurements.length - 1000);
      }
    }

    // Remove from active measurements
    PerformanceUtils.activeMeasurements.delete(id);

    return measurement;
  }

  /**
   * Measure function execution time
   */
  static async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<{ result: T; measurement: IPerformanceMeasurement }> {
    const id = PerformanceUtils.startMeasurement(name, metadata);
    
    try {
      const result = await fn();
      const measurement = PerformanceUtils.endMeasurement(id);
      
      if (!measurement) {
        throw new Error('Measurement not found');
      }

      return { result, measurement };
    } catch (error) {
      PerformanceUtils.endMeasurement(id);
      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  static measure<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): { result: T; measurement: IPerformanceMeasurement } {
    const id = PerformanceUtils.startMeasurement(name, metadata);
    
    try {
      const result = fn();
      const measurement = PerformanceUtils.endMeasurement(id);
      
      if (!measurement) {
        throw new Error('Measurement not found');
      }

      return { result, measurement };
    } catch (error) {
      PerformanceUtils.endMeasurement(id);
      throw error;
    }
  }

  /**
   * Get performance metrics for a measurement name
   */
  static getMetrics(name: string): IPerformanceMetrics | null {
    const measurements = PerformanceUtils.measurements.get(name);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const durations = measurements
      .map(m => m.duration!)
      .filter(d => d !== undefined);

    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    const averageDuration = totalDuration / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    // Calculate measurements per second
    const timeSpan = measurements[measurements.length - 1].startTime - measurements[0].startTime;
    const measurementsPerSecond = timeSpan > 0 ? (measurements.length / timeSpan) * 1000 : 0;

    return {
      totalMeasurements: measurements.length,
      averageDuration,
      minDuration,
      maxDuration,
      totalDuration,
      measurementsPerSecond,
      memoryUsage: PerformanceUtils.getMemoryUsage()
    };
  }

  /**
   * Get all performance metrics
   */
  static getAllMetrics(): Record<string, IPerformanceMetrics> {
    const allMetrics: Record<string, IPerformanceMetrics> = {};

    for (const name of PerformanceUtils.measurements.keys()) {
      const metrics = PerformanceUtils.getMetrics(name);
      if (metrics) {
        allMetrics[name] = metrics;
      }
    }

    return allMetrics;
  }

  /**
   * Clear measurements for a specific name
   */
  static clearMeasurements(name?: string): void {
    if (name) {
      PerformanceUtils.measurements.delete(name);
    } else {
      PerformanceUtils.measurements.clear();
      PerformanceUtils.activeMeasurements.clear();
    }
  }

  /**
   * Get memory usage (if available)
   */
  static getMemoryUsage(): IMemoryUsage | null {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      
      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      const usedPercentage = (used / total) * 100;

      return {
        used,
        total,
        usedPercentage,
        formatted: {
          used: PerformanceUtils.formatBytes(used),
          total: PerformanceUtils.formatBytes(total)
        }
      };
    }

    return null;
  }

  /**
   * Format bytes to human readable format
   */
  static formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Create performance context for logging
   */
  static createPerformanceContext(
    name: string,
    duration: number,
    additionalData?: Record<string, any>
  ): Record<string, any> {
    return {
      action: 'performance',
      operation: name,
      duration,
      durationFormatted: PerformanceUtils.formatDuration(duration),
      memoryUsage: PerformanceUtils.getMemoryUsage(),
      ...additionalData
    };
  }

  /**
   * Format duration to human readable format
   */
  static formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(2)}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = ((milliseconds % 60000) / 1000).toFixed(2);
      return `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Monitor function performance with automatic logging
   */
  static createPerformanceMonitor<T extends (...args: any[]) => any>(
    name: string,
    fn: T,
    logger?: { info: (context: any, message: string, ...args: any[]) => void }
  ): T {
    return (async (...args: Parameters<T>) => {
      const measurementId = PerformanceUtils.startMeasurement(name);
      
      try {
        const result = await fn(...args);
        const measurement = PerformanceUtils.endMeasurement(measurementId);
        
        if (measurement && logger) {
          const context = PerformanceUtils.createPerformanceContext(
            name,
            measurement.duration!
          );
          
          logger.info(context, 'Performance: {} completed in {}', name, measurement.duration);
        }
        
        return result;
      } catch (error) {
        const measurement = PerformanceUtils.endMeasurement(measurementId);
        
        if (measurement && logger) {
          const context = PerformanceUtils.createPerformanceContext(
            name,
            measurement.duration!,
            { error: (error as Error).message }
          );
          
          logger.error(context, 'Performance: {} failed in {}', name, measurement.duration);
        }
        
        throw error;
      }
    }) as T;
  }

  /**
   * Get performance statistics summary
   */
  static getPerformanceSummary(): {
    totalMeasurementNames: number;
    totalMeasurements: number;
    activeMeasurements: number;
    memoryUsage: IMemoryUsage | null;
    slowestOperations: Array<{ name: string; duration: number }>;
    fastestOperations: Array<{ name: string; duration: number }>;
  } {
    const allMetrics = PerformanceUtils.getAllMetrics();
    const totalMeasurements = Object.values(allMetrics)
      .reduce((sum, metrics) => sum + metrics.totalMeasurements, 0);

    // Find slowest and fastest operations
    const slowestOperations: Array<{ name: string; duration: number }> = [];
    const fastestOperations: Array<{ name: string; duration: number }> = [];

    for (const [name, metrics] of Object.entries(allMetrics)) {
      slowestOperations.push({ name, duration: metrics.maxDuration });
      fastestOperations.push({ name, duration: metrics.minDuration });
    }

    slowestOperations.sort((a, b) => b.duration - a.duration);
    fastestOperations.sort((a, b) => a.duration - b.duration);

    return {
      totalMeasurementNames: PerformanceUtils.measurements.size,
      totalMeasurements,
      activeMeasurements: PerformanceUtils.activeMeasurements.size,
      memoryUsage: PerformanceUtils.getMemoryUsage(),
      slowestOperations: slowestOperations.slice(0, 10),
      fastestOperations: fastestOperations.slice(0, 10)
    };
  }

  /**
   * Check if performance is degrading
   */
  static isPerformanceDegrading(name: string, threshold: number = 2.0): boolean {
    const metrics = PerformanceUtils.getMetrics(name);
    if (!metrics || metrics.totalMeasurements < 10) {
      return false;
    }

    // Compare recent performance with overall average
    const recentMeasurements = PerformanceUtils.measurements.get(name)?.slice(-10) || [];
    const recentAverage = recentMeasurements
      .map(m => m.duration!)
      .reduce((sum, duration) => sum + duration, 0) / recentMeasurements.length;

    return recentAverage > (metrics.averageDuration * threshold);
  }

  /**
   * Get performance trend
   */
  static getPerformanceTrend(name: string, windowSize: number = 10): 'improving' | 'degrading' | 'stable' {
    const measurements = PerformanceUtils.measurements.get(name);
    if (!measurements || measurements.length < windowSize * 2) {
      return 'stable';
    }

    const recent = measurements.slice(-windowSize);
    const previous = measurements.slice(-windowSize * 2, -windowSize);

    const recentAvg = recent
      .map(m => m.duration!)
      .reduce((sum, duration) => sum + duration, 0) / recent.length;

    const previousAvg = previous
      .map(m => m.duration!)
      .reduce((sum, duration) => sum + duration, 0) / previous.length;

    const changePercent = ((recentAvg - previousAvg) / previousAvg) * 100;

    if (changePercent > 10) return 'degrading';
    if (changePercent < -10) return 'improving';
    return 'stable';
  }
}
