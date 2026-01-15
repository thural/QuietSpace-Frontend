/**
 * Profile Repository Interface.
 * 
 * Defines the contract for profile data access operations.
 * This interface enables dependency inversion and testability
 * by providing a clean abstraction for profile data operations.
 */
export interface IProfileRepository {
  /**
   * Get user profile by ID.
   * 
   * @param {string | number} userId - The user ID to fetch profile for
   * @returns {Promise<UserProfileEntity>} - User profile data
   */
  getUserProfile(userId: string | number): Promise<UserProfileEntity>;

  /**
   * Get current user profile.
   * 
   * @returns {Promise<UserProfileEntity>} - Current user profile data
   */
  getCurrentUserProfile(): Promise<UserProfileEntity>;

  /**
   * Get user profile statistics.
   * 
   * @param {string | number} userId - The user ID to fetch stats for
   * @returns {Promise<UserProfileStatsEntity>} - User statistics
   */
  getUserStats(userId: string | number): Promise<UserProfileStatsEntity>;

  /**
   * Get user followers.
   * 
   * @param {string | number} userId - The user ID to fetch followers for
   * @returns {Promise<UserConnectionEntity[]>} - List of followers
   */
  getUserFollowers(userId: string | number): Promise<UserConnectionEntity[]>;

  /**
   * Get user followings.
   * 
   * @param {string | number} userId - The user ID to fetch followings for
   * @returns {Promise<UserConnectionEntity[]>} - List of followings
   */
  getUserFollowings(userId: string | number): Promise<UserConnectionEntity[]>;

  /**
   * Check profile access permissions.
   * 
   * @param {string | number} userId - The user ID to check access for
   * @param {string | number} viewerId - The viewer user ID
   * @returns {Promise<ProfileAccessEntity>} - Access permissions
   */
  getProfileAccess(userId: string | number, viewerId: string | number): Promise<ProfileAccessEntity>;

  /**
   * Update user profile.
   * 
   * @param {string | number} userId - The user ID to update
   * @param {Partial<UserProfileEntity>} updates - Profile updates
   * @returns {Promise<UserProfileEntity>} - Updated profile
   */
  updateProfile(userId: string | number, updates: Partial<UserProfileEntity>): Promise<UserProfileEntity>;

  /**
   * Follow a user.
   * 
   * @param {string | number} userId - The user to follow
   * @returns {Promise<void>} - Follow operation result
   */
  followUser(userId: string | number): Promise<void>;

  /**
   * Unfollow a user.
   * 
   * @param {string | number} userId - The user to unfollow
   * @returns {Promise<void>} - Unfollow operation result
   */
  unfollowUser(userId: string | number): Promise<void>;

  /**
   * Get loading state.
   * 
   * @returns {boolean} - Whether repository is currently loading
   */
  isLoading(): boolean;

  /**
   * Get error state.
   * 
   * @returns {Error | null} - Current error state
   */
  getError(): Error | null;

  /**
   * Clear error state.
   * 
   * @returns {void}
   */
  clearError(): void;
}

/**
 * Profile Service Interface.
 * 
 * Defines the contract for profile business logic operations.
 * This interface encapsulates complex business rules and operations
 * that go beyond simple data access.
 */
export interface IProfileService {
  /**
   * Get complete profile with all related data.
   * 
   * @param {string | number} userId - The user ID to fetch complete profile for
   * @param {string | number} viewerId - The viewer user ID
   * @returns {Promise<CompleteProfileEntity>} - Complete profile data
   */
  getCompleteProfile(userId: string | number, viewerId: string | number): Promise<CompleteProfileEntity>;

  /**
   * Check if current user can view profile.
   * 
   * @param {string | number} userId - The profile owner ID
   * @param {string | number} viewerId - The viewer ID
   * @returns {Promise<boolean>} - Whether viewer can access profile
   */
  canViewProfile(userId: string | number, viewerId: string | number): Promise<boolean>;

  /**
   * Toggle follow/unfollow relationship.
   * 
   * @param {string | number} userId - The user to follow/unfollow
   * @param {boolean} isFollowing - Current follow state
   * @returns {Promise<boolean>} - New follow state
   */
  toggleFollow(userId: string | number, isFollowing: boolean): Promise<boolean>;

  /**
   * Search for users.
   * 
   * @param {string} query - Search query
   * @param {number} limit - Maximum results to return
   * @returns {Promise<UserProfileEntity[]>} - Search results
   */
  searchUsers(query: string, limit?: number): Promise<UserProfileEntity[]>;

  /**
   * Get suggested users to follow.
   * 
   * @param {string | number} userId - The user ID to get suggestions for
   * @param {number} limit - Maximum suggestions to return
   * @returns {Promise<UserProfileEntity[]>} - Suggested users
   */
  getSuggestedUsers(userId: string | number, limit?: number): Promise<UserProfileEntity[]>;
}

// Import entities for type references
import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  ProfileStateEntity,
  CompleteProfileEntity
} from "./entities";
