/**
 * Multiplatform Configuration Types
 * 
 * Defines platform-specific configuration interfaces for build-time
 * configuration and maximum tree-shaking optimization.
 */

/**
 * Platform type definition
 * 
 * @typedef {'web'|' mobile'|' desktop'|' server'} Platform
 * @description Available platform types for configuration
 */

/**
 * Build configuration interface
 * 
 * @typedef {Object} BuildConfig
 * @property {Platform} platform - Platform type
 * @property {string} apiEndpoint - API endpoint URL
 * @property {boolean} enableWebSocket - Enable WebSocket connections
 * @property {'memory'|' persistent'|' hybrid'} cacheStrategy - Cache strategy
 * @property {boolean} enableRealtimeFeatures - Enable real-time features
 * @property {boolean} enableOfflineMode - Enable offline mode
 * @property {boolean} enablePushNotifications - Enable push notifications
 * @property {boolean} enableBackgroundSync - Enable background sync
 * @property {'size'|' performance'|' balanced'} bundleOptimization - Bundle optimization level
 * @property {boolean} enableDevTools - Enable developer tools
 * @property {'none'|' error'|' warn'|' info'|' debug'} logLevel - Logging level
 * @description Configuration for build process and runtime behavior
 */

/**
 * Platform-specific configuration interface
 * 
 * @typedef {Object} PlatformSpecificConfig
 * @property {Partial<BuildConfig>} web - Web platform configuration
 * @property {Partial<BuildConfig>} mobile - Mobile platform configuration
 * @property {Partial<BuildConfig>} desktop - Desktop platform configuration
 * @property {Partial<BuildConfig>} server - Server platform configuration
 * @description Platform-specific configuration overrides
 */
