/**
 * Search Application Hooks Barrel Export.
 * 
 * Exports all hooks from the application layer.
 */

// Main search hooks (legacy - for backward compatibility)
export { default as useSearch } from './useSearch';
export { default as useUserSearch } from './useUserSearch';
export { default as usePostSearch } from './usePostSearch';

// Enterprise Hooks (new - recommended for use)
export { useEnterpriseSearch } from './useEnterpriseSearch';
export { useEnterpriseUserSearch } from './useEnterpriseUserSearch';
export { useEnterprisePostSearch } from './useEnterprisePostSearch';

// Migration Hook (for gradual transition)
export { useSearchMigration, SearchMigrationUtils } from './useSearchMigration';

// Enterprise Services Hook
export { useSearchServices } from './useSearchServices';

// React Query hooks (legacy) - REMOVED - Migrated to enterprise hooks

// Dependency Injection hooks
export { useSearchDI, useSearchService, useQueryService, useUserSearchRepository, usePostSearchRepository } from './useSearchDI';
export type { UseSearchDIConfig } from './useSearchDI';

// Re-export commonly used types and utilities
export type { SearchState, SearchActions } from './useSearch';
export type { UserSearchState, UserSearchActions } from './useUserSearch';
export type { PostSearchState, PostSearchActions } from './usePostSearch';
