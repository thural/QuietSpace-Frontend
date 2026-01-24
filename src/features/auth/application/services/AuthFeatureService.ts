import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { AuthDataService } from '../services/AuthDataService';
import { AuthRequest, RefreshTokenResponse, RegisterRequest } from '@auth/data/models/auth';
import { AuthResponse, UserProfile, UserSession, LoginAttempt, SecurityEvent, UserDevice, DeviceInfo, TwoFactorSetup, ActivityEntry } from '@features/auth/domain/entities/IAuthRepository';
import { AUTH_CACHE_KEYS } from '../cache/AuthCacheKeys';

/**
 * Auth Feature Service
 * 
 * Implements business logic and orchestration for authentication features
 * Provides validation, security checks, and cross-service coordination
 */
@Injectable()
export class AuthFeatureService {
  constructor(
    @Inject(TYPES.AUTH_DATA_SERVICE) private authDataService: AuthDataService
  ) {}

  // Authentication business logic
  async authenticateUser(credentials: AuthRequest, ipAddress?: string): Promise<AuthResponse> {
    // Pre-authentication validation
    await this.validateLoginRequest(credentials, ipAddress);
    
    try {
      const result = await this.authDataService.login(credentials);
      
      // Post-authentication business logic
      await this.handleSuccessfulLogin(result.userId, ipAddress);
      
      return result;
    } catch (error) {
      await this.handleFailedLogin(credentials.email, ipAddress, error);
      throw error;
    }
  }

  async registerUser(userData: RegisterRequest, ipAddress?: string): Promise<void> {
    // Pre-registration validation
    await this.validateRegistrationRequest(userData, ipAddress);
    
    try {
      await this.authDataService.signup(userData);
      
      // Post-registration business logic
      await this.handleSuccessfulRegistration(userData.email, ipAddress);
    } catch (error) {
      await this.handleFailedRegistration(userData.email, ipAddress, error);
      throw error;
    }
  }

  async activateUserAccount(code: string): Promise<void> {
    // Validate activation code format
    if (!code || code.length < 10) {
      throw new Error('Invalid activation code');
    }
    
    await this.authDataService.activateAccount(code);
  }

  async resendActivationCode(email: string): Promise<void> {
    // Rate limiting check
    const rateLimitResult = await this.authDataService.checkRateLimit(email, 'resend_code');
    if (!rateLimitResult.allowed) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000)} seconds`);
    }
    
    await this.authDataService.resendCode(email);
    await this.authDataService.recordRateLimitHit(email, 'resend_code');
  }

  // Enhanced validation methods for enterprise hooks
  async validateLoginCredentials(credentials: any): Promise<boolean> {
    // Comprehensive credential validation
    if (!credentials || typeof credentials !== 'object') {
      return false;
    }
    
    const { email, password } = credentials;
    
    // Email validation
    if (!email || typeof email !== 'string' || !this.isValidEmail(email)) {
      return false;
    }
    
    // Password validation
    if (!password || typeof password !== 'string' || password.length < 8) {
      return false;
    }
    
    // Advanced password strength check
    if (!this.isStrongPassword(password)) {
      return false;
    }
    
    return true;
  }
  
  async sanitizeLoginCredentials(credentials: any): Promise<any> {
    // Sanitize and normalize credentials
    const { email, password, ...otherFields } = credentials;
    
    return {
      email: this.sanitizeEmail(email),
      password: password.trim(), // Don't sanitize password too much
      ...otherFields
    };
  }
  
  async validateSignupData(userData: any): Promise<boolean> {
    // Comprehensive signup data validation
    if (!userData || typeof userData !== 'object') {
      return false;
    }
    
    const { email, password, username, firstName, lastName } = userData;
    
    // Required fields validation
    if (!email || !password || !username || !firstName || !lastName) {
      return false;
    }
    
    // Email validation
    if (!this.isValidEmail(email)) {
      return false;
    }
    
    // Username validation
    if (!this.isValidUsername(username)) {
      return false;
    }
    
    // Name validation
    if (!this.isValidName(firstName) || !this.isValidName(lastName)) {
      return false;
    }
    
    // Password validation
    if (!this.isStrongPassword(password)) {
      return false;
    }
    
    return true;
  }
  
  async sanitizeSignupData(userData: any): Promise<any> {
    // Sanitize and normalize user data
    const { email, password, username, firstName, lastName, ...otherFields } = userData;
    
    return {
      email: this.sanitizeEmail(email),
      password: password.trim(),
      username: this.sanitizeUsername(username),
      firstName: this.sanitizeName(firstName),
      lastName: this.sanitizeName(lastName),
      ...otherFields
    };
  }
  
  // Security utility methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  private sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
  
  private isValidUsername(username: string): boolean {
    // Username: 3-30 chars, alphanumeric + underscores + hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  }
  
  private sanitizeUsername(username: string): string {
    return username.toLowerCase().trim().replace(/[^a-zA-Z0-9_-]/g, '');
  }
  
  private isValidName(name: string): boolean {
    // Name: 1-50 chars, letters + spaces + hyphens + apostrophes
    const nameRegex = /^[a-zA-Z\s'-]{1,50}$/;
    return nameRegex.test(name);
  }
  
  private sanitizeName(name: string): string {
    return name.trim().replace(/[^a-zA-Z\s'-]/g, '');
  }
  
  private isStrongPassword(password: string): boolean {
    // Strong password: 8+ chars, uppercase, lowercase, number, special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  // Session management business logic
  async getUserActiveSessions(userId: string): Promise<UserSession[]> {
    const sessions = await this.authDataService.getUserSessions(userId);
    
    // Filter out expired sessions
    const now = new Date();
    return sessions.filter(session => 
      session.isActive && session.lastActiveAt > new Date(now.getTime() - 24 * 60 * 60 * 1000)
    );
  }

  async revokeUserSession(sessionId: string, userId: string): Promise<void> {
    // Validate session ownership
    const sessions = await this.authDataService.getUserSessions(userId);
    const sessionToRevoke = sessions.find(s => s.id === sessionId);
    
    if (!sessionToRevoke) {
      throw new Error('Session not found');
    }
    
    if (sessionToRevoke.userId !== userId) {
      throw new Error('Unauthorized to revoke this session');
    }
    
    await this.authDataService.revokeSession(sessionId, userId);
    
    // Log session revocation
    await this.authDataService.recordActivity(userId, {
      action: 'session_revoked',
      resource: sessionId,
      details: { revokedAt: new Date() },
      timestamp: new Date()
    });
  }

  async revokeAllUserSessions(userId: string, exceptCurrent?: string): Promise<void> {
    const sessions = await this.authDataService.getUserSessions(userId);
    
    // Revoke all sessions except the current one (if specified)
    const sessionsToRevoke = exceptCurrent 
      ? sessions.filter(s => s.id !== exceptCurrent)
      : sessions;
    
    for (const session of sessionsToRevoke) {
      await this.authDataService.revokeSession(session.id, userId);
    }
    
    // Log mass session revocation
    await this.authDataService.recordActivity(userId, {
      action: 'all_sessions_revoked',
      details: { 
        revokedCount: sessionsToRevoke.length,
        exceptCurrent: exceptCurrent || null
      },
      timestamp: new Date()
    });
  }

  // Security monitoring business logic
  async getSecurityStatus(userId: string): Promise<SecurityStatus> {
    const [loginAttempts, securityEvents, sessions] = await Promise.all([
      this.authDataService.getLoginAttempts(''), // Will need to get by user
      this.authDataService.getSecurityEvents(userId),
      this.authDataService.getUserSessions(userId)
    ]);
    
    // Analyze security status
    const recentFailedLogins = loginAttempts
      .filter(attempt => !attempt.success)
      .filter(attempt => attempt.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .length;
    
    const recentSecurityEvents = securityEvents
      .filter(event => event.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .filter(event => event.severity === 'high' || event.severity === 'critical')
      .length;
    
    const suspiciousSessions = sessions.filter(session => 
      !session.isTrusted && session.lastActiveAt > new Date(Date.now() - 60 * 60 * 1000)
    ).length;
    
    return {
      riskLevel: this.calculateRiskLevel(recentFailedLogins, recentSecurityEvents, suspiciousSessions),
      recentFailedLogins,
      recentSecurityEvents,
      suspiciousSessions,
      lastSecurityScan: new Date()
    };
  }

  async recordSecurityEvent(userId: string, event: Omit<SecurityEvent, 'id' | 'userId' | 'timestamp'>): Promise<void> {
    // This would typically be handled by the repository, but we add business logic here
    const fullEvent: SecurityEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      timestamp: new Date()
    };
    
    // Log the security event
    await this.authDataService.recordActivity(userId, {
      action: 'security_event',
      resource: 'security_monitoring',
      details: {
        eventType: fullEvent.type,
        severity: fullEvent.severity,
        description: fullEvent.description
      },
      timestamp: new Date()
    });
    
    // Invalidate security caches
    this.authDataService.invalidateSecurityCaches(userId);
  }

  // User profile business logic
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    // Validate profile updates
    await this.validateProfileUpdates(updates);
    
    const result = await this.authDataService.updateUserProfile(userId, updates);
    
    // Log profile update
    await this.authDataService.recordActivity(userId, {
      action: 'profile_updated',
      resource: 'user_profile',
      details: { updatedFields: Object.keys(updates) },
      timestamp: new Date()
    });
    
    return result;
  }

  async getUserSecuritySettings(userId: string): Promise<UserSecuritySettings> {
    const profile = await this.authDataService.getUserProfile(userId);
    const twoFactorStatus = await this.authDataService.getTwoFactorStatus(userId);
    const devices = await this.authDataService.getUserDevices(userId);
    
    return {
      twoFactorEnabled: twoFactorStatus.enabled,
      twoFactorMethod: twoFactorStatus.method,
      trustedDevices: devices.filter(d => d.isTrusted).length,
      totalDevices: devices.length,
      sessionTimeout: profile?.settings.security.sessionTimeout || 30,
      requireReauth: profile?.settings.security.requireReauth || false,
      ipWhitelist: profile?.settings.security.ipWhitelist || []
    };
  }

  // Device management business logic
  async registerUserDevice(userId: string, deviceInfo: DeviceInfo): Promise<UserDevice> {
    // Validate device info
    await this.validateDeviceInfo(deviceInfo);
    
    const device = await this.authDataService.repository.registerDevice(userId, deviceInfo);
    
    // Log device registration
    await this.authDataService.recordActivity(userId, {
      action: 'device_registered',
      resource: device.id,
      details: {
        deviceName: device.name,
        deviceType: device.type,
        platform: device.platform
      },
      timestamp: new Date()
    });
    
    return device;
  }

  async revokeUserDevice(deviceId: string, userId: string): Promise<void> {
    // Validate device ownership
    const devices = await this.authDataService.getUserDevices(userId);
    const deviceToRevoke = devices.find(d => d.id === deviceId);
    
    if (!deviceToRevoke) {
      throw new Error('Device not found');
    }
    
    if (deviceToRevoke.userId !== userId) {
      throw new Error('Unauthorized to revoke this device');
    }
    
    await this.authDataService.repository.revokeDevice(deviceId);
    
    // Log device revocation
    await this.authDataService.recordActivity(userId, {
      action: 'device_revoked',
      resource: deviceId,
      details: {
        deviceName: deviceToRevoke.name,
        deviceType: deviceToRevoke.type
      },
      timestamp: new Date()
    });
  }

  // Two-factor authentication business logic
  async enableUserTwoFactor(userId: string): Promise<TwoFactorSetup> {
    const currentStatus = await this.authDataService.getTwoFactorStatus(userId);
    
    if (currentStatus.enabled) {
      throw new Error('Two-factor authentication is already enabled');
    }
    
    const setup = await this.authDataService.repository.enableTwoFactor(userId);
    
    // Log 2FA enablement
    await this.authDataService.recordActivity(userId, {
      action: '2fa_enabled',
      resource: 'user_security',
      details: { method: setup.method },
      timestamp: new Date()
    });
    
    return setup;
  }

  async verifyTwoFactorSetup(userId: string, code: string): Promise<boolean> {
    const isValid = await this.authDataService.repository.verifyTwoFactor(userId, code);
    
    if (isValid) {
      // Log successful 2FA verification
      await this.authDataService.recordActivity(userId, {
        action: '2fa_verified',
        resource: 'user_security',
        details: { verifiedAt: new Date() },
        timestamp: new Date()
      });
    }
    
    return isValid;
  }

  async disableUserTwoFactor(userId: string, code: string): Promise<void> {
    const currentStatus = await this.authDataService.getTwoFactorStatus(userId);
    
    if (!currentStatus.enabled) {
      throw new Error('Two-factor authentication is not enabled');
    }
    
    await this.authDataService.repository.disableTwoFactor(userId, code);
    
    // Log 2FA disablement
    await this.authDataService.recordActivity(userId, {
      action: '2fa_disabled',
      resource: 'user_security',
      details: { disabledAt: new Date() },
      timestamp: new Date()
    });
  }

  // Private helper methods
  private async validateLoginRequest(credentials: AuthRequest, ipAddress?: string): Promise<void> {
    // Rate limiting check
    const rateLimitResult = await this.authDataService.checkRateLimit(credentials.email, 'login');
    if (!rateLimitResult.allowed) {
      throw new Error(`Too many login attempts. Try again in ${Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000)} seconds`);
    }
    
    // Check for suspicious activity
    const loginAttempts = await this.authDataService.getLoginAttempts(credentials.email);
    const recentFailures = loginAttempts
      .filter(attempt => !attempt.success)
      .filter(attempt => attempt.timestamp > new Date(Date.now() - 15 * 60 * 1000))
      .length;
    
    if (recentFailures >= 5) {
      throw new Error('Account temporarily locked due to multiple failed attempts');
    }
    
    // IP-based security check
    if (ipAddress) {
      const ipAttempts = loginAttempts
        .filter(attempt => attempt.ipAddress === ipAddress)
        .filter(attempt => !attempt.success)
        .filter(attempt => attempt.timestamp > new Date(Date.now() - 60 * 60 * 1000))
        .length;
      
      if (ipAttempts >= 3) {
        throw new Error('Suspicious activity detected from this IP address');
      }
    }
  }

  private async validateRegistrationRequest(userData: RegisterRequest, ipAddress?: string): Promise<void> {
    // Rate limiting check
    const rateLimitResult = await this.authDataService.checkRateLimit(userData.email, 'register');
    if (!rateLimitResult.allowed) {
      throw new Error(`Too many registration attempts. Try again in ${Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000)} seconds`);
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    // Password strength validation
    if (userData.password && userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  private async validateProfileUpdates(updates: Partial<UserProfile>): Promise<void> {
    // Email validation if being updated
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new Error('Invalid email format');
      }
    }
    
    // Username validation if being updated
    if (updates.username) {
      if (updates.username.length < 3 || updates.username.length > 30) {
        throw new Error('Username must be between 3 and 30 characters');
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(updates.username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }
    }
  }

  private async validateDeviceInfo(deviceInfo: DeviceInfo): Promise<void> {
    if (!deviceInfo.name || deviceInfo.name.trim().length === 0) {
      throw new Error('Device name is required');
    }
    
    if (!['mobile', 'desktop', 'tablet'].includes(deviceInfo.type)) {
      throw new Error('Invalid device type');
    }
  }

  private async handleSuccessfulLogin(userId: string, ipAddress?: string): Promise<void> {
    // Record successful login activity
    await this.authDataService.recordActivity(userId, {
      action: 'login_success',
      resource: 'authentication',
      details: { ipAddress },
      timestamp: new Date()
    });
    
    // Record rate limit hit
    await this.authDataService.recordRateLimitHit(userId, 'login');
    
    // Invalidate user caches
    this.authDataService.invalidateUserCaches(userId);
  }

  private async handleFailedLogin(email: string, ipAddress?: string, error?: any): Promise<void> {
    // Record rate limit hit
    await this.authDataService.recordRateLimitHit(email, 'login');
    
    // Log failed login attempt (would typically be done by repository)
    console.warn(`Failed login attempt for ${email}`, { ipAddress, error: error?.message });
  }

  private async handleSuccessfulRegistration(email: string, ipAddress?: string): Promise<void> {
    // Record rate limit hit
    await this.authDataService.recordRateLimitHit(email, 'register');
    
    // Log successful registration
    console.info(`Successful registration for ${email}`, { ipAddress });
  }

  private async handleFailedRegistration(email: string, ipAddress?: string, error?: any): Promise<void> {
    // Record rate limit hit
    await this.authDataService.recordRateLimitHit(email, 'register');
    
    // Log failed registration attempt
    console.warn(`Failed registration attempt for ${email}`, { ipAddress, error: error?.message });
  }

  private calculateRiskLevel(failedLogins: number, securityEvents: number, suspiciousSessions: number): 'low' | 'medium' | 'high' | 'critical' {
    const riskScore = failedLogins * 2 + securityEvents * 3 + suspiciousSessions * 1;
    
    if (riskScore >= 10) return 'critical';
    if (riskScore >= 6) return 'high';
    if (riskScore >= 3) return 'medium';
    return 'low';
  }
}

// Supporting types
export interface SecurityStatus {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recentFailedLogins: number;
  recentSecurityEvents: number;
  suspiciousSessions: number;
  lastSecurityScan: Date;
}

export interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'app' | 'backup';
  trustedDevices: number;
  totalDevices: number;
  sessionTimeout: number;
  requireReauth: boolean;
  ipWhitelist: string[];
}
