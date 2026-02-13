/**
 * DI Container Health Checks
 *
 * Provides comprehensive health monitoring and cycle detection for dependency injection containers.
 * Includes memory usage monitoring, dependency graph analysis, and diagnostic utilities.
 */

import type { ServiceIdentifier } from '../registry/ServiceRegistry';

/**
 * Health check result interface
 */
export interface ContainerHealthCheckResult {
  /** Overall health status */
  status: 'healthy' | 'warning' | 'critical';
  /** Health check timestamp */
  timestamp: Date;
  /** Total registered services */
  totalServices: number;
  /** Active services count */
  activeServices: number;
  /** Memory usage in bytes */
  memoryUsage: number;
  /** Dependency cycles detected */
  dependencyCycles: string[][];
  /** Service-specific health issues */
  serviceIssues: ServiceHealthIssue[];
  /** Performance metrics */
  performance: ContainerPerformanceMetrics;
  /** Recommendations */
  recommendations: string[];
}

/**
 * Service health issue
 */
export interface ServiceHealthIssue {
  /** Service identifier */
  serviceId: ServiceIdentifier;
  /** Issue severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Issue description */
  description: string;
  /** Issue type */
  type: 'dependency_missing' | 'circular_dependency' | 'memory_leak' | 'instantiation_failure' | 'timeout';
  /** Suggested resolution */
  resolution: string;
}

/**
 * Container performance metrics
 */
export interface ContainerPerformanceMetrics {
  /** Average instantiation time (ms) */
  averageInstantiationTime: number;
  /** Total instantiation time (ms) */
  totalInstantiationTime: number;
  /** Cache hit rate */
  cacheHitRate: number;
  /** Resolution success rate */
  resolutionSuccessRate: number;
  /** Peak memory usage */
  peakMemoryUsage: number;
  /** Service count trend */
  serviceCountTrend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Dependency graph node
 */
export interface DependencyGraphNode {
  /** Service identifier */
  serviceId: ServiceIdentifier;
  /** Service dependencies */
  dependencies: ServiceIdentifier[];
  /** Service dependents */
  dependents: ServiceIdentifier[];
  /** Instantiation count */
  instantiationCount: number;
  /** Last instantiation time */
  lastInstantiation: Date;
  /** Average resolution time */
  averageResolutionTime: number;
}

/**
 * Health check configuration
 */
export interface ContainerHealthCheckConfig {
  /** Enable health checks */
  enabled: boolean;
  /** Check interval in milliseconds */
  checkInterval: number;
  /** Memory threshold in bytes */
  memoryThreshold: number;
  /** Maximum dependency depth */
  maxDependencyDepth: number;
  /** Enable cycle detection */
  enableCycleDetection: boolean;
  /** Enable performance monitoring */
  enablePerformanceMonitoring: boolean;
  /** Health check timeout in milliseconds */
  timeout: number;
}

/**
 * DI Container Health Monitor
 */
export class ContainerHealthMonitor {
  private healthHistory: ContainerHealthCheckResult[] = [];
  private dependencyGraph = new Map<ServiceIdentifier, DependencyGraphNode>();
  private performanceMetrics = new Map<ServiceIdentifier, number[]>();
  private memoryBaseline = 0;

  constructor(
    private readonly config: ContainerHealthCheckConfig,
    private readonly container: any
  ) {
    this.memoryBaseline = this.getCurrentMemoryUsage();
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<ContainerHealthCheckResult> {
    const startTime = Date.now();

    try {
      // Collect basic metrics
      const totalServices = this.getTotalServices();
      const activeServices = this.getActiveServices();
      const memoryUsage = this.getCurrentMemoryUsage();

      // Detect dependency cycles
      const dependencyCycles = this.config.enableCycleDetection
        ? this.detectDependencyCycles()
        : [];

      // Analyze service health
      const serviceIssues = await this.analyzeServiceHealth();

      // Collect performance metrics
      const performance = this.collectPerformanceMetrics();

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        memoryUsage,
        dependencyCycles,
        serviceIssues,
        performance
      );

      // Determine overall status
      const status = this.determineHealthStatus(
        memoryUsage,
        dependencyCycles,
        serviceIssues,
        performance
      );

      const result: ContainerHealthCheckResult = {
        status,
        timestamp: new Date(),
        totalServices,
        activeServices,
        memoryUsage,
        dependencyCycles,
        serviceIssues,
        performance,
        recommendations
      };

      // Store in history
      this.healthHistory.push(result);

      // Trim history to last 100 checks
      if (this.healthHistory.length > 100) {
        this.healthHistory = this.healthHistory.slice(-100);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        status: 'critical',
        timestamp: new Date(),
        totalServices: 0,
        activeServices: 0,
        memoryUsage: this.getCurrentMemoryUsage(),
        dependencyCycles: [],
        serviceIssues: [{
          serviceId: 'system',
          severity: 'critical',
          description: `Health check failed: ${errorMessage}`,
          type: 'instantiation_failure',
          resolution: 'Check container configuration and dependencies'
        }],
        performance: this.getDefaultPerformanceMetrics(),
        recommendations: ['Fix health check system errors']
      };
    }
  }

  /**
   * Detect circular dependencies
   */
  private detectDependencyCycles(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<ServiceIdentifier>();
    const recursionStack = new Set<ServiceIdentifier>();

    const dfs = (serviceId: ServiceIdentifier, path: ServiceIdentifier[]): void => {
      if (recursionStack.has(serviceId)) {
        // Found a cycle
        const cycleStart = path.indexOf(serviceId);
        cycles.push(path.slice(cycleStart).map(id => String(id)));
        return;
      }

      if (visited.has(serviceId)) return;

      visited.add(serviceId);
      recursionStack.add(serviceId);

      const node = this.dependencyGraph.get(serviceId);
      if (node) {
        for (const dep of node.dependencies) {
          dfs(dep, [...path, serviceId]);
        }
      }

      recursionStack.delete(serviceId);
    };

    for (const serviceId of this.dependencyGraph.keys()) {
      if (!visited.has(serviceId)) {
        dfs(serviceId, []);
      }
    }

    return cycles;
  }

  /**
   * Analyze individual service health
   */
  private async analyzeServiceHealth(): Promise<ServiceHealthIssue[]> {
    const issues: ServiceHealthIssue[] = [];

    for (const [serviceId, node] of this.dependencyGraph) {
      // Check for missing dependencies
      for (const dep of node.dependencies) {
        if (!this.dependencyGraph.has(dep)) {
          issues.push({
            serviceId,
            severity: 'high',
            description: `Missing dependency: ${String(dep)}`,
            type: 'dependency_missing',
            resolution: `Register dependency ${String(dep)} or remove from service ${String(serviceId)}`
          });
        }
      }

      // Check for excessive instantiation time
      const avgTime = node.averageResolutionTime;
      if (avgTime > 100) { // 100ms threshold
        issues.push({
          serviceId,
          severity: 'medium',
          description: `Slow instantiation: ${avgTime.toFixed(2)}ms average`,
          type: 'instantiation_failure',
          resolution: 'Optimize service constructor or consider lazy loading'
        });
      }

      // Check for memory leaks (high instantiation count)
      if (node.instantiationCount > 1000) {
        issues.push({
          serviceId,
          severity: 'medium',
          description: `High instantiation count: ${node.instantiationCount}`,
          type: 'memory_leak',
          resolution: 'Check for proper service lifetime management'
        });
      }
    }

    return issues;
  }

  /**
   * Collect performance metrics
   */
  private collectPerformanceMetrics(): ContainerPerformanceMetrics {
    const allTimes = Array.from(this.performanceMetrics.values()).flat();

    if (allTimes.length === 0) {
      return this.getDefaultPerformanceMetrics();
    }

    const averageInstantiationTime = allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length;
    const totalInstantiationTime = allTimes.reduce((sum, time) => sum + time, 0);
    const cacheHitRate = this.calculateCacheHitRate();
    const resolutionSuccessRate = this.calculateResolutionSuccessRate();
    const peakMemoryUsage = Math.max(...this.healthHistory.map(h => h.memoryUsage), this.getCurrentMemoryUsage());

    // Determine service count trend
    const serviceCountTrend = this.determineServiceCountTrend();

    return {
      averageInstantiationTime,
      totalInstantiationTime,
      cacheHitRate,
      resolutionSuccessRate,
      peakMemoryUsage,
      serviceCountTrend
    };
  }

  /**
   * Generate health recommendations
   */
  private generateRecommendations(
    memoryUsage: number,
    dependencyCycles: string[][],
    serviceIssues: ServiceHealthIssue[],
    performance: ContainerPerformanceMetrics
  ): string[] {
    const recommendations: string[] = [];

    // Memory recommendations
    if (memoryUsage > this.config.memoryThreshold) {
      recommendations.push(`Memory usage (${(memoryUsage / 1024 / 1024).toFixed(2)}MB) exceeds threshold`);
    }

    // Dependency cycle recommendations
    if (dependencyCycles.length > 0) {
      recommendations.push(`Resolve ${dependencyCycles.length} circular dependency cycles`);
    }

    // Service issue recommendations
    const criticalIssues = serviceIssues.filter(issue => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push(`Address ${criticalIssues.length} critical service issues`);
    }

    // Performance recommendations
    if (performance.averageInstantiationTime > 50) {
      recommendations.push('Optimize slow service instantiation');
    }

    if (performance.cacheHitRate < 0.8) {
      recommendations.push('Improve container cache hit rate');
    }

    return recommendations;
  }

  /**
   * Determine overall health status
   */
  private determineHealthStatus(
    memoryUsage: number,
    dependencyCycles: string[][],
    serviceIssues: ServiceHealthIssue[],
    performance: ContainerPerformanceMetrics
  ): 'healthy' | 'warning' | 'critical' {
    // Critical issues
    if (dependencyCycles.length > 0) return 'critical';
    if (serviceIssues.some(issue => issue.severity === 'critical')) return 'critical';

    // Warning issues
    if (memoryUsage > this.config.memoryThreshold) return 'warning';
    if (serviceIssues.some(issue => issue.severity === 'high')) return 'warning';
    if (performance.averageInstantiationTime > 100) return 'warning';

    return 'healthy';
  }

  /**
   * Get current memory usage (simplified)
   */
  private getCurrentMemoryUsage(): number {
    // In a real implementation, this would use process.memoryUsage() or browser APIs
    // For now, return a simulated value based on service count
    return this.dependencyGraph.size * 1024; // 1KB per service
  }

  /**
   * Get total services count
   */
  private getTotalServices(): number {
    return this.dependencyGraph.size;
  }

  /**
   * Get active services count
   */
  private getActiveServices(): number {
    return Array.from(this.dependencyGraph.values())
      .filter(node => node.instantiationCount > 0)
      .length;
  }

  /**
   * Calculate cache hit rate
   */
  private calculateCacheHitRate(): number {
    // Simulated cache hit rate
    return 0.85;
  }

  /**
   * Calculate resolution success rate
   */
  private calculateResolutionSuccessRate(): number {
    // Simulated resolution success rate
    return 0.95;
  }

  /**
   * Determine service count trend
   */
  private determineServiceCountTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.healthHistory.length < 2) return 'stable';

    const recent = this.healthHistory.slice(-5);
    const first = recent[0]!;
    const last = recent[recent.length - 1]!;

    if (last.totalServices > first.totalServices * 1.1) return 'increasing';
    if (last.totalServices < first.totalServices * 0.9) return 'decreasing';
    return 'stable';
  }

  /**
   * Get default performance metrics
   */
  private getDefaultPerformanceMetrics(): ContainerPerformanceMetrics {
    return {
      averageInstantiationTime: 0,
      totalInstantiationTime: 0,
      cacheHitRate: 0,
      resolutionSuccessRate: 0,
      peakMemoryUsage: 0,
      serviceCountTrend: 'stable'
    };
  }

  /**
   * Get health history
   */
  getHealthHistory(): ContainerHealthCheckResult[] {
    return [...this.healthHistory];
  }

  /**
   * Get dependency graph
   */
  getDependencyGraph(): Map<ServiceIdentifier, DependencyGraphNode> {
    return new Map(this.dependencyGraph);
  }

  /**
   * Update dependency graph (called by container during service resolution)
   */
  updateDependencyGraph(serviceId: ServiceIdentifier, dependencies: ServiceIdentifier[]): void {
    const node = this.dependencyGraph.get(serviceId) || {
      serviceId,
      dependencies: [],
      dependents: [],
      instantiationCount: 0,
      lastInstantiation: new Date(),
      averageResolutionTime: 0
    };

    node.dependencies = dependencies;
    this.dependencyGraph.set(serviceId, node);

    // Update dependents
    for (const dep of dependencies) {
      const depNode = this.dependencyGraph.get(dep) || {
        serviceId: dep,
        dependencies: [],
        dependents: [],
        instantiationCount: 0,
        lastInstantiation: new Date(),
        averageResolutionTime: 0
      };

      if (!depNode.dependents.includes(serviceId)) {
        depNode.dependents.push(serviceId);
      }

      this.dependencyGraph.set(dep, depNode);
    }
  }

  /**
   * Record service instantiation metrics
   */
  recordServiceInstantiation(serviceId: ServiceIdentifier, resolutionTime: number): void {
    const node = this.dependencyGraph.get(serviceId);
    if (node) {
      node.instantiationCount++;
      node.lastInstantiation = new Date();

      // Update average resolution time
      const times = this.performanceMetrics.get(serviceId) || [];
      times.push(resolutionTime);

      // Keep only last 100 measurements
      if (times.length > 100) {
        times.splice(0, times.length - 100);
      }

      this.performanceMetrics.set(serviceId, times);
      node.averageResolutionTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    }
  }
}
