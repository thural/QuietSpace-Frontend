/**
 * DI System Simple Test.
 * 
 * Simple test for the DI system functionality.
 */

import 'reflect-metadata';
import { Injectable, createContainer } from '../index.js';

// Simple test service
/**
 * Logger service for testing
 * 
 * @class LoggerService
 * @description Simple logger service for testing DI functionality
 */
@Injectable({ lifetime: 'singleton' })
export class LoggerService {
    constructor() {
        this.counter = 0;
    }

    /**
     * Increment counter
     * 
     * @returns {number} Current counter value
     */
    increment() {
        return ++this.counter;
    }

    /**
     * Get counter value
     * 
     * @returns {number} Current counter value
     */
    getCount() {
        return this.counter;
    }
}

// Test service
/**
 * Test service with dependency
 * 
 * @class TestService
 * @description Test service that uses LoggerService
 */
@Injectable({ lifetime: 'singleton' })
export class TestService {
    constructor(logger) {
        super();
        this.logger = logger;
    }

    /**
     * Test method
     * 
     * @returns {string} Test result
     */
    test() {
        this.logger.increment();
        return `Test completed. Count: ${this.logger.getCount()}`;
    }
}

/**
 * Simple test function
 * 
 * @function runSimpleTest
 * @returns {void}
 * @description Runs a simple test of the DI system
 */
export function runSimpleTest() {
    const container = createContainer();
    
    // Register services
    container.registerSingleton(LoggerService, LoggerService);
    container.registerSingleton(TestService, TestService);
    
    // Test service resolution
    const logger = container.get(LoggerService);
    const testService = container.get(TestService);
    
    // Test functionality
    console.log('Initial count:', logger.getCount());
    console.log('Test result:', testService.test());
    console.log('Final count:', logger.getCount());
}
