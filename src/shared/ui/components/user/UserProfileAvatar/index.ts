/**
 * User Profile Avatar Component Barrel Export
 * 
 * Clean public API for UserProfileAvatar component following
 * enterprise patterns with barrel exports.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

// Component exports
export { UserProfileAvatar, default } from './UserProfileAvatar';

// Interface exports
export type { IUserProfileAvatarProps, IUserProfileAvatarState, UserStatusType } from './interfaces/IUserProfileAvatar';

// Style exports
export {
  avatarContainerStyles,
  avatarImageStyles,
  avatarFallbackStyles,
  statusContainerStyles,
  statusStyles,
  userInfoStyles,
  userNameStyles,
  usernameStyles,
  clickableStyles,
  shapeStyles
} from './styles/UserProfileAvatar.styles';
