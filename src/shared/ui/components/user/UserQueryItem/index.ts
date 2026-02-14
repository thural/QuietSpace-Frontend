/**
 * User Query Item Component Barrel Export
 * 
 * Clean public API for UserQueryItem component following
 * enterprise patterns with barrel exports.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

// Component exports
export { default as UserQueryItem } from './UserQueryItem';

// Interface exports
export type { IUserQueryItemProps, IUserQueryItemState } from './interfaces/IUserQueryItem';

// Style exports
export {
  userQueryItemContainerStyles,
  avatarContainerStyles,
  detailsContainerStyles,
  loadingStyles,
  disabledStyles,
  responsiveStyles
} from './styles/UserQueryItem.styles';
