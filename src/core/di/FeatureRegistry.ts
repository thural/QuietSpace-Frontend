/**
 * Feature Registry Interface
 * 
 * Provides a decoupled way for features to register their services
 * with the main DI container without creating tight coupling.
 */

import type { Container } from './container/Container';
import type { TypeKeys } from './types';

/**
 * Feature service registration configuration
 */
export interface FeatureServiceConfig {
    token: TypeKeys;
    implementation: new (...args: unknown[]) => unknown;
    options?: {
        singleton?: boolean;
        transient?: boolean;
        scoped?: boolean;
        factory?: () => unknown;
    };
}

/**
 * Feature registration interface
 */
export interface IFeatureRegistration {
    featureName: string;
    version?: string;
    dependencies?: string[];
    services: FeatureServiceConfig[];
}

/**
 * Feature Registry interface
 */
export interface IFeatureRegistry {
    /**
     * Register a feature with its services
     */
    registerFeature(registration: IFeatureRegistration): void;

    /**
     * Get all registered features
     */
    getRegisteredFeatures(): IFeatureRegistration[];

    /**
     * Get services for a specific feature
     */
    getFeatureServices(featureName: string): FeatureServiceConfig[];

    /**
     * Apply all registered features to the container
     */
    applyToContainer(container: Container): void;

    /**
     * Check if a feature is registered
     */
    isFeatureRegistered(featureName: string): boolean;
}

/**
 * Default Feature Registry implementation
 */
export class FeatureRegistry implements IFeatureRegistry {
    private readonly features = new Map<string, IFeatureRegistration>();

    registerFeature(registration: IFeatureRegistration): void {
        if (this.features.has(registration.featureName)) {
            console.warn(`Feature ${registration.featureName} is already registered. Overwriting...`);
        }

        this.features.set(registration.featureName, registration);
        console.log(`✅ Registered feature: ${registration.featureName}`);
    }

    getRegisteredFeatures(): IFeatureRegistration[] {
        return Array.from(this.features.values());
    }

    getFeatureServices(featureName: string): FeatureServiceConfig[] {
        const feature = this.features.get(featureName);
        return feature?.services || [];
    }

    applyToContainer(container: Container): void {
        for (const [featureName, feature] of this.features) {
            console.log(`🔧 Applying ${featureName} services to container...`);

            for (const service of feature.services) {
                this.registerService(container, service);
            }
        }
    }

    isFeatureRegistered(featureName: string): boolean {
        return this.features.has(featureName);
    }

    private registerService(container: Container, service: FeatureServiceConfig): void {
        const { token, implementation, options = {} } = service;

        if (options.singleton) {
            container.registerSingletonByToken(token, implementation as new (...args: unknown[]) => unknown);
        } else if (options.transient) {
            container.registerTransientByToken(token, implementation as new (...args: unknown[]) => unknown);
        } else if (options.factory) {
            container.registerInstanceByToken(token, options.factory());
        } else {
            // Default to singleton
            container.registerSingletonByToken(token, implementation as new (...args: unknown[]) => unknown);
        }
    }
}

/**
 * Global feature registry instance
 */
export const featureRegistry = new FeatureRegistry();

/**
 * Helper function to create feature service configs
 */
export function createFeatureService(
    token: TypeKeys,
    implementation: new (...args: unknown[]) => unknown,
    options: FeatureServiceConfig['options'] = {}
): FeatureServiceConfig {
    return {
        token,
        implementation,
        options
    };
}
