/**
 * Simplified Authentication Configuration Loader
 *
 * Uses AuthConfigBuilder pattern to replace complex configuration management
 * and reduce complexity while maintaining all functionality.
 */

import { AuthConfigBuilder } from './AuthConfigBuilder';

import type { IAuthConfig } from '../interfaces/authInterfaces';

/**
 * Simplified configuration loader using builder pattern
 */
export class SimplifiedAuthConfigLoader {
    private static instance: SimplifiedAuthConfigLoader | null = null;

    /**
     * Loads configuration for specified environment
     */
    static async loadConfiguration(environment?: string): Promise<IAuthConfig> {
        try {
            const config = AuthConfigBuilder.create()
                .withDefaults()
                .withEnvironment(environment)
                .build();

            return config;
        } catch (error) {
            console.error('Failed to load authentication configuration:', error);
            
            // Return default configuration on error
            return AuthConfigBuilder.create().build();
        }
    }

    /**
     * Loads configuration from file
     */
    static async loadFromFile(configPath: string): Promise<IAuthConfig> {
        try {
            const config = AuthConfigBuilder.create()
                .withDefaults()
                .withFile(configPath)
                .build();

            return config;
        } catch (error) {
            console.error(`Failed to load config from ${configPath}:`, error);
            
            // Return default configuration on error
            return AuthConfigBuilder.create().build();
        }
    }

    /**
     * Loads configuration from environment variables only
     */
    static async loadFromEnvironment(): Promise<IAuthConfig> {
        try {
            const config = AuthConfigBuilder.create()
                .withDefaults()
                .withEnvironment()
                .build();

            return config;
        } catch (error) {
            console.error('Failed to load configuration from environment:', error);
            
            // Return default configuration on error
            return AuthConfigBuilder.create().build();
        }
    }

    /**
     * Creates configuration with custom overrides
     */
    static async loadWithOverrides(overrides: Record<string, any>): Promise<IAuthConfig> {
        try {
            const config = AuthConfigBuilder.create()
                .withDefaults()
                .withRuntime(overrides)
                .build();

            return config;
        } catch (error) {
            console.error('Failed to create configuration with overrides:', error);
            
            // Return default configuration on error
            return AuthConfigBuilder.create().build();
        }
    }

    /**
     * Gets singleton instance
     */
    static getInstance(): SimplifiedAuthConfigLoader {
        if (!this.instance) {
            this.instance = new SimplifiedAuthConfigLoader();
        }
        return this.instance;
    }

    /**
     * Validates configuration
     */
    static validateConfiguration(config: IAuthConfig): { isValid: boolean; errors: string[] } {
        try {
            const validation = config.validate();
            return {
                isValid: validation.success,
                errors: validation.success ? [] : [validation.error?.message || 'Unknown validation error']
            };
        } catch (error) {
            return {
                isValid: false,
                errors: [error instanceof Error ? error.message : 'Configuration validation failed']
            };
        }
    }
}
