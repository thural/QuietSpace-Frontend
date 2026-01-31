/**
 * React DI Context.
 * 
 * React context definitions for dependency injection.
 * Separated from provider to avoid React refresh warnings.
 */

import { createContext } from 'react';
import { Container } from '../container/Container';

/**
 * Service identifier type
 * @typedef {string|symbol|Function} ServiceIdentifier
 */

/**
 * Service provider interface
 * @typedef {Object} ServiceProvider
 * @property {Function} get - Get service by identifier
 * @property {Function} tryGet - Try to get service by identifier
 * @property {Function} has - Check if service exists
 */

/**
 * DI context interface
 * @typedef {Object} DIContext
 * @property {Container} container - DI container
 * @property {ServiceProvider} provider - Service provider
 * @property {*} [scope] - Optional scope
 */

/**
 * DI context for React components
 */
export const ReactDIContext = createContext(null);
