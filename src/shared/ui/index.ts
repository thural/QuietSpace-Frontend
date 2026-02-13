/**
 * QuietSpace UI Library - Central UI Component Library
 * 
 * This is the central entry point for all UI components, styles, and utilities.
 * The UI library provides a comprehensive set of reusable components organized
 * by category for easy discovery and use.
 */

// ====================================================================
// MAIN COMPONENT EXPORTS
// ====================================================================

// Layout Components
export * from './components/layout';

// Form Components  
export * from './components/forms';

// Feedback Components
export * from './components/feedback';

// User Components
export * from './components/user';

// Utility Components
export * from './components/utility';

// Display Components
export * from './components/display';

// Interactive Components
export * from './components/interactive';

// Navigation Components
export * from './components/navigation';

// Typography Components
export * from './components/typography';

// Provider Components (NEW - migrated from core)
export * from './components/providers';

// Social Components (NEW - extracted from features)
export * from './components/social';

// Content Components (NEW - extracted from features)
export * from './components/content';

// Data Display Components (NEW - for future implementation)
export * from './components/data-display';

// ====================================================================
// CORE COMPONENTS
// ====================================================================

// Enterprise Components
export { ComponentLibrary } from './components/ComponentLibrary';
export { TokenRefreshExample } from './components/TokenRefreshExample';
export { TokenRefreshProvider } from './components/TokenRefreshProvider';

// ====================================================================
// STYLES & THEMING
// ====================================================================

// Base Styled Components
export * from './styles/base-simple';

// Component Styles
export * from './styles';

// UI Utilities (NEW - migrated from core)
export * from './utils';

// ====================================================================
// TYPES & INTERFACES
// ====================================================================

// UI Types
export * from './types';

// Component Types
export * from './components/types';

// ====================================================================
// UTILITIES & CONSTANTS
// ====================================================================

// Component Utilities
export * from './components/utils';

// Component Constants
export * from './components/constants';

// ====================================================================
// NAVBAR COMPONENTS
// ====================================================================

export * from './navbar';

// ====================================================================
// PRESENTATION COMPONENTS
// ====================================================================

export * from './presentation';

// ====================================================================
// BUTTON COMPONENTS
// ====================================================================

export * from './buttons';

/**
 * UI Library Version Information
 */
export const UI_LIBRARY_VERSION = '1.0.0';

/**
 * UI Library Metadata
 */
export const UI_LIBRARY_INFO = {
  name: 'QuietSpace UI Library',
  version: UI_LIBRARY_VERSION,
  description: 'Central UI component library for QuietSpace application',
  components: {
    layout: 'Layout and container components',
    forms: 'Form input and control components',
    feedback: 'Loading, error, and feedback components',
    user: 'User profile and avatar components',
    utility: 'Utility and helper components',
    display: 'Display and presentation components',
    interactive: 'Interactive and button components',
    navigation: 'Navigation and menu components',
    typography: 'Text and typography components'
  },
  styles: {
    base: 'Base styled components and themes',
    components: 'Component-specific styles'
  }
};
