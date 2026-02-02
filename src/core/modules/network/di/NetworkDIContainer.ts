/**
 * Network DI Container
 *
 * Provides dependency injection configuration for network services.
 * Follows enterprise patterns for service registration and resolution.
 */

import { Container } from '../../di/container/Container';
import { TYPES } from '../../di/types';
import { AuthenticatedApiService } from '../services/AuthenticatedApiService';

/**
 * Creates and configures the network DI container
 *
 * @returns Configured DI container with network services
 */
export function createNetworkContainer(): Container {
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
 * @param container - Existing DI container to register services in
 */
export function registerNetworkServices(container: Container): void {
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
 * @param container - DI container instance
 * @returns Authenticated API service instance
 */
export function getAuthenticatedApiService(container: Container): AuthenticatedApiService {
    return container.getByToken<AuthenticatedApiService>(TYPES.AUTHENTICATED_API_SERVICE);
}

/**
 * Gets the API client from container
 *
 * @param container - DI container instance
 * @returns Authenticated API client instance
 */
export function getApiClient(container: Container) {
    const service = container.getByToken<AuthenticatedApiService>(TYPES.AUTHENTICATED_API_SERVICE);
    return service.getApiClient();
}
