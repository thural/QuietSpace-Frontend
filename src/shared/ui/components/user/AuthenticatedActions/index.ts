/**
 * Authenticated Actions Component Barrel Export
 * 
 * Clean public API for AuthenticatedActions component following
 * enterprise patterns with barrel exports.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

// Component exports
export { AuthenticatedActions, default } from './AuthenticatedActions';

// Interface exports
export type { IAuthenticatedActionsProps, IAuthenticatedActionsState } from './interfaces/IAuthenticatedActions';

// Style exports
export {
  authenticatedActionsContainerStyles,
  actionButtonStyles,
  actionIconStyles,
  actionLabelStyles,
  loadingStyles,
  responsiveStyles
} from './styles/AuthenticatedActions.styles';
