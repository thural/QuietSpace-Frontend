/**
 * Shared UI Components Index
 * 
 * Exports all UI components from the shared UI library.
 * This provides a single entry point for all component imports.
 */

// Layout components
export * from './layout';

// Display components
export * from './display';

// Form components
export * from './forms';

// Navigation components
export * from './navigation';

// User components
export * from './user';

// Feedback components
export * from './feedback';

// Interactive components
export { Button, Input, PinInput, Progress, Switch, FileInput } from './interactive';

// Utility components
export * from './utility';

// Core exports
export { TokenRefreshProvider } from './TokenRefreshProvider';

// New enterprise components (highlighted for easy access)
export { default as EnterpriseInput } from './forms/EnterpriseInput';
export { default as LoadingSpinner } from './feedback/LoadingSpinner';
export { default as UserProfileAvatar } from './user/UserProfileAvatar';

// Export user components
export { default as AuthStatus } from './user/AuthStatus';
export { default as SecurityStatus } from './user/SecurityStatus';
export { default as AuthenticatedActions } from './user/AuthenticatedActions';

// Export utility components
export { default as MigrationInfo } from './utility/MigrationInfo';

// Theme integration - Clean API
export type {
    ThemeTokens,
    ColorTokens,
    TypographyTokens,
    SpacingTokens,
    ShadowTokens,
    BreakpointTokens,
    RadiusTokens,
    AnimationTokens
} from '@/core/modules/theming/tokens';

export type {
    EnhancedTheme
} from '@/core/modules/theming/internal/types';

// Essential hooks for UI integration
export {
    useTheme,
    useThemeTokens
} from '@/core/modules/theming';

// Theme token helpers for class-based components
export {
    ThemeTokenHelper,
    ThemedComponent,
    ThemeTokenMixin,
    ComponentSize,
    ComponentVariant
} from '../utils/themeTokenHelpers';

// Legacy wildcard exports (deprecated - will be removed in next major version)
export * from './types';
export * from './utils';
