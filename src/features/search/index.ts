/**
 * Search Feature Barrel Export.
 * 
 * Exports all components, hooks, and utilities from the Search feature.
 */

// Presentation layer
export { default as SearchContainer } from './presentation/SearchContainer';
export { default as SearchBar } from './presentation/SearchBar';
export { default as UserResults } from './presentation/UserResults';
export { default as PostResults } from './presentation/PostResults';

// Application layer
export { default as useSearch } from './application/hooks/useSearch';
export { default as useUserSearch } from './application/hooks/useUserSearch';
export { default as usePostSearch } from './application/hooks/usePostSearch';
export { SearchService } from './application/services/SearchService';
export { SearchQueryService } from './application/services/SearchQueryService';

// Domain layer
export * from './domain';

// Data layer
export * from './data';
