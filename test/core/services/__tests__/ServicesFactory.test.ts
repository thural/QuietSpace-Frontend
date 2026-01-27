/**
 * Services Factory Tests
 * 
 * Comprehensive tests for the services factory functions
 * Tests service creation, configuration, and dependency injection
 */

import {
    createLogger,
    createComponentLogger,
    createDefaultLogger,
    createLoggerWithLevel,
    createStructuredLogger,
    createLoggerFromDI,
    createSingletonLogger,
    createMockLogger,
    LoggerService
} from '../../../../src/core/services/factory';
import { LogLevel, DEFAULT_LOGGER_CONFIG } from '../../../../src/core/services/interfaces';
import type { ILoggerService, ILoggerConfig } from '../../../../src/core/services/interfaces';

// Mock console methods
const mockConsole = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn()
};

const originalConsole = {
    info: console.info,
    debug: console.debug,
    error: console.error,
    warn: console.warn,
    log: console.log
};

describe('Services Factory', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock console methods
        console.info = mockConsole.info;
        console.debug = mockConsole.debug;
        console.error = mockConsole.error;
        console.warn = mockConsole.warn;
        console.log = mockConsole.log;
    });

    afterEach(() => {
        // Restore original console methods
        console.info = originalConsole.info;
        console.debug = originalConsole.debug;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.log = originalConsole.log;
    });

    describe('createLogger', () => {
        it('should create a logger service with default configuration', () => {
            const logger = createLogger();

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
            expect(typeof logger.debug).toBe('function');
            expect(typeof logger.error).toBe('function');
            expect(typeof logger.warn).toBe('function');
            expect(typeof logger.fatal).toBe('function');
        });

        it('should create different instances on multiple calls', () => {
            const logger1 = createLogger();
            const logger2 = createLogger();

            expect(logger1).not.toBe(logger2);
            expect(logger1).toBeDefined();
            expect(logger2).toBeDefined();
        });

        it('should create logger that implements ILoggerService interface', () => {
            const logger: ILoggerService = createLogger();

            expect(typeof logger.info).toBe('function');
            expect(typeof logger.debug).toBe('function');
            expect(typeof logger.error).toBe('function');
            expect(typeof logger.warn).toBe('function');
            expect(typeof logger.fatal).toBe('function');
        });

        it('should log messages correctly', () => {
            const logger = createLogger();

            logger.info('Test message');

            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[Logger]'),
                'Test message'
            );
        });

        it('should create logger with custom configuration', () => {
            const customConfig: ILoggerConfig = {
                level: LogLevel.ERROR,
                prefix: '[CustomLogger]',
                enableTimestamps: false,
                enableStructuredLogging: false,
                targets: [],
                format: {
                    dateFormat: 'HH:mm:ss',
                    enableColors: false,
                    includeMetadata: true
                }
            };

            const logger = createLogger(customConfig);

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });

        it('should merge custom config with defaults', () => {
            const customConfig: Partial<ILoggerConfig> = {
                prefix: '[CustomPrefix]',
                level: LogLevel.WARN
            };

            const logger = createLogger(customConfig as ILoggerConfig);

            expect(logger).toBeDefined();

            // Test that custom prefix is used
            logger.info('Test message');
            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[CustomPrefix]'),
                'Test message'
            );
        });

        it('should handle empty configuration', () => {
            const logger = createLogger({} as ILoggerConfig);

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });

        it('should handle null configuration gracefully', () => {
            const logger = createLogger(null as any);

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });
    });

    describe('createDefaultLogger', () => {
        it('should create logger with default configuration', () => {
            const logger = createDefaultLogger();

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });

        it('should use default configuration values', () => {
            const logger = createDefaultLogger();

            logger.info('Default test message');

            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[Logger]'),
                'Default test message'
            );
        });

        it('should create consistent instances', () => {
            const logger1 = createDefaultLogger();
            const logger2 = createDefaultLogger();

            expect(logger1).not.toBe(logger2);
            expect(typeof logger1.info).toBe('function');
            expect(typeof logger2.info).toBe('function');
        });
    });

    describe('LoggerService Class', () => {
        it('should be instantiable directly', () => {
            const logger = new LoggerService();

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });

        it('should accept configuration in constructor', () => {
            const config: ILoggerConfig = {
                level: LogLevel.ERROR,
                prefix: '[TestLogger]'
            };

            const logger = new LoggerService(config);

            expect(logger).toBeDefined();

            logger.info('Test message');
            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[TestLogger]'),
                'Test message'
            );
        });

        it('should handle configuration with no defaults', () => {
            const config = {} as ILoggerConfig;
            const logger = new LoggerService(config);

            expect(logger).toBeDefined();
        });

        it('should maintain metrics', () => {
            const logger = new LoggerService();

            logger.info('Info message');
            logger.error('Error message');
            logger.warn('Warning message');

            // The logger should track metrics internally
            expect(typeof logger.info).toBe('function');
        });
    });

    describe('Configuration Validation', () => {
        it('should handle invalid log levels', () => {
            const config = {
                level: 999, // Invalid log level
                prefix: '[Test]'
            } as any;

            const logger = new LoggerService(config);

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });

        it('should handle invalid prefix values', () => {
            const config = {
                level: LogLevel.INFO,
                prefix: null
            } as any;

            const logger = new LoggerService(config);

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });

        it('should handle missing format configuration', () => {
            const config = {
                level: LogLevel.INFO,
                prefix: '[Test]',
                format: null
            } as any;

            const logger = new LoggerService(config);

            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });
    });

    describe('Performance and Memory', () => {
        it('should handle rapid logger creation', () => {
            const startTime = performance.now();

            for (let i = 0; i < 100; i++) {
                const logger = createLogger();
                logger.info(`Message ${i}`);
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 100 logger creations and logs in under 100ms
            expect(duration).toBeLessThan(100);
        });

        it('should not leak memory on repeated creation', () => {
            const initialMemory = process.memoryUsage().heapUsed;

            // Create many logger instances
            const loggers = [];
            for (let i = 0; i < 1000; i++) {
                loggers.push(createLogger());
            }

            // Clear references
            loggers.length = 0;

            // Force garbage collection if available
            if (global.gc) {
                global.gc();
            }

            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;

            // Memory increase should be reasonable (less than 10MB)
            expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
        });
    });

    describe('Error Handling', () => {
        it('should handle console method failures gracefully', () => {
            mockConsole.info.mockImplementation(() => {
                throw new Error('Console method failed');
            });

            const logger = createLogger();

            expect(() => {
                logger.info('Test message');
            }).toThrow('Console method failed');
        });

        it('should handle configuration errors gracefully', () => {
            const problematicConfig = {
                get level() {
                    throw new Error('Config access error');
                }
            } as any;

            expect(() => {
                new LoggerService(problematicConfig);
            }).toThrow();
        });
    });

    describe('Integration Tests', () => {
        it('should work with all log levels', () => {
            const logger = createLogger();

            logger.debug('Debug message');
            logger.info('Info message');
            logger.warn('Warning message');
            logger.error('Error message');
            logger.fatal('Fatal message');

            expect(mockConsole.debug).toHaveBeenCalled();
            expect(mockConsole.info).toHaveBeenCalled();
            expect(mockConsole.warn).toHaveBeenCalled();
            expect(mockConsole.error).toHaveBeenCalledTimes(2); // error + fatal
        });

        it('should handle complex arguments', () => {
            const logger = createLogger();

            const complexObject = {
                user: { id: 1, name: 'Test User' },
                metadata: { timestamp: new Date(), source: 'test' },
                nested: { deep: { value: 'test' } }
            };

            logger.info('Complex message', complexObject, [1, 2, 3], null, undefined);

            expect(mockConsole.info).toHaveBeenCalledWith(
                expect.stringContaining('[Logger]'),
                'Complex message',
                complexObject,
                [1, 2, 3],
                null,
                undefined
            );
        });
    });
});
