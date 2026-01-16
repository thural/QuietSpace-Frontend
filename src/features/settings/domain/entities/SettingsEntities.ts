/**
 * Settings Domain Entities.
 * 
 * Defines the core domain entities for settings functionality.
 */

/**
 * Settings Query entity.
 */
export interface SettingsQuery {
    userId: string;
    category: 'profile' | 'privacy' | 'notifications' | 'sharing' | 'mentions' | 'replies' | 'blocking';
    filters?: SettingsFilters;
}

/**
 * Settings Filters entity.
 */
export interface SettingsFilters {
    isActive?: boolean;
    dateRange?: {
        startDate?: string;
        endDate?: string;
    };
    category?: string[];
}

/**
 * Settings Result entity.
 */
export interface SettingsResult {
    data: any;
    metadata: {
        timestamp: string;
        userId: string;
        category: string;
        isUpdated: boolean;
        updateCount: number;
    };
}

/**
 * Profile Settings entity.
 */
export interface ProfileSettings {
    bio: string;
    photo?: string;
    isPrivateAccount: boolean;
    username: string;
    email: string;
    displayName?: string;
}

/**
 * Privacy Settings entity.
 */
export interface PrivacySettings {
    isPrivateAccount: boolean;
    showEmail: boolean;
    showPhone: boolean;
    allowTagging: boolean;
    allowMentions: boolean;
    allowDirectMessages: boolean;
}

/**
 * Notification Settings entity.
 */
export interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    mentionNotifications: boolean;
    followNotifications: boolean;
    likeNotifications: boolean;
    commentNotifications: boolean;
    messageNotifications: boolean;
}

/**
 * Sharing Settings entity.
 */
export interface SharingSettings {
    allowSharing: boolean;
    shareToFacebook: boolean;
    shareToTwitter: boolean;
    shareToInstagram: boolean;
    autoShare: boolean;
}

/**
 * Mentions Settings entity.
 */
export interface MentionsSettings {
    allowMentions: boolean;
    mentionFromFollowersOnly: boolean;
    mentionFromVerifiedOnly: boolean;
    mentionNotifications: boolean;
}

/**
 * Replies Settings entity.
 */
export interface RepliesSettings {
    allowReplies: boolean;
    repliesFromFollowersOnly: boolean;
    repliesFromVerifiedOnly: boolean;
    replyNotifications: boolean;
}

/**
 * Blocking Settings entity.
 */
export interface BlockingSettings {
    blockedUsers: string[];
    mutedUsers: string[];
    blockedWords: string[];
    hideBlockedContent: boolean;
}
