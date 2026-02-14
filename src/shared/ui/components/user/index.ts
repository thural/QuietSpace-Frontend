/**
 * User Components Index
 * 
 * Exports all user-related UI components from the shared UI library.
 * These components provide reusable user interface elements with enterprise patterns.
 */

// Core user components
export { AuthenticatedActions } from './AuthenticatedActions';
export type { IAuthenticatedActionsProps, IAuthenticatedActionsState } from './AuthenticatedActions';
export { AuthStatus } from './AuthStatus';
export type { IAuthStatusProps, IAuthStatusState, IAuthUser } from './AuthStatus';
export { SecurityStatus } from './SecurityStatus';
export type { ISecurityStatusProps, ISecurityStatusState } from './SecurityStatus';

// New reusable components
export { UserProfileAvatar } from './UserProfileAvatar';
export type { IUserProfileAvatarProps, UserStatusType } from './UserProfileAvatar';
export { UserAvatar } from './UserAvatar';
export { UserAvatarPhoto } from './UserAvatarPhoto';
export { UserCard } from './UserCard';
export { UserDetails } from './UserDetails';
export type { IUserDetailsProps } from './UserDetails';
export { UserQueryItem } from './UserQueryItem';
export type { IUserQueryItemProps } from './UserQueryItem';
export { PhotoDisplay } from './PhotoDisplay';
