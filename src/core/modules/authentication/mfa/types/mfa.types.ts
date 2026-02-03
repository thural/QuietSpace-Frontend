/**
 * MFA Types Definition
 *
 * Defines shared types for multi-factor authentication system.
 * These types are used across all MFA services and interfaces.
 */

/**
 * MFA method definition
 */
export interface MFAMethod {
    /** Method type identifier */
    type: string;
    /** Display name for the method */
    name: string;
    /** Description of the method */
    description: string;
    /** Icon representation */
    icon: string;
    /** Whether the method is enabled */
    enabled: boolean;
    /** Priority order for method selection */
    priority: number;
    /** Whether setup is required */
    setupRequired: boolean;
}

/**
 * MFA enrollment status
 */
export type MFAEnrollmentStatus = 'pending' | 'active' | 'disabled' | 'revoked';

/**
 * MFA verification status
 */
export type MFAVerificationStatus = 'pending' | 'success' | 'failed' | 'expired';

/**
 * MFA challenge status
 */
export type MFAChallengeStatus = 'pending' | 'completed' | 'failed' | 'expired';

/**
 * Device information for enrollment
 */
export interface DeviceInfo {
    /** Device name */
    name: string;
    /** Device type */
    type: string;
    /** Platform/OS */
    platform: string;
    /** User agent string */
    userAgent?: string;
}

/**
 * Enrollment metadata
 */
export interface EnrollmentMetadata {
    /** When the enrollment was created */
    enrolledAt: number;
    /** When the enrollment was last used */
    lastUsed?: number;
    /** Number of times used */
    usageCount: number;
    /** When the enrollment was verified */
    verifiedAt?: number;
}

/**
 * Base MFA enrollment
 */
export interface BaseMFAEnrollment {
    /** Unique enrollment identifier */
    id: string;
    /** User ID */
    userId: string;
    /** MFA method type */
    method: MFAMethod;
    /** Enrollment status */
    status: MFAEnrollmentStatus;
    /** Device information */
    deviceInfo?: DeviceInfo;
    /** Enrollment metadata */
    metadata: EnrollmentMetadata;
}

/**
 * MFA enrollment
 */
export interface MFAEnrollment extends BaseMFAEnrollment {
    /** Method-specific data */
    methodData: {
        totp?: any;
        sms?: any;
        biometric?: any;
        backupCodes?: any;
        securityKey?: any;
        email?: any;
    };
}

/**
 * MFA verification record
 */
export interface MFAVerification {
    /** Unique verification identifier */
    id: string;
    /** User ID */
    userId: string;
    /** MFA method */
    method: MFAMethod;
    /** Verification status */
    status: MFAVerificationStatus;
    /** Verification code/token */
    code?: string;
    /** Verification timestamp */
    timestamp: number;
    /** Expiration timestamp */
    expiresAt: number;
    /** Number of attempts made */
    attempts: number;
    /** Maximum allowed attempts */
    maxAttempts: number;
}

/**
 * MFA challenge
 */
export interface MFAChallenge {
    /** Unique challenge identifier */
    id: string;
    /** User ID */
    userId: string;
    /** Required methods for this challenge */
    requiredMethods: MFAMethod[];
    /** Challenge status */
    status: MFAChallengeStatus;
    /** Created timestamp */
    createdAt: number;
    /** Expires timestamp */
    expiresAt: number;
    /** Completed verifications */
    completedVerifications: MFAVerification[];
}

/**
 * MFA service configuration
 */
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
}
