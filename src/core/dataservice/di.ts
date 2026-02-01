/**
 * Data Service Module - DI Container Integration
 *
 * Provides DI container integration for accessing Data Service through dependency injection.
 * Follows Black Box pattern by hiding implementation details.
 */

import { TYPES } from '../di/types';

import type { IBaseDataService, IDataServiceFactoryOptions } from './interfaces';
import type { Container } from '../di/container/Container';

/**
 * Creates a data service using dependency injection container.
 *
 * @param container - DI container instance
 * @param options - Optional data service configuration
 * @returns Data service from DI container
 */
export function createDataServiceFromDI(
  container: Container,
  options?: IDataServiceFactoryOptions
): IBaseDataService {
  // Try to get from DI container first
  try {
    // Use AUTH_DATA_SERVICE token as it's the closest match
    return container.getByToken<IBaseDataService>(TYPES.AUTH_DATA_SERVICE);
  } catch {
    // Fallback: throw error with guidance
    throw new Error(
      'Data Service not found in DI container. ' +
      'Please register a concrete data service implementation or use the factory functions directly.'
    );
  }
}

/**
 * Creates a default data service using dependency injection container.
 *
 * @param container - DI container instance
 * @returns Default data service from DI container
 */
export function createDefaultDataServiceFromDI(
  container: Container
): IBaseDataService {
  // Try to get from DI container first
  try {
    return container.getByToken<IBaseDataService>(TYPES.AUTH_DATA_SERVICE);
  } catch {
    // Fallback: throw error with guidance
    throw new Error(
      'Data Service not found in DI container. ' +
      'Please register a concrete data service implementation or use the factory functions directly.'
    );
  }
}

/**
 * Creates a data service with cache using dependency injection container.
 *
 * @param container - DI container instance
 * @param options - Optional data service configuration
 * @returns Data service with cache from DI container
 */
export function createDataServiceWithCacheFromDI(
  container: Container,
  options?: IDataServiceFactoryOptions
): IBaseDataService {
  // Try to get from DI container first
  try {
    return container.getByToken<IBaseDataService>(TYPES.AUTH_DATA_SERVICE);
  } catch {
    // Fallback: throw error with guidance
    throw new Error(
      'Data Service not found in DI container. ' +
      'Please register a concrete data service implementation or use the factory functions directly.'
    );
  }
}

/**
 * Register Data Service in DI container (for advanced usage)
 *
 * @param container - DI container instance
 * @param dataService - Data service instance to register
 */
export function registerDataServiceInDI(
  container: Container,
  dataService: IBaseDataService
): void {
  // This would require the container to have registration methods
  // For now, consumers should register their data services manually
  console.warn('Data Service DI registration not implemented. Please register manually.');
}

/**
 * Data Service DI utilities
 */
export const DataServiceDI = {
  createFromDI: createDataServiceFromDI,
  createDefaultFromDI: createDefaultDataServiceFromDI,
  createWithCacheFromDI: createDataServiceWithCacheFromDI,
  register: registerDataServiceInDI
} as const;
