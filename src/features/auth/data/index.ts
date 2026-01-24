// Data layer exports
export { AuthRepository } from './repositories/AuthRepository';
export { AuthDataService } from './services/AuthDataService';

// Cache exports
export { AUTH_CACHE_KEYS, AUTH_CACHE_TTL, AUTH_CACHE_INVALIDATION } from './cache/AuthCacheKeys';

// Types and interfaces
export type { 
  UserSession,
  LoginAttempt,
  SecurityEvent,
  SecurityEventType,
  UserProfile,
  UserPreferences,
  UserSettings,
  UserDevice,
  DeviceInfo,
  TwoFactorStatus,
  TwoFactorSetup,
  RateLimitResult,
  AuditEntry,
  ActivityEntry
} from '../domain/entities/IAuthRepository';
