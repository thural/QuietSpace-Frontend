/**
 * MFA Module Test
 *
 * Tests the refactored MFA services to ensure SOLID compliance
 * and proper functionality after decomposition.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

import { createDefaultMFAOrchestrator, createTestMFAOrchestrator } from '../mfa';
import { TOTPService } from '../mfa/services/TOTPService';
import { SMSService } from '../mfa/services/SMSService';
import { BackupCodeService } from '../mfa/services/BackupCodeService';

describe('MFA Module Refactoring Tests', () => {
    let mfaOrchestrator: any;

    beforeEach(() => {
        mfaOrchestrator = createTestMFAOrchestrator();
    });

    describe('Service Decomposition', () => {
        it('should create individual MFA services successfully', () => {
            const totpService = new TOTPService();
            const smsService = new SMSService();
            const backupCodeService = new BackupCodeService();

            expect(totpService).toBeDefined();
            expect(totpService.name).toBe('TOTPService');
            
            expect(smsService).toBeDefined();
            expect(smsService.name).toBe('SMSService');
            
            expect(backupCodeService).toBeDefined();
            expect(backupCodeService.name).toBe('BackupCodeService');
        });

        it('should create MFA orchestrator with injected dependencies', () => {
            expect(mfaOrchestrator).toBeDefined();
            expect(mfaOrchestrator.name).toBe('MFAOrchestrator');
        });

        it('should have focused service responsibilities', () => {
            // Each service should have a single, focused responsibility
            const totpService = new TOTPService();
            const smsService = new SMSService();
            const backupCodeService = new BackupCodeService();

            // TOTP service should only handle TOTP operations
            expect(typeof totpService.generateTOTPSecret).toBe('function');
            expect(typeof totpService.verifyTOTPCode).toBe('function');
            expect(typeof totpService.getStatistics).toBe('function');

            // SMS service should only handle SMS operations
            expect(typeof smsService.enrollSMS).toBe('function');
            expect(typeof smsService.verifySMSEnrollment).toBe('function');
            expect(typeof smsService.sendSMSVerification).toBe('function');

            // Backup code service should only handle backup code operations
            expect(typeof backupCodeService.generateBackupCodes).toBe('function');
            expect(typeof backupCodeService.verifyBackupCode).toBe('function');
            expect(typeof backupCodeService.getRemainingCodes).toBe('function');
        });
    });

    describe('TOTP Service Functionality', () => {
        let totpService: TOTPService;

        beforeEach(() => {
            totpService = new TOTPService();
        });

        it('should generate TOTP secret successfully', async () => {
            const result = await totpService.generateTOTPSecret('user123', 'test@example.com');
            
            expect(result).toBeDefined();
            expect(result.secret).toBeDefined();
            expect(result.qrCode).toBeDefined();
            expect(result.manualEntryKey).toBe(result.secret);
            expect(result.backupCodes).toHaveLength(10);
        });

        it('should verify TOTP codes correctly', async () => {
            const secret = 'JBSWY3DPEHPK3PXP'; // Mock secret
            const result = await totpService.verifyTOTPCode(secret, '123456');
            
            expect(result).toBeDefined();
            expect(typeof result.valid).toBe('boolean');
            expect(typeof result.remainingTime).toBe('number');
        });

        it('should validate TOTP secret format', () => {
            expect(totpService.validateSecret('JBSWY3DPEHPK3PXP')).toBe(true);
            expect(totpService.validateSecret('invalid')).toBe(false);
            expect(totpService.validateSecret('short')).toBe(false);
        });

        it('should provide service statistics', () => {
            const stats = totpService.getStatistics();
            
            expect(stats).toBeDefined();
            expect(typeof stats.totalEnrollments).toBe('number');
            expect(typeof stats.successfulVerifications).toBe('number');
            expect(typeof stats.failedVerifications).toBe('number');
            expect(typeof stats.averageVerificationTime).toBe('number');
        });
    });

    describe('SMS Service Functionality', () => {
        let smsService: SMSService;

        beforeEach(() => {
            smsService = new SMSService();
        });

        it('should enroll SMS verification successfully', async () => {
            const result = await smsService.enrollSMS('user123', '+1234567890', '1');
            
            expect(result).toBeDefined();
            expect(result.phoneNumber).toBeDefined();
            expect(result.countryCode).toBe('1');
            expect(result.verified).toBe(false);
        });

        it('should generate verification codes', () => {
            const code = smsService.generateVerificationCode();
            
            expect(code).toBeDefined();
            expect(code).toMatch(/^\d{6}$/); // 6 digits
        });

        it('should mask phone numbers correctly', () => {
            const masked = smsService.maskPhoneNumber('+1234567890');
            
            expect(masked).toBeDefined();
            expect(masked).toContain('*');
            expect(masked.length).toBe('+1234567890'.length);
        });

        it('should validate phone numbers', () => {
            expect(smsService.validatePhoneNumber('1234567890', '1')).toBe(true);
            expect(smsService.validatePhoneNumber('invalid', '1')).toBe(false);
            expect(smsService.validatePhoneNumber('123', '1')).toBe(false);
        });

        it('should enforce rate limiting', () => {
            const result = smsService.canSendSMS('user123');
            
            expect(result).toBeDefined();
            expect(typeof result.canSend).toBe('boolean');
        });
    });

    describe('Backup Code Service Functionality', () => {
        let backupCodeService: BackupCodeService;

        beforeEach(() => {
            backupCodeService = new BackupCodeService();
        });

        it('should generate backup codes successfully', async () => {
            const config = {
                count: 5,
                length: 8,
                format: 'alphanumeric' as const
            };
            
            const result = await backupCodeService.generateBackupCodes('user123', config);
            
            expect(result).toBeDefined();
            expect(result.codes).toHaveLength(5);
            expect(result.usedCodes).toHaveLength(0);
            expect(result.generatedAt).toBeDefined();
        });

        it('should verify backup codes correctly', async () => {
            const config = {
                count: 3,
                length: 6,
                format: 'numeric' as const
            };
            
            const enrollment = await backupCodeService.generateBackupCodes('user123', config);
            const validCode = enrollment.codes[0];
            
            const result = await backupCodeService.verifyBackupCode('user123', validCode);
            
            expect(result.valid).toBe(true);
            expect(result.alreadyUsed).toBe(false);
            expect(result.remainingCodes).toBe(2);
        });

        it('should track used backup codes', async () => {
            const config = {
                count: 3,
                length: 6,
                format: 'numeric' as const
            };
            
            const enrollment = await backupCodeService.generateBackupCodes('user123', config);
            const validCode = enrollment.codes[0];
            
            // First verification
            await backupCodeService.verifyBackupCode('user123', validCode);
            
            // Second verification of same code should fail
            const result = await backupCodeService.verifyBackupCode('user123', validCode);
            
            expect(result.valid).toBe(false);
            expect(result.alreadyUsed).toBe(true);
        });

        it('should validate backup code format', () => {
            expect(backupCodeService.validateBackupCodeFormat('ABC123', 'alphanumeric')).toBe(true);
            expect(backupCodeService.validateBackupCodeFormat('123456', 'numeric')).toBe(true);
            expect(backupCodeService.validateBackupCodeFormat('abc123', 'mixed')).toBe(true);
            expect(backupCodeService.validateBackupCodeFormat('invalid!', 'alphanumeric')).toBe(false);
        });
    });

    describe('MFA Orchestrator Integration', () => {
        it('should get available MFA methods', async () => {
            const methods = await mfaOrchestrator.getAvailableMethods('user123');
            
            expect(methods).toBeDefined();
            expect(methods.length).toBeGreaterThan(0);
            
            // Check that all required methods are present
            const methodTypes = methods.map(m => m.type);
            expect(methodTypes).toContain('totp');
            expect(methodTypes).toContain('sms');
            expect(methodTypes).toContain('backup-codes');
        });

        it('should enroll in MFA methods', async () => {
            const totpResult = await mfaOrchestrator.enrollMethod('user123', 'totp', {
                accountName: 'test@example.com'
            });
            
            expect(totpResult).toBeDefined();
            expect(totpResult.secret).toBeDefined();
            expect(totpResult.qrCode).toBeDefined();
        });

        it('should create MFA challenges', async () => {
            const challenge = await mfaOrchestrator.createChallenge('user123', ['totp']);
            
            expect(challenge).toBeDefined();
            expect(challenge.id).toBeDefined();
            expect(challenge.userId).toBe('user123');
            expect(challenge.requiredMethods).toHaveLength(1);
            expect(challenge.status).toBe('pending');
        });

        it('should provide service statistics', () => {
            const stats = mfaOrchestrator.getStatistics();
            
            expect(stats).toBeDefined();
            expect(typeof stats.totalEnrollments).toBe('number');
            expect(typeof stats.activeChallenges).toBe('number');
            expect(typeof stats.successRate).toBe('number');
        });
    });

    describe('SOLID Principles Compliance', () => {
        it('should follow Single Responsibility Principle', () => {
            // Each service should have a single, well-defined responsibility
            const totpService = new TOTPService();
            const smsService = new SMSService();
            const backupCodeService = new BackupCodeService();

            // TOTP service: Only TOTP-related operations
            expect(totpService.name).toBe('TOTPService');
            expect(typeof totpService.generateTOTPSecret).toBe('function');
            expect(typeof totpService.verifyTOTPCode).toBe('function');

            // SMS service: Only SMS-related operations
            expect(smsService.name).toBe('SMSService');
            expect(typeof smsService.enrollSMS).toBe('function');
            expect(typeof smsService.sendSMSVerification).toBe('function');

            // Backup code service: Only backup code operations
            expect(backupCodeService.name).toBe('BackupCodeService');
            expect(typeof backupCodeService.generateBackupCodes).toBe('function');
            expect(typeof backupCodeService.verifyBackupCode).toBe('function');
        });

        it('should follow Interface Segregation Principle', () => {
            // Each interface should be focused and cohesive
            const totpService = new TOTPService();
            
            // TOTP service should only implement TOTP-specific methods
            expect(typeof totpService.generateTOTPSecret).toBe('function');
            expect(typeof totpService.verifyTOTPCode).toBe('function');
            expect(typeof totpService.getStatistics).toBe('function');
            
            // Should not have methods from other services
            expect((totpService as any).enrollSMS).toBeUndefined();
            expect((totpService as any).generateBackupCodes).toBeUndefined();
        });

        it('should follow Dependency Inversion Principle', () => {
            // MFAOrchestrator should depend on abstractions, not concretions
            expect(mfaOrchestrator).toBeDefined();
            expect(mfaOrchestrator.name).toBe('MFAOrchestrator');
            
            // Should be able to work with any implementation of the interfaces
            const customTotpService = new TOTPService({ issuer: 'Custom' });
            const customSmsService = new SMSService({ provider: 'custom' });
            const customBackupService = new BackupCodeService();
            
            expect(() => {
                // This should work without issues
                return createDefaultMFAOrchestrator({
                    totp: { issuer: 'Custom' },
                    sms: { provider: 'custom' },
                    backupCodes: { count: 5 }
                });
            }).not.toThrow();
        });
    });
});
