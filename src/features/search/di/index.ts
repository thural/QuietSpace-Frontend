/**
 * Dependency Injection Module.
 * 
 * Exports all DI-related functionality for the Search feature.
 */

export { SearchDIContainer, getSearchDIContainer, resetSearchDIContainer } from './SearchDIContainer';
export type { DIContainerConfig } from './SearchDIContainer';
export { developmentConfig, productionConfig, testConfig, getSearchConfig, createSearchConfig } from './SearchDIConfig';
