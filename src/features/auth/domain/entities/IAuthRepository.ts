import { AuthRequest, AuthResponse, RefreshTokenResponse, RegisterRequest } from '@auth/data/models/auth';

/**
 * Interface for Auth Repository
 * Defines the contract for authentication data access operations
 */
export interface IAuthRepository {
  // Core authentication operations
  login(body: AuthRequest): Promise<AuthResponse>;
  logout(): Promise<Response>;
  refreshToken(): Promise<RefreshTokenResponse>;
  
  // User registration and activation
  signup(body: RegisterRequest): Promise<Response>;
  activateAccount(code: string): Promise<Response>;
  resendCode(email: string): Promise<Response>;
  
  // User session management
  getUserSessions(userId: string): Promise<UserSession[]>;
  revokeSession(sessionId: string): Promise<void>;
  revokeAllSessions(userId: string): Promise<void>;
  
  // Security operations
  getLoginAttempts(email: string): Promise<LoginAttempt[]>;
  recordLoginAttempt(email: string, success: boolean, ip?: string): Promise<void>;
  getSecurityEvents(userId: string): Promise<SecurityEvent[]>;
  
  // User profile and preferences
  getUserProfile(userId: string): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  getUserPermissions(userId: string): Promise<string[]>;
  getUserRoles(userId: string): Promise<string[]>;
  
  // Device management
  getUserDevices(userId: string): Promise<UserDevice[]>;
  registerDevice(userId: string, device: DeviceInfo): Promise<UserDevice>;
  revokeDevice(deviceId: string): Promise<void>;
  
  // Two-factor authentication
  getTwoFactorStatus(userId: string): Promise<TwoFactorStatus>;
  enableTwoFactor(userId: string): Promise<TwoFactorSetup>;
  verifyTwoFactor(userId: string, code: string): Promise<boolean>;
  disableTwoFactor(userId: string, code: string): Promise<void>;
  
  // Rate limiting
  checkRateLimit(identifier: string, action: string): Promise<RateLimitResult>;
  recordRateLimitHit(identifier: string, action: string): Promise<void>;
  
  // Audit and logging
  getAuditLog(userId: string, limit?: number): Promise<AuditEntry[]>;
  recordActivity(userId: string, activity: ActivityEntry): Promise<void>;
}

// Supporting types
export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
}

export interface LoginAttempt {
  email: string;
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  type: SecurityEventType;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export type SecurityEventType = 
  | 'login_success'
  | 'login_failure'
  | 'password_change'
  | 'email_change'
  | 'device_added'
  | 'device_removed'
  | 'suspicious_activity'
  | 'account_locked'
  | 'account_unlocked';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
}

export interface UserSettings {
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLastSeen: boolean;
  };
  security: {
    sessionTimeout: number;
    requireReauth: boolean;
    ipWhitelist: string[];
  };
}

export interface UserDevice {
  id: string;
  userId: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  platform: string;
  browser?: string;
  isTrusted: boolean;
  lastUsedAt: Date;
  createdAt: Date;
}

export interface DeviceInfo {
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  platform: string;
  browser?: string;
  userAgent: string;
  fingerprint?: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
  method: 'sms' | 'email' | 'app' | 'backup';
  backupCodesCount: number;
  lastUsed?: Date;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  limit: number;
  windowMs: number;
}

export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, any>;
}

export interface ActivityEntry {
  userId: string;
  action: string;
  resource?: string;
  details?: Record<string, any>;
  timestamp: Date;
}
