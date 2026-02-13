/**
 * Memory Management Optimization
 *
 * Provides comprehensive memory optimization features for cache providers.
 * Includes memory pooling, garbage collection optimization, and memory leak detection.
 */

/**
 * Memory pool configuration
 */
export interface IMemoryPoolConfig {
  /** Enable memory pooling */
  enabled: boolean;
  /** Initial pool size */
  initialSize: number;
  /** Maximum pool size */
  maxSize: number;
  /** Growth factor */
  growthFactor: number;
  /** Shrink threshold */
  shrinkThreshold: number;
  /** Cleanup interval in milliseconds */
  cleanupInterval: number;
}

/**
 * Memory usage statistics
 */
export interface IMemoryUsageStats {
  /** Total allocated memory in bytes */
  totalAllocated: number;
  /** Used memory in bytes */
  usedMemory: number;
  /** Free memory in bytes */
  freeMemory: number;
  /** Memory fragmentation ratio */
  fragmentationRatio: number;
  /** Pool hit rate */
  poolHitRate: number;
  /** Garbage collection count */
  gcCount: number;
  /** Memory leak count */
  leakCount: number;
}

/**
 * Memory leak detector
 */
export interface IMemoryLeakDetector {
  /** Start monitoring */
  startMonitoring(): void;
  /** Stop monitoring */
  stopMonitoring(): void;
  /** Get leak report */
  getLeakReport(): IMemoryLeakReport;
  /** Clear leak data */
  clearLeakData(): void;
}

/**
 * Memory leak report
 */
export interface IMemoryLeakReport {
  /** Total leaks detected */
  totalLeaks: number;
  /** Leaked objects */
  leakedObjects: Array<{
    id: string;
    type: string;
    size: number;
    age: number;
    stackTrace: string[];
  }>;
  /** Memory usage trend */
  memoryTrend: Array<{
    timestamp: Date;
    usage: number;
  }>;
  /** Recommendations */
  recommendations: string[];
}

/**
 * Memory pool entry
 */
interface IMemoryPoolEntry<T> {
  /** Object instance */
  object: T;
  /** In use flag */
  inUse: boolean;
  /** Creation timestamp */
  createdAt: Date;
  /** Last used timestamp */
  lastUsed: Date;
  /** Usage count */
  usageCount: number;
}

/**
 * Generic memory pool
 */
export class MemoryPool<T> {
  private pool: IMemoryPoolEntry<T>[] = [];
  private factory: () => T;
  private resetFn?: (obj: T) => void;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(
    private config: IMemoryPoolConfig,
    factory: () => T,
    resetFn?: (obj: T) => void
  ) {
    this.factory = factory;
    this.resetFn = resetFn;
    this.initializePool();
    this.startCleanup();
  }

  /**
   * Acquire object from pool
   */
  acquire(): T {
    const entry = this.pool.find(e => !e.inUse);

    if (entry) {
      entry.inUse = true;
      entry.lastUsed = new Date();
      entry.usageCount++;

      // Reset object if reset function provided
      if (this.resetFn) {
        this.resetFn(entry.object);
      }

      return entry.object;
    }

    // Create new object if pool not at max size
    if (this.pool.length < this.config.maxSize) {
      const newObject = this.factory();
      const newEntry: IMemoryPoolEntry<T> = {
        object: newObject,
        inUse: true,
        createdAt: new Date(),
        lastUsed: new Date(),
        usageCount: 1
      };

      this.pool.push(newEntry);
      return newObject;
    }

    // Pool is full, create temporary object
    return this.factory();
  }

  /**
   * Release object back to pool
   */
  release(object: T): void {
    const entry = this.pool.find(e => e.object === object);

    if (entry && entry.inUse) {
      entry.inUse = false;
      entry.lastUsed = new Date();
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    totalObjects: number;
    usedObjects: number;
    freeObjects: number;
    hitRate: number;
    averageUsage: number;
  } {
    const used = this.pool.filter(e => e.inUse).length;
    const total = this.pool.length;
    const free = total - used;

    const totalUsage = this.pool.reduce((sum, e) => sum + e.usageCount, 0);
    const averageUsage = total > 0 ? totalUsage / total : 0;

    // Calculate hit rate (simplified)
    const hitRate = total > 0 ? (total - this.config.initialSize) / total : 0;

    return {
      totalObjects: total,
      usedObjects: used,
      freeObjects: free,
      hitRate,
      averageUsage
    };
  }

  /**
   * Shrink pool if needed
   */
  shrink(): void {
    const freeEntries = this.pool.filter(e => !e.inUse);
    const shrinkThreshold = Math.floor(this.config.maxSize * this.config.shrinkThreshold);

    if (freeEntries.length > shrinkThreshold) {
      const toRemove = freeEntries.length - shrinkThreshold;
      const removed = freeEntries.slice(0, toRemove);

      for (const entry of removed) {
        const index = this.pool.indexOf(entry);
        if (index !== -1) {
          this.pool.splice(index, 1);
        }
      }
    }
  }

  /**
   * Clear pool
   */
  clear(): void {
    this.pool = [];
  }

  /**
   * Destroy pool
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }

  /**
   * Initialize pool
   */
  private initializePool(): void {
    for (let i = 0; i < this.config.initialSize; i++) {
      const object = this.factory();
      const entry: IMemoryPoolEntry<T> = {
        object,
        inUse: false,
        createdAt: new Date(),
        lastUsed: new Date(),
        usageCount: 0
      };
      this.pool.push(entry);
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Cleanup unused objects
   */
  private cleanup(): void {
    const now = new Date();
    const maxAge = this.config.cleanupInterval * 5; // 5 cleanup intervals

    // Remove old unused objects
    this.pool = this.pool.filter(entry => {
      if (!entry.inUse && now.getTime() - entry.lastUsed.getTime() > maxAge) {
        return false;
      }
      return true;
    });

    // Shrink if necessary
    this.shrink();
  }
}

/**
 * Memory leak detector implementation
 */
export class MemoryLeakDetector implements IMemoryLeakDetector {
  private objects = new Map<string, {
    type: string;
    createdAt: Date;
    size: number;
    stackTrace: string[];
  }>();
  private memorySnapshots: Array<{ timestamp: Date; usage: number }> = [];
  private isMonitoring = false;
  private snapshotInterval?: NodeJS.Timeout;

  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.takeMemorySnapshot();

    this.snapshotInterval = setInterval(() => {
      this.takeMemorySnapshot();
      this.detectLeaks();
    }, 30000); // Every 30 seconds
  }

  stopMonitoring(): void {
    this.isMonitoring = false;

    if (this.snapshotInterval) {
      clearInterval(this.snapshotInterval);
    }
  }

  getLeakReport(): IMemoryLeakReport {
    const now = new Date();
    const leakedObjects = Array.from(this.objects.entries())
      .filter(([_, obj]) => now.getTime() - obj.createdAt.getTime() > 300000) // 5 minutes
      .map(([id, obj]) => ({
        id,
        type: obj.type,
        size: obj.size,
        age: now.getTime() - obj.createdAt.getTime(),
        stackTrace: obj.stackTrace
      }));

    const recommendations = this.generateRecommendations(leakedObjects);

    return {
      totalLeaks: leakedObjects.length,
      leakedObjects,
      memoryTrend: this.memorySnapshots,
      recommendations
    };
  }

  clearLeakData(): void {
    this.objects.clear();
    this.memorySnapshots = [];
  }

  /**
   * Register object for leak detection
   */
  registerObject(id: string, type: string, size: number = 0): void {
    if (this.isMonitoring) {
      this.objects.set(id, {
        type,
        createdAt: new Date(),
        size,
        stackTrace: this.captureStackTrace()
      });
    }
  }

  /**
   * Unregister object
   */
  unregisterObject(id: string): void {
    this.objects.delete(id);
  }

  /**
   * Take memory snapshot
   */
  private takeMemorySnapshot(): void {
    const usage = this.estimateMemoryUsage();
    this.memorySnapshots.push({
      timestamp: new Date(),
      usage
    });

    // Keep only last 100 snapshots
    if (this.memorySnapshots.length > 100) {
      this.memorySnapshots = this.memorySnapshots.slice(-100);
    }
  }

  /**
   * Detect potential leaks
   */
  private detectLeaks(): void {
    const now = new Date();
    const threshold = 300000; // 5 minutes

    for (const [id, obj] of this.objects) {
      if (now.getTime() - obj.createdAt.getTime() > threshold) {
        console.warn(`Potential memory leak detected: ${obj.type} (${id})`);
      }
    }
  }

  /**
   * Estimate memory usage (simplified)
   */
  private estimateMemoryUsage(): number {
    // In a real implementation, this would use process.memoryUsage() or browser APIs
    return this.objects.size * 1024; // Estimate 1KB per object
  }

  /**
   * Capture stack trace
   */
  private captureStackTrace(): string[] {
    const stack = new Error().stack;
    return stack ? stack.split('\n').slice(2) : [];
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(leakedObjects: any[]): string[] {
    const recommendations: string[] = [];

    if (leakedObjects.length > 0) {
      recommendations.push('Consider implementing proper cleanup in object lifecycle');

      const typeCounts = leakedObjects.reduce((acc, obj) => {
        acc[obj.type] = (acc[obj.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const worstType = Object.entries(typeCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))[0];

      if (worstType && worstType[0]) {
        recommendations.push(`Focus on cleaning up ${worstType[0]} objects (${worstType[1]} instances)`);
      }
    }

    if (this.memorySnapshots.length > 10) {
      const recent = this.memorySnapshots.slice(-10);
      const trend = recent[recent.length - 1].usage - recent[0].usage;

      if (trend > 0) {
        recommendations.push('Memory usage is trending upward - investigate for leaks');
      }
    }

    return recommendations;
  }
}

/**
 * Memory manager for cache providers
 */
export class CacheMemoryManager {
  private objectPools = new Map<string, MemoryPool<any>>();
  private leakDetector: MemoryLeakDetector;
  private memoryStats: IMemoryUsageStats;

  constructor() {
    this.leakDetector = new MemoryLeakDetector();
    this.memoryStats = {
      totalAllocated: 0,
      usedMemory: 0,
      freeMemory: 0,
      fragmentationRatio: 0,
      poolHitRate: 0,
      gcCount: 0,
      leakCount: 0
    };
  }

  /**
   * Create object pool
   */
  createPool<T>(
    name: string,
    factory: () => T,
    resetFn?: (obj: T) => void,
    config?: Partial<IMemoryPoolConfig>
  ): MemoryPool<T> {
    const defaultConfig: IMemoryPoolConfig = {
      enabled: true,
      initialSize: 10,
      maxSize: 100,
      growthFactor: 1.5,
      shrinkThreshold: 0.7,
      cleanupInterval: 60000 // 1 minute
    };

    const finalConfig = { ...defaultConfig, ...config };
    const pool = new MemoryPool(finalConfig, factory, resetFn);

    this.objectPools.set(name, pool);
    return pool;
  }

  /**
   * Get object pool
   */
  getPool<T>(name: string): MemoryPool<T> | undefined {
    return this.objectPools.get(name) as MemoryPool<T>;
  }

  /**
   * Get memory statistics
   */
  getMemoryStats(): IMemoryUsageStats {
    this.updateMemoryStats();
    return { ...this.memoryStats };
  }

  /**
   * Optimize memory usage
   */
  optimizeMemory(): void {
    // Shrink all pools
    for (const pool of this.objectPools.values()) {
      pool.shrink();
    }

    // Trigger garbage collection hint
    if (typeof global !== 'undefined' && global.gc) {
      global.gc();
      this.memoryStats.gcCount++;
    }
  }

  /**
   * Start memory monitoring
   */
  startMonitoring(): void {
    this.leakDetector.startMonitoring();
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    this.leakDetector.stopMonitoring();
  }

  /**
   * Get memory leak report
   */
  getLeakReport(): IMemoryLeakReport {
    const report = this.leakDetector.getLeakReport();
    this.memoryStats.leakCount = report.totalLeaks;
    return report;
  }

  /**
   * Clear all memory
   */
  clear(): void {
    for (const pool of this.objectPools.values()) {
      pool.clear();
    }

    this.leakDetector.clearLeakData();
    this.memoryStats = {
      totalAllocated: 0,
      usedMemory: 0,
      freeMemory: 0,
      fragmentationRatio: 0,
      poolHitRate: 0,
      gcCount: 0,
      leakCount: 0
    };
  }

  /**
   * Destroy memory manager
   */
  destroy(): void {
    this.leakDetector.stopMonitoring();

    for (const pool of this.objectPools.values()) {
      pool.destroy();
    }

    this.objectPools.clear();
  }

  /**
   * Update memory statistics
   */
  private updateMemoryStats(): void {
    let totalObjects = 0;
    let usedObjects = 0;
    let totalHits = 0;
    let totalRequests = 0;

    for (const pool of this.objectPools.values()) {
      const stats = pool.getStats();
      totalObjects += stats.totalObjects;
      usedObjects += stats.usedObjects;
      totalHits += stats.totalObjects * stats.hitRate;
      totalRequests += stats.totalObjects;
    }

    const estimatedObjectSize = 1024; // 1KB per object estimate
    this.memoryStats.totalAllocated = totalObjects * estimatedObjectSize;
    this.memoryStats.usedMemory = usedObjects * estimatedObjectSize;
    this.memoryStats.freeMemory = this.memoryStats.totalAllocated - this.memoryStats.usedMemory;
    this.memoryStats.poolHitRate = totalRequests > 0 ? totalHits / totalRequests : 0;
    this.memoryStats.fragmentationRatio = totalObjects > 0 ?
      (totalObjects - usedObjects) / totalObjects : 0;
  }
}
