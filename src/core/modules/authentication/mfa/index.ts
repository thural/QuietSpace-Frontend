/**
 * MFA Module Index
 *
 * Exports all MFA-related components with clean public API.
 * Follows Black Box pattern by exposing only interfaces and factory functions.
 */

// Main MFA service
export { UnifiedMFAOrchestrator } from './UnifiedMFAOrchestrator';
export type { IMFAService } from './interfaces/IMFAService';

// Individual MFA services
export { UnifiedTOTPService } from './services/UnifiedTOTPService';
export { UnifiedSMSService } from './services/UnifiedSMSService';
export { UnifiedBackupCodeService } from './services/UnifiedBackupCodeService';

export type { ITOTPService, TOTPConfig, TOTPEnrollmentData, TOTPVerificationResult } from './interfaces/ITOTPService';
export type { ISMSService, SMSConfig, SMSEnrollmentData, SMSVerificationResult } from './interfaces/ISMSService';
export type { IBackupCodeService, BackupCodesConfig, BackupCodesEnrollmentData, BackupCodeVerificationResult } from './interfaces/IBackupCodeService';

// Types
export type {
    MFAMethod,
    MFAEnrollment,
    MFAVerification,
    MFAChallenge,
    MFAEnrollmentStatus,
    MFAVerificationStatus,
    MFAChallengeStatus,
    DeviceInfo,
    EnrollmentMetadata,
    MFAConfig
} from './types/mfa.types';

// Factory functions
export {
    createDefaultMFAOrchestrator,
    createCustomMFAOrchestrator,
    createDefaultTOTPService,
    createDefaultSMSService,
    createDefaultBackupCodeService,
    createTestMFAOrchestrator,
    DEFAULT_MFA_CONFIG
} from './factory';

// Module information
export const MFA_MODULE_INFO = {
    name: 'Multi-Factor Authentication Module',
    version: '1.0.0',
    description: 'SOLID-compliant MFA with specialized services',
    architecture: 'Service-oriented with interface segregation',
    features: [
        'TOTP authentication',
        'SMS verification',
        'Backup codes',
        'Interface segregation',
        'Single responsibility',
        'Dependency injection',
        'Comprehensive testing support'
    ]
};
