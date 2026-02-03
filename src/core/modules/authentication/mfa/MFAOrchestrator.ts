/**
 * MFA Orchestrator Implementation
 *
 * Implements multi-factor authentication orchestration by coordinating
 * between specialized MFA services following Single Responsibility Principle.
 */

import type { IMFAService } from './interfaces/IMFAService';
import type { ITOTPService } from './interfaces/ITOTPService';
import type { ISMSService } from './interfaces/ISMSService';
import type { IBackupCodeService } from './interfaces/IBackupCodeService';
import type { MFAMethod, MFAEnrollment, MFAChallenge, MFAVerification } from './types/mfa.types';

/**
 * MFA orchestrator implementation
 * 
 * Coordinates MFA operations by delegating to specialized services
 * while maintaining clean separation of concerns.
 */
export class MFAOrchestrator implements IMFAService {
    readonly name = 'MFAOrchestrator';
    
    private readonly enrollments = new Map<string, MFAEnrollment[]>();
    private readonly challenges = new Map<string, MFAChallenge>();
    private readonly statistics = {
        totalEnrollments: 0,
        activeChallenges: 0,
        methodUsage: new Map<string, number>(),
        successfulChallenges: 0,
        failedChallenges: 0
    };

    constructor(
        private readonly totpService: ITOTPService,
        private readonly smsService: ISMSService,
        private readonly backupCodeService: IBackupCodeService
    ) {}

    /**
     * Gets available MFA methods for a user
     */
    async getAvailableMethods(userId: string): Promise<MFAMethod[]> {
        const userEnrollments = this.enrollments.get(userId) || [];
        const methods: MFAMethod[] = [];

        // TOTP method
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

        // SMS method
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

        // Backup codes method
        const backupCodesEnrollment = userEnrollments.find(e => e.method.type === 'backup-codes' && e.status === 'active');
        methods.push({
            type: 'backup-codes',
            name: 'Backup Codes',
            description: 'Use one-time backup codes for account recovery',
            icon: '🔑',
            enabled: !!backupCodesEnrollment,
            priority: 3,
            setupRequired: !backupCodesEnrollment
        });

        return methods.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Initiates MFA enrollment for a specific method
     */
    async enrollMethod(userId: string, methodType: string, enrollmentData: any): Promise<any> {
        try {
            let result: any;
            let methodData: any;

            switch (methodType) {
                case 'totp':
                    result = await this.totpService.generateTOTPSecret(userId, enrollmentData.accountName || userId);
                    methodData = { totp: result };
                    break;

                case 'sms':
                    result = await this.smsService.enrollSMS(userId, enrollmentData.phoneNumber, enrollmentData.countryCode);
                    methodData = { sms: result };
                    break;

                case 'backup-codes':
                    result = await this.backupCodeService.generateBackupCodes(userId, enrollmentData);
                    methodData = { backupCodes: result };
                    break;

                default:
                    throw new Error(`Unsupported MFA method: ${methodType}`);
            }

            // Create enrollment record
            const enrollment: MFAEnrollment = {
                id: this.generateId(),
                userId,
                method: {
                    type: methodType,
                    name: this.getMethodName(methodType),
                    description: this.getMethodDescription(methodType),
                    icon: this.getMethodIcon(methodType),
                    enabled: true,
                    priority: this.getMethodPriority(methodType),
                    setupRequired: false
                },
                status: 'pending',
                metadata: {
                    enrolledAt: Date.now(),
                    usageCount: 0
                },
                methodData
            };

            // Store enrollment
            const userEnrollments = this.enrollments.get(userId) || [];
            userEnrollments.push(enrollment);
            this.enrollments.set(userId, userEnrollments);

            this.statistics.totalEnrollments++;
            this.updateMethodUsage(methodType);

            return result;
        } catch (error) {
            throw new Error(`Failed to enroll in ${methodType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Verifies MFA enrollment completion
     */
    async verifyEnrollment(userId: string, enrollmentId: string, verificationData: any): Promise<boolean> {
        try {
            const userEnrollments = this.enrollments.get(userId) || [];
            const enrollment = userEnrollments.find(e => e.id === enrollmentId);

            if (!enrollment) {
                throw new Error('Enrollment not found');
            }

            let isValid = false;

            switch (enrollment.method.type) {
                case 'totp':
                    if (enrollment.methodData.totp) {
                        const result = await this.totpService.verifyTOTPCode(
                            enrollment.methodData.totp.secret,
                            verificationData.code
                        );
                        isValid = result.valid;
                    }
                    break;

                case 'sms':
                    if (enrollment.methodData.sms) {
                        const result = await this.smsService.verifySMSEnrollment(
                            userId,
                            enrollmentId,
                            verificationData.code
                        );
                        isValid = result.valid;
                    }
                    break;

                case 'backup-codes':
                    // Backup codes don't require verification during enrollment
                    isValid = true;
                    break;

                default:
                    throw new Error(`Unsupported MFA method: ${enrollment.method.type}`);
            }

            if (isValid) {
                enrollment.status = 'active';
                enrollment.metadata.verifiedAt = Date.now();
                this.enrollments.set(userId, userEnrollments);
            }

            return isValid;
        } catch (error) {
            throw new Error(`Failed to verify enrollment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Creates MFA verification challenge
     */
    async createChallenge(userId: string, requiredMethods: string[]): Promise<MFAChallenge> {
        const challenge: MFAChallenge = {
            id: this.generateId(),
            userId,
            requiredMethods: requiredMethods.map(method => ({
                type: method,
                name: this.getMethodName(method),
                description: this.getMethodDescription(method),
                icon: this.getMethodIcon(method),
                enabled: true,
                priority: this.getMethodPriority(method),
                setupRequired: false
            })),
            status: 'pending',
            createdAt: Date.now(),
            expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
            completedVerifications: []
        };

        this.challenges.set(challenge.id, challenge);
        this.statistics.activeChallenges++;

        return challenge;
    }

    /**
     * Verifies MFA challenge response
     */
    async verifyChallenge(challengeId: string, methodType: string, verificationData: any): Promise<boolean> {
        try {
            const challenge = this.challenges.get(challengeId);
            
            if (!challenge) {
                throw new Error('Challenge not found');
            }

            if (challenge.status !== 'pending') {
                throw new Error('Challenge is not pending');
            }

            if (Date.now() > challenge.expiresAt) {
                challenge.status = 'expired';
                this.statistics.failedChallenges++;
                return false;
            }

            let isValid = false;

            switch (methodType) {
                case 'totp':
                    const userEnrollments = this.enrollments.get(challenge.userId) || [];
                    const totpEnrollment = userEnrollments.find(e => e.method.type === 'totp' && e.status === 'active');
                    if (totpEnrollment?.methodData.totp) {
                        const result = await this.totpService.verifyTOTPCode(
                            totpEnrollment.methodData.totp.secret,
                            verificationData.code
                        );
                        isValid = result.valid;
                    }
                    break;

                case 'sms':
                    // For SMS, we'd typically send a new code and verify it
                    // For simplicity, we'll assume verificationData contains the code
                    const smsEnrollments = this.enrollments.get(challenge.userId) || [];
                    const smsEnrollment = smsEnrollments.find(e => e.method.type === 'sms' && e.status === 'active');
                    if (smsEnrollment) {
                        const result = await this.smsService.verifySMSEnrollment(
                            challenge.userId,
                            smsEnrollment.id,
                            verificationData.code
                        );
                        isValid = result.valid;
                    }
                    break;

                case 'backup-codes':
                    const backupEnrollments = this.enrollments.get(challenge.userId) || [];
                    const backupEnrollment = backupEnrollments.find(e => e.method.type === 'backup-codes' && e.status === 'active');
                    if (backupEnrollment) {
                        const result = await this.backupCodeService.verifyBackupCode(
                            challenge.userId,
                            verificationData.code
                        );
                        isValid = result.valid;
                    }
                    break;

                default:
                    throw new Error(`Unsupported MFA method: ${methodType}`);
            }

            if (isValid) {
                const verification: MFAVerification = {
                    id: this.generateId(),
                    userId: challenge.userId,
                    method: {
                        type: methodType,
                        name: this.getMethodName(methodType),
                        description: this.getMethodDescription(methodType),
                        icon: this.getMethodIcon(methodType),
                        enabled: true,
                        priority: this.getMethodPriority(methodType),
                        setupRequired: false
                    },
                    status: 'success',
                    timestamp: Date.now(),
                    expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
                    attempts: 1,
                    maxAttempts: 3
                };

                challenge.completedVerifications.push(verification);

                // Check if all required methods are completed
                const requiredTypes = challenge.requiredMethods.map(m => m.type);
                const completedTypes = challenge.completedVerifications.map(v => v.method.type);
                
                if (requiredTypes.every(type => completedTypes.includes(type))) {
                    challenge.status = 'completed';
                    this.statistics.successfulChallenges++;
                }
            }

            return isValid;
        } catch (error) {
            this.statistics.failedChallenges++;
            throw new Error(`Failed to verify challenge: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Gets user's MFA enrollments
     */
    async getUserEnrollments(userId: string): Promise<MFAEnrollment[]> {
        return this.enrollments.get(userId) || [];
    }

    /**
     * Removes MFA enrollment
     */
    async removeEnrollment(userId: string, enrollmentId: string): Promise<boolean> {
        try {
            const userEnrollments = this.enrollments.get(userId) || [];
            const index = userEnrollments.findIndex(e => e.id === enrollmentId);
            
            if (index === -1) {
                return false;
            }

            userEnrollments.splice(index, 1);
            this.enrollments.set(userId, userEnrollments);
            
            return true;
        } catch (error) {
            throw new Error(`Failed to remove enrollment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Gets MFA service statistics
     */
    getStatistics() {
        const totalChallenges = this.statistics.successfulChallenges + this.statistics.failedChallenges;
        const successRate = totalChallenges > 0 ? this.statistics.successfulChallenges / totalChallenges : 0;

        return {
            totalEnrollments: this.statistics.totalEnrollments,
            activeChallenges: this.statistics.activeChallenges,
            methodUsage: Object.fromEntries(this.statistics.methodUsage),
            successRate
        };
    }

    /**
     * Helper methods
     */
    private generateId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    private getMethodName(methodType: string): string {
        const names: Record<string, string> = {
            'totp': 'Authenticator App',
            'sms': 'SMS Verification',
            'backup-codes': 'Backup Codes'
        };
        return names[methodType] || methodType;
    }

    private getMethodDescription(methodType: string): string {
        const descriptions: Record<string, string> = {
            'totp': 'Use Google Authenticator, Authy, or similar apps',
            'sms': 'Receive verification codes via text message',
            'backup-codes': 'Use one-time backup codes for account recovery'
        };
        return descriptions[methodType] || '';
    }

    private getMethodIcon(methodType: string): string {
        const icons: Record<string, string> = {
            'totp': '📱',
            'sms': '💬',
            'backup-codes': '🔑'
        };
        return icons[methodType] || '🔐';
    }

    private getMethodPriority(methodType: string): number {
        const priorities: Record<string, number> = {
            'totp': 1,
            'sms': 2,
            'backup-codes': 3
        };
        return priorities[methodType] || 999;
    }

    private updateMethodUsage(methodType: string): void {
        const current = this.statistics.methodUsage.get(methodType) || 0;
        this.statistics.methodUsage.set(methodType, current + 1);
    }
}
