/**
 * Search Application Hooks Barrel Export.
 * 
 * Exports all hooks from the application layer.
 */

// Main search hook
export { default as useSearch } from './useSearch';

// Domain-specific search hooks
export { default as useUserSearch } from './useUserSearch';
export { default as usePostSearch } from './usePostSearch';

// Dependency Injection hooks
export { useSearchDI, useSearchService, useQueryService, useUserSearchRepository, usePostSearchRepository } from './useSearchDI';
export type { UseSearchDIConfig } from './useSearchDI';

// Re-export commonly used types and utilities
export type { SearchState, SearchActions } from './useSearch';
export type { UserSearchState, UserSearchActions } from './useUserSearch';
export type { PostSearchState, PostSearchActions } from './usePostSearch';
