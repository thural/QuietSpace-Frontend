/**
 * Multiplatform Configuration Types
 * 
 * Defines platform-specific configuration interfaces for build-time
 * configuration and maximum tree-shaking optimization.
 */

export type Platform = 'web' | 'mobile' | 'desktop' | 'server';

export interface BuildConfig {
  platform: Platform;
  apiEndpoint: string;
  enableWebSocket: boolean;
  cacheStrategy: 'memory' | 'persistent' | 'hybrid';
  enableRealtimeFeatures: boolean;
  enableOfflineMode: boolean;
  enablePushNotifications: boolean;
  enableBackgroundSync: boolean;
  bundleOptimization: 'size' | 'performance' | 'balanced';
  enableDevTools: boolean;
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';
}

export interface PlatformSpecificConfig {
  web: Partial<BuildConfig>;
  mobile: Partial<BuildConfig>;
  desktop: Partial<BuildConfig>;
  server: Partial<BuildConfig>;
}

export interface ServiceRegistration {
  token: string;
  factory: () => any;
  lifetime: 'singleton' | 'transient' | 'scoped';
  platforms?: Platform[];
  condition?: (config: BuildConfig) => boolean;
}

export interface DIContainerConfig {
  services: ServiceRegistration[];
  platformOverrides?: Partial<Record<Platform, ServiceRegistration[]>>;
}
