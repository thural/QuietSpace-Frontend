/**
 * Profile Test Fixtures.
 * 
 * Pre-defined test data fixtures for Profile feature testing.
 * Provides realistic test data for various scenarios.
 */

import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  CompleteProfileEntity
} from '../../domain';

/**
 * Base user profile fixture.
 */
export const baseUserProfile: UserProfileEntity = {
  id: 'user-123',
  username: 'johndoe',
  email: 'john.doe@example.com',
  bio: 'Software developer passionate about clean code and testing',
  photo: {
    type: 'image',
    id: 'photo-123',
    name: 'profile.jpg',
    url: 'https://example.com/photos/profile.jpg'
  },
  settings: {
    theme: 'dark',
    language: 'en',
    notifications: true
  },
  isPrivateAccount: false,
  isVerified: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z'
};

/**
 * Private user profile fixture.
 */
export const privateUserProfile: UserProfileEntity = {
  ...baseUserProfile,
  id: 'user-456',
  username: 'privateuser',
  email: 'private@example.com',
  bio: 'This is a private account',
  isPrivateAccount: true,
  isVerified: false
};

/**
 * Unverified user profile fixture.
 */
export const unverifiedUserProfile: UserProfileEntity = {
  ...baseUserProfile,
  id: 'user-789',
  username: 'unverified',
  email: 'unverified@example.com',
  isVerified: false
};

/**
 * Base user stats fixture.
 */
export const baseUserStats: UserProfileStatsEntity = {
  postsCount: 42,
  followersCount: 1234,
  followingsCount: 567,
  likesCount: 8901,
  sharesCount: 234,
  commentsCount: 567
};

/**
 * High engagement stats fixture.
 */
export const highEngagementStats: UserProfileStatsEntity = {
  postsCount: 150,
  followersCount: 10000,
  followingsCount: 500,
  likesCount: 50000,
  sharesCount: 5000,
  commentsCount: 15000
};

/**
 * New user stats fixture.
 */
export const newUserStats: UserProfileStatsEntity = {
  postsCount: 0,
  followersCount: 5,
  followingsCount: 10,
  likesCount: 0,
  sharesCount: 0,
  commentsCount: 0
};

/**
 * Base user connection fixture.
 */
export const baseUserConnection: UserConnectionEntity = {
  id: 'connection-123',
  username: 'follower_user',
  bio: 'A follower user',
  photo: {
    type: 'image',
    id: 'photo-456',
    name: 'follower.jpg',
    url: 'https://example.com/photos/follower.jpg'
  },
  isFollowing: true,
  isMutual: true,
  connectedAt: '2024-01-10T12:00:00Z'
};

/**
 * One-way connection fixture.
 */
export const oneWayConnection: UserConnectionEntity = {
  ...baseUserConnection,
  id: 'connection-456',
  username: 'following_user',
  isFollowing: false,
  isMutual: false
};

/**
 * Mutual connection fixture.
 */
export const mutualConnection: UserConnectionEntity = {
  ...baseUserConnection,
  id: 'connection-789',
  username: 'mutual_friend',
  isFollowing: true,
  isMutual: true
};

/**
 * Public profile access fixture.
 */
export const publicProfileAccess: ProfileAccessEntity = {
  hasAccess: true,
  isOwner: false,
  isFollowing: false,
  isPrivate: false,
  reason: 'allowed'
};

/**
 * Private profile access fixture (following).
 */
export const privateFollowingAccess: ProfileAccessEntity = {
  hasAccess: true,
  isOwner: false,
  isFollowing: true,
  isPrivate: true,
  reason: 'allowed'
};

/**
 * Private profile access fixture (blocked).
 */
export const privateBlockedAccess: ProfileAccessEntity = {
  hasAccess: false,
  isOwner: false,
  isFollowing: false,
  isPrivate: true,
  reason: 'private'
};

/**
 * Own profile access fixture.
 */
export const ownProfileAccess: ProfileAccessEntity = {
  hasAccess: true,
  isOwner: true,
  isFollowing: false,
  isPrivate: false,
  reason: 'allowed'
};

/**
 * Complete profile fixture.
 */
export const completeProfile: CompleteProfileEntity = {
  profile: baseUserProfile,
  stats: baseUserStats,
  access: publicProfileAccess,
  state: {
    isLoading: false,
    isError: false,
    lastUpdated: new Date('2024-01-20T14:45:00Z'),
    viewFollowers: false,
    viewFollowings: false,
    activeTab: 'posts'
  },
  followers: [baseUserConnection, mutualConnection],
  followings: [baseUserConnection, oneWayConnection]
};

/**
 * Private complete profile fixture.
 */
export const privateCompleteProfile: CompleteProfileEntity = {
  ...completeProfile,
  profile: privateUserProfile,
  access: privateBlockedAccess,
  followers: [],
  followings: []
};

/**
 * Own complete profile fixture.
 */
export const ownCompleteProfile: CompleteProfileEntity = {
  ...completeProfile,
  access: ownProfileAccess
};

/**
 * Array of all user profile fixtures.
 */
export const allUserProfiles = [
  baseUserProfile,
  privateUserProfile,
  unverifiedUserProfile
];

/**
 * Array of all user stats fixtures.
 */
export const allUserStats = [
  baseUserStats,
  highEngagementStats,
  newUserStats
];

/**
 * Array of all user connection fixtures.
 */
export const allUserConnections = [
  baseUserConnection,
  oneWayConnection,
  mutualConnection
];

/**
 * Array of all profile access fixtures.
 */
export const allProfileAccess = [
  publicProfileAccess,
  privateFollowingAccess,
  privateBlockedAccess,
  ownProfileAccess
];

/**
 * Array of all complete profile fixtures.
 */
export const allCompleteProfiles = [
  completeProfile,
  privateCompleteProfile,
  ownCompleteProfile
];
