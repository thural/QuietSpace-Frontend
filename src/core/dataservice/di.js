/**
 * Data Service Module - DI Container Integration
 * 
 * Provides DI container integration for accessing Data Service through dependency injection.
 * Follows Black Box pattern by hiding implementation details.
 */

import { Container } from '../di/container/Container.js';

/**
 * Creates a data service using dependency injection container.
 * 
 * @param {Container} container - DI container instance
 * @param {Object} [options] - Optional data service configuration
 * @returns {Object} Data service from DI container
 */
export function createDataServiceFromDI(container, options) {
  // Try to get from DI container first
  try {
    // Use AUTH_DATA_SERVICE token as it's the closest match
    return container.getByToken('AUTH_DATA_SERVICE');
  } catch (error) {
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
 * @param {Container} container - DI container instance
 * @returns {Object} Default data service from DI container
 */
export function createDefaultDataServiceFromDI(container) {
  // Try to get from DI container first
  try {
    return container.getByToken('AUTH_DATA_SERVICE');
  } catch (error) {
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
 * @param {Container} container - DI container instance
 * @param {Object} [options] - Optional data service configuration
 * @returns {Object} Data service with cache from DI container
 */
export function createDataServiceWithCacheFromDI(container, options) {
  // Try to get from DI container first
  try {
    return container.getByToken('AUTH_DATA_SERVICE');
  } catch (error) {
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
 * @param {Container} container - DI container instance
 * @param {Object} dataService - Data service instance to register
 */
export function registerDataServiceInDI(container, dataService) {
  // This would require the container to have registration methods
  // For now, consumers should register their data services manually
  console.warn('Data Service DI registration not implemented. Please register manually.');
}

/**
 * Data Service DI utilities
 */
export const DataServiceDI = Object.freeze({
  createFromDI: createDataServiceFromDI,
  createDefaultFromDI: createDefaultDataServiceFromDI,
  createWithCacheFromDI: createDataServiceWithCacheFromDI,
  register: registerDataServiceInDI
});
