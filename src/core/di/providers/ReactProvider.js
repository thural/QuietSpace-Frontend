/**
 * React DI Provider.
 * 
 * React context provider for dependency injection.
 * Integrates DI container with React component tree.
 */

import * as React from 'react';
import { createContext, useContext, useCallback, useMemo } from 'react';
import { Container } from '../container/Container.js';

// Define local types to avoid import issues
/**
 * Service identifier for type-safe dependency resolution
 * 
 * @typedef {string|symbol|Function} ServiceIdentifier
 */

/**
 * Service provider interface
 * 
 * @interface ServiceProvider
 * @description Defines contract for service providers
 */
export class ServiceProvider {
  /**
   * Get a service by identifier
   * 
   * @param {any} identifier - Service identifier
   * @returns {any} Service instance
   */
  get(identifier) {
    throw new Error('Method get() must be implemented');
  }

  /**
   * Try to get a service by identifier
   * 
   * @param {any} identifier - Service identifier
   * @returns {any|null} Service instance or null
   */
  tryGet(identifier) {
    throw new Error('Method tryGet() must be implemented');
  }

  /**
   * Check if service exists
   * 
   * @param {any} identifier - Service identifier
   * @returns {boolean} Whether service exists
   */
  has(identifier) {
    throw new Error('Method has() must be implemented');
  }
}

/**
 * DI context interface
 * 
 * @typedef {Object} DIContext
 * @property {Container} container - DI container
 * @property {ServiceProvider} provider - Service provider
 * @property {any} [scope] - Optional scope
 */

/**
 * DI context for React components
 * 
 * @type {React.Context<DIContext|null>}
 */
const ReactDIContext = createContext(/** @type {DIContext|null} */(null));

/**
 * React DI Provider component
 * 
 * @param {Object} props - Component props
 * @param {Container} [props.container] - DI container instance
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Provider component
 * @description React context provider for dependency injection
 */
const DIProvider = ({ container, children }) => {
  // Use provided container or create default
  const diContainer = useMemo(() => container || Container.create(), [container]);

  // Get service with error handling
  const getService = useCallback((identifier) => {
    const service = diContainer.tryGet(identifier);
    if (!service) {
      throw new Error(`Service ${String(identifier)} not found in DI container`);
    }
    return service;
  }, [diContainer]);

  // Try to get service
  const tryGetService = useCallback((identifier) => {
    return diContainer.tryGet(identifier);
  }, [diContainer]);

  // Check if Service exists
  const hasService = useCallback((identifier) => {
    return diContainer.has(identifier);
  }, [diContainer]);

  // Context value
  const contextValue = useMemo(() => ({
    container: diContainer,
    provider: {
      get: getService,
      tryGet: tryGetService,
      has: hasService,
    },
    scope: undefined
  }), [diContainer, getService, tryGetService, hasService]);

  return React.createElement(
    ReactDIContext.Provider,
    { value: contextValue },
    children
  );
};

export { DIProvider };

/**
 * Hook to use DI container
 * 
 * @function useDIContainer
 * @returns {Container} DI container instance
 * @description Gets the DI container from React context
 */
export const useDIContainer = () => {
  const context = useContext(ReactDIContext);
  if (!context || !context.container) {
    throw new Error('useDIContainer must be used within a DIProvider');
  }
  return context.container;
};

/**
 * Hook to use DI context
 * 
 * @function useDIContext
 * @returns {DIContext} DI context
 * @description Gets the DI context from React context
 */
export const useDIContext = () => {
  const context = useContext(ReactDIContext);
  if (!context) {
    throw new Error('useDIContext must be used within a DIProvider');
  }
  return context;
};

/**
 * Hook to get a service
 * 
 * @function useService
 * @param {any} identifier - Service identifier
 * @returns {any} Service instance
 * @description Gets a service from the DI container
 */
export function useService(identifier) {
  const context = useDIContext();
  return context.provider.get(identifier);
}

/**
 * Hook to try to get a service
 * 
 * @function useTryService
 * @param {any} identifier - Service identifier
 * @returns {any|null} Service instance or null
 * @description Tries to get a service from the DI container
 */
export function useTryService(identifier) {
  const context = useDIContext();
  return context.provider.tryGet(identifier);
}

/**
 * Hook to check if Service exists
 * 
 * @function useHasService
 * @param {any} identifier - Service identifier
 * @returns {boolean} Whether service exists
 * @description Checks if a service exists in the DI container
 */
export function useHasService(identifier) {
  const context = useDIContext();
  return context.provider.has(identifier);
}

/**
 * Hook to create scoped container
 * 
 * @function useDIScope
 * @returns {Container} Scoped container
 * @description Creates a scoped container from the current container
 */
export function useDIScope() {
  const context = useDIContext();
  return context.container.createScope();
}
