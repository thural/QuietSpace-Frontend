// Feature flags for gradual architecture rollout
/**
 * Feature flags object
 * @typedef {Object} FeatureFlags
 * @property {boolean} USE_NEW_ARCHITECTURE - Enable new DI-based architecture
 * @property {boolean} USE_DI_FEED - Enable DI-enabled feed component
 * @property {boolean} USE_DI_CHAT - Enable DI-enabled chat component
 * @property {boolean} USE_DI_PROFILE - Enable DI-enabled profile component
 * @property {boolean} USE_DI_SEARCH - Enable DI-enabled search component
 * @property {boolean} USE_DI_SETTINGS - Enable DI-enabled settings component
 * @property {boolean} USE_DI_NOTIFICATIONS - Enable DI-enabled notifications component
 * @property {boolean} USE_DI_CONTENT - Enable DI-enabled content component
 * @property {boolean} USE_DI_ANALYTICS - Enable DI-enabled analytics component
 * @property {boolean} USE_RESPONSIVE_DESIGN - Enable mobile/wide optimization
 * @property {boolean} USE_MOBILE_OPTIMIZATION - Enable mobile optimization
 * @property {boolean} USE_WIDE_OPTIMIZATION - Enable wide optimization
 * @property {boolean} USE_REAL_TIME_COLLABORATION - Enable real-time collaboration
 * @property {boolean} USE_ADVANCED_SEARCH - Enable advanced search
 * @property {boolean} USE_ANALYTICS_MONITORING - Enable analytics monitoring
 */

export const FEATURE_FLAGS = {
  // Enable new DI-based architecture
  USE_NEW_ARCHITECTURE: process.env.REACT_APP_USE_NEW_ARCHITECTURE === 'true',

  // Enable DI-enabled components
  USE_DI_FEED: process.env.REACT_APP_USE_DI_FEED === 'true',
  USE_DI_CHAT: process.env.REACT_APP_USE_DI_CHAT === 'true',
  USE_DI_PROFILE: process.env.REACT_APP_USE_DI_PROFILE === 'true',
  USE_DI_SEARCH: process.env.REACT_APP_USE_DI_SEARCH === 'true',
  USE_DI_SETTINGS: process.env.REACT_APP_USE_DI_SETTINGS === 'true',
  USE_DI_NOTIFICATIONS: process.env.REACT_APP_USE_DI_NOTIFICATIONS === 'true',
  USE_DI_CONTENT: process.env.REACT_APP_USE_DI_CONTENT === 'true',
  USE_DI_ANALYTICS: process.env.REACT_APP_USE_DI_ANALYTICS === 'true',

  // Enable mobile/wide optimization
  USE_RESPONSIVE_DESIGN: process.env.REACT_APP_USE_RESPONSIVE === 'true',
  USE_MOBILE_OPTIMIZATION: process.env.REACT_APP_USE_MOBILE === 'true',
  USE_WIDE_OPTIMIZATION: process.env.REACT_APP_USE_WIDE === 'true',

  // Enable advanced features
  USE_REAL_TIME_COLLABORATION: process.env.REACT_APP_REAL_TIME === 'true',
  USE_ADVANCED_SEARCH: process.env.REACT_APP_ADVANCED_SEARCH === 'true',
  USE_ANALYTICS_MONITORING: process.env.REACT_APP_ANALYTICS === 'true',
};

/**
 * Check if a feature is enabled
 * 
 * @param {string} feature - Feature name
 * @returns {boolean} Whether feature is enabled
 */
export const isFeatureEnabled = (feature) => {
  return FEATURE_FLAGS[feature];
};

/**
 * Get list of enabled features
 * 
 * @returns {Array<string>} Array of enabled feature names
 */
export const getEnabledFeatures = () => {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature);
};

/**
 * Set feature flag (development only)
 * 
 * @param {string} feature - Feature name
 * @param {string} value - Feature value
 */
export const setFeatureFlag = (feature, value) => {
  if (process.env.NODE_ENV === 'development') {
    process.env[`REACT_APP_${feature.toUpperCase()}`] = value;
  }
};
