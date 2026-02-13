/**
 * React DI Provider.
 * 
 * React context provider for dependency injection.
 * Integrates DI container with React component tree.
 */

import * as React from 'react';
import { createContext, useContext, useCallback, useMemo, PureComponent, ReactNode } from 'react';
import { Container } from '../../../../core/modules/dependency-injection/container/Container';

// Define local types to avoid import issues
type ServiceIdentifier<T = any> = string | symbol | (new (...args: any[]) => T);

interface ServiceProvider {
  get<T>(identifier: ServiceIdentifier<T>): T;
  tryGet<T>(identifier: ServiceIdentifier<T>): T | null;
  has(identifier: ServiceIdentifier): boolean;
}

interface IDIContext {
  container: Container;
  provider: ServiceProvider;
  scope?: any;
}

interface IDIProviderProps {
  container?: Container;
  children: React.ReactNode;
}

/**
 * DI context for React components
 */
const ReactDIContext = createContext<IDIContext | null>(null);

/**
 * React DI Provider component
 */
class DIProvider extends PureComponent<IDIProviderProps> {
  /**
   * Get service with error handling
   */
  private getService = (diContainer: Container, identifier: ServiceIdentifier) => {
    const service = diContainer.tryGet(identifier);
    if (!service) {
      throw new Error(`Service ${String(identifier)} not found in DI container`);
    }
    return service;
  };

  /**
   * Try to get service
   */
  private tryGetService = (diContainer: Container, identifier: ServiceIdentifier) => {
    return diContainer.tryGet(identifier);
  };

  /**
   * Check if Service exists
   */
  private hasService = (diContainer: Container, identifier: ServiceIdentifier) => {
    return diContainer.has(identifier);
  };

  override render(): ReactNode {
    const { container, children } = this.props;

    // Use provided container or create default
    const diContainer = useMemo(() => container || Container.create(), [container]);

    // Context value
    const contextValue: IDIContext = useMemo(() => ({
      container: diContainer,
      provider: {
        get: (identifier: ServiceIdentifier) => this.getService(diContainer, identifier),
        tryGet: (identifier: ServiceIdentifier) => this.tryGetService(diContainer, identifier),
        has: (identifier: ServiceIdentifier) => this.hasService(diContainer, identifier),
      },
      scope: undefined
    }), [diContainer]);

    return React.createElement(
      ReactDIContext.Provider,
      { value: contextValue },
      children
    );
  }
}

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
export const useDIContext = (): IDIContext => {
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
