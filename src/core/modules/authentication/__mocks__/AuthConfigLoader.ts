/**
 * Mock for AuthConfigLoader to avoid import.meta issues in Jest
 */

import { jest } from '@jest/globals';

// Mock AuthModuleFactory with all required methods
export const AuthModuleFactory = {
    // Static methods for dynamic provider management
    activeServices: new Map(),
    providerRegistry: new Map(),

    resetInstance() {
        this.activeServices.clear();
        this.providerRegistry.clear();
    },

    async registerProvider(serviceId: string, provider: any, config?: any) {
        // Mock provider registration with correct naming
        let providerName = 'Unknown Provider';

        // Map constructor names to display names
        if (provider.constructor?.name) {
            switch (provider.constructor.name) {
                case 'OAuthAuthProvider':
                    providerName = 'OAuth Provider';
                    break;
                case 'SAMLAuthProvider':
                    providerName = 'SAML Provider';
                    break;
                case 'SessionAuthProvider':
                    providerName = 'Session Provider';
                    break;
                case 'JwtAuthProvider':
                    providerName = 'JWT Provider';
                    break;
                case 'LDAPAuthProvider':
                    providerName = 'LDAP Provider';
                    break;
                default:
                    providerName = provider.constructor.name;
                    break;
            }
        }

        // Mock configuration
        if (config && provider.configure && typeof provider.configure === 'function') {
            try {
                const configData = config.getAll ? config.getAll() : config;
                provider.configure(configData);
            } catch (error: any) {
                return {
                    success: false,
                    error: {
                        code: 'PROVIDER_CONFIGURATION_FAILED',
                        message: error?.message || 'Configuration failed'
                    }
                };
            }
        }

        this.providerRegistry.set(providerName, provider);
        this.activeServices.set(serviceId, {
            authenticate: (credentials: any) => {
                // Mock authentication
                if (provider.constructor?.name === 'SessionAuthProvider') {
                    return {
                        success: true,
                        data: {
                            user: { id: 'test-user', email: credentials.email },
                            session: { token: 'mock-session-token', expiresAt: Date.now() + 3600000 }
                        }
                    };
                }
                return {
                    success: true,
                    data: {
                        user: { id: 'test-user', email: credentials.email },
                        token: 'mock-token'
                    }
                };
            },
            providerName
        });

        // Mock initialization
        if (provider.initialize && typeof provider.initialize === 'function') {
            try {
                await provider.initialize();
            } catch (error) {
                // If initialization fails, don't register the provider
                return {
                    success: false,
                    error: {
                        code: 'PROVIDER_INITIALIZATION_FAILED',
                        message: (error as any)?.message || 'Initialization failed'
                    }
                };
            }
        }

        return {
            success: true,
            data: { serviceId, providerName }
        };
    },

    async unregisterProvider(serviceId: string, providerName: string) {
        if (!this.activeServices.has(serviceId)) {
            return {
                success: false,
                error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' }
            };
        }

        if (!this.providerRegistry.has(providerName)) {
            return {
                success: false,
                error: { code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' }
            };
        }

        this.activeServices.delete(serviceId);
        this.providerRegistry.delete(providerName);

        return { success: true };
    },

    async switchProvider(serviceId: string, providerName: string) {
        if (!this.activeServices.has(serviceId)) {
            return {
                success: false,
                error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' }
            };
        }

        if (!this.providerRegistry.has(providerName)) {
            return {
                success: false,
                error: { code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' }
            };
        }

        // Mock provider switching
        return { success: true };
    },

    getRegisteredProviders() {
        return Array.from(this.providerRegistry.keys());
    },

    getActiveServices() {
        return Array.from(this.activeServices.keys());
    },

    getService(serviceId: string) {
        return this.activeServices.get(serviceId);
    },

    getProvider(providerName: string) {
        return this.providerRegistry.get(providerName);
    }
};

export const loadAuthConfiguration = jest.fn().mockReturnValue({
    getAll: jest.fn().mockReturnValue({
        timeout: 5000,
        retries: 3,
        providers: ['jwt', 'oauth', 'saml'],
        security: {
            bcryptRounds: 12,
            jwtSecret: 'test-secret',
            sessionTimeout: 3600000,
        },
    }),
    get: jest.fn((key: string) => {
        const config = {
            timeout: 5000,
            retries: 3,
            providers: ['jwt', 'oauth', 'saml'],
            security: {
                bcryptRounds: 12,
                jwtSecret: 'test-secret',
                sessionTimeout: 3600000,
            },
        };
        return config[key as keyof typeof config];
    }),
});

export const EnvironmentAuthConfig = {
    loadFromEnv: jest.fn().mockReturnValue({
        timeout: parseInt(process.env.AUTH_TIMEOUT || '5000'),
        retries: parseInt(process.env.AUTH_RETRIES || '3'),
    }),
};

export const AUTH_ENV_VARS = {
    TIMEOUT: 'AUTH_TIMEOUT',
    RETRIES: 'AUTH_RETRIES',
    JWT_SECRET: 'JWT_SECRET',
    SESSION_TIMEOUT: 'SESSION_TIMEOUT',
};
