/**
 * React DI Hooks.
 * 
 * React hooks for dependency injection.
 * Separated from provider to avoid React refresh warnings.
 */

import { useContext, useMemo } from 'react';
import { ReactDIContext } from './context';
import { Container } from '../container/Container';

/**
 * Service identifier type
 * @typedef {string|symbol|Function} ServiceIdentifier
 */

/**
 * Hook to use DI container
 * @returns {Container} DI container instance
 * @throws {Error} If used outside DIProvider
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
 * @returns {DIContext} DI context instance
 * @throws {Error} If used outside DIProvider
 */
export const useDIContext = () => {
  const context = useContext(ReactDIContext);
  if (!context) {
    throw new Error('useDIContext must be used within a DIProvider');
  }
  return context;
};

/**
 * Hook to use a service from DI container
 * @template T
 * @param {ServiceIdentifier<T>} identifier - Service identifier
 * @returns {T} Service instance
 */
export function useService(identifier) {
  const context = useDIContext();
  return context.provider.get(identifier);
}

/**
 * Hook to try to get a service
 * @template T
 * @param {ServiceIdentifier<T>} identifier - Service identifier
 * @returns {T|null} Service instance or null
 */
export function useTryService(identifier) {
  const context = useDIContext();
  return context.provider.tryGet(identifier);
}

/**
 * Hook to check if Service exists
 * @param {ServiceIdentifier} identifier - Service identifier
 * @returns {boolean} True if service exists
 */
export function useHasService(identifier) {
  const context = useDIContext();
  return context.provider.has(identifier);
}

/**
 * Hook to create scoped container
 * @template T
 * @param {Function} factory - Factory function
 * @param {ServiceIdentifier[]} [dependencies] - Dependencies array
 * @returns {T} Scoped container result
 */
export function useScopedContainer(
  factory,
  dependencies
) {
  const container = useDIContainer();
  const context = useDIContext();

  return useMemo(() => {
    return factory(container);
  }, [container, context, ...(dependencies || [])]);
}
