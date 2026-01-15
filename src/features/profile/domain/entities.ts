/**
 * User Profile Entity.
 * 
 * Represents the core user profile data structure
 * with all essential user information.
 */
export interface UserProfileEntity {
  id: string | number;
  username: string;
  email: string;
  bio?: string;
  photo?: {
    type: string;
    id: string | number;
    name: string;
    url: string;
  };
  settings?: {
    theme: string;
    language: string;
    notifications: boolean;
  };
  isPrivateAccount: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Profile Stats Entity.
 * 
 * Represents user statistics and counts
 * for profile display.
 */
export interface UserProfileStatsEntity {
  postsCount: number;
  followersCount: number;
  followingsCount: number;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
}

/**
 * User Connection Entity.
 * 
 * Represents a user connection (follower/following)
 * with relationship information.
 */
export interface UserConnectionEntity {
  id: string | number;
  username: string;
  bio?: string;
  photo?: {
    type: string;
    id: string | number;
    name: string;
    url: string;
  };
  isFollowing: boolean;
  isMutual: boolean;
  connectedAt: string;
}

/**
 * Profile Access Entity.
 * 
 * Represents access control information
 * for user profile viewing.
 */
export interface ProfileAccessEntity {
  hasAccess: boolean;
  isOwner: boolean;
  isFollowing: boolean;
  isPrivate: boolean;
  reason?: 'private' | 'blocked' | 'restricted' | 'allowed';
}

/**
 * Profile State Entity.
 * 
 * Represents the current state of profile
 * operations and UI state.
 */
export interface ProfileStateEntity {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  lastUpdated: Date | null;
  viewFollowers: boolean;
  viewFollowings: boolean;
  activeTab: string;
}

/**
 * Complete Profile Entity.
 * 
 * Combines all profile-related entities
 * into a comprehensive profile structure.
 */
export interface CompleteProfileEntity {
  profile: UserProfileEntity;
  stats: UserProfileStatsEntity;
  access: ProfileAccessEntity;
  state: ProfileStateEntity;
  followers: UserConnectionEntity[];
  followings: UserConnectionEntity[];
}
