/**
 * Search Application Hooks Barrel Export.
 * 
 * Exports all hooks from the application layer.
 */

// Main search hooks
export { default as useSearch } from './useSearch';
export { default as useUserSearch } from './useUserSearch';
export { default as usePostSearch } from './usePostSearch';

// React Query hooks
export { useReactQuerySearch } from './useReactQuerySearch';

// Dependency Injection hooks
export { useSearchDI, useSearchService, useQueryService, useUserSearchRepository, usePostSearchRepository } from './useSearchDI';
export type { UseSearchDIConfig } from './useSearchDI';

// Re-export commonly used types and utilities
export type { SearchState, SearchActions } from './useSearch';
export type { UserSearchState, UserSearchActions } from './useUserSearch';
export type { PostSearchState, PostSearchActions } from './usePostSearch';
