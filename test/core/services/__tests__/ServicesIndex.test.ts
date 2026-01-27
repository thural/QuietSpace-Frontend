/**
 * Services Index Tests
 * 
 * Tests for the services module index file exports
 */

import * as ServicesModule from '../../../../src/core/services';

describe('Services Index', () => {
    it('should export factory functions', () => {
        expect(ServicesModule.createLogger).toBeDefined();
        expect(typeof ServicesModule.createLogger).toBe('function');

        expect(ServicesModule.createDefaultLogger).toBeDefined();
        expect(typeof ServicesModule.createDefaultLogger).toBe('function');

        expect(ServicesModule.createComponentLogger).toBeDefined();
        expect(typeof ServicesModule.createComponentLogger).toBe('function');
    });

    it('should export interfaces as types', () => {
        expect(ServicesModule.ILoggerService).toBeDefined();
        expect(ServicesModule.ILoggerConfig).toBeDefined();
        expect(ServicesModule.ILogEntry).toBeDefined();
        expect(ServicesModule.ILoggerTarget).toBeDefined();
        expect(ServicesModule.LogFormat).toBeDefined();
        expect(ServicesModule.ILoggerMetrics).toBeDefined();
        expect(ServicesModule.ILoggerHealthStatus).toBeDefined();
        expect(ServicesModule.ILoggerFactoryConfig).toBeDefined();
        expect(ServicesModule.ILoggerContext).toBeDefined();
    });

    it('should export enums and constants', () => {
        expect(ServicesModule.LogLevel).toBeDefined();
        expect(ServicesModule.DEFAULT_LOGGER_CONFIG).toBeDefined();
        expect(ServicesModule.LOG_LEVEL_NAMES).toBeDefined();
        expect(ServicesModule.LOG_LEVEL_COLORS).toBeDefined();
        expect(ServicesModule.CONSOLE_METHODS).toBeDefined();
        expect(ServicesModule.DEFAULT_LOG_ENTRY).toBeDefined();
    });

    it('should export utility functions', () => {
        expect(ServicesModule.createLogEntry).toBeDefined();
        expect(ServicesModule.createDebugEntry).toBeDefined();
        expect(ServicesModule.createInfoEntry).toBeDefined();
        expect(ServicesModule.createWarnEntry).toBeDefined();
        expect(ServicesModule.createErrorEntry).toBeDefined();
        expect(ServicesModule.createFatalEntry).toBeDefined();
        expect(ServicesModule.formatLogEntry).toBeDefined();
        expect(ServicesModule.formatLogEntryWithColors).toBeDefined();
        expect(ServicesModule.getConsoleMethod).toBeDefined();
        expect(ServicesModule.logLevelToString).toBeDefined();
        expect(ServicesModule.stringToLogLevel).toBeDefined();
        expect(ServicesModule.shouldLog).toBeDefined();
        expect(ServicesModule.isLogLevelType).toBeDefined();
        expect(ServicesModule.isLogEntryType).toBeDefined();
        expect(ServicesModule.isLoggerTargetType).toBeDefined();
        expect(ServicesModule.mergeLoggerConfig).toBeDefined();
        expect(ServicesModule.validateLoggerConfig).toBeDefined();
        expect(ServicesModule.createConsoleTarget).toBeDefined();
        expect(ServicesModule.createFileTarget).toBeDefined();
        expect(ServicesModule.createRemoteTarget).toBeDefined();
        expect(ServicesModule.createCustomTarget).toBeDefined();
        expect(ServicesModule.extractErrorInfo).toBeDefined();
        expect(ServicesModule.sanitizeMessage).toBeDefined();
        expect(ServicesModule.formatDuration).toBeDefined();
        expect(ServicesModule.createTimer).toBeDefined();
        expect(ServicesModule.createLoggerTimer).toBeDefined();
    });

    it('should export factory registry', () => {
        expect(ServicesModule.loggerFactoryRegistry).toBeDefined();
    });

    it('should export module information', () => {
        expect(ServicesModule.LOGGER_MODULE_VERSION).toBeDefined();
        expect(ServicesModule.LOGGER_MODULE_INFO).toBeDefined();
        expect(ServicesModule.LOGGER_MODULE_VERSION).toBe('1.0.0');
        expect(ServicesModule.LOGGER_MODULE_INFO.name).toBe('Enterprise Logger Module');
        expect(ServicesModule.LOGGER_MODULE_INFO.version).toBe('1.0.0');
    });

    it('should export legacy LoggerService with underscore prefix', () => {
        expect(ServicesModule._LoggerService).toBeDefined();
        expect(typeof ServicesModule._LoggerService).toBe('function');
    });

    it('should allow usage of factory functions', () => {
        const logger = ServicesModule.createLogger();
        expect(logger).toBeDefined();
        expect(typeof logger.info).toBe('function');

        const defaultLogger = ServicesModule.createDefaultLogger();
        expect(defaultLogger).toBeDefined();
        expect(typeof defaultLogger.info).toBe('function');

        const componentLogger = ServicesModule.createComponentLogger('TestComponent');
        expect(componentLogger).toBeDefined();
        expect(typeof componentLogger.info).toBe('function');
    });

    it('should provide access to LogLevel enum', () => {
        expect(ServicesModule.LogLevel.DEBUG).toBe(0);
        expect(ServicesModule.LogLevel.INFO).toBe(1);
        expect(ServicesModule.LogLevel.WARN).toBe(2);
        expect(ServicesModule.LogLevel.ERROR).toBe(3);
        expect(ServicesModule.LogLevel.FATAL).toBe(4);
    });

    it('should provide access to constants', () => {
        expect(ServicesModule.DEFAULT_LOGGER_CONFIG).toBeDefined();
        expect(typeof ServicesModule.DEFAULT_LOGGER_CONFIG).toBe('object');

        expect(ServicesModule.LOG_LEVEL_NAMES).toBeDefined();
        expect(ServicesModule.LOG_LEVEL_NAMES[0]).toBe('DEBUG');

        expect(ServicesModule.LOG_LEVEL_COLORS).toBeDefined();
        expect(ServicesModule.LOG_LEVEL_COLORS.DEBUG).toBe('#60A5FA');

        expect(ServicesModule.CONSOLE_METHODS).toBeDefined();
        expect(ServicesModule.CONSOLE_METHODS[0]).toBe('debug');
    });

    it('should provide access to utility functions', () => {
        const { LogLevel } = ServicesModule;
        const entry = ServicesModule.createLogEntry(LogLevel.INFO, 'Test');

        expect(entry.level).toBe(LogLevel.INFO);
        expect(entry.message).toBe('Test');

        const formatted = ServicesModule.formatLogEntry(entry);
        expect(formatted).toContain('INFO');
        expect(formatted).toContain('Test');

        const levelString = ServicesModule.logLevelToString(LogLevel.ERROR);
        expect(levelString).toBe('ERROR');

        const parsedLevel = ServicesModule.stringToLogLevel('WARN');
        expect(parsedLevel).toBe(LogLevel.WARN);
    });

    it('should have consistent export structure', () => {
        const exports = Object.keys(ServicesModule);

        // Should have expected exports
        expect(exports).toContain('createLogger');
        expect(exports).toContain('createDefaultLogger');
        expect(exports).toContain('createComponentLogger');
        expect(exports).toContain('ILoggerService');
        expect(exports).toContain('ILoggerConfig');
        expect(exports).toContain('LogLevel');
        expect(exports).toContain('DEFAULT_LOGGER_CONFIG');
        expect(exports).toContain('createLogEntry');
        expect(exports).toContain('formatLogEntry');
        expect(exports).toContain('loggerFactoryRegistry');
        expect(exports).toContain('LOGGER_MODULE_VERSION');
        expect(exports).toContain('LOGGER_MODULE_INFO');
        expect(exports).toContain('_LoggerService');
    });

    it('should follow Black Box pattern', () => {
        // Implementation classes should not be directly exported
        expect(ServicesModule.LoggerService).toBeUndefined();
        expect(ServicesModule.ThemeService).toBeUndefined();
        expect(ServicesModule.UserService).toBeUndefined();

        // Only interfaces and factory functions should be exported
        expect(ServicesModule.ILoggerService).toBeDefined();
        expect(ServicesModule.createLogger).toBeDefined();

        // Legacy exports should have underscore prefix
        expect(ServicesModule._LoggerService).toBeDefined();
    });

    it('should provide module metadata', () => {
        const info = ServicesModule.LOGGER_MODULE_INFO;

        expect(info.name).toBe('Enterprise Logger Module');
        expect(info.version).toBe('1.0.0');
        expect(info.description).toBe('Centralized logging management with enterprise patterns');
        expect(Array.isArray(info.deprecatedExports)).toBe(true);
        expect(info.deprecatedExports).toContain('_LoggerService');
        expect(info.migrationGuide).toBe('Use factory functions instead of direct LoggerService import');
    });

    it('should allow instantiation through legacy export', () => {
        const loggerService = new ServicesModule._LoggerService();
        expect(loggerService).toBeDefined();
        expect(typeof loggerService.info).toBe('function');
    });

    it('should provide type guards', () => {
        const { LogLevel } = ServicesModule;

        expect(ServicesModule.isLogLevelType(LogLevel.INFO)).toBe(true);
        expect(ServicesModule.isLogLevelType('invalid' as any)).toBe(false);

        const entry = ServicesModule.createLogEntry(LogLevel.INFO, 'Test');
        expect(ServicesModule.isLogEntryType(entry)).toBe(true);
        expect(ServicesModule.isLogEntryType({})).toBe(false);
    });
});
