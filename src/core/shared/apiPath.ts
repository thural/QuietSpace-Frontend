/**
 * API Path Constants
 * 
 * Centralized API endpoint paths for the application.
 * Following the core architecture pattern for shared constants.
 */

// Base API paths
export const API_PATHS = {
  // Feed/Post endpoints
  POST_URL: '/api/posts',
  COMMENT_PATH: '/api/comments',

  // User endpoints
  USER_URL: '/api/users',
  USER_PATH: '/api/users',
  USER_PROFILE: '/api/users/profile',
  USER_PROFILE_URL: '/api/users/profile',
  PHOTO_PATH: '/api/photos',

  // Authentication endpoints
  AUTH_URL: '/api/auth',
  LOGIN_URL: '/api/auth/login',
  LOGOUT_URL: '/api/auth/logout',
  REGISTER_URL: '/api/auth/register',
  REFRESH_TOKEN_URL: '/api/auth/refresh',

  // Search endpoints
  SEARCH_URL: '/api/search',

  // Notification endpoints
  NOTIFICATION_URL: '/api/notifications',

  // File upload endpoints
  UPLOAD_URL: '/api/upload',

  // Settings endpoints
  SETTINGS_URL: '/api/settings',

  // Chat endpoints
  CHAT_URL: '/api/chat',
  MESSAGE_URL: '/api/messages'
} as const;

// Export individual constants for backward compatibility
export const {
  POST_URL,
  COMMENT_PATH,
  USER_URL,
  USER_PATH,
  USER_PROFILE,
  USER_PROFILE_URL,
  PHOTO_PATH,
  AUTH_URL,
  SEARCH_URL,
  NOTIFICATION_URL,
  UPLOAD_URL,
  SETTINGS_URL,
  CHAT_URL,
  MESSAGE_URL
} = API_PATHS;

// Type definitions for API paths
export type ApiPath = typeof API_PATHS[keyof typeof API_PATHS];

// Default export
export default API_PATHS;
