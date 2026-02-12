/**
 * Styled Components Performance Utilities.
 *
 * Legacy file maintained for backward compatibility.
 * All functionality has been moved to shared UI utilities.
 *
 * @deprecated Import from @/shared/ui/utils instead:
 * - createStyledComponent → @/shared/ui/utils/styledFactory
 * - media → @/shared/ui/utils/mediaQueries
 * - animations → @/shared/ui/utils/animations
 * - useResponsiveStyles → @/core/hooks/ui/theme
 */

// Re-export from new shared UI locations for backward compatibility
export { createStyledComponent } from '../../../../../shared/ui/utils/styledFactory';
export { media } from '../../../../../shared/ui/utils/mediaQueries';
export { animations } from '../../../../../shared/ui/utils/animations';
export { useResponsiveStyles } from '../../hooks/ui/theme';

// NOTE: UI components have been moved to shared/ui/components
// Container, FlexContainer, GridContainer → @/shared/ui/components/layout
// StyledButton → @/shared/ui/components/forms
