// Feature flags for gradual architecture rollout
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

// Feature flag utilities
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature];
};

export const getEnabledFeatures = (): string[] => {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature);
};

// Development utilities
export const setFeatureFlag = (feature: keyof typeof FEATURE_FLAGS, value: string): void => {
  if (process.env.NODE_ENV === 'development') {
    process.env[`REACT_APP_${feature.toUpperCase()}`] = value;
  }
};
