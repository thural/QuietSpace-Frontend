/**
 * Content Hooks Index
 * 
 * Exports all content hooks with proper organization
 * Enterprise hooks are prioritized over legacy implementations
 */

// Enterprise hooks (recommended)
export { useEnterpriseContent } from './useEnterpriseContent';
export type { EnterpriseContentState, EnterpriseContentActions } from './useEnterpriseContent';

// Legacy hooks (deprecated, maintained for backward compatibility)
export { useContentService } from './useContentService';
export type { ContentServiceState, ContentServiceActions } from './useContentService';

// Recommended usage:
// import { useEnterpriseContent } from '@features/content/application/hooks';
// For migration: import { useContentMigration } from '@features/content/application/hooks';
