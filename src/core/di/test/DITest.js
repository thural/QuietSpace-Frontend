/**
 * DI System Integration Test.
 * 
 * Example services and usage to test the DI system.
 */

import 'reflect-metadata';
import { Injectable, Inject } from '../index.js';
import { Container } from '../container/Container.js';

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
     * 
     * @param {string} message - Message to log
     * @returns {void}
     */
    log(message) {
        throw new Error('Method log() must be implemented');
    }
}

/**
 * Data service interface
 * 
 * @interface IDataService
 * @description Defines contract for data services
 */
export class IDataService {
    /**
     * Get data
     * 
     * @returns {Promise<string[]>} Promise resolving to data array
     */
    getData() {
        throw new Error('Method getData() must be implemented');
    }
}

// Example service implementations
/**
 * Logger service implementation
 * 
 * @class LoggerService
 * @implements {ILogger}
 * @description Concrete implementation of logger service
 */
@Injectable({ lifetime: 'singleton' })
class LoggerService extends ILogger {
    /**
     * Log a message
     * 
     * @param {string} message - Message to log
     * @returns {void}
     */
    log(message) {
        console.log(`[Logger] ${message}`);
    }
}

/**
 * Data service implementation
 * 
 * @class DataService
 * @implements {IDataService}
 * @description Concrete implementation of data service
 */
@Injectable({ lifetime: 'transient' })
class DataService extends IDataService {
    /**
     * Create data service
     * 
     * @param {ILogger} logger - Logger service
     */
    constructor(logger) {
        super();
        this.logger = logger;
    }

    /**
     * Get data
     * 
     * @returns {Promise<string[]>} Promise resolving to data array
     */
    async getData() {
        this.logger.log('Fetching data...');
        return ['item1', 'item2', 'item3'];
    }
}

// Export test classes for external use
export { LoggerService, DataService };

/**
 * Example usage of DI system
 * 
 * @function exampleUsage
 * @returns {Promise<void>} Promise that resolves when example completes
 * @description Demonstrates how to use the DI system
 */
export async function exampleUsage() {
    // Create container
    const container = new Container();

    // Register services
    container.registerSingleton(ILogger, LoggerService);
    container.register(IDataService, DataService);

    // Resolve and use services
    const logger = container.get(ILogger);
    const dataService = container.get(IDataService);

    logger.log('DI System Test');
    const data = await dataService.getData();
    console.log('Data:', data);
}

// Run example if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    exampleUsage().catch(console.error);
}
