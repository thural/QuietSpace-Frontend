/**
 * Logger Registry
 * 
 * Registry for managing logger instances and providing centralized
 * access to loggers with configuration management.
 */

import { ILogger, ILoggerConfig, ILoggingManager, ILoggingSystemConfig } from '../types';
import { EnterpriseLogger } from './EnterpriseLogger';
import { LoggerFactory } from '../factories/LoggerFactory';

/**
 * Logger registry implementation
 */
export class LoggerRegistry implements ILoggingManager {
  private static instance: LoggerRegistry;
  private _loggers: Map<string, ILogger> = new Map();
  private _config: ILoggingSystemConfig;
  private _factory: LoggerFactory;
  private _isShutdown: boolean = false;

  private constructor() {
    this._factory = LoggerFactory.getInstance();
    this._config = this.createDefaultConfig();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): LoggerRegistry {
    if (!LoggerRegistry.instance) {
      LoggerRegistry.instance = new LoggerRegistry();
    }
    return LoggerRegistry.instance;
  }

  /**
   * Get logger by category
   */
  getLogger(category: string): ILogger {
    if (this._isShutdown) {
      throw new Error('Logger registry is shutdown');
    }

    if (this._loggers.has(category)) {
      return this._loggers.get(category)!;
    }

    // Create new logger
    const loggerConfig = this._config.loggers[category] || this.createDefaultLoggerConfig(category);
    const logger = this._factory.createLogger(category, loggerConfig);
    
    // Register logger
    this.registerLogger(logger);
    
    return logger;
  }

  /**
   * Register logger
   */
  registerLogger(logger: ILogger): void {
    if (this._isShutdown) {
      throw new Error('Logger registry is shutdown');
    }

    this._loggers.set(logger.category, logger);
  }

  /**
   * Unregister logger
   */
  unregisterLogger(category: string): void {
    this._loggers.delete(category);
  }

  /**
   * Get all loggers
   */
  getAllLoggers(): ILogger[] {
    return Array.from(this._loggers.values());
  }

  /**
   * Configure logging system
   */
  configure(config: ILoggingSystemConfig): void {
    this._config = { ...this._config, ...config };
    
    // Reconfigure existing loggers
    for (const [category, logger] of this._loggers) {
      const loggerConfig = this._config.loggers[category];
      if (loggerConfig) {
        // Update logger configuration
        if ('updateConfig' in logger && typeof logger.updateConfig === 'function') {
          (logger as any).updateConfig(loggerConfig);
        }
      }
    }
  }

  /**
   * Get current configuration
   */
  getConfiguration(): ILoggingSystemConfig {
    return { ...this._config };
  }

  /**
   * Shutdown logging system
   */
  async shutdown(): Promise<void> {
    if (this._isShutdown) {
      return;
    }

    this._isShutdown = true;

    // Shutdown all loggers
    const shutdownPromises = Array.from(this._loggers.values()).map(logger => {
      // Stop all appenders
      const appenders = logger.getAppenders();
      return Promise.all(
        appenders.map(appender => {
          if ('stop' in appender && typeof appender.stop === 'function') {
            return appender.stop();
          }
          return Promise.resolve();
        })
      );
    });

    await Promise.all(shutdownPromises);
    
    // Clear registry
    this._loggers.clear();
  }

  /**
   * Get registry statistics
   */
  getStatistics(): {
    loggerCount: number;
    categories: string[];
    isShutdown: boolean;
    config: {
      defaultLevel: string;
      loggerCount: number;
      appenderCount: number;
      layoutCount: number;
    };
  } {
    return {
      loggerCount: this._loggers.size,
      categories: Array.from(this._loggers.keys()),
      isShutdown: this._isShutdown,
      config: {
        defaultLevel: this._config.defaultLevel,
        loggerCount: Object.keys(this._config.loggers).length,
        appenderCount: Object.keys(this._config.appenders).length,
        layoutCount: Object.keys(this._config.layouts).length
      }
    };
  }

  /**
   * Clear all loggers
   */
  clearLoggers(): void {
    this._loggers.clear();
  }

  /**
   * Check if logger exists
   */
  hasLogger(category: string): boolean {
    return this._loggers.has(category);
  }

  /**
   * Get logger by category pattern (regex)
   */
  getLoggersByPattern(pattern: RegExp): ILogger[] {
    return Array.from(this._loggers.values()).filter(logger => 
      pattern.test(logger.category)
    );
  }

  /**
   * Set log level for all loggers
   */
  setGlobalLevel(level: string): void {
    for (const logger of this._loggers.values()) {
      logger.setLevel(level);
    }
  }

  /**
   * Set log level for loggers matching pattern
   */
  setLevelForPattern(pattern: RegExp, level: string): void {
    for (const logger of this._loggers.values()) {
      if (pattern.test(logger.category)) {
        logger.setLevel(level);
      }
    }
  }

  /**
   * Add appender to all loggers
   */
  addGlobalAppender(appender: any): void {
    for (const logger of this._loggers.values()) {
      logger.addAppender(appender);
    }
  }

  /**
   * Remove appender from all loggers
   */
  removeGlobalAppender(appender: any): void {
    for (const logger of this._loggers.values()) {
      logger.removeAppender(appender);
    }
  }

  /**
   * Create default configuration
   */
  private createDefaultConfig(): ILoggingSystemConfig {
    return {
      defaultLevel: 'INFO',
      loggers: {
        root: {
          category: 'root',
          level: 'INFO',
          additive: true,
          appenders: ['console'],
          includeCaller: false
        }
      },
      appenders: {
        console: {
          name: 'console',
          type: 'console',
          active: true,
          layout: {
            name: 'console',
            type: 'pretty',
            includeColors: true
          }
        }
      },
      layouts: {
        pretty: {
          name: 'pretty',
          type: 'pretty',
          includeColors: true,
          pattern: '%d{HH:mm:ss} [%level] %category - %message'
        },
        json: {
          name: 'json',
          type: 'json',
          includeColors: false
        }
      },
      properties: {
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      },
      security: {
        enableSanitization: false,
        sensitiveFields: ['password', 'token', 'secret', 'key'],
        maskChar: '*',
        partialMask: true
      },
      performance: {
        enableLazyEvaluation: true,
        maxMessageLength: 10000,
        enableBatching: false
      }
    };
  }

  /**
   * Create default logger configuration
   */
  private createDefaultLoggerConfig(category: string): ILoggerConfig {
    return {
      category,
      level: this._config.defaultLevel,
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
   * Reset to default configuration
   */
  resetToDefaults(): void {
    this._config = this.createDefaultConfig();
    this.clearLoggers();
  }

  /**
   * Get logger factory
   */
  getFactory(): LoggerFactory {
    return this._factory;
  }

  /**
   * Check if registry is shutdown
   */
  isShutdown(): boolean {
    return this._isShutdown;
  }
}

/**
 * Global logger registry instance
 */
export const loggerRegistry = LoggerRegistry.getInstance();

/**
 * Convenience function to get logger
 */
export function getLogger(category: string): ILogger {
  return loggerRegistry.getLogger(category);
}

/**
 * Convenience function to configure logging system
 */
export function configureLogging(config: ILoggingSystemConfig): void {
  loggerRegistry.configure(config);
}

/**
 * Convenience function to shutdown logging system
 */
export function shutdownLogging(): Promise<void> {
  return loggerRegistry.shutdown();
}
