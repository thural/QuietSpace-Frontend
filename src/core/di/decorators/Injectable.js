/**
 * Injectable Decorator.
 * 
 * Marks a class as injectable for dependency injection.
 * Provides metadata for automatic service registration.
 */

import 'reflect-metadata';

// Metadata keys for reflection
const INJECTABLE_METADATA_KEY = Symbol('injectable');
const INJECT_METADATA_KEY = Symbol('inject');

/**
 * Injectable options interface
 * 
 * @typedef {Object} InjectableOptions
 * @property {'transient'|'singleton'|'scoped'} [lifetime] - Service lifetime
 * @property {any[]} [dependencies] - Service dependencies
 */

/**
 * Injectable decorator
 * 
 * Marks a class as injectable and stores metadata for DI container.
 * 
 * @function Injectable
 * @param {InjectableOptions} [options={}] - Injectable options
 * @returns {Function} Class decorator function
 * @description Marks a class as injectable with specified options
 */
export function Injectable(options = {}) {
  return function(target) {
    // Get existing metadata
    const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
    
    // Add new metadata
    const metadata = {
      lifetime: options.lifetime || 'transient',
      dependencies: options.dependencies || [],
      ...existingMetadata
    };
    
    // Store metadata
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, metadata, target);
    
    return target;
  };
}

/**
 * Inject decorator
 * 
 * Marks a constructor parameter as injectable dependency.
 * 
 * @function Inject
 * @param {any} [token] - Injection token
 * @returns {Function} Parameter decorator function
 * @description Marks a constructor parameter for dependency injection
 */
export function Inject(token) {
  return function(target, propertyKey, parameterIndex) {
    const existingTokens = Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
    
    // Add injection token
    existingTokens[parameterIndex] = token || propertyKey;
    
    // Store injection metadata
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingTokens, target);
  };
}

/**
 * Get injectable metadata from a class
 * 
 * @function getInjectableMetadata
 * @param {any} target - Target class
 * @returns {Object} Injectable metadata
 * @description Retrieves injectable metadata from a class
 */
export function getInjectableMetadata(target) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
}

/**
 * Get injection metadata from a class
 * 
 * @function getInjectionMetadata
 * @param {any} target - Target class
 * @returns {any[]} Injection metadata array
 * @description Retrieves injection parameter metadata from a class
 */
export function getInjectionMetadata(target) {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
}

/**
 * Check if a class is injectable
 * 
 * @function isInjectable
 * @param {any} target - Target class
 * @returns {boolean} Whether class is injectable
 * @description Checks if a class has injectable metadata
 */
export function isInjectable(target) {
  return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, target);
}

/**
 * Get all injectable dependencies from constructor
 * 
 * @function getConstructorDependencies
 * @param {any} target - Target class
 * @returns {any[]} Constructor dependencies
 * @description Gets all constructor parameter dependencies
 */
export function getConstructorDependencies(target) {
  const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
  const injectionTokens = getInjectionMetadata(target) || [];
  
  return paramTypes.map((type, index) => {
    return injectionTokens[index] || type;
  });
}
