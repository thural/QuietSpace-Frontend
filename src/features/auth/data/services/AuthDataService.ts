import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { IAuthRepository, AuthResponse, UserProfile, UserSession, LoginAttempt, SecurityEvent, UserDevice, TwoFactorStatus, TwoFactorSetup, RateLimitResult, AuditEntry, ActivityEntry } from '@features/auth/domain/entities/IAuthRepository';
import { AuthRequest, RefreshTokenResponse, RegisterRequest } from '@auth/data/models/auth';
import { AUTH_CACHE_KEYS, AUTH_CACHE_TTL, AUTH_CACHE_INVALIDATION } from '../cache/AuthCacheKeys';

/**
 * Auth Data Service
 * 
 * Provides intelligent caching and orchestration for authentication data
 * Implements enterprise-grade caching with security-conscious TTL strategies
 */
@Injectable()
export class AuthDataService {
  constructor(
    @Inject(TYPES.CACHE_SERVICE) private cache: CacheService,
    @Inject(TYPES.IAUTH_REPOSITORY) private repository: IAuthRepository
  ) {}

  // Core authentication operations with caching
  async getUserAuth(userId: string): Promise<AuthResponse | null> {
    const cacheKey = AUTH_CACHE_KEYS.USER_AUTH(userId);
    
    // Cache-first lookup with security-conscious TTL
    let data = this.cache.get<AuthResponse>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getUserProfile(userId).then(profile => ({
        userId: profile.id,
        email: profile.email,
        username: profile.username,
        isAuthenticated: true,
        isActive: profile.isActive,
        isVerified: profile.isVerified,
        roles: await this.repository.getUserRoles(userId),
        permissions: await this.repository.getUserPermissions(userId),
        lastLoginAt: profile.lastLoginAt,
        createdAt: profile.createdAt
      } as AuthResponse));
      
      if (data) {
        this.cache.set(cacheKey, data, AUTH_CACHE_TTL.USER_AUTH);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user auth:', error);
      return null;
    }
  }

  async login(credentials: AuthRequest): Promise<AuthResponse> {
    // Record login attempt first
    await this.repository.recordLoginAttempt(credentials.email, false);
    
    try {
      const result = await this.repository.login(credentials);
      
      // Record successful login
      await this.repository.recordLoginAttempt(credentials.email, true);
      
      // Invalidate user-related caches on successful login
      this.cache.invalidatePattern(AUTH_CACHE_KEYS.INVALIDATE_USER(result.userId));
      this.cache.invalidatePattern(AUTH_CACHE_KEYS.LOGIN_ATTEMPTS(credentials.email));
      
      // Cache the new auth data
      const cacheKey = AUTH_CACHE_KEYS.USER_AUTH(result.userId);
      this.cache.set(cacheKey, result, AUTH_CACHE_TTL.USER_AUTH);
      
      return result;
    } catch (error) {
      // Login failed - increment attempt counter
      const attemptsKey = AUTH_CACHE_KEYS.LOGIN_ATTEMPTS(credentials.email);
      const currentAttempts = this.cache.get<number>(attemptsKey) || 0;
      this.cache.set(attemptsKey, currentAttempts + 1, AUTH_CACHE_TTL.LOGIN_ATTEMPTS);
      
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.repository.logout();
      
      // Note: In a real implementation, we'd need the userId to invalidate specific caches
      // For now, we'll clear all auth-related caches
      this.cache.invalidatePattern('auth:*');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const result = await this.repository.refreshToken();
      
      // Invalidate token caches
      this.cache.invalidatePattern('auth:tokens:*');
      
      return result;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // User registration and activation
  async signup(userData: RegisterRequest): Promise<void> {
    try {
      await this.repository.signup(userData);
      
      // Clear any existing caches for this email
      this.cache.invalidatePattern(`auth:attempts:${userData.email}*`);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async activateAccount(code: string): Promise<void> {
    try {
      await this.repository.activateAccount(code);
      
      // Clear activation-related caches
      this.cache.invalidatePattern('auth:activation:*');
    } catch (error) {
      console.error('Account activation error:', error);
      throw error;
    }
  }

  async resendCode(email: string): Promise<void> {
    try {
      await this.repository.resendCode(email);
      
      // Update rate limiting for resend attempts
      const rateLimitKey = AUTH_CACHE_KEYS.RATE_LIMIT(email, 'resend_code');
      const currentHits = this.cache.get<number>(rateLimitKey) || 0;
      this.cache.set(rateLimitKey, currentHits + 1, AUTH_CACHE_TTL.RATE_LIMIT);
    } catch (error) {
      console.error('Resend code error:', error);
      throw error;
    }
  }

  // User session management
  async getUserSessions(userId: string): Promise<UserSession[]> {
    const cacheKey = AUTH_CACHE_KEYS.ACTIVE_SESSIONS(userId);
    
    let sessions = this.cache.get<UserSession[]>(cacheKey);
    if (sessions) return sessions;
    
    try {
      sessions = await this.repository.getUserSessions(userId);
      this.cache.set(cacheKey, sessions, AUTH_CACHE_TTL.USER_SESSION);
      return sessions;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    try {
      await this.repository.revokeSession(sessionId);
      
      // Invalidate session caches
      this.cache.invalidatePattern(AUTH_CACHE_KEYS.INVALIDATE_SESSIONS(userId));
    } catch (error) {
      console.error('Error revoking session:', error);
      throw error;
    }
  }

  async revokeAllSessions(userId: string): Promise<void> {
    try {
      await this.repository.revokeAllSessions(userId);
      
      // Invalidate all session-related caches
      this.cache.invalidatePattern(AUTH_CACHE_KEYS.INVALIDATE_SESSIONS(userId));
    } catch (error) {
      console.error('Error revoking all sessions:', error);
      throw error;
    }
  }

  // Security operations
  async getLoginAttempts(email: string): Promise<LoginAttempt[]> {
    const cacheKey = AUTH_CACHE_KEYS.LOGIN_ATTEMPTS(email);
    
    let attempts = this.cache.get<LoginAttempt[]>(cacheKey);
    if (attempts) return attempts;
    
    try {
      attempts = await this.repository.getLoginAttempts(email);
      this.cache.set(cacheKey, attempts, AUTH_CACHE_TTL.LOGIN_ATTEMPTS);
      return attempts;
    } catch (error) {
      console.error('Error fetching login attempts:', error);
      return [];
    }
  }

  async getSecurityEvents(userId: string): Promise<SecurityEvent[]> {
    const cacheKey = AUTH_CACHE_KEYS.SECURITY_EVENTS(userId);
    
    let events = this.cache.get<SecurityEvent[]>(cacheKey);
    if (events) return events;
    
    try {
      events = await this.repository.getSecurityEvents(userId);
      this.cache.set(cacheKey, events, AUTH_CACHE_TTL.SECURITY_EVENTS);
      return events;
    } catch (error) {
      console.error('Error fetching security events:', error);
      return [];
    }
  }

  // User profile and preferences
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const cacheKey = AUTH_CACHE_KEYS.USER_PROFILE(userId);
    
    let profile = this.cache.get<UserProfile>(cacheKey);
    if (profile) return profile;
    
    try {
      profile = await this.repository.getUserProfile(userId);
      this.cache.set(cacheKey, profile, AUTH_CACHE_TTL.USER_PROFILE);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const result = await this.repository.updateUserProfile(userId, updates);
      
      // Invalidate profile-related caches
      this.cache.invalidatePattern(AUTH_CACHE_KEYS.INVALIDATE_USER(userId));
      
      // Cache the updated profile
      const cacheKey = AUTH_CACHE_KEYS.USER_PROFILE(userId);
      this.cache.set(cacheKey, result, AUTH_CACHE_TTL.USER_PROFILE);
      
      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const cacheKey = AUTH_CACHE_KEYS.USER_PERMISSIONS(userId);
    
    let permissions = this.cache.get<string[]>(cacheKey);
    if (permissions) return permissions;
    
    try {
      permissions = await this.repository.getUserPermissions(userId);
      this.cache.set(cacheKey, permissions, AUTH_CACHE_TTL.USER_PERMISSIONS);
      return permissions;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const cacheKey = AUTH_CACHE_KEYS.USER_ROLES(userId);
    
    let roles = this.cache.get<string[]>(cacheKey);
    if (roles) return roles;
    
    try {
      roles = await this.repository.getUserRoles(userId);
      this.cache.set(cacheKey, roles, AUTH_CACHE_TTL.USER_ROLES);
      return roles;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  }

  // Device management
  async getUserDevices(userId: string): Promise<UserDevice[]> {
    const cacheKey = AUTH_CACHE_KEYS.USER_DEVICES(userId);
    
    let devices = this.cache.get<UserDevice[]>(cacheKey);
    if (devices) return devices;
    
    try {
      devices = await this.repository.getUserDevices(userId);
      this.cache.set(cacheKey, devices, AUTH_CACHE_TTL.USER_DEVICES);
      return devices;
    } catch (error) {
      console.error('Error fetching user devices:', error);
      return [];
    }
  }

  // Two-factor authentication
  async getTwoFactorStatus(userId: string): Promise<TwoFactorStatus> {
    const cacheKey = AUTH_CACHE_KEYS.TWO_FACTOR_STATUS(userId);
    
    let status = this.cache.get<TwoFactorStatus>(cacheKey);
    if (status) return status;
    
    try {
      status = await this.repository.getTwoFactorStatus(userId);
      this.cache.set(cacheKey, status, AUTH_CACHE_TTL.TWO_FACTOR_STATUS);
      return status;
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
      throw error;
    }
  }

  // Rate limiting
  async checkRateLimit(identifier: string, action: string): Promise<RateLimitResult> {
    const cacheKey = AUTH_CACHE_KEYS.RATE_LIMIT(identifier, action);
    
    // Check cache first for rate limit status
    let cached = this.cache.get<RateLimitResult>(cacheKey);
    if (cached && cached.resetTime > new Date()) {
      return cached;
    }
    
    try {
      const result = await this.repository.checkRateLimit(identifier, action);
      this.cache.set(cacheKey, result, AUTH_CACHE_TTL.RATE_LIMIT);
      return result;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      // Default to allowing the request if rate limit check fails
      return {
        allowed: true,
        remaining: 100,
        resetTime: new Date(Date.now() + 60000),
        limit: 100,
        windowMs: 60000
      };
    }
  }

  async recordRateLimitHit(identifier: string, action: string): Promise<void> {
    try {
      await this.repository.recordRateLimitHit(identifier, action);
      
      // Update cache
      const cacheKey = AUTH_CACHE_KEYS.RATE_LIMIT(identifier, action);
      const current = this.cache.get<RateLimitResult>(cacheKey);
      if (current) {
        const updated = {
          ...current,
          remaining: Math.max(0, current.remaining - 1)
        };
        this.cache.set(cacheKey, updated, AUTH_CACHE_TTL.RATE_LIMIT);
      }
    } catch (error) {
      console.error('Error recording rate limit hit:', error);
    }
  }

  // Audit and logging
  async getAuditLog(userId: string, limit?: number): Promise<AuditEntry[]> {
    const cacheKey = AUTH_CACHE_KEYS.AUDIT_LOG(userId);
    
    // Audit logs change frequently, so use shorter TTL
    let auditLog = this.cache.get<AuditEntry[]>(cacheKey);
    if (auditLog) return auditLog;
    
    try {
      auditLog = await this.repository.getAuditLog(userId, limit);
      this.cache.set(cacheKey, auditLog, AUTH_CACHE_TTL.AUDIT_LOG);
      return auditLog;
    } catch (error) {
      console.error('Error fetching audit log:', error);
      return [];
    }
  }

  async recordActivity(userId: string, activity: ActivityEntry): Promise<void> {
    try {
      await this.repository.recordActivity(userId, activity);
      
      // Invalidate activity cache
      this.cache.invalidatePattern(AUTH_CACHE_KEYS.ACTIVITY_LOG(userId));
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  }

  // Cache management utilities
  invalidateUserCaches(userId: string): void {
    const patterns = AUTH_CACHE_INVALIDATION.invalidateAllUser(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  invalidateSecurityCaches(userId: string): void {
    const patterns = AUTH_CACHE_INVALIDATION.invalidateSecurity(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  invalidateSessionCaches(userId: string): void {
    const patterns = AUTH_CACHE_INVALIDATION.invalidateSessions(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }
}
