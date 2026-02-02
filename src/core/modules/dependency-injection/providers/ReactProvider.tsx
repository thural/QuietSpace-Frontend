/**
 * React DI Provider.
 * 
 * React context provider for dependency injection.
 * Integrates DI container with React component tree.
 */

import * as React from 'react';
import { createContext, useContext, useCallback, useMemo } from 'react';
import { Container } from '../container/Container';

// Define local types to avoid import issues
type ServiceIdentifier<T = any> = string | symbol | (new (...args: any[]) => T);

interface ServiceProvider {
  get<T>(identifier: ServiceIdentifier<T>): T;
  tryGet<T>(identifier: ServiceIdentifier<T>): T | null;
  has(identifier: ServiceIdentifier): boolean;
}

interface DIContext {
  container: Container;
  provider: ServiceProvider;
  scope?: any;
}

/**
 * DI context for React components
 */
const ReactDIContext = createContext<DIContext | null>(null);

/**
 * React DI Provider component
 */
const DIProvider: React.FC<{
  container?: Container;
  children: React.ReactNode;
}> = ({ container, children }) => {
  // Use provided container or create default
  const diContainer = useMemo(() => container || Container.create(), [container]);

  // Get service with error handling
  const getService = useCallback((identifier: ServiceIdentifier) => {
    const service = diContainer.tryGet(identifier);
    if (!service) {
      throw new Error(`Service ${String(identifier)} not found in DI container`);
    }
    return service;
  }, [diContainer]);

  // Try to get service
  const tryGetService = useCallback((identifier: ServiceIdentifier) => {
    return diContainer.tryGet(identifier);
  }, [diContainer]);

  // Check if Service exists
  const hasService = useCallback((identifier: ServiceIdentifier) => {
    return diContainer.has(identifier);
  }, [diContainer]);

  // Context value
  const contextValue: DIContext = useMemo(() => ({
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
 */
export const useDIContainer = (): Container => {
  const context = useContext(ReactDIContext);
  if (!context || !context.container) {
    throw new Error('useDIContainer must be used within a DIProvider');
  }
  return context.container;
};

/**
 * Hook to use DI context
 */
export const useDIContext = (): DIContext => {
  const context = useContext(ReactDIContext);
  if (!context) {
    throw new Error('useDIContext must be used within a DIProvider');
  }
  return context;
};

/**
 * Hook to get a service
 */
export function useService<T>(identifier: ServiceIdentifier<T>): T {
  const context = useDIContext();
  return context.provider.get(identifier);
}

/**
 * Hook to try to get a service
 */
export function useTryService<T>(identifier: ServiceIdentifier<T>): T | null {
  const context = useDIContext();
  return context.provider.tryGet(identifier);
}

/**
 * Hook to check if Service exists
 */
export function useHasService(identifier: ServiceIdentifier): boolean {
  const context = useDIContext();
  return context.provider.has(identifier);
}

/**
 * Hook to create scoped container
 */
export function useDIScope(): Container {
  const context = useDIContext();
  return context.container.createScope();
}
