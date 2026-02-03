/**
 * MFA Factory
 *
 * Factory functions for creating MFA services with proper
 * dependency injection and configuration.
 */

import { TOTPService } from './services/TOTPService';
import { SMSService } from './services/SMSService';
import { BackupCodeService } from './services/BackupCodeService';
import { MFAOrchestrator } from './MFAOrchestrator';

import type { ITOTPService, TOTPConfig } from './interfaces/ITOTPService';
import type { ISMSService, SMSConfig } from './interfaces/ISMSService';
import type { IBackupCodeService, BackupCodesConfig } from './interfaces/IBackupCodeService';
import type { IMFAService } from './interfaces/IMFAService';

/**
 * Default MFA configuration
 */
export const DEFAULT_MFA_CONFIG = {
    totp: {
        issuer: 'QuietSpace',
        period: 30,
        digits: 6,
        algorithm: 'SHA1' as const
    },
    sms: {
        provider: 'twilio' as const,
        template: 'Your verification code is: {code}',
        rateLimit: 5
    },
    backupCodes: {
        count: 10,
        length: 8,
        format: 'alphanumeric' as const
    }
};

/**
 * Creates a default TOTP service
 */
export function createDefaultTOTPService(config?: Partial<TOTPConfig>): ITOTPService {
    return new TOTPService({
        ...DEFAULT_MFA_CONFIG.totp,
        ...config
    });
}

/**
 * Creates a default SMS service
 */
export function createDefaultSMSService(config?: Partial<SMSConfig>): ISMSService {
    return new SMSService({
        ...DEFAULT_MFA_CONFIG.sms,
        ...config
    });
}

/**
 * Creates a default backup code service
 */
export function createDefaultBackupCodeService(config?: Partial<BackupCodesConfig>): IBackupCodeService {
    return new BackupCodeService({
        ...DEFAULT_MFA_CONFIG.backupCodes,
        ...config
    });
}

/**
 * Creates a default MFA orchestrator with all services
 */
export function createDefaultMFAOrchestrator(config?: {
    totp?: Partial<TOTPConfig>;
    sms?: Partial<SMSConfig>;
    backupCodes?: Partial<BackupCodesConfig>;
}): IMFAService {
    const totpService = createDefaultTOTPService(config?.totp);
    const smsService = createDefaultSMSService(config?.sms);
    const backupCodeService = createDefaultBackupCodeService(config?.backupCodes);

    return new MFAOrchestrator(totpService, smsService, backupCodeService);
}

/**
 * Creates a custom MFA orchestrator with provided services
 */
export function createCustomMFAOrchestrator(
    totpService: ITOTPService,
    smsService: ISMSService,
    backupCodeService: IBackupCodeService
): IMFAService {
    return new MFAOrchestrator(totpService, smsService, backupCodeService);
}

/**
 * Creates MFA services for testing
 */
export function createTestMFAOrchestrator(): IMFAService {
    const testConfig = {
        totp: {
            issuer: 'Test-App',
            period: 30,
            digits: 6,
            algorithm: 'SHA1' as const
        },
        sms: {
            provider: 'twilio' as const,
            template: 'Test code: {code}',
            rateLimit: 10 // Higher limit for testing
        },
        backupCodes: {
            count: 5, // Fewer codes for testing
            length: 6,
            format: 'numeric' as const
        }
    };

    return createDefaultMFAOrchestrator(testConfig);
}
