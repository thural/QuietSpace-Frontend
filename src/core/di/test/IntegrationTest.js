/**
 * DI System Integration Test.
 * 
 * Integration tests for the DI system with multiple services.
 */

import 'reflect-metadata';
import { Injectable, Inject, createContainer } from '../index.js';

// Example service interfaces
/**
 * Logger interface
 * 
 * @interface ILogger
 * @description Defines contract for logging services
 */
export class ILogger {
    /**
     * Log a message
     * @param {string} message - Message to log
     * @returns {void}
     */
    log(message) {
        throw new Error('Method log() must be implemented');
    }
    
    /**
     * Log an error
     * @param {string} message - Error message
     * @returns {void}
     */
    error(message) {
        throw new Error('Method error() must be implemented');
    }
}

/**
 * Cache service interface
 * 
 * @interface ICacheService
 * @description Defines contract for cache services
 */
export class ICacheService {
    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {*} Cached value or null
     */
    get(key) {
        throw new Error('Method get() must be implemented');
    }
    
    /**
     * Set value in cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @returns {void}
     */
    set(key, value) {
        throw new Error('Method set() must be implemented');
    }
    
    /**
     * Clear cache
     * @returns {void}
     */
    clear() {
        throw new Error('Method clear() must be implemented');
    }
}

/**
 * Config service interface
 * 
 * @interface IConfigService
 * @description Defines contract for configuration services
 */
export class IConfigService {
    /**
     * Get configuration value
     * @param {string} key - Configuration key
     * @returns {*} Configuration value
     */
    get(key) {
        throw new Error('Method get() must be implemented');
    }
    
    /**
     * Set configuration value
     * @param {string} key - Configuration key
     * @param {*} value - Configuration value
     * @returns {void}
     */
    set(key, value) {
        throw new Error('Method set() must be implemented');
    }
}

// Example service implementations
/**
 * Logger service implementation
 * 
 * @class LoggerService
 * @implements {ILogger}
 */
@Injectable({ lifetime: 'singleton' })
export class LoggerService extends ILogger {
    /**
     * Log a message
     * @param {string} message - Message to log
     * @returns {void}
     */
    log(message) {
        console.log(`[LOG] ${message}`);
    }
    
    /**
     * Log an error
     * @param {string} message - Error message
     * @returns {void}
     */
    error(message) {
        console.error(`[ERROR] ${message}`);
    }
}

/**
 * Cache service implementation
 * 
 * @class CacheService
 * @implements {ICacheService}
 */
@Injectable({ lifetime: 'singleton' })
export class CacheService extends ICacheService {
    constructor() {
        super();
        this.cache = new Map();
    }
    
    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {*} Cached value or null
     */
    get(key) {
        return this.cache.get(key) || null;
    }
    
    /**
     * Set value in cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @returns {void}
     */
    set(key, value) {
        this.cache.set(key, value);
    }
    
    /**
     * Clear cache
     * @returns {void}
     */
    clear() {
        this.cache.clear();
    }
}

/**
 * Config service implementation
 * 
 * @class ConfigService
 * @implements {IConfigService}
 */
@Injectable({ lifetime: 'singleton' })
export class ConfigService extends IConfigService {
    constructor() {
        super();
        this.config = new Map();
    }
    
    /**
     * Get configuration value
     * @param {string} key - Configuration key
     * @returns {*} Configuration value
     */
    get(key) {
        return this.config.get(key);
    }
    
    /**
     * Set configuration value
     * @param {string} key - Configuration key
     * @param {*} value - Configuration value
     * @returns {void}
     */
    set(key, value) {
        this.config.set(key, value);
    }
}

/**
 * Integration test function
 * 
 * @function runIntegrationTest
 * @returns {Promise<void>} Promise that resolves when test completes
 */
export async function runIntegrationTest() {
    const container = createContainer();
    
    // Register services
    container.registerSingleton(ILogger, LoggerService);
    container.registerSingleton(ICacheService, CacheService);
    container.registerSingleton(IConfigService, ConfigService);
    
    // Test service resolution
    const logger = container.get(ILogger);
    const cache = container.get(ICacheService);
    const config = container.get(IConfigService);
    
    // Test functionality
    logger.log('Integration test started');
    cache.set('test-key', 'test-value');
    config.set('app-name', 'QuietSpace');
    
    console.log('Cache value:', cache.get('test-key'));
    console.log('Config value:', config.get('app-name'));
    
    logger.log('Integration test completed');
}
