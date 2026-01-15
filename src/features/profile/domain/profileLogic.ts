/**
 * Profile Business Logic.
 * 
 * Contains pure business logic functions for profile operations.
 * These functions are stateless and can be easily tested.
 */

import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  CompleteProfileEntity
} from "./entities";

/**
 * Check if a user profile is private.
 * 
 * @param {UserProfileEntity} profile - User profile to check
 * @returns {boolean} - Whether profile is private
 */
export const isProfilePrivate = (profile: UserProfileEntity): boolean => {
  return profile.isPrivateAccount;
};

/**
 * Check if a user is verified.
 * 
 * @param {UserProfileEntity} profile - User profile to check
 * @returns {boolean} - Whether user is verified
 */
export const isUserVerified = (profile: UserProfileEntity): boolean => {
  return profile.isVerified;
};

/**
 * Check if a user has a complete profile.
 * 
 * @param {UserProfileEntity} profile - User profile to check
 * @returns {boolean} - Whether profile is complete
 */
export const hasCompleteProfile = (profile: UserProfileEntity): boolean => {
  return !!(
    profile.username &&
    profile.email &&
    profile.bio &&
    profile.photo
  );
};

/**
 * Calculate profile completion percentage.
 * 
 * @param {UserProfileEntity} profile - User profile to analyze
 * @returns {number} - Completion percentage (0-100)
 */
export const getProfileCompletion = (profile: UserProfileEntity): number => {
  const fields = [
    profile.username,
    profile.email,
    profile.bio,
    profile.photo,
    profile.settings
  ];

  const completedFields = fields.filter(field => !!field).length;
  return Math.round((completedFields / fields.length) * 100);
};

/**
 * Check if user can access another user's profile.
 * 
 * @param {ProfileAccessEntity} access - Access control entity
 * @returns {boolean} - Whether access is granted
 */
export const canAccessProfile = (access: ProfileAccessEntity): boolean => {
  return access.hasAccess || access.isOwner;
};

/**
 * Get access denied reason.
 * 
 * @param {ProfileAccessEntity} access - Access control entity
 * @returns {string} - Human-readable reason
 */
export const getAccessDeniedReason = (access: ProfileAccessEntity): string => {
  if (access.isOwner) return "You are the owner";
  if (access.hasAccess) return "Access granted";
  
  switch (access.reason) {
    case 'private':
      return "This account is private";
    case 'blocked':
      return "You are blocked by this user";
    case 'restricted':
      return "This profile has restricted access";
    default:
      return "Access denied";
  }
};

/**
 * Filter active connections.
 * 
 * @param {UserConnectionEntity[]} connections - List of connections
 * @returns {UserConnectionEntity[]} - Active connections only
 */
export const getActiveConnections = (connections: UserConnectionEntity[]): UserConnectionEntity[] => {
  return connections.filter(connection => connection.isFollowing);
};

/**
 * Get mutual connections between two users.
 * 
 * @param {UserConnectionEntity[]} user1Connections - First user's connections
 * @param {UserConnectionEntity[]} user2Connections - Second user's connections
 * @returns {UserConnectionEntity[]} - Mutual connections
 */
export const getMutualConnections = (
  user1Connections: UserConnectionEntity[],
  user2Connections: UserConnectionEntity[]
): UserConnectionEntity[] => {
  const user1Ids = new Set(user1Connections.map(conn => conn.id));
  return user2Connections.filter(conn => user1Ids.has(conn.id));
};

/**
 * Calculate engagement rate based on stats.
 * 
 * @param {UserProfileStatsEntity} stats - User statistics
 * @returns {number} - Engagement rate percentage
 */
export const calculateEngagementRate = (stats: UserProfileStatsEntity): number => {
  if (stats.followersCount === 0) return 0;
  
  const totalEngagement = stats.likesCount + stats.sharesCount + stats.commentsCount;
  return Math.round((totalEngagement / stats.followersCount) * 100);
};

/**
 * Get profile strength score.
 * 
 * @param {UserProfileEntity} profile - User profile
 * @param {UserProfileStatsEntity} stats - User statistics
 * @returns {number} - Profile strength score (0-100)
 */
export const getProfileStrength = (
  profile: UserProfileEntity,
  stats: UserProfileStatsEntity
): number => {
  const completionScore = getProfileCompletion(profile);
  const engagementScore = Math.min(calculateEngagementRate(stats), 20); // Cap at 20%
  const verificationScore = profile.isVerified ? 10 : 0;
  const activityScore = Math.min((stats.postsCount / 100) * 10, 10); // Cap at 10%
  
  return Math.min(completionScore + engagementScore + verificationScore + activityScore, 100);
};

/**
 * Create profile access entity.
 * 
 * @param {UserProfileEntity} profile - User profile
 * @param {string | number} viewerId - Viewer user ID
 * @param {boolean} isFollowing - Whether viewer is following
 * @returns {ProfileAccessEntity} - Profile access entity
 */
export const createProfileAccess = (
  profile: UserProfileEntity,
  viewerId: string | number,
  isFollowing: boolean
): ProfileAccessEntity => {
  const isOwner = profile.id === viewerId;
  const isPrivate = isProfilePrivate(profile);
  
  let hasAccess = false;
  let reason: ProfileAccessEntity['reason'] = 'allowed';
  
  if (isOwner) {
    hasAccess = true;
    reason = 'allowed';
  } else if (isPrivate && !isFollowing) {
    hasAccess = false;
    reason = 'private';
  } else {
    hasAccess = true;
    reason = 'allowed';
  }
  
  return {
    hasAccess,
    isOwner,
    isFollowing,
    isPrivate,
    reason
  };
};

/**
 * Merge profile data from multiple sources.
 * 
 * @param {UserProfileEntity} profile - Base profile
 * @param {UserProfileStatsEntity} stats - Profile statistics
 * @param {ProfileAccessEntity} access - Access information
 * @param {UserConnectionEntity[]} followers - Followers list
 * @param {UserConnectionEntity[]} followings - Followings list
 * @returns {CompleteProfileEntity} - Complete profile entity
 */
export const createCompleteProfile = (
  profile: UserProfileEntity,
  stats: UserProfileStatsEntity,
  access: ProfileAccessEntity,
  followers: UserConnectionEntity[],
  followings: UserConnectionEntity[]
): CompleteProfileEntity => {
  return {
    profile,
    stats,
    access,
    state: {
      isLoading: false,
      isError: false,
      lastUpdated: new Date(),
      viewFollowers: false,
      viewFollowings: false,
      activeTab: 'posts'
    },
    followers,
    followings
  };
};
