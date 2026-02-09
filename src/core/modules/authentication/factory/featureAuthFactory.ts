/**
 * Feature Authentication Factory
 *
 * Provides factory functions for creating feature authentication services.
 * This follows Black Box pattern and eliminates direct store access.
 */

import { FeatureAuthService } from '../services/FeatureAuthService';

import type { Container } from '../../dependency-injection/factory';
import { TYPES } from '../../dependency-injection/types';

/**
 * Create a feature authentication service
 *
 * @param container - DI container instance
 * @returns Feature authentication service instance
 */
export function createFeatureAuthService(container: Container): FeatureAuthService {
    return new FeatureAuthService(container);
}

/**
 * Create a feature authentication service from DI container
 *
 * @param container - DI container instance
 * @returns Feature authentication service instance or null if not available
 */
export function createFeatureAuthServiceFromDI(container: Container): FeatureAuthService | null {
    try {
        // Try to get from DI container first
        return container.getByToken<FeatureAuthService>(TYPES.AUTH_FEATURE_SERVICE);
    } catch {
        // Fallback to direct creation
        return createFeatureAuthService(container);
    }
}

/**
 * Create a singleton feature authentication service
 *
 * @param container - DI container instance
 * @returns Singleton feature authentication service
 */
export function createSingletonFeatureAuthService(container: Container): FeatureAuthService {
    try {
        return container.getByToken<FeatureAuthService>(TYPES.AUTH_FEATURE_SERVICE);
    } catch {
        // Register as singleton if not found
        const service = createFeatureAuthService(container);
        container.registerInstanceByToken(TYPES.AUTH_FEATURE_SERVICE, service);
        return service;
    }
}
