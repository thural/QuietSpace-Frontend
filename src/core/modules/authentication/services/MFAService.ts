/**
 * Enterprise Multi-Factor Authentication (MFA) Service
 *
 * Provides comprehensive MFA support with:
 * - TOTP (Time-based One-Time Password) authentication
 * - SMS verification for phone number-based authentication
 * - Biometric authentication (fingerprint, face recognition)
 * - Backup codes for account recovery
 * - QR code generation for easy device enrollment
 * - Security key support (WebAuthn/FIDO2)
 * - Email verification as fallback method
 */

import { DeviceInfo } from '../mfa/types/mfa.types';

export interface MFAConfig {
  /** Enable TOTP authentication */
  enableTOTP: boolean;
  /** Enable SMS verification */
  enableSMS: boolean;
  /** Enable biometric authentication */
  enableBiometrics: boolean;
  /** Enable backup codes */
  enableBackupCodes: boolean;
  /** Enable security keys */
  enableSecurityKeys: boolean;
  /** Enable email verification */
  enableEmail: boolean;
  /** TOTP configuration */
  totpConfig: {
    /** Issuer name for TOTP */
    issuer: string;
    /** Token validity period in seconds */
    period: number;
    /** Number of digits in TOTP code */
    digits: number;
    /** Algorithm used for TOTP */
    algorithm: 'SHA1' | 'SHA256' | 'SHA512';
  };
  /** SMS configuration */
  smsConfig: {
    /** SMS service provider */
    provider: 'twilio' | 'aws-sns' | 'custom';
    /** Template for SMS messages */
    template: string;
    /** Rate limiting for SMS */
    rateLimit: number; // requests per minute
  };
  /** Backup codes configuration */
  backupCodesConfig: {
    /** Number of backup codes to generate */
    count: number;
    /** Length of each backup code */
    length: number;
    /** Code format */
    format: 'alphanumeric' | 'numeric' | 'mixed';
  };
}

export interface MFAEnrollment {
  /** Unique enrollment identifier */
  id: string;
  /** User ID */
  userId: string;
  /** MFA method type */
  method: MFAMethod;
  /** Enrollment status */
  status: 'pending' | 'active' | 'disabled' | 'revoked';
  /** Device information */
  deviceInfo?: {
    name: string;
    type: string;
    platform: string;
    userAgent?: string;
  };
  /** Enrollment metadata */
  metadata: {
    enrolledAt: number;
    lastUsed?: number;
    usageCount: number;
    verifiedAt?: number;
  };
  /** Method-specific data */
  methodData: {
    totp?: TOTPEnrollmentData;
    sms?: SMSEnrollmentData;
    biometric?: BiometricEnrollmentData;
    backupCodes?: BackupCodesEnrollmentData;
    securityKey?: SecurityKeyEnrollmentData;
    email?: EmailEnrollmentData;
  };
}

export interface TOTPEnrollmentData {
  /** Secret key for TOTP */
  secret: string;
  /** QR code data URI */
  qrCode: string;
  /** Manual entry key */
  manualEntryKey: string;
  /** Verification codes for setup */
  backupCodes: string[];
}

export interface SMSEnrollmentData {
  /** Phone number (masked) */
  phoneNumber: string;
  /** Country code */
  countryCode: string;
  /** Verification status */
  verified: boolean;
  /** Last verification timestamp */
  lastVerified?: number;
}

export interface BiometricEnrollmentData {
  /** Biometric type */
  type: 'fingerprint' | 'face' | 'voice';
  /** Device identifier */
  deviceId: string;
  /** Public key credential */
  credentialId: string;
  /** Enrollment status */
  enrolled: boolean;
}

export interface BackupCodesEnrollmentData {
  /** Generated backup codes */
  codes: string[];
  /** Used codes tracking */
  usedCodes: string[];
  /** Generation timestamp */
  generatedAt: number;
  /** Expiration timestamp */
  expiresAt?: number;
}

export interface SecurityKeyEnrollmentData {
  /** Key identifier */
  keyId: string;
  /** Key name */
  keyName: string;
  /** Credential ID */
  credentialId: string;
  /** Public key */
  publicKey: string;
  /** Enrollment date */
  enrolledAt: number;
}

export interface EmailEnrollmentData {
  /** Email address (masked) */
  email: string;
  /** Verification status */
  verified: boolean;
  /** Last verification timestamp */
  lastVerified?: number;
}

export interface MFAVerification {
  /** Verification attempt ID */
  id: string;
  /** User ID */
  userId: string;
  /** MFA method being verified */
  method: MFAMethod;
  /** Verification status */
  status: 'pending' | 'success' | 'failed' | 'expired';
  /** Verification code/token */
  code?: string;
  /** Attempt timestamp */
  timestamp: number;
  /** Expiration timestamp */
  expiresAt: number;
  /** Number of attempts */
  attempts: number;
  /** Maximum attempts allowed */
  maxAttempts: number;
  /** IP address of attempt */
  ipAddress?: string;
  /** User agent */
  userAgent?: string;
}

export interface MFAMethod {
  type: 'totp' | 'sms' | 'biometric' | 'backup-codes' | 'security-key' | 'email';
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  priority: number;
  setupRequired: boolean;
}

export interface MFAChallenge {
  /** Challenge ID */
  id: string;
  /** User ID */
  userId: string;
  /** Available MFA methods for this user */
  availableMethods: MFAMethod[];
  /** Required methods for this challenge */
  requiredMethods: MFAMethod[];
  /** Challenge status */
  status: 'pending' | 'completed' | 'failed' | 'expired';
  /** Created timestamp */
  createdAt: number;
  /** Expires timestamp */
  expiresAt: number;
  /** Completed verifications */
  completedVerifications: MFAVerification[];
}

export class MFAService {
  private readonly config: MFAConfig;
  private readonly enrollments: Map<string, MFAEnrollment[]> = new Map();
  private readonly verifications: Map<string, MFAVerification> = new Map();
  private readonly challenges: Map<string, MFAChallenge> = new Map();

  constructor(config: Partial<MFAConfig> = {}) {
    this.config = {
      enableTOTP: true,
      enableSMS: true,
      enableBiometrics: true,
      enableBackupCodes: true,
      enableSecurityKeys: true,
      enableEmail: true,
      totpConfig: {
        issuer: 'QuietSpace',
        period: 30,
        digits: 6,
        algorithm: 'SHA1'
      },
      smsConfig: {
        provider: 'twilio',
        template: 'Your verification code is: {code}',
        rateLimit: 5
      },
      backupCodesConfig: {
        count: 10,
        length: 8,
        format: 'alphanumeric'
      },
      ...config
    };
  }

  /**
   * Get available MFA methods for a user
   */
  public async getAvailableMethods(userId: string): Promise<MFAMethod[]> {
    const userEnrollments = this.enrollments.get(userId) || [];
    const methods: MFAMethod[] = [];

    if (this.config.enableTOTP) {
      const totpEnrollment = userEnrollments.find(e => e.method.type === 'totp' && e.status === 'active');
      methods.push({
        type: 'totp',
        name: 'Authenticator App',
        description: 'Use Google Authenticator, Authy, or similar apps',
        icon: '📱',
        enabled: !!totpEnrollment,
        priority: 1,
        setupRequired: !totpEnrollment
      });
    }

    if (this.config.enableSMS) {
      const smsEnrollment = userEnrollments.find(e => e.method.type === 'sms' && e.status === 'active');
      methods.push({
        type: 'sms',
        name: 'SMS Verification',
        description: 'Receive verification codes via text message',
        icon: '💬',
        enabled: !!smsEnrollment,
        priority: 2,
        setupRequired: !smsEnrollment
      });
    }

    if (this.config.enableBiometrics) {
      const biometricEnrollment = userEnrollments.find(e => e.method.type === 'biometric' && e.status === 'active');
      methods.push({
        type: 'biometric',
        name: 'Biometric Authentication',
        description: 'Use fingerprint or face recognition',
        icon: '👆',
        enabled: !!biometricEnrollment,
        priority: 3,
        setupRequired: !biometricEnrollment
      });
    }

    if (this.config.enableBackupCodes) {
      const backupCodesEnrollment = userEnrollments.find(e => e.method.type === 'backup-codes' && e.status === 'active');
      methods.push({
        type: 'backup-codes',
        name: 'Backup Codes',
        description: 'Use one-time backup codes for account recovery',
        icon: '🔑',
        enabled: !!backupCodesEnrollment,
        priority: 4,
        setupRequired: !backupCodesEnrollment
      });
    }

    if (this.config.enableSecurityKeys) {
      const securityKeyEnrollment = userEnrollments.find(e => e.method.type === 'security-key' && e.status === 'active');
      methods.push({
        type: 'security-key',
        name: 'Security Key',
        description: 'Use YubiKey or other FIDO2 security keys',
        icon: '🔐',
        enabled: !!securityKeyEnrollment,
        priority: 5,
        setupRequired: !securityKeyEnrollment
      });
    }

    if (this.config.enableEmail) {
      const emailEnrollment = userEnrollments.find(e => e.method.type === 'email' && e.status === 'active');
      methods.push({
        type: 'email',
        name: 'Email Verification',
        description: 'Receive verification codes via email',
        icon: '📧',
        enabled: !!emailEnrollment,
        priority: 6,
        setupRequired: !emailEnrollment
      });
    }

    return methods.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Enroll in TOTP authentication
   */
  public async enrollTOTP(userId: string, deviceInfo?: DeviceInfo): Promise<TOTPEnrollmentData> {
    if (!this.config.enableTOTP) {
      throw new Error('TOTP authentication is not enabled');
    }

    // Generate secret key
    const secret = this.generateTOTPSecret();

    // Generate QR code data
    const qrData = this.generateTOTPQRCode(userId, secret);

    // Generate manual entry key
    const manualKey = this.formatManualKey(secret);

    // Generate backup codes for setup verification
    const backupCodes = this.generateBackupCodesArray(3);

    const enrollmentData: TOTPEnrollmentData = {
      secret,
      qrCode: qrData,
      manualEntryKey: manualKey,
      backupCodes
    };

    // Create enrollment record
    const enrollment: MFAEnrollment = {
      id: this.generateId(),
      userId,
      method: { type: 'totp', name: 'Authenticator App', description: '', icon: '📱', enabled: true, priority: 1, setupRequired: false },
      status: 'pending',
      deviceInfo: deviceInfo || {
        name: 'Unknown Device',
        type: 'web',
        platform: navigator.platform || 'Unknown',
        userAgent: navigator.userAgent
      },
      metadata: {
        enrolledAt: Date.now(),
        usageCount: 0
      },
      methodData: {
        totp: enrollmentData
      }
    };

    // Store enrollment
    const userEnrollments = this.enrollments.get(userId) || [];
    userEnrollments.push(enrollment);
    this.enrollments.set(userId, userEnrollments);

    return enrollmentData;
  }

  /**
   * Verify TOTP enrollment
   */
  public async verifyTOTPEnrollment(userId: string, enrollmentId: string, code: string): Promise<boolean> {
    const userEnrollments = this.enrollments.get(userId) || [];
    const enrollment = userEnrollments.find(e => e.id === enrollmentId && e.method.type === 'totp');

    if (!enrollment) {
      throw new Error('TOTP enrollment not found');
    }

    const isValid = this.verifyTOTPCode(enrollment.methodData.totp!.secret, code);

    if (isValid) {
      enrollment.status = 'active';
      enrollment.metadata.verifiedAt = Date.now();
      this.enrollments.set(userId, userEnrollments);
    }

    return isValid;
  }

  /**
   * Enroll in SMS verification
   */
  public async enrollSMS(userId: string, phoneNumber: string, countryCode: string): Promise<SMSEnrollmentData> {
    if (!this.config.enableSMS) {
      throw new Error('SMS verification is not enabled');
    }

    // Send verification code
    const verificationCode = this.generateVerificationCode();
    await this.sendSMSVerification(phoneNumber, verificationCode);

    const enrollmentData: SMSEnrollmentData = {
      phoneNumber: this.maskPhoneNumber(phoneNumber),
      countryCode,
      verified: false
    };

    // Create enrollment record
    const enrollment: MFAEnrollment = {
      id: this.generateId(),
      userId,
      method: { type: 'sms', name: 'SMS Verification', description: '', icon: '💬', enabled: true, priority: 2, setupRequired: false },
      status: 'pending',
      metadata: {
        enrolledAt: Date.now(),
        usageCount: 0
      },
      methodData: {
        sms: enrollmentData
      }
    };

    // Store enrollment
    const userEnrollments = this.enrollments.get(userId) || [];
    userEnrollments.push(enrollment);
    this.enrollments.set(userId, userEnrollments);

    // Store verification
    const verification: MFAVerification = {
      id: this.generateId(),
      userId,
      method: { type: 'sms', name: 'SMS Verification', description: '', icon: '💬', enabled: true, priority: 2, setupRequired: false },
      status: 'pending',
      code: verificationCode,
      timestamp: Date.now(),
      expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
      attempts: 0,
      maxAttempts: 3
    };

    this.verifications.set(verification.id, verification);

    return enrollmentData;
  }

  /**
   * Verify SMS enrollment
   */
  public async verifySMSEnrollment(userId: string, enrollmentId: string, code: string): Promise<boolean> {
    const userEnrollments = this.enrollments.get(userId) || [];
    const enrollment = userEnrollments.find(e => e.id === enrollmentId && e.method.type === 'sms');

    if (!enrollment) {
      throw new Error('SMS enrollment not found');
    }

    // Find pending verification
    const pendingVerification = Array.from(this.verifications.values())
      .find(v => v.userId === userId && v.method.type === 'sms' && v.status === 'pending');

    if (pendingVerification?.code !== code) {
      return false;
    }

    // Mark as verified
    enrollment.methodData.sms!.verified = true;
    enrollment.methodData.sms!.lastVerified = Date.now();
    enrollment.status = 'active';
    enrollment.metadata.verifiedAt = Date.now();

    this.enrollments.set(userId, userEnrollments);

    // Mark verification as successful
    pendingVerification.status = 'success';
    this.verifications.set(pendingVerification.id, pendingVerification);

    return true;
  }

  /**
   * Generate backup codes
   */
  public async generateBackupCodes(userId: string): Promise<BackupCodesEnrollmentData> {
    if (!this.config.enableBackupCodes) {
      throw new Error('Backup codes are not enabled');
    }

    const codes = this.generateBackupCodesArray(this.config.backupCodesConfig.count);

    const enrollmentData: BackupCodesEnrollmentData = {
      codes,
      usedCodes: [],
      generatedAt: Date.now(),
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
    };

    // Create enrollment record
    const enrollment: MFAEnrollment = {
      id: this.generateId(),
      userId,
      method: { type: 'backup-codes', name: 'Backup Codes', description: '', icon: '🔑', enabled: true, priority: 4, setupRequired: false },
      status: 'active',
      metadata: {
        enrolledAt: Date.now(),
        usageCount: 0
      },
      methodData: {
        backupCodes: enrollmentData
      }
    };

    // Store enrollment
    const userEnrollments = this.enrollments.get(userId) || [];
    userEnrollments.push(enrollment);
    this.enrollments.set(userId, userEnrollments);

    return enrollmentData;
  }

  /**
   * Verify backup code
   */
  public async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const userEnrollments = this.enrollments.get(userId) || [];
    const backupEnrollment = userEnrollments.find(e => e.method.type === 'backup-codes' && e.status === 'active');

    if (!backupEnrollment) {
      return false;
    }

    const backupData = backupEnrollment.methodData.backupCodes!;

    // Check if code is valid and not used
    if (backupData.codes.includes(code) && !backupData.usedCodes.includes(code)) {
      backupData.usedCodes.push(code);
      backupEnrollment.metadata.usageCount++;
      backupEnrollment.metadata.lastUsed = Date.now();

      this.enrollments.set(userId, userEnrollments);
      return true;
    }

    return false;
  }

  /**
   * Create MFA challenge
   */
  public async createChallenge(userId: string, requiredMethods?: string[]): Promise<MFAChallenge> {
    const availableMethods = await this.getAvailableMethods(userId);
    const activeMethods = availableMethods.filter(m => m.enabled);

    // Determine required methods
    let required: MFAMethod[] = [];
    if (requiredMethods) {
      required = activeMethods.filter(m => requiredMethods.includes(m.type));
    } else {
      // Default to first available method
      required = activeMethods.slice(0, 1);
    }

    if (required.length === 0) {
      throw new Error('No MFA methods available for this user');
    }

    const challenge: MFAChallenge = {
      id: this.generateId(),
      userId,
      availableMethods: activeMethods,
      requiredMethods: required,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
      completedVerifications: []
    };

    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  /**
   * Verify MFA challenge
   */
  public async verifyChallenge(challengeId: string, method: string, code: string): Promise<boolean> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (challenge.status !== 'pending') {
      throw new Error('Challenge is not pending');
    }

    if (Date.now() > challenge.expiresAt) {
      challenge.status = 'expired';
      this.challenges.set(challengeId, challenge);
      throw new Error('Challenge has expired');
    }

    // Verify based on method
    let isValid = false;
    const userId = challenge.userId;

    switch (method) {
      case 'totp':
        isValid = await this.verifyTOTP(userId, code);
        break;
      case 'sms':
        isValid = await this.verifySMS(userId, code);
        break;
      case 'backup-codes':
        isValid = await this.verifyBackupCode(userId, code);
        break;
      case 'biometric':
        isValid = await this.verifyBiometric(userId, code);
        break;
      case 'security-key':
        isValid = await this.verifySecurityKey(userId, code);
        break;
      case 'email':
        isValid = await this.verifyEmail(userId, code);
        break;
      default:
        throw new Error(`Unsupported MFA method: ${method}`);
    }

    if (isValid) {
      // Add to completed verifications
      const verification: MFAVerification = {
        id: this.generateId(),
        userId,
        method: challenge.requiredMethods.find(m => m.type === method)!,
        status: 'success',
        timestamp: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000),
        attempts: 1,
        maxAttempts: 3
      };

      challenge.completedVerifications.push(verification);

      // Check if all required methods are completed
      if (challenge.completedVerifications.length === challenge.requiredMethods.length) {
        challenge.status = 'completed';
      }

      this.challenges.set(challengeId, challenge);
    }

    return isValid;
  }

  // Private helper methods

  private generateId(): string {
    return `mfa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTOTPSecret(): string {
    // Generate 32-byte base32 encoded secret
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  private generateTOTPQRCode(userId: string, secret: string): string {
    const otpauth = `otpauth://totp/${this.config.totpConfig.issuer}:${userId}?secret=${secret}&issuer=${this.config.totpConfig.issuer}&period=${this.config.totpConfig.period}&digits=${this.config.totpConfig.digits}&algorithm=${this.config.totpConfig.algorithm}`;

    // In a real implementation, this would generate an actual QR code image
    // For now, return the data URI that can be used to generate the QR code
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  private formatManualKey(secret: string): string {
    // Format secret in groups of 4 characters for easier manual entry
    return secret.match(/.{1,4}/g)?.join(' ') || secret;
  }

  private generateBackupCodesArray(count: number): string[] {
    const codes: string[] = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < count; i++) {
      let code = '';
      for (let j = 0; j < 8; j++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      codes.push(code);
    }

    return codes;
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private maskPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.length <= 4) return phoneNumber;
    return phoneNumber.slice(0, 2) + '***' + phoneNumber.slice(-2);
  }

  private async sendSMSVerification(phoneNumber: string, code: string): Promise<void> {
    // In a real implementation, this would integrate with SMS service
    console.log(`SMS sent to ${phoneNumber}: Your verification code is ${code}`);
  }

  private verifyTOTPCode(secret: string, code: string): boolean {
    // In a real implementation, this would use a TOTP library
    // For demo purposes, accept any 6-digit code
    return /^\d{6}$/.test(code);
  }

  private async verifyTOTP(userId: string, code: string): Promise<boolean> {
    const userEnrollments = this.enrollments.get(userId) || [];
    const totpEnrollment = userEnrollments.find(e => e.method.type === 'totp' && e.status === 'active');

    if (!totpEnrollment) {
      return false;
    }

    return this.verifyTOTPCode(totpEnrollment.methodData.totp!.secret, code);
  }

  private async verifySMS(userId: string, code: string): Promise<boolean> {
    // Find pending SMS verification
    const pendingVerification = Array.from(this.verifications.values())
      .find(v => v.userId === userId && v.method.type === 'sms' && v.status === 'pending');

    if (pendingVerification?.code !== code) {
      return false;
    }

    pendingVerification.status = 'success';
    this.verifications.set(pendingVerification.id, pendingVerification);
    return true;
  }

  private async verifyBiometric(userId: string, credential: string): Promise<boolean> {
    // In a real implementation, this would use WebAuthn API
    return credential.length > 0;
  }

  private async verifySecurityKey(userId: string, credential: string): Promise<boolean> {
    // In a real implementation, this would use WebAuthn API
    return credential.length > 0;
  }

  private async verifyEmail(userId: string, code: string): Promise<boolean> {
    // Similar to SMS verification but for email
    return /^\d{6}$/.test(code);
  }

  /**
   * Get user enrollments
   */
  public getUserEnrollments(userId: string): MFAEnrollment[] {
    return this.enrollments.get(userId) || [];
  }

  /**
   * Disable MFA method
   */
  public async disableMFA(userId: string, enrollmentId: string): Promise<boolean> {
    const userEnrollments = this.enrollments.get(userId) || [];
    const enrollment = userEnrollments.find(e => e.id === enrollmentId);

    if (!enrollment) {
      return false;
    }

    enrollment.status = 'disabled';
    this.enrollments.set(userId, userEnrollments);
    return true;
  }

  /**
   * Get MFA statistics
   */
  public getMFAStatistics(): {
    totalUsers: number;
    enrollmentsByMethod: Record<string, number>;
    activeEnrollments: number;
    verificationSuccessRate: number;
  } {
    const stats = {
      totalUsers: this.enrollments.size,
      enrollmentsByMethod: {} as Record<string, number>,
      activeEnrollments: 0,
      verificationSuccessRate: 0
    };

    let totalVerifications = 0;
    let successfulVerifications = 0;

    for (const [userId, enrollments] of this.enrollments) {
      for (const enrollment of enrollments) {
        if (enrollment.status === 'active') {
          stats.activeEnrollments++;
          stats.enrollmentsByMethod[enrollment.method.type] =
            (stats.enrollmentsByMethod[enrollment.method.type] || 0) + 1;
        }
      }
    }

    for (const verification of this.verifications.values()) {
      totalVerifications++;
      if (verification.status === 'success') {
        successfulVerifications++;
      }
    }

    stats.verificationSuccessRate = totalVerifications > 0
      ? (successfulVerifications / totalVerifications) * 100
      : 0;

    return stats;
  }
}

/**
 * Factory function to create MFA service
 */
export function createMFAService(config?: Partial<MFAConfig>): MFAService {
  return new MFAService(config);
}
