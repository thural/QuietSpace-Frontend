/**
 * Logger Factory
 * 
 * Factory for creating logger instances with proper configuration
 * and dependency injection support.
 */

import { ILogger, ILoggerConfig, IAppender, ILayout, ILoggerFactory } from '../types';
import { BaseLogger } from '../classes/BaseLogger';
import { EnterpriseLogger } from '../core/EnterpriseLogger';

/**
 * Logger factory implementation
 */
export class LoggerFactory implements ILoggerFactory {
  private static instance: LoggerFactory;
  private _appenderFactories: Map<string, (config: any) => IAppender> = new Map();
  private _layoutFactories: Map<string, (config: any) => ILayout> = new Map();
  private _loggerCache: Map<string, ILogger> = new Map();

  private constructor() {
    this.registerDefaultFactories();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): LoggerFactory {
    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new LoggerFactory();
    }
    return LoggerFactory.instance;
  }

  /**
   * Create logger instance
   */
  createLogger(category: string, config?: ILoggerConfig): ILogger {
    const cacheKey = `${category}:${JSON.stringify(config)}`;
    
    // Check cache first
    if (this._loggerCache.has(cacheKey)) {
      return this._loggerCache.get(cacheKey)!;
    }

    // Create default config if none provided
    const loggerConfig = config || this.createDefaultLoggerConfig(category);
    
    // Create logger instance
    const logger = new EnterpriseLogger(category, loggerConfig);
    
    // Cache the logger
    this._loggerCache.set(cacheKey, logger);
    
    return logger;
  }

  /**
   * Create appender instance
   */
  createAppender(config: any): IAppender {
    const factory = this._appenderFactories.get(config.type);
    
    if (!factory) {
      throw new Error(`Unknown appender type: ${config.type}`);
    }
    
    return factory(config);
  }

  /**
   * Create layout instance
   */
  createLayout(config: any): ILayout {
    const factory = this._layoutFactories.get(config.type);
    
    if (!factory) {
      throw new Error(`Unknown layout type: ${config.type}`);
    }
    
    return factory(config);
  }

  /**
   * Register custom appender type
   */
  registerAppenderType(type: string, factory: (config: any) => IAppender): void {
    this._appenderFactories.set(type, factory);
  }

  /**
   * Register custom layout type
   */
  registerLayoutType(type: string, factory: (config: any) => ILayout): void {
    this._layoutFactories.set(type, factory);
  }

  /**
   * Get registered appender types
   */
  getAppenderTypes(): string[] {
    return Array.from(this._appenderFactories.keys());
  }

  /**
   * Get registered layout types
   */
  getLayoutTypes(): string[] {
    return Array.from(this._layoutFactories.keys());
  }

  /**
   * Clear logger cache
   */
  clearCache(): void {
    this._loggerCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this._loggerCache.size,
      keys: Array.from(this._loggerCache.keys())
    };
  }

  /**
   * Create default logger configuration
   */
  private createDefaultLoggerConfig(category: string): ILoggerConfig {
    return {
      category,
      level: 'INFO',
      additive: true,
      appenders: ['console'],
      includeCaller: false,
      properties: {
        category,
        version: '1.0.0'
      }
    };
  }

  /**
   * Register default factories
   */
  private registerDefaultFactories(): void {
    // Register default appender types
    this.registerAppenderType('console', (config) => {
      // Will be implemented in ConsoleAppender
      throw new Error('ConsoleAppender not yet implemented');
    });
    
    this.registerAppenderType('remote', (config) => {
      // Will be implemented in RemoteAppender
      throw new Error('RemoteAppender not yet implemented');
    });
    
    this.registerAppenderType('memory', (config) => {
      // Will be implemented in MemoryAppender
      throw new Error('MemoryAppender not yet implemented');
    });
    
    this.registerAppenderType('localStorage', (config) => {
      // Will be implemented in LocalStorageAppender
      throw new Error('LocalStorageAppender not yet implemented');
    });

    // Register default layout types
    this.registerLayoutType('json', (config) => {
      // Will be implemented in JsonLayout
      throw new Error('JsonLayout not yet implemented');
    });
    
    this.registerLayoutType('pretty', (config) => {
      // Will be implemented in PrettyLayout
      throw new Error('PrettyLayout not yet implemented');
    });
    
    this.registerLayoutType('grafana', (config) => {
      // Will be implemented in GrafanaLayout
      throw new Error('GrafanaLayout not yet implemented');
    });
  }
}

/**
 * Global logger factory instance
 */
export const loggerFactory = LoggerFactory.getInstance();

/**
 * Convenience function to get logger
 */
export function getLogger(category: string, config?: ILoggerConfig): ILogger {
  return loggerFactory.createLogger(category, config);
}

/**
 * Convenience function to create appender
 */
export function createAppender(config: any): IAppender {
  return loggerFactory.createAppender(config);
}

/**
 * Convenience function to create layout
 */
export function createLayout(config: any): ILayout {
  return loggerFactory.createLayout(config);
}

/**
 * Convenience function to register appender type
 */
export function registerAppenderType(type: string, factory: (config: any) => IAppender): void {
  loggerFactory.registerAppenderType(type, factory);
}

/**
 * Convenience function to register layout type
 */
export function registerLayoutType(type: string, factory: (config: any) => ILayout): void {
  loggerFactory.registerLayoutType(type, factory);
}
