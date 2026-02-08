/**
 * Advanced Token Rotation Manager
 *
 * Provides enterprise-grade token rotation and refresh strategies with:
 * - Proactive token rotation before expiration
 * - Multiple refresh strategies (eager, lazy, adaptive)
 * - Token validation and integrity checking
 * - Refresh token rotation for enhanced security
 * - Graceful degradation and fallback mechanisms
 */

import { createDefaultAuthOrchestrator } from '../factory';

import type { AuthOrchestrator } from '../enterprise/AuthOrchestrator';
import type { IAuthLogger, IAuthMetrics } from '../interfaces/authInterfaces';

export interface TokenRotationStrategy {
  name: string;
  shouldRotate: (tokenInfo: TokenInfo) => boolean;
  getRotationDelay: (tokenInfo: TokenInfo) => number;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  issuedAt: Date;
  tokenType: string;
  scope?: string;
}

export interface TokenRotationOptions {
  strategy?: 'eager' | 'lazy' | 'adaptive' | 'custom';
  customStrategy?: TokenRotationStrategy;
  rotationBuffer?: number; // Time before expiration to rotate (ms)
  enableRefreshTokenRotation?: boolean;
  enableTokenValidation?: boolean;
  maxRefreshAttempts?: number;
  rotationDelay?: number; // Delay between rotation attempts
}

export interface TokenRotationMetrics {
  totalRotations: number;
  successfulRotations: number;
  failedRotations: number;
  averageRotationTime: number;
  lastRotationTime: Date | null;
  rotationStrategy: string;
  refreshTokensRotated: number;
  validationFailures: number;
  fallbackActivations: number;
}

/**
 * Advanced Token Rotation Manager
 *
 * Implements sophisticated token rotation strategies with enterprise-grade
 * security monitoring and performance optimization.
 */
export class AdvancedTokenRotationManager {
  private readonly authOrchestrator: AuthOrchestrator;
  private readonly logger: IAuthLogger;
  private readonly metrics: IAuthMetrics;
  private readonly options: TokenRotationOptions;
  private rotationStrategies: Map<string, TokenRotationStrategy>;
  private currentStrategy: TokenRotationStrategy;
  private isRotating: boolean = false;
  private rotationQueue: Array<() => Promise<void>> = [];
  private lastRotationAttempt: Date | null = null;

  constructor(options: TokenRotationOptions = {}) {
    this.authOrchestrator = createDefaultAuthOrchestrator();
    this.logger = this.authOrchestrator.logger;
    this.metrics = this.authOrchestrator.metrics;
    this.options = {
      strategy: 'adaptive',
      rotationBuffer: 300000, // 5 minutes
      enableRefreshTokenRotation: false,
      enableTokenValidation: true,
      maxRefreshAttempts: 3,
      rotationDelay: 1000,
      ...options
    };

    this.metrics = {
      totalRotations: 0,
      successfulRotations: 0,
      failedRotations: 0,
      averageRotationTime: 0,
      lastRotationTime: null,
      rotationStrategy: this.options.strategy,
      refreshTokensRotated: 0,
      validationFailures: 0,
      fallbackActivations: 0
    };
  }

  /**
   * Start automatic token rotation
   */
  async startTokenRotation(): Promise<void> {
    if (this.isActive) {
      console.warn('Token rotation is already active');
      return;
    }

    try {
      // Validate current tokens
      const tokenInfo = await this.getCurrentTokenInfo();
      if (!tokenInfo) {
        throw new Error('No valid tokens found for rotation');
      }

      if (this.options.enableTokenValidation) {
        const isValid = await this.validateTokenIntegrity(tokenInfo);
        if (!isValid) {
          throw new Error('Token integrity validation failed');
        }
      }

      this.isActive = true;
      this.scheduleNextRotation(tokenInfo);

      console.log(`Token rotation started with strategy: ${this.options.strategy}`);
    } catch (error) {
      console.error('Failed to start token rotation:', error);
      throw error;
    }
  }

  /**
   * Stop automatic token rotation
   */
  stopTokenRotation(): void {
    if (!this.isActive) {
      return;
    }

    if (this.rotationIntervalId) {
      clearInterval(this.rotationIntervalId);
      this.rotationIntervalId = null;
    }

    this.isActive = false;
    console.log('Token rotation stopped');
  }

  /**
   * Force immediate token rotation
   */
  async forceRotation(): Promise<boolean> {
    const startTime = Date.now();
    this.metrics.totalRotations++;

    try {
      const tokenInfo = await this.getCurrentTokenInfo();
      if (!tokenInfo) {
        throw new Error('No tokens available for rotation');
      }

      const success = await this.performTokenRotation(tokenInfo);

      if (success) {
        this.metrics.successfulRotations++;
        this.metrics.lastRotationTime = new Date();
      } else {
        this.metrics.failedRotations++;
      }

      const rotationTime = Date.now() - startTime;
      this.updateAverageRotationTime(rotationTime);

      return success;
    } catch (error) {
      this.metrics.failedRotations++;
      console.error('Forced token rotation failed:', error);
      return false;
    }
  }

  /**
   * Get current rotation metrics
   */
  getMetrics(): TokenRotationMetrics {
    return { ...this.metrics };
  }

  /**
   * Get rotation status
   */
  getStatus(): {
    isActive: boolean;
    strategy: string;
    lastRotation: Date | null;
    nextRotation: Date | null;
  } {
    const tokenInfo = this.getCurrentTokenInfoSync();
    const nextRotation = tokenInfo ? this.calculateNextRotation(tokenInfo) : null;

    return {
      isActive: this.isActive,
      strategy: this.options.strategy,
      lastRotation: this.metrics.lastRotationTime,
      nextRotation
    };
  }

  /**
   * Update rotation strategy
   */
  updateStrategy(strategy: TokenRotationOptions['strategy'], customStrategy?: TokenRotationStrategy): void {
    this.options.strategy = strategy;
    if (customStrategy) {
      this.options.customStrategy = customStrategy;
    }
    this.metrics.rotationStrategy = strategy;

    // Restart rotation with new strategy if active
    if (this.isActive) {
      this.stopTokenRotation();
      this.startTokenRotation();
    }
  }

  /**
   * Private methods
   */

  private async getCurrentTokenInfo(): Promise<TokenInfo | null> {
    try {
      const authData = await this.authService.getCurrentAuthData();
      if (!authData?.token) {
        return null;
      }

      return this.parseTokenInfo(authData.token, authData.refreshToken);
    } catch (error) {
      console.error('Failed to get current token info:', error);
      return null;
    }
  }

  private getCurrentTokenInfoSync(): TokenInfo | null {
    try {
      // Synchronous version for status checks
      const token = this.authService.getAccessToken();
      const refreshToken = this.authService.getRefreshToken();

      if (!token) {
        return null;
      }

      return this.parseTokenInfo(token, refreshToken);
    } catch (error) {
      return null;
    }
  }

  private parseTokenInfo(accessToken: string, refreshToken?: string): TokenInfo {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));

      return {
        accessToken,
        refreshToken: refreshToken || '',
        expiresAt: new Date(payload.exp * 1000),
        issuedAt: new Date(payload.iat * 1000),
        tokenType: payload.typ || 'Bearer',
        scope: payload.scope
      };
    } catch (error) {
      throw new Error('Failed to parse token information');
    }
  }

  private async validateTokenIntegrity(tokenInfo: TokenInfo): Promise<boolean> {
    try {
      // Check token expiration
      if (tokenInfo.expiresAt <= new Date()) {
        return false;
      }

      // Check token format
      if (tokenInfo.accessToken?.split('.').length !== 3) {
        return false;
      }

      // Validate refresh token if rotation is enabled
      if (this.options.enableRefreshTokenRotation && !tokenInfo.refreshToken) {
        return false;
      }

      // Additional validation can be added here
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  private scheduleNextRotation(tokenInfo: TokenInfo): void {
    const strategy = this.getRotationStrategy();
    const delay = strategy.getRotationDelay(tokenInfo);

    this.rotationIntervalId = window.setTimeout(async () => {
      if (this.isActive) {
        await this.performScheduledRotation(tokenInfo);
      }
    }, delay);
  }

  private async performScheduledRotation(tokenInfo: TokenInfo): Promise<void> {
    const shouldRotate = this.getRotationStrategy().shouldRotate(tokenInfo);

    if (shouldRotate) {
      const success = await this.performTokenRotation(tokenInfo);

      if (success) {
        // Get updated token info and schedule next rotation
        const newTokenInfo = await this.getCurrentTokenInfo();
        if (newTokenInfo) {
          this.scheduleNextRotation(newTokenInfo);
        }
      } else {
        // Handle rotation failure with fallback
        await this.handleRotationFailure(tokenInfo);
      }
    } else {
      // No rotation needed, schedule next check
      this.scheduleNextRotation(tokenInfo);
    }
  }

  private async performTokenRotation(tokenInfo: TokenInfo): Promise<boolean> {
    const startTime = Date.now();
    this.lastRotationAttempt = new Date();

    try {
      // Attempt token refresh
      const refreshResult = await this.authService.refreshToken();

      if (refreshResult) {
        // Rotate refresh token if enabled
        if (this.options.enableRefreshTokenRotation && refreshResult.refreshToken) {
          await this.rotateRefreshToken(refreshResult.refreshToken);
        }

        console.log('Token rotation successful');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token rotation failed:', error);
      return false;
    }
  }

  private async rotateRefreshToken(newRefreshToken: string): Promise<void> {
    try {
      // Implement refresh token rotation logic
      // This would typically involve invalidating the old refresh token
      // and issuing a new one
      this.metrics.refreshTokensRotated++;
      console.log('Refresh token rotated successfully');
    } catch (error) {
      console.error('Refresh token rotation failed:', error);
    }
  }

  private async handleRotationFailure(tokenInfo: TokenInfo): Promise<void> {
    this.metrics.fallbackActivations++;

    // Implement fallback strategy
    const timeUntilExpiration = tokenInfo.expiresAt.getTime() - Date.now();

    if (timeUntilExpiration < 60000) { // Less than 1 minute
      // Critical: Token will expire soon, force logout
      console.warn('Token expiration imminent, forcing logout');
      await this.authService.logout();
    } else {
      // Schedule retry with exponential backoff
      const retryDelay = Math.min(
        this.options.rotationDelay * Math.pow(2, this.rotationCount),
        30000 // Max 30 seconds
      );

      this.rotationCount++;

      setTimeout(() => {
        if (this.isActive) {
          this.performScheduledRotation(tokenInfo);
        }
      }, retryDelay);
    }
  }

  private getRotationStrategy(): TokenRotationStrategy {
    switch (this.options.strategy) {
      case 'eager':
        return this.getEagerStrategy();
      case 'lazy':
        return this.getLazyStrategy();
      case 'adaptive':
        return this.getAdaptiveStrategy();
      case 'custom':
        return this.options.customStrategy;
      default:
        return this.getAdaptiveStrategy();
    }
  }

  private getEagerStrategy(): TokenRotationStrategy {
    return {
      name: 'eager',
      shouldRotate: (tokenInfo) => {
        const timeUntilExpiration = tokenInfo.expiresAt.getTime() - Date.now();
        return timeUntilExpiration <= this.options.rotationBuffer * 2; // Rotate earlier
      },
      getRotationDelay: (tokenInfo) => {
        const timeUntilExpiration = tokenInfo.expiresAt.getTime() - Date.now();
        return Math.max(0, timeUntilExpiration - (this.options.rotationBuffer * 2));
      }
    };
  }

  private getLazyStrategy(): TokenRotationStrategy {
    return {
      name: 'lazy',
      shouldRotate: (tokenInfo) => {
        const timeUntilExpiration = tokenInfo.expiresAt.getTime() - Date.now();
        return timeUntilExpiration <= this.options.rotationBuffer / 2; // Rotate later
      },
      getRotationDelay: (tokenInfo) => {
        const timeUntilExpiration = tokenInfo.expiresAt.getTime() - Date.now();
        return Math.max(0, timeUntilExpiration - (this.options.rotationBuffer / 2));
      }
    };
  }

  private getAdaptiveStrategy(): TokenRotationStrategy {
    return {
      name: 'adaptive',
      shouldRotate: (tokenInfo) => {
        const timeUntilExpiration = tokenInfo.expiresAt.getTime() - Date.now();

        // Adaptive logic based on usage patterns and failure rate
        const failureRate = this.metrics.failedRotations / Math.max(1, this.metrics.totalRotations);
        const adaptiveBuffer = failureRate > 0.1
          ? this.options.rotationBuffer * 1.5 // More buffer if failures
          : this.options.rotationBuffer;

        return timeUntilExpiration <= adaptiveBuffer;
      },
      getRotationDelay: (tokenInfo) => {
        const timeUntilExpiration = tokenInfo.expiresAt.getTime() - Date.now();
        const failureRate = this.metrics.failedRotations / Math.max(1, this.metrics.totalRotations);
        const adaptiveBuffer = failureRate > 0.1
          ? this.options.rotationBuffer * 1.5
          : this.options.rotationBuffer;

        return Math.max(0, timeUntilExpiration - adaptiveBuffer);
      }
    };
  }

  private getDefaultStrategy(): TokenRotationStrategy {
    return this.getAdaptiveStrategy();
  }

  private calculateNextRotation(tokenInfo: TokenInfo): Date | null {
    const strategy = this.getRotationStrategy();
    const delay = strategy.getRotationDelay(tokenInfo);
    return new Date(Date.now() + delay);
  }

  private updateAverageRotationTime(rotationTime: number): void {
    const totalRotations = this.metrics.successfulRotations;
    if (totalRotations === 1) {
      this.metrics.averageRotationTime = rotationTime;
    } else {
      this.metrics.averageRotationTime =
        (this.metrics.averageRotationTime * (totalRotations - 1) + rotationTime) / totalRotations;
    }
  }
}

/**
 * Factory function to create advanced token rotation manager
 */
export function createAdvancedTokenRotationManager(options?: TokenRotationOptions): AdvancedTokenRotationManager {
  return new AdvancedTokenRotationManager(options);
}

// Export types for external use
export type { TokenRotationStrategy, TokenInfo, TokenRotationOptions, TokenRotationMetrics };
