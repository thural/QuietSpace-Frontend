/**
 * Platform-Specific Build Configurations
 * 
 * These configurations are designed for maximum tree-shaking to ensure
 * zero platform-specific code ends up in target bundles.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').BuildConfig} BuildConfig
 * @typedef {import('./types.js').Platform} Platform
 */

/**
 * Web Platform Configuration
 * Optimized for browser environments with web-specific features
 * 
 * @type {BuildConfig}
 */
export const WEB_CONFIG = {
  platform: 'web',
  apiEndpoint: process.env.VITE_API_URL || 'https://api.quietspace.com',
  enableWebSocket: true,
  cacheStrategy: 'hybrid',
  enableRealtimeFeatures: true,
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableBackgroundSync: false, // Web doesn't support true background sync
  bundleOptimization: 'size',
  enableDevTools: process.env.NODE_ENV === 'development',
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
};

/**
 * Mobile Platform Configuration
 * Optimized for mobile apps with mobile-specific features
 * 
 * @type {BuildConfig}
 */
export const MOBILE_CONFIG = {
  platform: 'mobile',
  apiEndpoint: process.env.VITE_API_URL || 'https://api.quietspace.com',
  enableWebSocket: true,
  cacheStrategy: 'persistent',
  enableRealtimeFeatures: true,
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableBackgroundSync: true,
  bundleOptimization: 'performance',
  enableDevTools: process.env.NODE_ENV === 'development',
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
};

/**
 * Desktop Platform Configuration
 * Optimized for desktop applications with desktop-specific features
 * 
 * @type {BuildConfig}
 */
export const DESKTOP_CONFIG = {
  platform: 'desktop',
  apiEndpoint: process.env.VITE_API_URL || 'https://api.quietspace.com',
  enableWebSocket: true,
  cacheStrategy: 'hybrid',
  enableRealtimeFeatures: true,
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableBackgroundSync: true,
  bundleOptimization: 'balanced',
  enableDevTools: process.env.NODE_ENV === 'development',
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
};

/**
 * Server Platform Configuration
 * Optimized for server-side rendering and server applications
 * 
 * @type {BuildConfig}
 */
export const SERVER_CONFIG = {
  platform: 'server',
  apiEndpoint: process.env.VITE_API_URL || 'http://localhost:3000',
  enableWebSocket: false, // Server typically doesn't need WebSocket
  cacheStrategy: 'memory',
  enableRealtimeFeatures: false,
  enableOfflineMode: false,
  enablePushNotifications: false,
  enableBackgroundSync: false,
  bundleOptimization: 'performance',
  enableDevTools: process.env.NODE_ENV === 'development',
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
};

/**
 * Get configuration for specific platform
 * 
 * @param {Platform} platform - Platform type
 * @returns {BuildConfig} Platform-specific configuration
 * @description Returns configuration object for the specified platform
 */
export const getPlatformConfig = (platform) => {
  switch (platform) {
    case 'web':
      return WEB_CONFIG;
    case 'mobile':
      return MOBILE_CONFIG;
    case 'desktop':
      return DESKTOP_CONFIG;
    case 'server':
      return SERVER_CONFIG;
    default:
      return WEB_CONFIG; // Default to web configuration
  }
};

/**
 * Get current platform configuration
 * 
 * @returns {BuildConfig} Current platform configuration
 * @description Returns configuration for the current platform
 */
export const getCurrentConfig = () => {
  // Detect current platform based on environment
  const platform = typeof window !== 'undefined' ? 'web' : 'server';
  return getPlatformConfig(platform);
};
