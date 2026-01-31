/**
 * Network DI Container
 * 
 * Provides dependency injection configuration for network services.
 * Follows enterprise patterns for service registration and resolution.
 */

import { Container } from '../../di/container/Container.js';
import { AuthenticatedApiService } from '../services/AuthenticatedApiService.js';
import { TYPES } from '../../di/types.js';

/**
 * Creates and configures the network DI container
 * 
 * @returns {Container} Configured DI container with network services
 */
export function createNetworkContainer() {
    const container = new Container();

    // Create and register authenticated API service instance
    const authService = new AuthenticatedApiService();
    container.registerInstanceByToken(TYPES.AUTHENTICATED_API_SERVICE, authService);

    // Register API client instance from the service
    const apiClient = authService.getApiClient();
    container.registerInstanceByToken(TYPES.API_CLIENT, apiClient);

    return container;
}

/**
 * Registers network services in an existing container
 * 
 * @param {Container} container - Existing DI container to register services in
 */
export function registerNetworkServices(container) {
    // Create and register authenticated API service instance
    const authService = new AuthenticatedApiService();
    container.registerInstanceByToken(TYPES.AUTHENTICATED_API_SERVICE, authService);

    // Register API client instance from the service
    const apiClient = authService.getApiClient();
    container.registerInstanceByToken(TYPES.API_CLIENT, apiClient);
}

/**
 * Gets the authenticated API service from container
 * 
 * @param {Container} container - DI container instance
 * @returns {AuthenticatedApiService} Authenticated API service instance
 */
export function getAuthenticatedApiService(container) {
    return container.getByToken(TYPES.AUTHENTICATED_API_SERVICE);
}

/**
 * Gets the API client from container
 * 
 * @param {Container} container - DI container instance
 * @returns {Object} Authenticated API client instance
 */
export function getApiClient(container) {
    const service = container.getByToken(TYPES.AUTHENTICATED_API_SERVICE);
    return service.getApiClient();
}
