/**
 * Logging Configuration
 * 
 * Centralized configuration management for the logging system.
 * Provides environment-based configuration and runtime updates.
 */

import { 
  ILoggingSystemConfig, 
  IEnvironmentConfig, 
  IConfigurationManager,
  IConfigurationLoader,
  IValidationResult,
  IValidationError,
  IValidationWarning,
  IConfigurationChangeEvent,
  IConfigurationWatcher
} from '../types';
import { DefaultConfigurationFactory, ENVIRONMENT_CONFIGS } from '../types/LoggingConfiguration';

/**
 * Configuration manager implementation
 */
export class LoggingConfig implements IConfigurationManager {
  private _config: ILoggingSystemConfig;
  private _environment: string;
  private _loader: IConfigurationLoader;
  private _watchers: Array<(event: IConfigurationChangeEvent) => void> = [];
  private _validator: ConfigurationValidator;

  constructor(environment?: string) {
    this._environment = environment || this.detectEnvironment();
    this._config = DefaultConfigurationFactory.createDefault(this._environment);
    this._loader = new ConfigurationLoader();
    this._validator = new ConfigurationValidator();
  }

  /**
   * Get current configuration
   */
  getCurrentConfig(): ILoggingSystemConfig {
    return { ...this._config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ILoggingSystemConfig>): void {
    const oldConfig = { ...this._config };
    this._config = this._loader.merge(this._config, config);

    // Validate new configuration
    const validation = this._validator.validate(this._config);
    if (!validation.valid) {
      // Revert to old configuration if validation fails
      this._config = oldConfig;
      throw new Error(`Invalid configuration: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Notify watchers
    this.notifyWatchers({
      type: 'updated',
      path: 'root',
      oldValue: oldConfig,
      newValue: this._config,
      timestamp: new Date()
    });
  }

  /**
   * Get environment configuration
   */
  getEnvironmentConfig(): IEnvironmentConfig {
    return ENVIRONMENT_CONFIGS[this._environment] || ENVIRONMENT_CONFIGS.development;
  }

  /**
   * Set environment
   */
  setEnvironment(env: string): void {
    const oldEnv = this._environment;
    this._environment = env;
    
    // Load environment-specific configuration
    const envConfig = this.getEnvironmentConfig();
    this.updateConfig({
      defaultLevel: envConfig.defaultLevel,
      properties: {
        ...this._config.properties,
        environment: env
      }
    });

    this.notifyWatchers({
      type: 'updated',
      path: 'environment',
      oldValue: oldEnv,
      newValue: env,
      timestamp: new Date()
    });
  }

  /**
   * Load configuration from source
   */
  async loadConfig(source: string | object): Promise<void> {
    let config: ILoggingSystemConfig;

    if (typeof source === 'string') {
      if (source.startsWith('http')) {
        config = await this._loader.loadFromUrl(source);
      } else {
        config = await this._loader.loadFromFile(source);
      }
    } else {
      config = this._loader.loadFromObject(source);
    }

    this.updateConfig(config);
  }

  /**
   * Save configuration
   */
  async saveConfig(target?: string): Promise<void> {
    const filename = target || 'logging-config.json';
    
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(filename, JSON.stringify(this._config, null, 2));
      } catch (error) {
        throw new Error(`Failed to save configuration to localStorage: ${error}`);
      }
    } else {
      throw new Error('Cannot save configuration: localStorage not available');
    }
  }

  /**
   * Validate configuration
   */
  validateConfig(config: ILoggingSystemConfig): boolean {
    const validation = this._validator.validate(config);
    return validation.valid;
  }

  /**
   * Reset to defaults
   */
  resetToDefaults(): void {
    const oldConfig = { ...this._config };
    this._config = DefaultConfigurationFactory.createDefault(this._environment);

    this.notifyWatchers({
      type: 'updated',
      path: 'root',
      oldValue: oldConfig,
      newValue: this._config,
      timestamp: new Date()
    });
  }

  /**
   * Watch for configuration changes
   */
  watch(callback: (event: IConfigurationChangeEvent) => void): () => void {
    this._watchers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this._watchers.indexOf(callback);
      if (index > -1) {
        this._watchers.splice(index, 1);
      }
    };
  }

  /**
   * Stop watching
   */
  stop(): void {
    this._watchers = [];
  }

  /**
   * Detect current environment
   */
  private detectEnvironment(): string {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
      return process.env.NODE_ENV;
    }
    
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
      } else if (hostname.includes('staging') || hostname.includes('test')) {
        return 'staging';
      } else {
        return 'production';
      }
    }
    
    return 'development';
  }

  /**
   * Notify watchers of configuration changes
   */
  private notifyWatchers(event: IConfigurationChangeEvent): void {
    for (const watcher of this._watchers) {
      try {
        watcher(event);
      } catch (error) {
        console.error('Configuration watcher error:', error);
      }
    }
  }

  /**
   * Get configuration statistics
   */
  getStatistics(): {
    environment: string;
    loggerCount: number;
    appenderCount: number;
    layoutCount: number;
    watcherCount: number;
    lastValidated: Date;
  } {
    return {
      environment: this._environment,
      loggerCount: Object.keys(this._config.loggers).length,
      appenderCount: Object.keys(this._config.appenders).length,
      layoutCount: Object.keys(this._config.layouts).length,
      watcherCount: this._watchers.length,
      lastValidated: new Date()
    };
  }
}

/**
 * Configuration loader implementation
 */
export class ConfigurationLoader implements IConfigurationLoader {
  /**
   * Load configuration from file
   */
  async loadFromFile(path: string): Promise<ILoggingSystemConfig> {
    // In browser environment, try to load from localStorage or fetch
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(path);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.warn(`Failed to load config from localStorage (${path}):`, error);
      }

      // Try to fetch from server
      try {
        const response = await fetch(path);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn(`Failed to fetch config from server (${path}):`, error);
      }
    }

    throw new Error(`Cannot load configuration from file: ${path}`);
  }

  /**
   * Load configuration from URL
   */
  async loadFromUrl(url: string): Promise<ILoggingSystemConfig> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to load configuration from URL (${url}): ${error}`);
    }
  }

  /**
   * Load configuration from environment variables
   */
  loadFromEnvironment(): ILoggingSystemConfig {
    const config: Partial<ILoggingSystemConfig> = {};

    if (typeof process !== 'undefined' && process.env) {
      // Load from process.env
      if (process.env.LOG_LEVEL) {
        config.defaultLevel = process.env.LOG_LEVEL;
      }
      
      if (process.env.LOG_REMOTE_URL) {
        config.appenders = {
          remote: {
            name: 'remote',
            type: 'remote',
            active: true,
            url: process.env.LOG_REMOTE_URL
          }
        };
      }
    }

    return this.merge(DefaultConfigurationFactory.createDefault(), config);
  }

  /**
   * Load configuration from object
   */
  loadFromObject(config: object): ILoggingSystemConfig {
    return config as ILoggingSystemConfig;
  }

  /**
   * Merge configurations
   */
  merge(base: ILoggingSystemConfig, override: Partial<ILoggingSystemConfig>): ILoggingSystemConfig {
    const merged = { ...base };

    // Merge top-level properties
    for (const [key, value] of Object.entries(override)) {
      if (value !== undefined) {
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          // Deep merge for objects
          merged[key as keyof ILoggingSystemConfig] = {
            ...(merged[key as keyof ILoggingSystemConfig] as any),
            ...value
          };
        } else {
          // Direct assignment for primitives
          merged[key as keyof ILoggingSystemConfig] = value as any;
        }
      }
    }

    return merged;
  }
}

/**
 * Configuration validator implementation
 */
export class ConfigurationValidator {
  /**
   * Validate complete configuration
   */
  validate(config: ILoggingSystemConfig): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    // Validate default level
    if (!config.defaultLevel) {
      errors.push({
        code: 'MISSING_DEFAULT_LEVEL',
        message: 'Default log level is required',
        path: 'defaultLevel'
      });
    }

    // Validate loggers
    if (config.loggers) {
      for (const [name, logger] of Object.entries(config.loggers)) {
        const loggerValidation = this.validateLogger(logger);
        errors.push(...loggerValidation.errors.map(e => ({ ...e, path: `loggers.${name}.${e.path}` })));
        warnings.push(...loggerValidation.warnings.map(w => ({ ...w, path: `loggers.${name}.${w.path}` })));
      }
    }

    // Validate appenders
    if (config.appenders) {
      for (const [name, appender] of Object.entries(config.appenders)) {
        const appenderValidation = this.validateAppender(appender);
        errors.push(...appenderValidation.errors.map(e => ({ ...e, path: `appenders.${name}.${e.path}` })));
        warnings.push(...appenderValidation.warnings.map(w => ({ ...w, path: `appenders.${name}.${w.path}` })));
      }
    }

    // Validate layouts
    if (config.layouts) {
      for (const [name, layout] of Object.entries(config.layouts)) {
        const layoutValidation = this.validateLayout(layout);
        errors.push(...layoutValidation.errors.map(e => ({ ...e, path: `layouts.${name}.${e.path}` })));
        warnings.push(...layoutValidation.warnings.map(w => ({ ...w, path: `layouts.${name}.${w.path}` })));
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate logger configuration
   */
  validateLogger(config: any): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (!config.category) {
      errors.push({
        code: 'MISSING_CATEGORY',
        message: 'Logger category is required',
        path: 'category'
      });
    }

    if (!config.level) {
      errors.push({
        code: 'MISSING_LEVEL',
        message: 'Logger level is required',
        path: 'level'
      });
    }

    if (!config.appenders || config.appenders.length === 0) {
      warnings.push({
        code: 'NO_APPENDERS',
        message: 'Logger has no appenders configured',
        path: 'appenders'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate appender configuration
   */
  validateAppender(config: any): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (!config.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Appender name is required',
        path: 'name'
      });
    }

    if (!config.type) {
      errors.push({
        code: 'MISSING_TYPE',
        message: 'Appender type is required',
        path: 'type'
      });
    }

    if (config.type === 'remote' && !config.url) {
      errors.push({
        code: 'MISSING_URL',
        message: 'Remote appender requires URL',
        path: 'url'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate layout configuration
   */
  validateLayout(config: any): IValidationResult {
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    if (!config.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Layout name is required',
        path: 'name'
      });
    }

    if (!config.type) {
      errors.push({
        code: 'MISSING_TYPE',
        message: 'Layout type is required',
        path: 'type'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
