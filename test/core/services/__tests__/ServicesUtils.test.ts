/**
 * Services Utils Tests
 * 
 * Tests for the services module utilities
 */

import {
    LogLevel,
    DEFAULT_LOGGER_CONFIG
} from '../../../../src/core/services/interfaces';
import {
    createLogEntry,
    createDebugEntry,
    createInfoEntry,
    createWarnEntry,
    createErrorEntry,
    createFatalEntry,
    formatLogEntry,
    formatLogEntryWithColors,
    getConsoleMethod,
    logLevelToString,
    stringToLogLevel,
    shouldLog,
    isLogLevel,
    isLogEntry,
    mergeLoggerConfig,
    validateLoggerConfig,
    createConsoleTarget
} from '../../../../src/core/services/utils';

describe('Services Utils', () => {
    describe('Log Entry Creation', () => {
        it('should create basic log entry', () => {
            const entry = createLogEntry(LogLevel.INFO, 'Test message');

            expect(entry.level).toBe(LogLevel.INFO);
            expect(entry.message).toBe('Test message');
            expect(entry.timestamp).toBeInstanceOf(Date);
            expect(entry.metadata).toEqual({});
        });

        it('should create log entry with metadata', () => {
            const metadata = { userId: 123, action: 'login' };
            const entry = createLogEntry(LogLevel.INFO, 'User action', metadata);

            expect(entry.metadata).toEqual(metadata);
        });

        it('should create debug entry', () => {
            const entry = createDebugEntry('Debug message');
            expect(entry.level).toBe(LogLevel.DEBUG);
            expect(entry.message).toBe('Debug message');
        });

        it('should create info entry', () => {
            const entry = createInfoEntry('Info message');
            expect(entry.level).toBe(LogLevel.INFO);
            expect(entry.message).toBe('Info message');
        });

        it('should create warn entry', () => {
            const entry = createWarnEntry('Warning message');
            expect(entry.level).toBe(LogLevel.WARN);
            expect(entry.message).toBe('Warning message');
        });

        it('should create error entry', () => {
            const error = new Error('Test error');
            const entry = createErrorEntry('Error occurred', error);

            expect(entry.level).toBe(LogLevel.ERROR);
            expect(entry.message).toBe('Error occurred');
            expect(entry.error).toBe(error);
        });

        it('should create fatal entry', () => {
            const error = new Error('Fatal error');
            const entry = createFatalEntry('Fatal error occurred', error);

            expect(entry.level).toBe(LogLevel.FATAL);
            expect(entry.message).toBe('Fatal error occurred');
            expect(entry.error).toBe(error);
        });
    });

    describe('Log Entry Formatting', () => {
        it('should format log entry', () => {
            const entry = createLogEntry(LogLevel.INFO, 'Test message', { userId: 123 });
            const formatted = formatLogEntry(entry);

            expect(formatted).toContain('INFO');
            expect(formatted).toContain('Test message');
            expect(formatted).toContain('userId');
            expect(formatted).toContain('123');
        });

        it('should format log entry with custom config', () => {
            const entry = createLogEntry(LogLevel.INFO, 'Test message');
            const config = { ...DEFAULT_LOGGER_CONFIG, prefix: '[Custom]' };
            const formatted = formatLogEntry(entry, config);

            expect(formatted).toContain('[Custom]');
        });

        it('should format log entry with colors', () => {
            const entry = createLogEntry(LogLevel.ERROR, 'Error message');
            const formatted = formatLogEntryWithColors(entry);

            expect(formatted).toContain('ERROR');
            expect(formatted).toContain('Error message');
            // Should contain color codes
            expect(formatted).toMatch(/\x1b\[/);
        });
    });

    describe('Console Method Mapping', () => {
        it('should return correct console methods', () => {
            expect(getConsoleMethod(LogLevel.DEBUG)).toBe('debug');
            expect(getConsoleMethod(LogLevel.INFO)).toBe('info');
            expect(getConsoleMethod(LogLevel.WARN)).toBe('warn');
            expect(getConsoleMethod(LogLevel.ERROR)).toBe('error');
            expect(getConsoleMethod(LogLevel.FATAL)).toBe('error');
        });
    });

    describe('Log Level Utilities', () => {
        it('should convert log level to string', () => {
            expect(logLevelToString(LogLevel.DEBUG)).toBe('DEBUG');
            expect(logLevelToString(LogLevel.INFO)).toBe('INFO');
            expect(logLevelToString(LogLevel.WARN)).toBe('WARN');
            expect(logLevelToString(LogLevel.ERROR)).toBe('ERROR');
            expect(logLevelToString(LogLevel.FATAL)).toBe('FATAL');
        });

        it('should convert string to log level', () => {
            expect(stringToLogLevel('DEBUG')).toBe(LogLevel.DEBUG);
            expect(stringToLogLevel('INFO')).toBe(LogLevel.INFO);
            expect(stringToLogLevel('WARN')).toBe(LogLevel.WARN);
            expect(stringToLogLevel('ERROR')).toBe(LogLevel.ERROR);
            expect(stringToLogLevel('FATAL')).toBe(LogLevel.FATAL);
        });

        it('should handle case insensitive string conversion', () => {
            expect(stringToLogLevel('debug')).toBe(LogLevel.DEBUG);
            expect(stringToLogLevel('Info')).toBe(LogLevel.INFO);
            expect(stringToLogLevel('WARN')).toBe(LogLevel.WARN);
        });

        it('should default to INFO for invalid strings', () => {
            expect(stringToLogLevel('INVALID')).toBe(LogLevel.INFO);
            expect(stringToLogLevel('')).toBe(LogLevel.INFO);
        });

        it('should check if value is log level', () => {
            expect(isLogLevel(LogLevel.DEBUG)).toBe(true);
            expect(isLogLevel(LogLevel.INFO)).toBe(true);
            expect(isLogLevel(LogLevel.WARN)).toBe(true);
            expect(isLogLevel(LogLevel.ERROR)).toBe(true);
            expect(isLogLevel(LogLevel.FATAL)).toBe(true);

            expect(isLogLevel('DEBUG' as any)).toBe(false);
            expect(isLogLevel(999 as any)).toBe(false);
            expect(isLogLevel(null as any)).toBe(false);
            expect(isLogLevel(undefined as any)).toBe(false);
        });

        it('should check if should log', () => {
            expect(shouldLog(LogLevel.ERROR, LogLevel.INFO)).toBe(true);
            expect(shouldLog(LogLevel.WARN, LogLevel.ERROR)).toBe(false);
            expect(shouldLog(LogLevel.INFO, LogLevel.DEBUG)).toBe(true);
            expect(shouldLog(LogLevel.DEBUG, LogLevel.INFO)).toBe(false);
        });
    });

    describe('Type Guards', () => {
        it('should check if value is log entry', () => {
            const validEntry = createLogEntry(LogLevel.INFO, 'Test');
            expect(isLogEntry(validEntry)).toBe(true);

            expect(isLogEntry({ level: LogLevel.INFO, message: 'Test' })).toBe(true);
            expect(isLogEntry({ level: LogLevel.INFO })).toBe(false); // Missing message
            expect(isLogEntry({ message: 'Test' })).toBe(false); // Missing level
            expect(isLogEntry(null)).toBe(false);
            expect(isLogEntry('string')).toBe(false);
        });
    });

    describe('Configuration Management', () => {
        it('should merge logger configurations', () => {
            const base = DEFAULT_LOGGER_CONFIG;
            const override1 = { level: LogLevel.ERROR, prefix: '[Override]' };
            const override2 = { enableTimestamps: false };

            const merged = mergeLoggerConfig(base, override1, override2);

            expect(merged.level).toBe(LogLevel.ERROR);
            expect(merged.prefix).toBe('[Override]');
            expect(merged.enableTimestamps).toBe(false);
            expect(merged.enableStructuredLogging).toBe(base.enableStructuredLogging); // Should preserve base
        });

        it('should validate logger configuration', () => {
            const validConfig = DEFAULT_LOGGER_CONFIG;
            const errors = validateLoggerConfig(validConfig);

            expect(Array.isArray(errors)).toBe(true);
            // Valid config should have no errors
            expect(errors.length).toBe(0);
        });

        it('should detect configuration errors', () => {
            const invalidConfig = {
                level: 'invalid' as any,
                prefix: null,
                enableTimestamps: 'yes' as any
            };

            const errors = validateLoggerConfig(invalidConfig);

            expect(Array.isArray(errors)).toBe(true);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('Target Creation', () => {
        it('should create console target', () => {
            const target = createConsoleTarget('console', LogLevel.WARN);

            expect(target.name).toBe('console');
            expect(target.level).toBe(LogLevel.WARN);
            expect(typeof target.write).toBe('function');
        });

        it('should create console target with default level', () => {
            const target = createConsoleTarget('console');

            expect(target.level).toBe(LogLevel.DEBUG);
        });
    });

    describe('Performance', () => {
        it('should handle rapid utility function calls', () => {
            const startTime = performance.now();

            for (let i = 0; i < 10000; i++) {
                createLogEntry(LogLevel.INFO, `Message ${i}`);
                logLevelToString(LogLevel.INFO);
                stringToLogLevel('INFO');
                shouldLog(LogLevel.ERROR, LogLevel.INFO);
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 10,000 operations in under 100ms
            expect(duration).toBeLessThan(100);
        });

        it('should not cause memory leaks', () => {
            const initialMemory = process.memoryUsage().heapUsed;

            for (let i = 0; i < 100000; i++) {
                createLogEntry(LogLevel.INFO, `Message ${i}`);
                formatLogEntry(createLogEntry(LogLevel.INFO, `Message ${i}`));
            }

            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;

            // Memory increase should be minimal
            expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
        });
    });

    describe('Edge Cases', () => {
        it('should handle very long messages', () => {
            const longMessage = 'x'.repeat(10000);
            const entry = createLogEntry(LogLevel.INFO, longMessage);

            expect(entry.message).toBe(longMessage);
            expect(entry.message.length).toBe(10000);
        });

        it('should handle special characters in messages', () => {
            const specialMessage = 'Special chars: !@#$%^&*()[]{}|\\:";\'<>?,./';
            const entry = createLogEntry(LogLevel.INFO, specialMessage);

            expect(entry.message).toBe(specialMessage);
        });

        it('should handle Unicode characters', () => {
            const unicodeMessage = '测试消息 🚀 ñiño';
            const entry = createLogEntry(LogLevel.INFO, unicodeMessage);

            expect(entry.message).toBe(unicodeMessage);
        });

        it('should handle circular references in metadata', () => {
            const circular: any = { name: 'test' };
            circular.self = circular;

            expect(() => {
                createLogEntry(LogLevel.INFO, 'Test', circular);
            }).not.toThrow();
        });
    });

    describe('Integration', () => {
        it('should work together for complete logging workflow', () => {
            // Create log entry
            const entry = createErrorEntry('Test error', new Error('Test'), { userId: 123 });

            // Check type
            expect(isLogEntry(entry)).toBe(true);
            expect(isLogLevel(entry.level)).toBe(true);

            // Format for display
            const formatted = formatLogEntry(entry);
            expect(formatted).toContain('ERROR');
            expect(formatted).toContain('Test error');
            expect(formatted).toContain('userId');

            // Get console method
            const method = getConsoleMethod(entry.level);
            expect(method).toBe('error');

            // Check if should log
            const shouldLogEntry = shouldLog(LogLevel.ERROR, LogLevel.INFO);
            expect(shouldLogEntry).toBe(true);
        });
    });
});
