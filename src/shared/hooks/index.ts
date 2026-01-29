/**
 * Shared Hooks Barrel Export.
 * 
 * Exports all shared utility hooks for cross-feature usage.
 */

// Error handling
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as withErrorBoundary } from './withErrorBoundary';

// Component utilities
export { default as useComponentHeight } from './useComponentHeight';
export { default as useComponentInitialHeight } from './useComponentInitialHeight';
export { default as withForwardedRef } from './withForwardedRef';

// Form utilities
export { default as useFormInput } from './useFormInput';
export { default as useMultiSelect } from './useMultiSelect';

// Interaction utilities
export { default as useHoverState } from './useHoverState';
export { default as useNavigation } from './useNavigation';

// Media utilities
export { default as useFileUploader } from './useFileUploader';

// Search utilities
export { default as useSearchQuery } from './useSearchQuery';

// Theme utilities
export { default as useTheme } from './useTheme';

// UI utilities
export { default as usePlaceholderCount } from './usePlaceholderCount';
