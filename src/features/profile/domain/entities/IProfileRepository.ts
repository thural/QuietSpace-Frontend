import { JwtToken } from '@/shared/api/models/common';
import {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity
} from '../entities';

// Re-export entities for convenience
export {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity
};

/**
 * Interface for Profile Repository
 * Defines the contract for profile data access operations
 */
export interface IProfileRepository {
  supportsFollowMutations?: boolean;

  // User profile operations
  getUserProfile(userId: string | number): Promise<UserProfileEntity>;
  getCurrentUserProfile(): Promise<UserProfileEntity>;
  updateUserProfile(userId: string | number, updates: Partial<UserProfileEntity>): Promise<UserProfileEntity>;
  deleteUserProfile(userId: string | number): Promise<void>;

  // User statistics operations
  getUserStats(userId: string | number): Promise<UserProfileStatsEntity>;
  updateUserStats(userId: string | number, stats: Partial<UserProfileStatsEntity>): Promise<UserProfileStatsEntity>;

  // User connections operations
  getUserFollowers(userId: string | number, options?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<UserConnectionEntity[]>;
  getUserFollowings(userId: string | number, options?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<UserConnectionEntity[]>;
  followUser(userId: string | number, targetUserId: string | number): Promise<UserConnectionEntity>;
  unfollowUser(userId: string | number, targetUserId: string | number): Promise<void>;

  // User search and discovery
  searchUsers(query: string, options?: {
    limit?: number;
    offset?: number;
    filters?: Record<string, any>;
  }): Promise<UserProfileEntity[]>;
  getUserSuggestions(userId: string | number, options?: {
    limit?: number;
    type?: 'mutual' | 'popular' | 'new';
  }): Promise<UserProfileEntity[]>;

  // User settings operations
  getUserSettings(userId: string | number): Promise<any>;
  updateUserSettings(userId: string | number, settings: any): Promise<any>;

  // User privacy operations
  getUserPrivacy(userId: string | number): Promise<any>;
  updateUserPrivacy(userId: string | number, privacy: any): Promise<any>;

  // User activity operations
  getUserActivity(userId: string | number, options?: {
    limit?: number;
    offset?: number;
    period?: string;
    type?: string;
  }): Promise<any[]>;

  // User achievements and badges
  getUserAchievements(userId: string | number, options?: {
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  getUserBadges(userId: string | number): Promise<any[]>;

  // User reputation operations
  getUserReputation(userId: string | number): Promise<any>;
  updateUserReputation(userId: string | number, reputation: any): Promise<any>;

  // User engagement operations
  getUserEngagement(userId: string | number, period?: string): Promise<any>;

  // User online status operations
  getUserOnlineStatus(userId: string | number): Promise<any>;
  updateUserOnlineStatus(userId: string | number, status: any): Promise<any>;

  // User profile views operations
  getProfileViews(userId: string | number, period?: string): Promise<any>;
  incrementProfileView(userId: string | number, viewerId?: string | number): Promise<void>;

  // User mutual connections operations
  getMutualConnections(userId1: string | number, userId2: string | number): Promise<UserConnectionEntity[]>;

  // User blocked and muted operations
  getBlockedUsers(userId: string | number, options?: {
    limit?: number;
    offset?: number;
  }): Promise<UserConnectionEntity[]>;
  getMutedUsers(userId: string | number, options?: {
    limit?: number;
    offset?: number;
  }): Promise<UserConnectionEntity[]>;
  blockUser(userId: string | number, targetUserId: string | number): Promise<void>;
  unblockUser(userId: string | number, targetUserId: string | number): Promise<void>;
  muteUser(userId: string | number, targetUserId: string | number): Promise<void>;
  unmuteUser(userId: string | number, targetUserId: string | number): Promise<void>;

  // User profile completion operations
  getProfileCompletion(userId: string | number): Promise<any>;
  updateProfileCompletion(userId: string | number, completion: any): Promise<any>;

  // User verification operations
  getUserVerification(userId: string | number): Promise<any>;
  requestUserVerification(userId: string | number, verificationData: any): Promise<any>;

  // User profile analytics operations
  getProfileAnalytics(userId: string | number, period?: string): Promise<any>;

  // User social links operations
  getUserSocialLinks(userId: string | number): Promise<any>;
  updateUserSocialLinks(userId: string | number, links: any): Promise<any>;

  // User interests and skills operations
  getUserInterests(userId: string | number): Promise<any>;
  updateUserInterests(userId: string | number, interests: any): Promise<any>;
  getUserSkills(userId: string | number): Promise<any>;
  updateUserSkills(userId: string | number, skills: any): Promise<any>;

  // User education and work experience operations
  getUserEducation(userId: string | number): Promise<any>;
  updateUserEducation(userId: string | number, education: any): Promise<any>;
  getUserWorkExperience(userId: string | number): Promise<any>;
  updateUserWorkExperience(userId: string | number, workExperience: any): Promise<any>;

  // User portfolio operations
  getUserPortfolio(userId: string | number, options?: {
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  addPortfolioItem(userId: string | number, item: any): Promise<any>;
  updatePortfolioItem(userId: string | number, itemId: string, item: any): Promise<any>;
  deletePortfolioItem(userId: string | number, itemId: string): Promise<void>;

  // User testimonials and recommendations operations
  getUserTestimonials(userId: string | number, options?: {
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  addTestimonial(userId: string | number, testimonial: any): Promise<any>;
  getUserRecommendations(userId: string | number, options?: {
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  addRecommendation(userId: string | number, recommendation: any): Promise<any>;

  // Batch operations
  batchUpdateProfiles(updates: Array<{ userId: string | number; updates: Partial<UserProfileEntity> }>): Promise<UserProfileEntity[]>;
  batchGetProfiles(userIds: Array<string | number>): Promise<UserProfileEntity[]>;

  // Data cleanup and maintenance
  cleanupOldActivity(olderThan: Date): Promise<number>;
  refreshUserStats(userId: string | number): Promise<UserProfileStatsEntity>;

  // Additional utility methods for testing
  getAllProfiles(): Promise<UserProfileEntity[]>;
  clearAllProfiles(): Promise<void>;

  // Missing methods for Phase 6 implementation
  uploadAvatar(userId: string | number, file: File): Promise<string>;
  uploadCoverPhoto(userId: string | number, file: File): Promise<string>;
  trackUserActivity(userId: string | number, activity: any): Promise<void>;
  updateUserActivityStatus(userId: string | number, status: string): Promise<void>;
  setUserOnlineStatus(userId: string | number, isOnline: boolean): Promise<void>;
  getUserOnlineStatus(userId: string | number): Promise<boolean>;
  getUserActivity(userId: string | number, options?: {
    limit?: number;
    offset?: number;
    type?: string;
  }): Promise<UserActivityData[]>;
  addUserExperience(userId: string | number, experience: Partial<UserWorkExperienceData>): Promise<UserWorkExperienceData>;
  updateUserExperience(userId: string | number, experienceId: string, updates: Partial<UserWorkExperienceData>): Promise<UserWorkExperienceData>;
  removeUserExperience(userId: string | number, experienceId: string): Promise<void>;
  getUserRecentActivity(userId: string | number, limit?: number): Promise<UserActivityData[]>;
}

// Supporting types for enhanced profile management
export interface UserProfileQuery {
  userId?: string | number;
  search?: string;
  limit?: number;
  offset?: number;
  filters?: {
    isVerified?: boolean;
    isActive?: boolean;
    hasProfilePicture?: boolean;
    minFollowers?: number;
    maxFollowers?: number;
    location?: string;
    interests?: string[];
    skills?: string[];
  };
  sortBy?: 'createdAt' | 'updatedAt' | 'followersCount' | 'username';
  sortOrder?: 'asc' | 'desc';
}

export interface UserConnectionQuery {
  userId?: string | number;
  type?: 'followers' | 'followings' | 'mutual';
  search?: string;
  limit?: number;
  offset?: number;
  filters?: {
    isVerified?: boolean;
    isActive?: boolean;
    hasProfilePicture?: boolean;
    location?: string;
    interests?: string[];
  };
  sortBy?: 'createdAt' | 'username' | 'followersCount';
  sortOrder?: 'asc' | 'desc';
}

export interface UserActivityQuery {
  userId?: string | number;
  type?: 'post' | 'comment' | 'like' | 'share' | 'follow' | 'profile_update';
  period?: '1d' | '7d' | '30d' | '90d' | '1y';
  limit?: number;
  offset?: number;
  filters?: {
    contentType?: string;
    isPublic?: boolean;
  };
  sortBy?: 'createdAt' | 'engagement';
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchQuery {
  query: string;
  limit?: number;
  offset?: number;
  filters?: {
    isVerified?: boolean;
    isActive?: boolean;
    hasProfilePicture?: boolean;
    location?: string;
    interests?: string[];
    skills?: string[];
    minFollowers?: number;
    maxFollowers?: number;
    ageRange?: {
      min?: number;
      max?: number;
    };
  };
  sortBy?: 'relevance' | 'createdAt' | 'updatedAt' | 'followersCount' | 'username';
  sortOrder?: 'asc' | 'desc';
}

export interface UserSuggestionQuery {
  userId: string | number;
  type?: 'mutual' | 'popular' | 'new' | 'similar';
  limit?: number;
  offset?: number;
  filters?: {
    excludeFollowed?: boolean;
    excludeBlocked?: boolean;
    location?: string;
    interests?: string[];
    skills?: string[];
  };
}

export interface UserSettingsData {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
    security: boolean;
    mentions: boolean;
    follows: boolean;
    likes: boolean;
    comments: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showBirthdate: boolean;
    allowFollowRequests: boolean;
    allowTagging: boolean;
    allowSearchIndexing: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
    passwordChangeRequired: boolean;
  };
  preferences: {
    autoPlayVideos: boolean;
    showSensitiveContent: boolean;
    enableHighQualityMedia: boolean;
    dataUsage: 'low' | 'medium' | 'high';
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
}

export interface UserPrivacyData {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showBirthdate: boolean;
  showAge: boolean;
  showFollowers: boolean;
  showFollowing: boolean;
  allowFollowRequests: boolean;
  allowTagging: boolean;
  allowSearchIndexing: boolean;
  allowDirectMessages: 'everyone' | 'following' | 'none';
  allowComments: 'everyone' | 'following' | 'none';
  allowMentions: 'everyone' | 'following' | 'none';
  blockedUsers: string[];
  mutedUsers: string[];
  restrictedWords: string[];
}

export interface UserActivityData {
  id: string;
  userId: string | number;
  type: 'post' | 'comment' | 'like' | 'share' | 'follow' | 'profile_update' | 'achievement' | 'verification';
  content?: any;
  metadata?: any;
  createdAt: Date;
  isPublic: boolean;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

export interface UserAchievementData {
  id: string;
  userId: string | number;
  type: string;
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  unlockedAt: Date;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
  isPublic: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadgeData {
  id: string;
  userId: string | number;
  type: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  earnedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  isPublic: boolean;
  category: 'achievement' | 'verification' | 'special' | 'seasonal' | 'custom';
}

export interface UserReputationData {
  userId: string | number;
  score: number;
  level: number;
  rank: string;
  badges: string[];
  achievements: string[];
  contributions: {
    posts: number;
    comments: number;
    likes: number;
    shares: number;
    helpfulVotes: number;
  };
  history: Array<{
    action: string;
    score: number;
    timestamp: Date;
    reason: string;
  }>;
  lastUpdated: Date;
}

export interface UserEngagementData {
  userId: string | number;
  period: string;
  metrics: {
    postsCount: number;
    commentsCount: number;
    likesCount: number;
    sharesCount: number;
    profileViews: number;
    followersGained: number;
    followersLost: number;
    averageEngagementRate: number;
    topPerformingContent: any[];
    peakActivityHours: number[];
    mostUsedHashtags: string[];
  };
  trends: Array<{
    date: Date;
    engagement: number;
    reach: number;
    interactions: number;
  }>;
  lastUpdated: Date;
}

export interface UserOnlineStatusData {
  userId: string | number;
  isOnline: boolean;
  lastSeen: Date;
  currentActivity?: string;
  device?: string;
  location?: string;
  status?: 'online' | 'away' | 'busy' | 'invisible';
  customStatus?: string;
  statusEmoji?: string;
}

export interface ProfileViewData {
  userId: string | number;
  viewerId?: string | number;
  timestamp: Date;
  source?: string;
  device?: string;
  location?: string;
  referrer?: string;
  duration?: number;
}

export interface ProfileCompletionData {
  userId: string | number;
  overallPercentage: number;
  sections: {
    profile: {
      completed: boolean;
      percentage: number;
      fields: string[];
    };
    bio: {
      completed: boolean;
      percentage: number;
      fields: string[];
    };
    photo: {
      completed: boolean;
      percentage: number;
      fields: string[];
    };
    social: {
      completed: boolean;
      percentage: number;
      fields: string[];
    };
    interests: {
      completed: boolean;
      percentage: number;
      fields: string[];
    };
    skills: {
      completed: boolean;
      percentage: number;
      fields: string[];
    };
    education: {
      completed: boolean;
      percentage: number;
      fields: string[];
    };
    work: {
      completed: boolean;
      percentage: number;
      fields: string[];
    };
  };
  suggestions: Array<{
    section: string;
    field: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
  }>;
  lastUpdated: Date;
}

export interface UserVerificationData {
  userId: string | number;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  type: 'basic' | 'premium' | 'business' | 'government';
  badge?: string;
  verifiedAt?: Date;
  expiresAt?: Date;
  documents: Array<{
    type: string;
    url: string;
    uploadedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  verificationDetails: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    socialLinks?: Record<string, string>;
  };
  rejectionReason?: string;
  lastUpdated: Date;
}

export interface ProfileAnalyticsData {
  userId: string | number;
  period: string;
  metrics: {
    profileViews: number;
    uniqueVisitors: number;
    averageTimeOnProfile: number;
    bounceRate: number;
    followersGrowth: number;
    engagementGrowth: number;
    contentPerformance: any[];
    audienceDemographics: any[];
    topTrafficSources: any[];
    peakActivityTimes: number[];
  };
  trends: Array<{
    date: Date;
    views: number;
    visitors: number;
    engagement: number;
    followers: number;
  }>;
  insights: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
    recommendations: string[];
  }>;
  lastUpdated: Date;
}

export interface UserSocialLinkData {
  id: string;
  userId: string | number;
  platform: string;
  url: string;
  username?: string;
  isPublic: boolean;
  isVerified: boolean;
  followers?: number;
  addedAt: Date;
  lastUpdated: Date;
}

export interface UserInterestData {
  id: string;
  userId: string | number;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isPublic: boolean;
  addedAt: Date;
  relatedInterests: string[];
}

export interface UserSkillData {
  id: string;
  userId: string | number;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  isPublic: boolean;
  isVerified: boolean;
  endorsements: Array<{
    userId: string | number;
    name: string;
    timestamp: Date;
  }>;
  addedAt: Date;
  lastUpdated: Date;
}

export interface UserEducationData {
  id: string;
  userId: string | number;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  gpa?: number;
  description?: string;
  isPublic: boolean;
  addedAt: Date;
  lastUpdated: Date;
}

export interface UserWorkExperienceData {
  id: string;
  userId: string | number;
  company: string;
  position: string;
  department?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  achievements?: string[];
  isPublic: boolean;
  addedAt: Date;
  lastUpdated: Date;
}

export interface PortfolioItemData {
  id: string;
  userId: string | number;
  title: string;
  description: string;
  type: 'image' | 'video' | 'article' | 'project' | 'design' | 'code';
  url?: string;
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface TestimonialData {
  id: string;
  userId: string | number;
  authorId: string | number;
  authorName: string;
  authorPhoto?: string;
  content: string;
  rating: number;
  isPublic: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecommendationData {
  id: string;
  userId: string | number;
  authorId: string | number;
  authorName: string;
  authorPhoto?: string;
  content: string;
  relationship: string;
  isPublic: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
