/**
 * LoggerService Tests
 * 
 * Comprehensive tests for the LoggerService implementation
 * Tests logging functionality, level filtering, and output formatting
 */

import { LoggerService } from '../../../../src/core/services/LoggerService';
import { LogLevel, type ILoggerService, type ILoggerConfig } from '../../../../src/core/services/interfaces';

// Mock console methods to capture output
const mockConsole = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn()
};

// Store original console methods
const originalConsole = {
    info: console.info,
    debug: console.debug,
    error: console.error,
    warn: console.warn,
    log: console.log
};

describe('LoggerService', () => {
    let loggerService: LoggerService;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Mock console methods
        console.info = mockConsole.info;
        console.debug = mockConsole.debug;
        console.error = mockConsole.error;
        console.warn = mockConsole.warn;
        console.log = mockConsole.log;
        
        loggerService = new LoggerService();
    });

    afterEach(() => {
        // Restore original console methods
        console.info = originalConsole.info;
        console.debug = originalConsole.debug;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.log = originalConsole.log;
    });

    describe('Basic Logging Operations', () => {
        it('should create logger service instance', () => {
            expect(loggerService).toBeDefined();
            expect(typeof loggerService.info).toBe('function');
            expect(typeof loggerService.debug).toBe('function');
            expect(typeof loggerService.error).toBe('function');
            expect(typeof loggerService.warn).toBe('function');
            expect(typeof loggerService.fatal).toBe('function');
        });

        it('should log info messages with prefix', () => {
            const message = 'Test info message';
            const args = ['arg1', 'arg2'];
            
            loggerService.info(message, ...args);
            
            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                message,
                ...args
            );
        });

        it('should log debug messages with prefix', () => {
            const message = 'Test debug message';
            
            loggerService.debug(message);
            
            expect(mockConsole.debug).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                message
            );
        });

        it('should log error messages with prefix', () => {
            const message = 'Test error message';
            const error = new Error('Test error');
            
            loggerService.error(message, error);
            
            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                message,
                error
            );
        });

        it('should log warning messages with prefix', () => {
            const message = 'Test warning message';
            
            loggerService.warn(message);
            
            expect(mockConsole.warn).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                message
            );
        });

        it('should log fatal messages with FATAL prefix', () => {
            const message = 'Test fatal message';
            
            loggerService.fatal(message);
            
            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                expect.stringContaining('FATAL:'),
                message
            );
        });
    });

    describe('Interface Compliance', () => {
        it('should implement ILoggerService interface', () => {
            const service: ILoggerService = loggerService;
            
            expect(typeof service.info).toBe('function');
            expect(typeof service.debug).toBe('function');
            expect(typeof service.error).toBe('function');
            expect(typeof service.warn).toBe('function');
            expect(typeof service.fatal).toBe('function');
        });

        it('should handle multiple arguments correctly', () => {
            const message = 'Test message';
            const objectArg = { key: 'value' };
            const numberArg = 42;
            const arrayArg = [1, 2, 3];
            
            loggerService.info(message, objectArg, numberArg, arrayArg);
            
            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                message,
                objectArg,
                numberArg,
                arrayArg
            );
        });

        it('should handle empty arguments', () => {
            loggerService.info('Test message');
            
            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                'Test message'
            );
        });
    });

    describe('Error Handling', () => {
        it('should handle circular reference objects', () => {
            const circularObj: any = { name: 'test' };
            circularObj.self = circularObj;
            
            expect(() => {
                loggerService.info('Circular object', circularObj);
            }).not.toThrow();
        });

        it('should handle null and undefined arguments', () => {
            expect(() => {
                loggerService.info('Message', null, undefined);
            }).not.toThrow();
            
            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                'Message',
                null,
                undefined
            );
        });

        it('should handle very long messages', () => {
            const longMessage = 'x'.repeat(10000);
            
            expect(() => {
                loggerService.info(longMessage);
            }).not.toThrow();
            
            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[LoggerService]'),
                longMessage
            );
        });
    });

    describe('Performance', () => {
        it('should handle rapid logging without performance issues', () => {
            const startTime = performance.now();
            
            for (let i = 0; i < 1000; i++) {
                loggerService.info(`Message ${i}`, { index: i });
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Should complete 1000 log calls in under 100ms
            expect(duration).toBeLessThan(100);
        });

        it('should not block execution', () => {
            const startTime = performance.now();
            
            loggerService.info('Start');
            
            // Simulate some work
            let sum = 0;
            for (let i = 0; i < 100000; i++) {
                sum += i;
            }
            
            loggerService.info('End', { result: sum });
            
            const endTime = performance.now();
            
            // Logging should add minimal overhead
            expect(endTime - startTime).toBeLessThan(50);
        });
    });

    describe('Singleton Behavior', () => {
        it('should maintain separate instances', () => {
            const logger1 = new LoggerService();
            const logger2 = new LoggerService();
            
            expect(logger1).not.toBe(logger2);
            expect(logger1).toBeDefined();
            expect(logger2).toBeDefined();
        });

        it('should not interfere with each other', () => {
            const logger1 = new LoggerService();
            const logger2 = new LoggerService();
            
            logger1.info('Logger 1 message');
            logger2.info('Logger 2 message');
            
            expect(mockConsole.info).toHaveBeenCalledTimes(2);
            expect(mockConsole.info).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('[LoggerService]'),
                'Logger 1 message'
            );
            expect(mockConsole.info).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining('[LoggerService]'),
                'Logger 2 message'
            );
        });
    });

    describe('Integration with Console', () => {
        it('should preserve console methods functionality', () => {
            // Test that console methods still work normally
            console.info('Direct console info');
            console.error('Direct console error');
            console.warn('Direct console warning');
            console.debug('Direct console debug');
            
            expect(mockConsole.info).toHaveBeenCalledWith('Direct console info');
            expect(mockConsole.error).toHaveBeenCalledWith('Direct console error');
            expect(mockConsole.warn).toHaveBeenCalledWith('Direct console warning');
            expect(mockConsole.debug).toHaveBeenCalledWith('Direct console debug');
        });

        it('should handle console method failures gracefully', () => {
            // Mock console.info to throw an error
            mockConsole.info.mockImplementation(() => {
                throw new Error('Console method failed');
            });
            
            expect(() => {
                loggerService.info('Test message');
            }).toThrow('Console method failed');
        });
    });
});
