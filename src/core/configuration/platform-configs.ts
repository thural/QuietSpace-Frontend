/**
 * Platform-Specific Build Configurations
 *
 * These configurations are designed for maximum tree-shaking to ensure
 * zero platform-specific code ends up in target bundles.
 */

import type { BuildConfig, Platform } from './types';

/**
 * Web Platform Configuration
 * Optimized for browser environments with web-specific features
 */
export const WEB_CONFIG: BuildConfig = {
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
 */
export const MOBILE_CONFIG: BuildConfig = {
  platform: 'mobile',
  apiEndpoint: process.env.MOBILE_API_URL || 'https://api-mobile.quietspace.com',
  enableWebSocket: true,
  cacheStrategy: 'persistent',
  enableRealtimeFeatures: true,
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableBackgroundSync: true,
  bundleOptimization: 'performance',
  enableDevTools: process.env.NODE_ENV === 'development',
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'warn'
};

/**
 * Desktop Platform Configuration
 * Optimized for desktop applications with desktop-specific features
 */
export const DESKTOP_CONFIG: BuildConfig = {
  platform: 'desktop',
  apiEndpoint: process.env.DESKTOP_API_URL || 'https://api-desktop.quietspace.com',
  enableWebSocket: true,
  cacheStrategy: 'persistent',
  enableRealtimeFeatures: true,
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableBackgroundSync: true,
  bundleOptimization: 'performance',
  enableDevTools: true, // Desktop always has dev tools available
  logLevel: 'info'
};

/**
 * Server Platform Configuration
 * Optimized for server-side rendering and API services
 */
export const SERVER_CONFIG: BuildConfig = {
  platform: 'server',
  apiEndpoint: process.env.SERVER_API_URL || 'http://localhost:3001',
  enableWebSocket: false, // Server doesn't need WebSocket
  cacheStrategy: 'memory',
  enableRealtimeFeatures: false,
  enableOfflineMode: false,
  enablePushNotifications: false,
  enableBackgroundSync: false,
  bundleOptimization: 'performance',
  enableDevTools: false,
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
};

/**
 * Platform Configuration Factory
 * Returns the appropriate configuration based on build target
 */
export function getPlatformConfig(platform?: Platform): BuildConfig {
  const targetPlatform = platform || (process.env.PLATFORM as Platform) || 'web';

  switch (targetPlatform) {
    case 'web':
      return WEB_CONFIG;
    case 'mobile':
      return MOBILE_CONFIG;
    case 'desktop':
      return DESKTOP_CONFIG;
    case 'server':
      return SERVER_CONFIG;
    default:
      console.warn(`Unknown platform: ${targetPlatform}, falling back to web config`);
      return WEB_CONFIG;
  }
}

/**
 * Runtime Platform Detection (for development only)
 * This will be tree-shaken out in production builds
 */
export function detectPlatform(): Platform {
  if (typeof window === 'undefined') {
    return 'server';
  }

  // Check for mobile indicators
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return 'mobile';
  }

  // Check for desktop indicators (Electron, etc.)
  if ((window as any).process?.type === 'renderer') {
    return 'desktop';
  }

  return 'web';
}

/**
 * Build-time Platform Configuration
 * This is resolved at build time for maximum tree-shaking
 */
export const PLATFORM_CONFIG = getPlatformConfig(
  // This will be replaced by build tools with the actual platform
  (process.env.BUILD_TARGET as Platform) || 'web'
);
