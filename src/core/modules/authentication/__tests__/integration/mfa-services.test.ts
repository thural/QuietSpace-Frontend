/**
 * MFA Services Integration Test
 *
 * Tests the integration between MFAOrchestrator and all MFA services
 * including TOTP, SMS, and Backup Code services.
 */

import { jest } from '@jest/globals';
import { MFAOrchestrator } from '../../mfa/MFAOrchestrator';
import { TOTPService } from '../../mfa/services/TOTPService';
import { SMSService } from '../../mfa/services/SMSService';
import { BackupCodeService } from '../../mfa/services/BackupCodeService';

import type { IMFAService, MFAEnrollment, MFAVerification, MFAChallenge } from '../../mfa';
import type { MFAMethod, MFAConfig } from '../../mfa/types/mfa.types';

describe('MFA Services Integration', () => {
    let mfaOrchestrator: MFAOrchestrator;
    let totpService: TOTPService;
    let smsService: SMSService;
    let backupCodeService: BackupCodeService;

    beforeEach(() => {
        // Create individual MFA services
        totpService = new TOTPService();
        smsService = new SMSService();
        backupCodeService = new BackupCodeService();

        // Create MFA orchestrator with all services
        mfaOrchestrator = new MFAOrchestrator({
            totp: totpService,
            sms: smsService,
            backupCodes: backupCodeService
        });
    });

    describe('Service Integration', () => {
        it('should initialize with all MFA services', () => {
            expect(mfaOrchestrator).toBeDefined();
            expect(mfaOrchestrator.name).toBe('MFAOrchestrator');
        });

        it('should provide all available MFA methods', async () => {
            const methods = await mfaOrchestrator.getAvailableMethods('user123');

            expect(methods).toHaveLength(3);
            
            const methodTypes = methods.map(m => m.type);
            expect(methodTypes).toContain('totp');
            expect(methodTypes).toContain('sms');
            expect(methodTypes).toContain('backup-codes');
        });

        it('should get service statistics from all services', () => {
            const stats = mfaOrchestrator.getStatistics();

            expect(stats).toBeDefined();
            expect(stats.totalEnrollments).toBeDefined();
            expect(stats.activeChallenges).toBeDefined();
            expect(stats.successRate).toBeDefined();
        });
    });

    describe('TOTP Integration', () => {
        it('should enroll in TOTP and verify code', async () => {
            // Enroll in TOTP
            const enrollment = await mfaOrchestrator.enrollMethod('user123', 'totp', {
                accountName: 'test@example.com'
            });

            expect(enrollment.success).toBe(true);
            expect(enrollment.data).toBeDefined();
            expect(enrollment.data?.secret).toBeDefined();
            expect(enrollment.data?.qrCode).toBeDefined();
            expect(enrollment.data?.backupCodes).toHaveLength(10);

            // Create verification challenge
            const challenge = await mfaOrchestrator.createChallenge('user123', ['totp']);

            expect(challenge.success).toBe(true);
            expect(challenge.data).toBeDefined();
            expect(challenge.data?.requiredMethods).toContain('totp');

            // Verify TOTP code
            const verification = await mfaOrchestrator.verifyChallenge(
                challenge.data!.id,
                'totp',
                { code: '123456' }
            );

            expect(verification.success).toBe(true);
            expect(verification.data).toBeDefined();
            expect(verification.data?.verified).toBe(true);
        });

        it('should handle TOTP enrollment errors gracefully', async () => {
            // Test with invalid data
            const enrollment = await mfaOrchestrator.enrollMethod('user123', 'totp', {
                accountName: '' // Invalid empty account name
            });

            expect(enrollment.success).toBe(false);
            expect(enrollment.error).toBeDefined();
        });
    });

    describe('SMS Integration', () => {
        it('should enroll in SMS and verify code', async () => {
            // Enroll in SMS
            const enrollment = await mfaOrchestrator.enrollMethod('user123', 'sms', {
                phoneNumber: '+1234567890',
                countryCode: '1'
            });

            expect(enrollment.success).toBe(true);
            expect(enrollment.data).toBeDefined();
            expect(enrollment.data?.phoneNumber).toBe('+1234567890');
            expect(enrollment.data?.verified).toBe(false);

            // Send verification code
            const sendResult = await mfaOrchestrator.sendVerification('user123', 'sms');

            expect(sendResult.success).toBe(true);

            // Verify SMS code
            const verification = await mfaOrchestrator.verifyMethod('user123', 'sms', {
                code: '123456'
            });

            expect(verification.success).toBe(true);
            expect(verification.data).toBeDefined();
            expect(verification.data?.verified).toBe(true);
        });

        it('should handle SMS rate limiting', async () => {
            // Send multiple SMS requests to trigger rate limiting
            await mfaOrchestrator.sendVerification('user123', 'sms');
            await mfaOrchestrator.sendVerification('user123', 'sms');
            await mfaOrchestrator.sendVerification('user123', 'sms');

            // Fourth request should be rate limited
            const sendResult = await mfaOrchestrator.sendVerification('user123', 'sms');

            expect(sendResult.success).toBe(false);
            expect(sendResult.error?.type).toBe('RATE_LIMITED');
        });
    });

    describe('Backup Codes Integration', () => {
        it('should generate and verify backup codes', async () => {
            // Generate backup codes
            const enrollment = await mfaOrchestrator.enrollMethod('user123', 'backup-codes', {
                count: 5,
                length: 8,
                format: 'alphanumeric'
            });

            expect(enrollment.success).toBe(true);
            expect(enrollment.data).toBeDefined();
            expect(enrollment.data?.codes).toHaveLength(5);

            // Verify a backup code
            const validCode = enrollment.data!.codes[0];
            const verification = await mfaOrchestrator.verifyMethod('user123', 'backup-codes', {
                code: validCode
            });

            expect(verification.success).toBe(true);
            expect(verification.data?.verified).toBe(true);
            expect(verification.data?.remainingCodes).toBe(4);
        });

        it('should prevent reuse of backup codes', async () => {
            // Generate backup codes
            const enrollment = await mfaOrchestrator.enrollMethod('user123', 'backup-codes', {
                count: 3,
                length: 6,
                format: 'numeric'
            });

            const validCode = enrollment.data!.codes[0];

            // First verification should succeed
            const firstVerification = await mfaOrchestrator.verifyMethod('user123', 'backup-codes', {
                code: validCode
            });

            expect(firstVerification.success).toBe(true);

            // Second verification of same code should fail
            const secondVerification = await mfaOrchestrator.verifyMethod('user123', 'backup-codes', {
                code: validCode
            });

            expect(secondVerification.success).toBe(false);
            expect(secondVerification.error?.type).toBe('CODE_ALREADY_USED');
        });
    });

    describe('Multi-Method Challenges', () => {
        it('should create challenges with multiple methods', async () => {
            // Enroll in multiple methods first
            await mfaOrchestrator.enrollMethod('user123', 'totp', { accountName: 'test@example.com' });
            await mfaOrchestrator.enrollMethod('user123', 'sms', { phoneNumber: '+1234567890', countryCode: '1' });

            // Create multi-method challenge
            const challenge = await mfaOrchestrator.createChallenge('user123', ['totp', 'sms']);

            expect(challenge.success).toBe(true);
            expect(challenge.data?.requiredMethods).toHaveLength(2);
            expect(challenge.data?.requiredMethods).toContain('totp');
            expect(challenge.data?.requiredMethods).toContain('sms');
        });

        it('should verify multi-method challenges', async () => {
            // Enroll in multiple methods
            await mfaOrchestrator.enrollMethod('user123', 'totp', { accountName: 'test@example.com' });
            await mfaOrchestrator.enrollMethod('user123', 'sms', { phoneNumber: '+1234567890', countryCode: '1' });

            // Create challenge
            const challenge = await mfaOrchestrator.createChallenge('user123', ['totp', 'sms']);

            // Verify TOTP
            const totpVerification = await mfaOrchestrator.verifyChallenge(
                challenge.data!.id,
                'totp',
                { code: '123456' }
            );

            expect(totpVerification.success).toBe(true);

            // Verify SMS
            await mfaOrchestrator.sendVerification('user123', 'sms');
            const smsVerification = await mfaOrchestrator.verifyChallenge(
                challenge.data!.id,
                'sms',
                { code: '123456' }
            );

            expect(smsVerification.success).toBe(true);

            // Check overall challenge completion
            const challengeStatus = await mfaOrchestrator.getChallengeStatus(challenge.data!.id);

            expect(challengeStatus.success).toBe(true);
            expect(challengeStatus.data?.completed).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid method names gracefully', async () => {
            const enrollment = await mfaOrchestrator.enrollMethod('user123', 'invalid-method' as MFAMethod, {});

            expect(enrollment.success).toBe(false);
            expect(enrollment.error?.type).toBe('METHOD_NOT_SUPPORTED');
        });

        it('should handle non-existent challenges', async () => {
            const verification = await mfaOrchestrator.verifyChallenge(
                'non-existent-challenge-id',
                'totp',
                { code: '123456' }
            );

            expect(verification.success).toBe(false);
            expect(verification.error?.type).toBe('CHALLENGE_NOT_FOUND');
        });

        it('should handle verification without enrollment', async () => {
            const verification = await mfaOrchestrator.verifyMethod('user123', 'totp', {
                code: '123456'
            });

            expect(verification.success).toBe(false);
            expect(verification.error?.type).toBe('NOT_ENROLLED');
        });
    });

    describe('Service Health Monitoring', () => {
        it('should check health of all MFA services', async () => {
            const healthStatus = await mfaOrchestrator.checkHealth();

            expect(healthStatus).toBeDefined();
            expect(healthStatus.totp).toBeDefined();
            expect(healthStatus.sms).toBeDefined();
            expect(healthStatus.backupCodes).toBeDefined();

            // All services should be healthy in mock implementation
            expect(healthStatus.totp.healthy).toBe(true);
            expect(healthStatus.sms.healthy).toBe(true);
            expect(healthStatus.backupCodes.healthy).toBe(true);
        });

        it('should handle service failures gracefully', async () => {
            // Create a failing TOTP service
            const failingTotpService = new TOTPService();
            jest.spyOn(failingTotpService, 'healthCheck').mockResolvedValue({
                healthy: false,
                timestamp: new Date(),
                responseTime: 1000,
                message: 'Service unavailable'
            });

            const failingOrchestrator = new MFAOrchestrator({
                totp: failingTotpService,
                sms: smsService,
                backupCodes: backupCodeService
            });

            const healthStatus = await failingOrchestrator.checkHealth();

            expect(healthStatus.totp.healthy).toBe(false);
            expect(healthStatus.sms.healthy).toBe(true);
            expect(healthStatus.backupCodes.healthy).toBe(true);
        });
    });

    describe('Performance and Scalability', () => {
        it('should handle concurrent operations', async () => {
            const promises = [];

            // Create multiple concurrent enrollments
            for (let i = 0; i < 10; i++) {
                promises.push(
                    mfaOrchestrator.enrollMethod(`user${i}`, 'totp', {
                        accountName: `user${i}@example.com`
                    })
                );
            }

            const results = await Promise.all(promises);

            // All operations should succeed
            results.forEach(result => {
                expect(result.success).toBe(true);
            });

            // Check statistics
            const stats = mfaOrchestrator.getStatistics();
            expect(stats.totalEnrollments).toBe(10);
        });

        it('should maintain performance under load', async () => {
            const startTime = Date.now();

            // Perform 100 operations
            const promises = [];
            for (let i = 0; i < 100; i++) {
                promises.push(
                    mfaOrchestrator.getAvailableMethods(`user${i}`)
                );
            }

            await Promise.all(promises);
            const endTime = Date.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
        });
    });

    describe('Configuration and Customization', () => {
        it('should accept custom configuration', () => {
            const customConfig: MFAConfig = {
                totp: {
                    issuer: 'CustomApp',
                    digits: 6,
                    period: 30
                },
                sms: {
                    provider: 'custom-provider',
                    maxAttempts: 3,
                    cooldownPeriod: 60000
                },
                backupCodes: {
                    count: 15,
                    length: 10,
                    format: 'alphanumeric'
                }
            };

            const customOrchestrator = new MFAOrchestrator({
                totp: new TOTPService(customConfig.totp),
                sms: new SMSService(customConfig.sms),
                backupCodes: new BackupCodeService(customConfig.backupCodes)
            });

            expect(customOrchestrator).toBeDefined();
        });

        it('should work with partial service configuration', () => {
            const partialOrchestrator = new MFAOrchestrator({
                totp: totpService,
                // SMS and backup codes will use default services
            });

            expect(partialOrchestrator).toBeDefined();

            // Should only have TOTP method available
            const methods = partialOrchestrator.getAvailableMethods('user123');
            expect(methods).resolves.toHaveLength(1);
        });
    });
});
