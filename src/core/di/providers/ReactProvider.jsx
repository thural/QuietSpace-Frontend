/**
 * React DI Provider
 * 
 * React context provider for dependency injection.
 * Integrates DI container with React component tree.
 */

import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('../container/Container.js').Container} Container
 */

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
   * @param {ServiceIdentifier} identifier - Service identifier
   * @returns {any} Service instance
   * @description Retrieves service from container
   */
  // eslint-disable-next-line no-unused-vars
  _get(identifier) {
    throw new Error('Method get() must be implemented');
  }

  /**
   * Try to get a service by identifier
   * 
   * @param {ServiceIdentifier} identifier - Service identifier
   * @returns {any|null} Service instance or null
   * @description Attempts to retrieve service from container
   */
  // eslint-disable-next-line no-unused-vars
  _tryGet(identifier) {
    throw new Error('Method tryGet() must be implemented');
  }

  /**
   * Check if service is registered
   * 
   * @param {ServiceIdentifier} identifier - Service identifier
   * @returns {boolean} Whether service is registered
   * @description Checks if service exists in container
   */
  // eslint-disable-next-line no-unused-vars
  _has(identifier) {
    throw new Error('Method has() must be implemented');
  }
}

/**
 * DI context interface
 * 
 * @interface DIContext
 * @description Defines structure for DI context value
 */
export class DIContext {
  /**
   * DI container instance
   * 
   * @type {Container}
   */
  container;

  /**
   * Service provider instance
   * 
   * @type {ServiceProvider}
   */
  provider;

  /**
   * Optional scope identifier
   * 
   * @type {any}
   */
  scope;

  /**
   * Creates DI context instance
   * 
   * @param {Object} context - Context object
   * @param {Container} context.container - DI container
   * @param {ServiceProvider} context.provider - Service provider
   * @param {any} [context.scope] - Optional scope
   */
  constructor({ container, provider, scope }) {
    this.container = container;
    this.provider = provider;
    this.scope = scope;
  }
}

/**
 * DI context for React components
 * 
 * @type {React.Context<DIContext|null>}
 */
const ReactDIContext = createContext(null);

/**
 * DI Provider component
 * 
 * @param {Object} props - Component props
 * @param {Container} props.container - DI container
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Provider component
 * @description Provides DI context to child components
 */
export const DIProvider = ({ container, children }) => {
  // Create service provider from container
  const provider = useMemo(() => ({
    get: (identifier) => container.get(identifier),
    tryGet: (identifier) => container.tryGet(identifier),
    has: (identifier) => container.has(identifier)
  }), [container]);

  // Create context value
  const contextValue = useMemo(() => new DIContext({
    container,
    provider
  }), [container, provider]);

  return (
    <ReactDIContext.Provider value={contextValue}>
      {children}
    </ReactDIContext.Provider>
  );
};

/**
 * Hook to use DI container
 * 
 * @returns {DIContext} DI context value
 * @description Access DI container from React components
 * @throws {Error} If used outside DIProvider
 */
export const useDIContainer = () => {
  const context = useContext(ReactDIContext);

  if (!context) {
    throw new Error('useDIContainer must be used within a DIProvider');
  }

  return context;
};

/**
 * Hook to get a service from DI container
 * 
 * @param {ServiceIdentifier} identifier - Service identifier
 * @returns {any} Service instance
 * @description Get service from DI container
 * @throws {Error} If service is not registered
 */
export const useService = (identifier) => {
  const { provider } = useDIContainer();
  return provider.get(identifier);
};

/**
 * Hook to try to get a service from DI container
 * 
 * @param {ServiceIdentifier} identifier - Service identifier
 * @returns {any|null} Service instance or null
 * @description Try to get service from DI container
 */
export const useTryService = (identifier) => {
  const { provider } = useDIContainer();
  return provider.tryGet(identifier);
};

/**
 * Hook to check if service is registered
 * 
 * @param {ServiceIdentifier} identifier - Service identifier
 * @returns {boolean} Whether service is registered
 * @description Check if service exists in DI container
 */
export const useHasService = (identifier) => {
  const { provider } = useDIContainer();
  return provider.has(identifier);
};

/**
 * Hook to get DI scope
 * 
 * @returns {any} DI scope value
 * @description Get current DI scope
 */
export const useDIScope = () => {
  const { scope } = useDIContainer();
  return scope;
};

export {
  DIProvider, ReactDIContext, useDIContainer, useDIScope, useHasService, useService,
  useTryService
};
