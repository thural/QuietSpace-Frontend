/**
 * Services Constants Tests
 * 
 * Tests for the services module constants
 */

import {
    LOGGER_CONSTANTS,
    THEME_SERVICE_CONSTANTS,
    USER_SERVICE_CONSTANTS,
    SERVICE_FACTORY_CONSTANTS,
    SERVICE_ERROR_CODES,
    SERVICE_PERFORMANCE_CONSTANTS
} from '../../../../src/core/services/constants';

describe('Services Constants', () => {
    describe('LOGGER_CONSTANTS', () => {
        it('should have defined log levels', () => {
            expect(LOGGER_CONSTANTS.LOG_LEVELS).toBeDefined();
            expect(LOGGER_CONSTANTS.LOG_LEVELS.TRACE).toBe(0);
            expect(LOGGER_CONSTANTS.LOG_LEVELS.DEBUG).toBe(1);
            expect(LOGGER_CONSTANTS.LOG_LEVELS.INFO).toBe(2);
            expect(LOGGER_CONSTANTS.LOG_LEVELS.WARN).toBe(3);
            expect(LOGGER_CONSTANTS.LOG_LEVELS.ERROR).toBe(4);
            expect(LOGGER_CONSTANTS.LOG_LEVELS.FATAL).toBe(5);
            expect(LOGGER_CONSTANTS.LOG_LEVELS.OFF).toBe(6);
        });

        it('should have defined log level names', () => {
            expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES).toBeDefined();
            expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES[0]).toBe('TRACE');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES[1]).toBe('DEBUG');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES[2]).toBe('INFO');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES[3]).toBe('WARN');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES[4]).toBe('ERROR');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES[5]).toBe('FATAL');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES[6]).toBe('OFF');
        });

        it('should have defined log level colors', () => {
            expect(LOGGER_CONSTANTS.LOG_LEVEL_COLORS).toBeDefined();
            expect(LOGGER_CONSTANTS.LOG_LEVEL_COLORS.TRACE).toBe('#9CA3AF');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_COLORS.DEBUG).toBe('#60A5FA');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_COLORS.INFO).toBe('#34D399');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_COLORS.WARN).toBe('#FBBF24');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_COLORS.ERROR).toBe('#F87171');
            expect(LOGGER_CONSTANTS.LOG_LEVEL_COLORS.FATAL).toBe('#DC2626');
        });

        it('should have valid color codes', () => {
            Object.values(LOGGER_CONSTANTS.LOG_LEVEL_COLORS).forEach(color => {
                expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
            });
        });
    });

    describe('THEME_SERVICE_CONSTANTS', () => {
        it('should be defined', () => {
            expect(THEME_SERVICE_CONSTANTS).toBeDefined();
        });

        it('should have storage keys', () => {
            expect(THEME_SERVICE_CONSTANTS.STORAGE_KEYS).toBeDefined();
            expect(THEME_SERVICE_CONSTANTS.STORAGE_KEYS.THEME).toBe('quietSpace_theme');
            expect(THEME_SERVICE_CONSTANTS.STORAGE_KEYS.THEME_VARIANT).toBe('quietSpace_themeVariant');
        });

        it('should have default config', () => {
            expect(THEME_SERVICE_CONSTANTS.DEFAULT_CONFIG).toBeDefined();
            expect(typeof THEME_SERVICE_CONSTANTS.DEFAULT_CONFIG).toBe('object');
        });
    });

    describe('USER_SERVICE_CONSTANTS', () => {
        it('should be defined', () => {
            expect(USER_SERVICE_CONSTANTS).toBeDefined();
        });

        it('should have storage keys', () => {
            expect(USER_SERVICE_CONSTANTS.STORAGE_KEYS).toBeDefined();
            expect(USER_SERVICE_CONSTANTS.STORAGE_KEYS.USER_PROFILE).toBe('quietSpace_userProfile');
        });

        it('should have validation rules', () => {
            expect(USER_SERVICE_CONSTANTS.VALIDATION_RULES).toBeDefined();
            expect(typeof USER_SERVICE_CONSTANTS.VALIDATION_RULES).toBe('object');
        });
    });

    describe('SERVICE_FACTORY_CONSTANTS', () => {
        it('should be defined', () => {
            expect(SERVICE_FACTORY_CONSTANTS).toBeDefined();
        });

        it('should have lifecycle states', () => {
            expect(SERVICE_FACTORY_CONSTANTS.LIFECYCLE_STATES).toBeDefined();
            expect(SERVICE_FACTORY_CONSTANTS.LIFECYCLE_STATES.INITIALIZING).toBe('initializing');
            expect(SERVICE_FACTORY_CONSTANTS.LIFECYCLE_STATES.READY).toBe('ready');
            expect(SERVICE_FACTORY_CONSTANTS.LIFECYCLE_STATES.ERROR).toBe('error');
        });
    });

    describe('SERVICE_ERROR_CODES', () => {
        it('should be defined', () => {
            expect(SERVICE_ERROR_CODES).toBeDefined();
        });

        it('should have common error codes', () => {
            expect(SERVICE_ERROR_CODES.SERVICE_NOT_FOUND).toBe('SERVICE_NOT_FOUND');
            expect(SERVICE_ERROR_CODES.SERVICE_INITIALIZATION_FAILED).toBe('SERVICE_INITIALIZATION_FAILED');
        });
    });

    describe('SERVICE_PERFORMANCE_CONSTANTS', () => {
        it('should be defined', () => {
            expect(SERVICE_PERFORMANCE_CONSTANTS).toBeDefined();
        });

        it('should have performance thresholds', () => {
            expect(SERVICE_PERFORMANCE_CONSTANTS.THRESHOLDS).toBeDefined();
            expect(typeof SERVICE_PERFORMANCE_CONSTANTS.THRESHOLDS.INITIALIZATION_TIME).toBe('number');
        });
    });

    describe('Constants Usage', () => {
        it('should support log level comparison', () => {
            const currentLevel = LOGGER_CONSTANTS.LOG_LEVELS.WARN;
            const errorLevel = LOGGER_CONSTANTS.LOG_LEVELS.ERROR;
            const debugLevel = LOGGER_CONSTANTS.LOG_LEVELS.DEBUG;

            expect(currentLevel < errorLevel).toBe(true);
            expect(currentLevel > debugLevel).toBe(true);
        });

        it('should have consistent log level mapping', () => {
            Object.entries(LOGGER_CONSTANTS.LOG_LEVELS).forEach(([name, value]) => {
                expect(LOGGER_CONSTANTS.LOG_LEVEL_NAMES[value]).toBe(name);
            });
        });
    });
});
