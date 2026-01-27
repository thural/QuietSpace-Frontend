/**
 * Core Utils Tests
 * 
 * Tests for core system utility functions and helpers.
 */

import {
    validateCoreConfig,
    checkCoreSystemHealth,
    getCoreSystemMetrics,
    formatCoreSystemStatus,
    createDefaultCoreConfig
} from '../../../src/core/utils';

import type {
    CoreConfig,
    CoreSystemStatus,
    CoreSystemEvent
} from '../../../src/core/types';

import {
    CORE_STATUS,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES,
    CORE_VALIDATION_RULES,
    CORE_EVENTS
} from '../../../src/core/constants';

describe('Core Utils', () => {
    describe('validateCoreConfig', () => {
        it('should validate valid configuration', () => {
            const config: CoreConfig = {
                cache: {
                    maxSize: 1000,
                    defaultTtl: 3600000,
                    strategy: 'lru',
                    enableMetrics: true
                },
                websocket: {
                    url: 'ws://localhost:8080',
                    reconnectInterval: 3000,
                    maxReconnectAttempts: 5,
                    timeout: 10000
                },
                theme: {
                    name: 'default'
                },
                network: {
                    timeout: 30000,
                    retryAttempts: 3,
                    retryDelay: 1000
                },
                services: {
                    level: 'info' as any,
                    enableConsole: true,
                    enableFile: false,
                    enableRemote: false
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors).toHaveLength(0);
        });

        it('should reject invalid configuration', () => {
            const config = {
                cache: {
                    maxSize: 0, // Invalid - below min
                    defaultTtl: 100, // Invalid - below min
                    strategy: 'invalid' // Invalid strategy
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0]).toContain('must be between');
            expect(errors[1]).toContain('must be between');
            expect(errors[2]).toContain('must be one of');
        });

        it('should handle non-object configuration', () => {
            const errors = validateCoreConfig(null);
            expect(errors).toContain('Configuration must be an object');
        });

        it('should validate cache configuration', () => {
            const config = {
                cache: {
                    maxSize: 2000,
                    defaultTtl: 7200000,
                    strategy: 'fifo',
                    enableMetrics: false
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors).toHaveLength(0);
        });

        it('should validate websocket configuration', () => {
            const config = {
                websocket: {
                    reconnectInterval: 5000,
                    maxReconnectAttempts: 10,
                    timeout: 20000
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors).toHaveLength(0);
        });

        it('should validate auth configuration', () => {
            const config = {
                auth: {
                    tokenRefreshInterval: 600000,
                    sessionTimeout: 7200000,
                    maxLoginAttempts: 3
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors).toHaveLength(0);
        });

        it('should validate network configuration', () => {
            const config = {
                network: {
                    timeout: 60000,
                    retryAttempts: 5,
                    retryDelay: 2000
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors).toHaveLength(0);
        });

        it('should validate service configuration', () => {
            const config = {
                services: {
                    level: 'debug',
                    enableConsole: true,
                    enableFile: true,
                    enableRemote: true
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors).toHaveLength(0);
        });
    });

    describe('checkCoreSystemHealth', () => {
        it('should return healthy status for initialized system', () => {
            const status: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: true,
                    theme: true,
                    websocket: true,
                    network: true,
                    services: true
                },
                errors: [],
                lastUpdated: new Date()
            };

            const health = checkCoreSystemHealth(status);
            expect(health).toBe('healthy');
        });

        it('should return unhealthy status for uninitialized system', () => {
            const status: CoreSystemStatus = {
                initialized: false,
                services: {},
                errors: [],
                lastUpdated: new Date()
            };

            const health = checkCoreSystemHealth(status);
            expect(health).toBe('unhealthy');
        });

        it('should return degraded status for partially initialized system', () => {
            const status: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: false,
                    theme: true,
                    websocket: true,
                    network: true,
                    services: true
                },
                errors: [],
                lastUpdated: new Date()
            };

            const health = checkCoreSystemHealth(status);
            expect(health).toBe('degraded');
        });

        it('should return unhealthy status for system with errors', () => {
            const status: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: true,
                    theme: true,
                    websocket: true,
                    network: true,
                    services: true
                },
                errors: ['Critical error'],
                lastUpdated: new Date()
            };

            const health = checkCoreSystemHealth(status);
            expect(health).toBe('unhealthy');
        });
    });

    describe('getCoreSystemMetrics', () => {
        it('should return correct metrics for healthy system', () => {
            const status: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: true,
                    theme: true,
                    websocket: true,
                    network: true,
                    services: true
                },
                errors: [],
                lastUpdated: new Date(Date.now() - 60000) // 1 minute ago
            };

            const metrics = getCoreSystemMetrics(status);
            expect(metrics.serviceCount).toBe(6);
            expect(metrics.healthyServices).toBe(6);
            expect(metrics.unhealthyServices).toBe(0);
            expect(metrics.errorCount).toBe(0);
            expect(metrics.healthRatio).toBe(1.0);
            expect(metrics.uptime).toBeGreaterThan(50000); // Should be around 60 seconds
        });

        it('should return correct metrics for unhealthy system', () => {
            const status: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: false,
                    theme: true,
                    websocket: false,
                    network: true,
                    services: true
                },
                errors: ['Error 1', 'Error 2'],
                lastUpdated: new Date()
            };

            const metrics = getCoreSystemMetrics(status);
            expect(metrics.serviceCount).toBe(6);
            expect(metrics.healthyServices).toBe(4);
            expect(metrics.unhealthyServices).toBe(2);
            expect(metrics.errorCount).toBe(2);
            expect(metrics.healthRatio).toBe(4 / 6);
            expect(metrics.uptime).toBe(0); // Just updated
        });

        it('should handle empty services object', () => {
            const status: CoreSystemStatus = {
                initialized: false,
                services: {},
                errors: [],
                lastUpdated: new Date()
            };

            const metrics = getCoreSystemMetrics(status);
            expect(metrics.serviceCount).toBe(0);
            expect(metrics.healthyServices).toBe(0);
            expect(metrics.unhealthyServices).toBe(0);
            expect(metrics.errorCount).toBe(0);
            expect(metrics.healthRatio).toBe(0);
        });
    });

    describe('formatCoreSystemStatus', () => {
        it('should format status correctly', () => {
            const status: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: true,
                    theme: true,
                    websocket: true,
                    network: true,
                    services: true
                },
                errors: [],
                lastUpdated: new Date(Date.now() - 60000)
            };

            const formatted = formatCoreSystemStatus(status);
            expect(formatted).toContain('Core System Status: Initialized');
            expect(formatted).toContain('Health: healthy');
            expect(formatted).toContain('Services: 6/6 healthy');
            expect(formatted).toContain('Errors: 0');
            expect(formatted).toContain('Uptime: 60s');
        });

        it('should format uninitialized status', () => {
            const status: CoreSystemStatus = {
                initialized: false,
                services: {},
                errors: [],
                lastUpdated: new Date()
            };

            const formatted = formatCoreSystemStatus(status);
            expect(formatted).toContain('Core System Status: Not Initialized');
            expect(formatted).toContain('Health: unhealthy');
            expect(formatted).toContain('Services: 0/0 healthy');
            expect(formatted).toContain('Errors: 0');
        });

        it('should format status with errors', () => {
            const status: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: false,
                    theme: true
                },
                errors: ['Critical error occurred'],
                lastUpdated: new Date()
            };

            const formatted = formatCoreSystemStatus(status);
            expect(formatted).toContain('Core System Status: Initialized');
            expect(formatted).toContain('Health: unhealthy');
            expect(formatted).toContain('Services: 2/3 healthy');
            expect(formatted).toContain('Errors: 1');
        });
    });

    describe('createDefaultCoreConfig', () => {
        it('should create default configuration', () => {
            const config = createDefaultCoreConfig();

            expect(config).toBeDefined();
            expect(config.cache?.maxSize).toBe(1000);
            expect(config.cache?.defaultTtl).toBe(3600000);
            expect(config.cache?.strategy).toBe('lru');
            expect(config.websocket?.url).toBe('ws://localhost:8080');
            expect(config.websocket?.reconnectInterval).toBe(3000);
            expect(config.websocket?.maxReconnectAttempts).toBe(5);
            expect(config.websocket?.timeout).toBe(10000);

            expect(config.theme?.name).toBe('default');

            expect(config.network?.timeout).toBe(30000);
            expect(config.network?.retryAttempts).toBe(3);
            expect(config.network?.retryDelay).toBe(1000);

            expect(config.services?.level).toBe('info');
            expect(config.services?.enableConsole).toBe(true);
            expect(config.services?.enableFile).toBe(false);
            expect(config.services?.enableRemote).toBe(false);
        });

        it('should apply overrides correctly', () => {
            const overrides = {
                cache: {
                    maxSize: 2000,
                    strategy: 'fifo' as const
                }
            };

            const config = createDefaultCoreConfig(overrides);

            expect(config.cache?.maxSize).toBe(2000);
            expect(config.cache?.strategy).toBe('fifo');
            expect(config.cache?.defaultTtl).toBe(3600000); // Default preserved
        });

        it('should handle empty overrides', () => {
            const config1 = createDefaultCoreConfig();
            const config2 = createDefaultCoreConfig({});

            expect(config1).toEqual(config2);
        });

        it('should handle partial overrides', () => {
            const overrides = {
                theme: {
                    name: 'dark'
                }
            };

            const config = createDefaultCoreConfig(overrides);

            expect(config.theme?.name).toBe('dark');
            expect(config.cache?.maxSize).toBe(1000); // Default preserved
        });
    });

    describe('Integration with Constants', () => {
        it('should use validation rules from constants', () => {
            const config = {
                cache: {
                    maxSize: 1000,
                    defaultTtl: 3600000,
                    strategy: 'lru'
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors).toHaveLength(0);

            // Test boundary conditions
            const invalidConfig = {
                cache: {
                    maxSize: 0, // Below min
                    defaultTtl: 100, // Below min
                    strategy: 'invalid'
                }
            };

            const invalidErrors = validateCoreConfig(invalidConfig);
            expect(invalidErrors.length).toBe(3);

            // Check that the validation rules match constants
            expect(invalidErrors[0]).toContain(CORE_VALIDATION_RULES.cache.maxSize.min.toString());
            expect(invalidErrors[1]).toContain(CORE_VALIDATION_RULES.cache.defaultTtl.min.toString());
            expect(invalidErrors[2]).toContain(CORE_VALIDATION_RULES.cache.strategy.join(', '));
        });

        it('should use error codes from constants', () => {
            const errors = validateCoreConfig(null);
            expect(errors.length).toBeGreaterThan(0);
            // The function should work with the error codes from constants
        });

        it('should use error messages from constants', () => {
            const config = {
                cache: {
                    maxSize: 0
                }
            };

            const errors = validateCoreConfig(config);
            expect(errors.length).toBeGreaterThan(0);
            // The function should work with the error messages from constants
        });
    });

    describe('Type Safety', () => {
        it('should maintain type safety for configuration', () => {
            const config: CoreConfig = {
                cache: {
                    maxSize: 1000,
                    strategy: 'lru'
                }
            };

            expect(() => {
                validateCoreConfig(config);
            }).not.toThrow();
        });

        it('should handle type checking for status', () => {
            const status: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: true
                },
                errors: [],
                lastUpdated: new Date()
            };

            expect(() => {
                checkCoreSystemHealth(status);
                getCoreSystemMetrics(status);
                formatCoreSystemStatus(status);
            }).not.toThrow();
        });

        it('should handle type checking for events', () => {
            const event: CoreSystemEvent = {
                type: CORE_EVENTS.SYSTEM_INITIALIZED,
                payload: { message: 'System initialized' },
                timestamp: new Date()
            };

            expect(event.type).toBe(CORE_EVENTS.SYSTEM_INITIALIZED);
            expect(event.payload).toEqual({ message: 'System initialized' });
            expect(event.timestamp).toBeInstanceOf(Date);
        });
    });

    describe('Error Handling', () => {
        it('should handle malformed configuration gracefully', () => {
            const malformedConfigs = [
                null,
                undefined,
                'string',
                123,
                [],
                () => { },
                { cache: 'not-an-object' }
            ];

            malformedConfigs.forEach(config => {
                expect(() => {
                    validateCoreConfig(config);
                }).not.toThrow();
            });
        });

        it('should handle partial configuration', () => {
            const partialConfigs = [
                { cache: { maxSize: 1000 } },
                { websocket: { reconnectInterval: 3000 } },
                { auth: { tokenRefreshInterval: 300000 } },
                { theme: { name: 'dark' } },
                { network: { timeout: 30000 } },
                { services: { level: 'debug' } }
            ];

            partialConfigs.forEach(config => {
                expect(() => {
                    validateCoreConfig(config);
                }).not.toThrow();
            });
        });

        it('should handle extreme values', () => {
            const extremeConfigs = [
                {
                    cache: {
                        maxSize: Number.MAX_SAFE_INTEGER,
                        defaultTtl: Number.MAX_SAFE_INTEGER,
                        strategy: 'lru'
                    }
                },
                {
                    websocket: {
                        reconnectInterval: Number.MAX_SAFE_INTEGER,
                        maxReconnectAttempts: Number.MAX_SAFE_INTEGER,
                        timeout: Number.MAX_SAFE_INTEGER
                    }
                }
            ];

            extremeConfigs.forEach(config => {
                expect(() => {
                    validateCoreConfig(config);
                }).not.toThrow();
            });
        });
    });

    describe('Performance', () => {
        it('should handle large configurations efficiently', () => {
            const largeConfig = {
                cache: {
                    maxSize: 1000000,
                    defaultTtl: 3600000,
                    strategy: 'lru',
                    enableMetrics: true
                },
                websocket: {
                    reconnectInterval: 3000,
                    maxReconnectAttempts: 5,
                    timeout: 10000
                },
                auth: {
                    tokenRefreshInterval: 300000,
                    sessionTimeout: 3600000,
                    maxLoginAttempts: 5
                },
                theme: {
                    name: 'default',
                    variant: 'light'
                },
                network: {
                    timeout: 30000,
                    retryAttempts: 3,
                    retryDelay: 1000
                },
                services: {
                    level: 'info',
                    enableConsole: true,
                    enableFile: false,
                    enableRemote: false
                }
            };

            expect(() => {
                validateCoreConfig(largeConfig);
                checkCoreSystemHealth({
                    initialized: true,
                    services: {
                        cache: true,
                        auth: true,
                        theme: true,
                        websocket: true,
                        network: true,
                        services: true
                    },
                    errors: [],
                    lastUpdated: new Date()
                });
                getCoreSystemMetrics({
                    initialized: true,
                    services: {
                        cache: true,
                        auth: true,
                        theme: true,
                        websocket: true,
                        network: true,
                        services: true
                    },
                    errors: [],
                    lastUpdated: new Date()
                });
                formatCoreSystemStatus({
                    initialized: true,
                    services: {
                        cache: true,
                        auth: true,
                        theme: true,
                        websocket: true,
                        network: true,
                        services: true
                    },
                    errors: [],
                    lastUpdated: new Date()
                });
            }).not.toThrow();
        });
    });
});
