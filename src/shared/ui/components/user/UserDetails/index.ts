/**
 * UserDetails Component Barrel Export
 * 
 * Clean public API for the UserDetails component following
 * enterprise patterns with barrel exports.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

// Component exports
export { default as UserDetails } from './UserDetails';

// Interface exports
export type { IUserDetailsProps, IUserDetailsState } from './interfaces/IUserDetails';

// Style exports
export {
  userDetailsContainerStyles,
  userNameStyles,
  userEmailStyles,
  userDetailsWrapperStyles,
  userDetailsResponsiveStyles,
  userDetailsScaleStyles,
  userDetailsAnimationStyles
} from './styles/UserDetails.styles';
