/**
 * Services Types Tests
 * 
 * Tests for the services module types and interfaces
 */

import {
    LogLevel
} from '../../../../src/core/services/interfaces';
import type {
    ILoggerConfig,
    ILoggerService
} from '../../../../src/core/services/interfaces';

describe('Services Types', () => {
    describe('ILoggerConfig', () => {
        it('should allow valid logger configuration', () => {
            const config: ILoggerConfig = {
                level: LogLevel.INFO,
                prefix: '[Test]',
                enableTimestamps: true,
                enableStructuredLogging: false,
                targets: [],
                format: {
                    dateFormat: 'yyyy-MM-dd HH:mm:ss',
                    enableColors: true,
                    includeMetadata: false
                }
            };

            expect(config.level).toBe(LogLevel.INFO);
            expect(config.prefix).toBe('[Test]');
            expect(config.enableTimestamps).toBe(true);
            expect(config.enableStructuredLogging).toBe(false);
            expect(config.targets).toEqual([]);
            expect(config.format.dateFormat).toBe('yyyy-MM-dd HH:mm:ss');
            expect(config.format.enableColors).toBe(true);
            expect(config.format.includeMetadata).toBe(false);
        });

        it('should allow partial configuration', () => {
            const config: Partial<ILoggerConfig> = {
                level: LogLevel.ERROR,
                prefix: '[Error]'
            };

            expect(config.level).toBe(LogLevel.ERROR);
            expect(config.prefix).toBe('[Error]');
        });

        it('should allow empty configuration', () => {
            const config: ILoggerConfig = {} as ILoggerConfig;

            expect(config).toBeDefined();
        });
    });

    describe('ILoggerService', () => {
        it('should define required methods', () => {
            // Test that the interface requires these methods
            const loggerService: ILoggerService = {
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
                fatal: jest.fn(),
                log: jest.fn(),
                updateConfig: jest.fn(),
                getConfig: jest.fn(),
                addTarget: jest.fn(),
                removeTarget: jest.fn(),
                getMetrics: jest.fn()
            };

            expect(typeof loggerService.debug).toBe('function');
            expect(typeof loggerService.info).toBe('function');
            expect(typeof loggerService.warn).toBe('function');
            expect(typeof loggerService.error).toBe('function');
            expect(typeof loggerService.fatal).toBe('function');
            expect(typeof loggerService.log).toBe('function');
            expect(typeof loggerService.updateConfig).toBe('function');
            expect(typeof loggerService.getConfig).toBe('function');
            expect(typeof loggerService.addTarget).toBe('function');
            expect(typeof loggerService.removeTarget).toBe('function');
            expect(typeof loggerService.getMetrics).toBe('function');
        });
    });

    describe('LogLevel', () => {
        it('should have correct numeric values', () => {
            expect(LogLevel.DEBUG).toBe(0);
            expect(LogLevel.INFO).toBe(1);
            expect(LogLevel.WARN).toBe(2);
            expect(LogLevel.ERROR).toBe(3);
            expect(LogLevel.FATAL).toBe(4);
        });

        it('should support comparison operations', () => {
            expect(LogLevel.DEBUG < LogLevel.INFO).toBe(true);
            expect(LogLevel.INFO < LogLevel.WARN).toBe(true);
            expect(LogLevel.WARN < LogLevel.ERROR).toBe(true);
            expect(LogLevel.ERROR < LogLevel.FATAL).toBe(true);
        });

        it('should be usable as array index', () => {
            const logLevelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];

            expect(logLevelNames[LogLevel.DEBUG]).toBe('DEBUG');
            expect(logLevelNames[LogLevel.INFO]).toBe('INFO');
            expect(logLevelNames[LogLevel.WARN]).toBe('WARN');
            expect(logLevelNames[LogLevel.ERROR]).toBe('ERROR');
            expect(logLevelNames[LogLevel.FATAL]).toBe('FATAL');
        });
    });

    describe('Type Compatibility', () => {
        it('should allow interface implementation', () => {
            class TestLogger implements ILoggerService {
                debug(message: string, ...args: any[]): void {
                    console.debug(message, ...args);
                }

                info(message: string, ...args: any[]): void {
                    console.info(message, ...args);
                }

                warn(message: string, ...args: any[]): void {
                    console.warn(message, ...args);
                }

                error(message: string, ...args: any[]): void {
                    console.error(message, ...args);
                }

                fatal(message: string, ...args: any[]): void {
                    console.error('FATAL:', message, ...args);
                }

                log(level: LogLevel, message: string, ...args: any[]): void {
                    console.log(`[${level}] ${message}`, ...args);
                }

                updateConfig(config: Partial<ILoggerConfig>): void {
                    // Implementation
                }

                getConfig(): ILoggerConfig {
                    return {
                        level: LogLevel.INFO,
                        prefix: '[Test]',
                        enableTimestamps: true,
                        enableStructuredLogging: false,
                        targets: [],
                        format: {
                            dateFormat: 'yyyy-MM-dd HH:mm:ss',
                            enableColors: true,
                            includeMetadata: false
                        }
                    };
                }

                addTarget(target: any): void {
                    // Implementation
                }

                removeTarget(name: string): void {
                    // Implementation
                }

                getMetrics(): any {
                    return {
                        totalLogs: 0,
                        logsByLevel: {
                            [LogLevel.DEBUG]: 0,
                            [LogLevel.INFO]: 0,
                            [LogLevel.WARN]: 0,
                            [LogLevel.ERROR]: 0,
                            [LogLevel.FATAL]: 0
                        }
                    };
                }
            }

            const logger = new TestLogger();
            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
        });

        it('should support function parameters', () => {
            const logMessage = (logger: ILoggerService, level: LogLevel, message: string) => {
                switch (level) {
                    case LogLevel.DEBUG:
                        logger.debug(message);
                        break;
                    case LogLevel.INFO:
                        logger.info(message);
                        break;
                    case LogLevel.WARN:
                        logger.warn(message);
                        break;
                    case LogLevel.ERROR:
                        logger.error(message);
                        break;
                    case LogLevel.FATAL:
                        logger.fatal(message);
                        break;
                }
            };

            const mockLogger: ILoggerService = {
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
                fatal: jest.fn(),
                log: jest.fn(),
                updateConfig: jest.fn(),
                getConfig: jest.fn(),
                addTarget: jest.fn(),
                removeTarget: jest.fn(),
                getMetrics: jest.fn()
            };

            logMessage(mockLogger, LogLevel.INFO, 'Test message');
            expect(mockLogger.info).toHaveBeenCalledWith('Test message');
        });
    });

    describe('Advanced Type Usage', () => {
        it('should support generic logger factory', () => {
            type LoggerFactory<T extends ILoggerService> = () => T;

            const createMockLogger: LoggerFactory<ILoggerService> = () => ({
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
                fatal: jest.fn(),
                log: jest.fn(),
                updateConfig: jest.fn(),
                getConfig: jest.fn(),
                addTarget: jest.fn(),
                removeTarget: jest.fn(),
                getMetrics: jest.fn()
            });

            const logger = createMockLogger();
            expect(logger).toBeDefined();
        });

        it('should support configuration merging', () => {
            const defaultConfig: ILoggerConfig = {
                level: LogLevel.INFO,
                prefix: '[Default]',
                enableTimestamps: true,
                enableStructuredLogging: false,
                targets: [],
                format: {
                    dateFormat: 'yyyy-MM-dd HH:mm:ss',
                    enableColors: true,
                    includeMetadata: false
                }
            };

            const userConfig: Partial<ILoggerConfig> = {
                level: LogLevel.ERROR,
                prefix: '[User]'
            };

            const mergedConfig: ILoggerConfig = {
                ...defaultConfig,
                ...userConfig
            };

            expect(mergedConfig.level).toBe(LogLevel.ERROR);
            expect(mergedConfig.prefix).toBe('[User]');
            expect(mergedConfig.enableTimestamps).toBe(true); // Should preserve default
        });

        it('should support conditional configuration', () => {
            const createConfig = (isProduction: boolean): ILoggerConfig => ({
                level: isProduction ? LogLevel.WARN : LogLevel.DEBUG,
                prefix: isProduction ? '[Prod]' : '[Dev]',
                enableTimestamps: true,
                enableStructuredLogging: isProduction,
                targets: [],
                format: {
                    dateFormat: 'yyyy-MM-dd HH:mm:ss',
                    enableColors: !isProduction,
                    includeMetadata: isProduction
                }
            });

            const devConfig = createConfig(false);
            const prodConfig = createConfig(true);

            expect(devConfig.level).toBe(LogLevel.DEBUG);
            expect(devConfig.prefix).toBe('[Dev]');
            expect(devConfig.format.enableColors).toBe(true);

            expect(prodConfig.level).toBe(LogLevel.WARN);
            expect(prodConfig.prefix).toBe('[Prod]');
            expect(prodConfig.format.enableColors).toBe(false);
        });
    });
});
