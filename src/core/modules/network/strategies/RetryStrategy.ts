/**
 * Retry Strategy Pattern for Network Module
 *
 * Provides flexible retry strategies for different network scenarios.
 */

/**
 * Retry strategy interface
 */
export interface IRetryStrategy {
  /**
   * Calculate delay before next retry attempt
   */
  getDelay(attempt: number, error?: Error): number;

  /**
   * Check if retry should be attempted
   */
  shouldRetry(attempt: number, error: Error): boolean;

  /**
   * Get maximum number of retry attempts
   */
  getMaxAttempts(): number;

  /**
   * Reset strategy state
   */
  reset(): void;
}

/**
 * No retry strategy - never retries
 */
export class NoRetryStrategy implements IRetryStrategy {
  getDelay(): number {
    return 0;
  }

  shouldRetry(): boolean {
    return false;
  }

  getMaxAttempts(): number {
    return 1;
  }

  reset(): void {
    // No state to reset
  }
}

/**
 * Linear retry strategy - fixed delay between attempts
 */
export class LinearRetryStrategy implements IRetryStrategy {
  constructor(
    private readonly delay: number = 1000,
    private readonly maxAttempts: number = 3
  ) { }

  getDelay(): number {
    return this.delay;
  }

  shouldRetry(attempt: number): boolean {
    return attempt < this.maxAttempts;
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }

  reset(): void {
    // No state to reset
  }
}

/**
 * Exponential backoff retry strategy
 */
export class ExponentialBackoffRetryStrategy implements IRetryStrategy {
  constructor(
    private readonly baseDelay: number = 1000,
    private readonly maxDelay: number = 30000,
    private readonly maxAttempts: number = 5,
    private readonly backoffMultiplier: number = 2
  ) { }

  getDelay(attempt: number): number {
    const delay = this.baseDelay * Math.pow(this.backoffMultiplier, attempt - 1);
    return Math.min(delay, this.maxDelay);
  }

  shouldRetry(attempt: number, error: Error): boolean {
    if (attempt >= this.maxAttempts) {
      return false;
    }

    // Don't retry certain error types
    if (error.name === 'AuthenticationError' || error.name === 'BadRequestError') {
      return false;
    }

    return true;
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }

  reset(): void {
    // No state to reset
  }
}

/**
 * Adaptive retry strategy - adjusts based on error type
 */
export class AdaptiveRetryStrategy implements IRetryStrategy {
  private consecutiveFailures = 0;

  constructor(
    private readonly baseDelay: number = 1000,
    private readonly maxDelay: number = 30000,
    private readonly maxAttempts: number = 5
  ) { }

  getDelay(attempt: number, error?: Error): number {
    // Adjust delay based on error type
    let multiplier = 1;

    if (error?.name === 'RateLimitError') {
      // For rate limiting, use longer delays
      multiplier = 3;
    } else if (error?.name === 'NetworkTimeoutError') {
      // For timeouts, use moderate delays
      multiplier = 1.5;
    } else if (this.consecutiveFailures > 2) {
      // For multiple consecutive failures, increase delay
      multiplier = 2;
    }

    const delay = this.baseDelay * Math.pow(2, attempt - 1) * multiplier;
    return Math.min(delay, this.maxDelay);
  }

  shouldRetry(attempt: number, error: Error): boolean {
    if (attempt >= this.maxAttempts) {
      this.recordFailure();
      return false;
    }

    // Don't retry client errors (4xx) except specific cases
    if (error.name === 'AuthenticationError' ||
      error.name === 'BadRequestError' ||
      error.name === 'ForbiddenError') {
      this.recordFailure();
      return false;
    }

    return true;
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }

  reset(): void {
    this.consecutiveFailures = 0;
  }

  private recordFailure(): void {
    this.consecutiveFailures++;
  }
}

/**
 * Retry strategy factory
 */
export class RetryStrategyFactory {
  /**
   * Create retry strategy based on configuration
   */
  static createStrategy(type: 'none' | 'linear' | 'exponential' | 'adaptive', options?: {
    delay?: number;
    maxDelay?: number;
    maxAttempts?: number;
    backoffMultiplier?: number;
  }): IRetryStrategy {
    switch (type) {
      case 'none':
        return new NoRetryStrategy();
      case 'linear':
        return new LinearRetryStrategy(
          options?.delay || 1000,
          options?.maxAttempts || 3
        );
      case 'exponential':
        return new ExponentialBackoffRetryStrategy(
          options?.delay || 1000,
          options?.maxDelay || 30000,
          options?.maxAttempts || 5,
          options?.backoffMultiplier || 2
        );
      case 'adaptive':
        return new AdaptiveRetryStrategy(
          options?.delay || 1000,
          options?.maxDelay || 30000,
          options?.maxAttempts || 5
        );
      default:
        return new ExponentialBackoffRetryStrategy();
    }
  }

  /**
   * Get default strategy for most use cases
   */
  static getDefault(): IRetryStrategy {
    return new ExponentialBackoffRetryStrategy(1000, 30000, 3, 2);
  }

  /**
   * Get strategy for sensitive operations (no retries)
   */
  static getNoRetry(): IRetryStrategy {
    return new NoRetryStrategy();
  }

  /**
   * Get strategy for critical operations (more retries)
   */
  static getCritical(): IRetryStrategy {
    return new AdaptiveRetryStrategy(500, 60000, 7);
  }
}

/**
 * Retry configuration types
 */
export type RetryStrategyType = 'none' | 'linear' | 'exponential' | 'adaptive';

export interface RetryConfig {
  strategy: RetryStrategyType;
  delay?: number;
  maxDelay?: number;
  maxAttempts?: number;
  backoffMultiplier?: number;
}
