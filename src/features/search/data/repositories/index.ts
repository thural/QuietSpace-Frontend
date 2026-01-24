/**
 * Search Repositories Barrel Export.
 * 
 * Exports all repository implementations from the data layer.
 */

export { BaseSearchRepository } from './SearchRepository';
export type { ISearchRepository, RepositoryCapabilities } from './SearchRepository';
export { SearchRepositoryImpl } from './SearchRepositoryImpl';
export { UserSearchRepository } from './UserSearchRepository';
export { PostSearchRepository } from './PostSearchRepository';
export { MockSearchRepository } from './MockSearchRepository';
