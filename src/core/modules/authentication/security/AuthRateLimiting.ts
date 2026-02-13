/**
 * Authentication Rate Limiting
 *
 * Provides comprehensive rate limiting and security features for authentication endpoints.
 * Includes IP-based limiting, user-based limiting, progressive delays, and DDoS protection.
 */

import { createSystemError } from '../../error';

/**
 * Rate limit configuration
 */
export interface IRateLimitConfig {
  /** Enable rate limiting */
  enabled: boolean;
  /** Maximum requests per window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Skip successful requests */
  skipSuccessfulRequests: boolean;
  /** Skip failed requests */
  skipFailedRequests: boolean;
  /** Enable progressive delays */
  enableProgressiveDelays: boolean;
  /** Base delay in milliseconds */
  baseDelayMs: number;
  /** Delay multiplier */
  delayMultiplier: number;
  /** Maximum delay in milliseconds */
  maxDelayMs: number;
}

/**
 * Rate limit entry
 */
export interface IRateLimitEntry {
  /** Request count */
  count: number;
  /** First request timestamp */
  firstRequest: Date;
  /** Last request timestamp */
  lastRequest: Date;
  /** Blocked until timestamp */
  blockedUntil?: Date;
  /** Progressive delay level */
  delayLevel: number;
  /** Total violations */
  totalViolations: number;
}

/**
 * Rate limit result
 */
export interface IRateLimitResult {
  /** Whether request is allowed */
  allowed: boolean;
  /** Remaining requests */
  remaining: number;
  /** Reset time */
  resetTime: Date;
  /** Retry after delay (in milliseconds) */
  retryAfter?: number;
  /** Rate limit exceeded */
  limitExceeded: boolean;
  /** Progressive delay applied */
  progressiveDelay?: number;
}

/**
 * Rate limit storage interface
 */
export interface IRateLimitStorage {
  /** Get rate limit entry */
  get(key: string): Promise<IRateLimitEntry | null>;
  /** Set rate limit entry */
  set(key: string, entry: IRateLimitEntry): Promise<void>;
  /** Delete rate limit entry */
  delete(key: string): Promise<void>;
  /** Clear expired entries */
  clearExpired(): Promise<void>;
  /** Get all entries */
  getAll(): Promise<Map<string, IRateLimitEntry>>;
}

/**
 * Rate limiter class
 */
export class RateLimiter {
  private entries = new Map<string, IRateLimitEntry>();
  private cleanupInterval?: NodeJS.Timeout;

  constructor(
    private config: IRateLimitConfig,
    private storage?: IRateLimitStorage
  ) {
    this.startCleanup();
  }

  /**
   * Check rate limit
   */
  async checkLimit(key: string, identifier?: string): Promise<IRateLimitResult> {
    if (!this.config.enabled) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetTime: new Date(Date.now() + this.config.windowMs),
        limitExceeded: false
      };
    }

    const fullKey = identifier ? `${key}:${identifier}` : key;
    const now = new Date();
    
    let entry: IRateLimitEntry;
    
    if (this.storage) {
      entry = await this.storage.get(fullKey) || this.createEntry(now);
    } else {
      entry = this.entries.get(fullKey) || this.createEntry(now);
    }

    // Check if currently blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
        retryAfter: entry.blockedUntil.getTime() - now.getTime(),
        limitExceeded: true
      };
    }

    // Reset window if expired
    if (now.getTime() - entry.firstRequest.getTime() > this.config.windowMs) {
      entry = this.createEntry(now);
    }

    // Increment count
    entry.count++;
    entry.lastRequest = now;

    // Check if limit exceeded
    const limitExceeded = entry.count > this.config.maxRequests;
    
    if (limitExceeded) {
      entry.totalViolations++;
      
      // Apply progressive delay if enabled
      if (this.config.enableProgressiveDelays) {
        entry.delayLevel = Math.min(entry.delayLevel + 1, 10);
        
        const delay = Math.min(
          this.config.baseDelayMs * Math.pow(this.config.delayMultiplier, entry.delayLevel - 1),
          this.config.maxDelayMs
        );
        
        entry.blockedUntil = new Date(now.getTime() + delay);
        
        if (this.storage) {
          await this.storage.set(fullKey, entry);
        } else {
          this.entries.set(fullKey, entry);
        }
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.blockedUntil,
          retryAfter: delay,
          limitExceeded: true,
          progressiveDelay: delay
        };
      } else {
        // Simple block for the remainder of the window
        entry.blockedUntil = new Date(entry.firstRequest.getTime() + this.config.windowMs);
        
        if (this.storage) {
          await this.storage.set(fullKey, entry);
        } else {
          this.entries.set(fullKey, entry);
        }
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.blockedUntil,
          retryAfter: entry.blockedUntil.getTime() - now.getTime(),
          limitExceeded: true
        };
      }
    }

    // Update storage
    if (this.storage) {
      await this.storage.set(fullKey, entry);
    } else {
      this.entries.set(fullKey, entry);
    }

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: new Date(entry.firstRequest.getTime() + this.config.windowMs),
      limitExceeded: false
    };
  }

  /**
   * Reset rate limit for a key
   */
  async reset(key: string, identifier?: string): Promise<void> {
    const fullKey = identifier ? `${key}:${identifier}` : key;
    
    if (this.storage) {
      await this.storage.delete(fullKey);
    } else {
      this.entries.delete(fullKey);
    }
  }

  /**
   * Get rate limit status
   */
  async getStatus(key: string, identifier?: string): Promise<IRateLimitEntry | null> {
    const fullKey = identifier ? `${key}:${identifier}` : key;
    
    if (this.storage) {
      return await this.storage.get(fullKey);
    } else {
      return this.entries.get(fullKey) || null;
    }
  }

  /**
   * Clear all rate limits
   */
  async clear(): Promise<void> {
    if (this.storage) {
      const allEntries = await this.storage.getAll();
      for (const [key] of allEntries) {
        await this.storage.delete(key);
      }
    } else {
      this.entries.clear();
    }
  }

  /**
   * Create new rate limit entry
   */
  private createEntry(now: Date): IRateLimitEntry {
    return {
      count: 0,
      firstRequest: now,
      lastRequest: now,
      delayLevel: 0,
      totalViolations: 0
    };
  }

  /**
   * Start cleanup interval
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(async () => {
      await this.cleanup();
    }, 60000); // Cleanup every minute
  }

  /**
   * Cleanup expired entries
   */
  private async cleanup(): Promise<void> {
    const now = new Date();
    
    if (this.storage) {
      await this.storage.clearExpired();
    } else {
      for (const [key, entry] of this.entries) {
        if (now.getTime() - entry.lastRequest.getTime() > this.config.windowMs * 2) {
          this.entries.delete(key);
        }
      }
    }
  }

  /**
   * Destroy rate limiter
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

/**
 * Authentication rate limiter
 */
export class AuthRateLimiter {
  private limiters = new Map<string, RateLimiter>();

  constructor(
    private configs: Record<string, IRateLimitConfig>,
    storage?: IRateLimitStorage
  ) {
    // Initialize limiters for different types
    for (const [type, config] of Object.entries(configs)) {
      this.limiters.set(type, new RateLimiter(config, storage));
    }
  }

  /**
   * Check login rate limit
   */
  async checkLogin(ip: string, email?: string): Promise<IRateLimitResult> {
    const ipResult = await this.limiters.get('login_ip')?.checkLimit('login', ip);
    const emailResult = email ? await this.limiters.get('login_email')?.checkLimit('login', email) : undefined;
    
    if (!ipResult?.allowed || !emailResult?.allowed) {
      return {
        allowed: false,
        remaining: Math.min(ipResult?.remaining || 0, emailResult?.remaining || 0),
        resetTime: ipResult?.resetTime || emailResult?.resetTime || new Date(),
        retryAfter: Math.max(ipResult?.retryAfter || 0, emailResult?.retryAfter || 0),
        limitExceeded: true,
        progressiveDelay: ipResult?.progressiveDelay || emailResult?.progressiveDelay
      };
    }
    
    return ipResult || { allowed: true, remaining: 1, resetTime: new Date(), limitExceeded: false };
  }

  /**
   * Check registration rate limit
   */
  async checkRegistration(ip: string): Promise<IRateLimitResult> {
    return await this.limiters.get('registration')?.checkLimit('registration', ip) || 
           { allowed: true, remaining: 1, resetTime: new Date(), limitExceeded: false };
  }

  /**
   * Check password reset rate limit
   */
  async checkPasswordReset(ip: string, email?: string): Promise<IRateLimitResult> {
    const ipResult = await this.limiters.get('password_reset_ip')?.checkLimit('password_reset', ip);
    const emailResult = email ? await this.limiters.get('password_reset_email')?.checkLimit('password_reset', email) : undefined;
    
    if (!ipResult?.allowed || !emailResult?.allowed) {
      return {
        allowed: false,
        remaining: Math.min(ipResult?.remaining || 0, emailResult?.remaining || 0),
        resetTime: ipResult?.resetTime || emailResult?.resetTime || new Date(),
        retryAfter: Math.max(ipResult?.retryAfter || 0, emailResult?.retryAfter || 0),
        limitExceeded: true,
        progressiveDelay: ipResult?.progressiveDelay || emailResult?.progressiveDelay
      };
    }
    
    return ipResult || { allowed: true, remaining: 1, resetTime: new Date(), limitExceeded: false };
  }

  /**
   * Check account unlock rate limit
   */
  async checkAccountUnlock(ip: string, email?: string): Promise<IRateLimitResult> {
    const ipResult = await this.limiters.get('account_unlock_ip')?.checkLimit('account_unlock', ip);
    const emailResult = email ? await this.limiters.get('account_unlock_email')?.checkLimit('account_unlock', email) : undefined;
    
    if (!ipResult?.allowed || !emailResult?.allowed) {
      return {
        allowed: false,
        remaining: Math.min(ipResult?.remaining || 0, emailResult?.remaining || 0),
        resetTime: ipResult?.resetTime || emailResult?.resetTime || new Date(),
        retryAfter: Math.max(ipResult?.retryAfter || 0, emailResult?.retryAfter || 0),
        limitExceeded: true,
        progressiveDelay: ipResult?.progressiveDelay || emailResult?.progressiveDelay
      };
    }
    
    return ipResult || { allowed: true, remaining: 1, resetTime: new Date(), limitExceeded: false };
  }

  /**
   * Record successful authentication
   */
  async recordSuccess(type: 'login' | 'registration' | 'password_reset' | 'account_unlock', identifier: string): Promise<void> {
    // Reset rate limit on successful authentication
    const limiter = this.limiters.get(`${type}_success`);
    if (limiter) {
      await limiter.reset(type, identifier);
    }
  }

  /**
   * Record failed authentication
   */
  async recordFailure(type: 'login' | 'registration' | 'password_reset' | 'account_unlock', identifier: string): Promise<void> {
    // Increment failure counter
    const limiter = this.limiters.get(`${type}_failure`);
    if (limiter) {
      await limiter.checkLimit(type, identifier);
    }
  }

  /**
   * Get rate limit status
   */
  async getStatus(type: string, identifier: string): Promise<IRateLimitEntry | null> {
    const limiter = this.limiters.get(type);
    return limiter ? await limiter.getStatus(type, identifier) : null;
  }

  /**
   * Reset rate limit
   */
  async reset(type: string, identifier: string): Promise<void> {
    const limiter = this.limiters.get(type);
    if (limiter) {
      await limiter.reset(type, identifier);
    }
  }

  /**
   * Clear all rate limits
   */
  async clear(): Promise<void> {
    for (const limiter of this.limiters.values()) {
      await limiter.clear();
    }
  }

  /**
   * Destroy all limiters
   */
  destroy(): void {
    for (const limiter of this.limiters.values()) {
      limiter.destroy();
    }
    this.limiters.clear();
  }
}

/**
 * In-memory rate limit storage
 */
export class InMemoryRateLimitStorage implements IRateLimitStorage {
  private entries = new Map<string, IRateLimitEntry>();

  async get(key: string): Promise<IRateLimitEntry | null> {
    return this.entries.get(key) || null;
  }

  async set(key: string, entry: IRateLimitEntry): Promise<void> {
    this.entries.set(key, entry);
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }

  async clearExpired(): Promise<void> {
    const now = new Date();
    for (const [key, entry] of this.entries) {
      if (now.getTime() - entry.lastRequest.getTime() > 300000) { // 5 minutes
        this.entries.delete(key);
      }
    }
  }

  async getAll(): Promise<Map<string, IRateLimitEntry>> {
    return new Map(this.entries);
  }
}

/**
 * Default rate limit configurations
 */
export const DefaultRateLimitConfigs: Record<string, IRateLimitConfig> = {
  login_ip: {
    enabled: true,
    maxRequests: 5,
    windowMs: 900000, // 15 minutes
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enableProgressiveDelays: true,
    baseDelayMs: 1000,
    delayMultiplier: 2,
    maxDelayMs: 300000 // 5 minutes
  },
  login_email: {
    enabled: true,
    maxRequests: 3,
    windowMs: 900000, // 15 minutes
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enableProgressiveDelays: true,
    baseDelayMs: 2000,
    delayMultiplier: 2,
    maxDelayMs: 600000 // 10 minutes
  },
  registration: {
    enabled: true,
    maxRequests: 3,
    windowMs: 3600000, // 1 hour
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enableProgressiveDelays: false,
    baseDelayMs: 1000,
    delayMultiplier: 2,
    maxDelayMs: 60000 // 1 minute
  },
  password_reset_ip: {
    enabled: true,
    maxRequests: 3,
    windowMs: 3600000, // 1 hour
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enableProgressiveDelays: true,
    baseDelayMs: 5000,
    delayMultiplier: 2,
    maxDelayMs: 900000 // 15 minutes
  },
  password_reset_email: {
    enabled: true,
    maxRequests: 2,
    windowMs: 3600000, // 1 hour
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enableProgressiveDelays: true,
    baseDelayMs: 10000,
    delayMultiplier: 2,
    maxDelayMs: 1800000 // 30 minutes
  },
  account_unlock_ip: {
    enabled: true,
    maxRequests: 5,
    windowMs: 3600000, // 1 hour
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enableProgressiveDelays: true,
    baseDelayMs: 15000,
    delayMultiplier: 2,
    maxDelayMs: 3600000 // 1 hour
  },
  account_unlock_email: {
    enabled: true,
    maxRequests: 3,
    windowMs: 3600000, // 1 hour
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enableProgressiveDelays: true,
    baseDelayMs: 30000,
    delayMultiplier: 2,
    maxDelayMs: 7200000 // 2 hours
  }
};
