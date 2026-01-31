/**
 * Feature Authentication Factory
 * 
 * Provides factory functions for creating feature authentication services.
 * This follows Black Box pattern and eliminates direct store access.
 */

import { FeatureAuthService } from '../services/FeatureAuthService.js';
import { Container } from '@core/di/factory/index.js';

/**
 * Create a feature authentication service
 * 
 * @param {Container} container - DI container instance
 * @returns {FeatureAuthService} Feature authentication service instance
 */
export function createFeatureAuthService(container) {
    return new FeatureAuthService(container);
}

/**
 * Create a feature authentication service from DI container
 * 
 * @param {Container} container - DI container instance
 * @returns {FeatureAuthService|null} Feature authentication service instance or null if not available
 */
export function createFeatureAuthServiceFromDI(container) {
    try {
        // Try to get from DI container first
        return container.getByToken('FEATURE_AUTH_SERVICE');
    } catch {
        // Fallback to direct creation
        return createFeatureAuthService(container);
    }
}

/**
 * Create a singleton feature authentication service
 * 
 * @param {Container} container - DI container instance
 * @returns {FeatureAuthService} Singleton feature authentication service
 */
export function createSingletonFeatureAuthService(container) {
    try {
        return container.getByToken('FEATURE_AUTH_SERVICE');
    } catch {
        // Register as singleton if not found
        const service = createFeatureAuthService(container);
        container.registerInstanceByToken('FEATURE_AUTH_SERVICE', service);
        return service;
    }
}
