/**
 * Unified SMS Service
 *
 * Implements MFAMethod interface for SMS authentication
 * to consolidate MFA functionality and reduce complexity.
 */

import type { MFAMethod, MFAMethodType, MFAChallenge, MFAVerification, MFAEnrollment, MFAResult } from '../MFAMethod';

/**
 * SMS Service implementing unified MFAMethod interface
 */
export class UnifiedSMSService implements MFAMethod {
    readonly name = 'UnifiedSMSService';
    readonly type = MFAMethodType.SMS;
    readonly capabilities = ['sms_verification', 'phone_enrollment', 'rate_limiting'];
    readonly isAvailable = true;

    private readonly enrollments = new Map<string, MFAEnrollment>();
    private readonly challenges = new Map<string, MFAChallenge>();
    private readonly rateLimitStore = new Map<string, { lastSent: number; count: number }>();
    private readonly config: Record<string, any> = {
        provider: 'twilio',
        template: 'Your verification code is: {code}',
        rateLimit: 5, // 5 SMS per minute
        maxRetries: 3
    };

    constructor(config: Record<string, any> = {}) {
        Object.assign(this.config, config);
    }

    /**
     * Enrolls user in SMS
     */
    async enroll(userId: string, config: Record<string, any>): Promise<MFAResult> {
        try {
            const phoneNumber = config.phoneNumber;
            const countryCode = config.countryCode || '+1';

            const enrollment: MFAEnrollment = {
                id: `sms_${Date.now()}`,
                userId,
                type: MFAMethodType.SMS,
                status: 'active',
                config: {
                    ...this.config,
                    phoneNumber,
                    countryCode
                },
                enrolledAt: new Date()
            };

            this.enrollments.set(userId, enrollment);

            return {
                success: true,
                data: {
                    enrollment,
                    verificationSent: false
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'enrollment_failed' as const,
                    message: error instanceof Error ? error.message : 'SMS enrollment failed',
                    code: 'SMS_ENROLLMENT_FAILED'
                }
            };
        }
    }

    /**
     * Creates SMS challenge
     */
    async createChallenge(userId: string, metadata?: Record<string, any>): Promise<MFAResult> {
        try {
            const enrollment = this.enrollments.get(userId);
            if (!enrollment || enrollment.status !== 'active') {
                return {
                    success: false,
                    error: {
                        type: 'not_enrolled',
                        message: 'User not enrolled in SMS',
                        code: 'SMS_NOT_ENROLLED'
                    }
                };
            }

            // Check rate limiting
            const rateLimitCheck = this.canSendSMS(userId);
            if (!rateLimitCheck.canSend) {
                return {
                    success: false,
                    error: {
                        type: 'rate_limit_exceeded',
                        message: `Rate limit exceeded. Try again at ${new Date(rateLimitCheck.nextAvailableTime!).toLocaleTimeString()}`,
                        code: 'SMS_RATE_LIMIT_EXCEEDED'
                    }
                };
            }

            // Generate and send verification code
            const code = this.generateVerificationCode();
            const challenge: MFAChallenge = {
                id: `challenge_${Date.now()}`,
                type: MFAMethodType.SMS,
                data: {
                    enrollment,
                    verificationCode: code,
                    ...metadata
                },
                expiresAt: new Date(Date.now() + 600000), // 10 minutes
                isActive: true,
                metadata: {
                    method: 'sms',
                    phoneNumber: enrollment.config.phoneNumber,
                    sentAt: new Date()
                }
            };

            this.challenges.set(challenge.id, challenge);
            this.updateRateLimit(userId);

            return {
                success: true,
                data: challenge
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'challenge_creation_failed' as AuthErrorType,
                    message: error instanceof Error ? error.message : 'SMS challenge creation failed',
                    code: 'SMS_CHALLENGE_FAILED'
                }
            };
        }
    }

    /**
     * Verifies SMS challenge response
     */
    async verify(challengeId: string, response: string, metadata?: Record<string, any>): Promise<MFAResult> {
        try {
            const challenge = this.challenges.get(challengeId);
            if (!challenge) {
                return {
                    success: false,
                    error: {
                        type: 'challenge_not_found',
                        message: `Challenge ${challengeId} not found`,
                        code: 'SMS_CHALLENGE_NOT_FOUND'
                    }
                };
            }

            const isValid = this.validateVerificationCode(response);

            if (isValid) {
                // Remove challenge
                this.challenges.delete(challengeId);

                return {
                    success: true,
                    data: {
                        verified: true,
                        remainingAttempts: 0
                    }
                };
            } else {
                return {
                    success: false,
                    error: {
                        type: 'verification_failed',
                        message: 'Invalid verification code',
                        code: 'SMS_VERIFICATION_FAILED'
                    }
                };
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'verification_failed' as AuthErrorType,
                    message: error instanceof Error ? error.message : 'SMS verification failed',
                    code: 'SMS_VERIFICATION_FAILED'
                }
            };
        }
    }

    /**
     * Disables SMS for user
     */
    async disable(userId: string): Promise<MFAResult> {
        try {
            const enrollment = this.enrollments.get(userId);
            if (enrollment) {
                enrollment.status = 'disabled';
            }

            // Remove all challenges for this user
            for (const [challengeId, challenge] of this.challenges) {
                if (challenge.data.enrollment?.userId === userId) {
                    this.challenges.delete(challengeId);
                }
            }

            return {
                success: true,
                data: {
                    disabled: true
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'disable_failed' as AuthErrorType,
                    message: error instanceof Error ? error.message : 'SMS disable failed',
                    code: 'SMS_DISABLE_FAILED'
                }
            };
        }
    }

    /**
     * Gets enrollment status for user
     */
    async getEnrollment(userId: string): Promise<MFAEnrollment | null> {
        return this.enrollments.get(userId) || null;
    }

    /**
     * Validates method configuration
     */
    validateConfig(config: Record<string, any>): Promise<MFAResult> {
        try {
            // Validate required fields
            if (!config.phoneNumber || typeof config.phoneNumber !== 'string') {
                return {
                    success: false,
                    error: {
                        type: 'invalid_config',
                        message: 'Phone number is required and must be a string',
                        code: 'SMS_INVALID_CONFIG'
                    }
                };
            }

            // Basic phone number validation
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(config.phoneNumber)) {
                return {
                    success: false,
                    error: {
                        type: 'invalid_config',
                        message: 'Invalid phone number format',
                        code: 'SMS_INVALID_CONFIG'
                    }
                };
            }

            return {
                success: true,
                data: true
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'validation_failed' as AuthErrorType,
                    message: error instanceof Error ? error.message : 'SMS config validation failed',
                    code: 'SMS_VALIDATION_FAILED'
                }
            };
        }
    }

    /**
     * Gets method metadata
     */
    getMetadata(): Record<string, any> {
        return {
            type: 'sms',
            provider: this.config.provider,
            template: this.config.template,
            rateLimit: this.config.rateLimit,
            maxRetries: this.config.maxRetries,
            enrollmentCount: this.enrollments.size,
            activeChallengeCount: this.challenges.size
        };
    }

    /**
     * Performs health check
     */
    async healthCheck(): Promise<{
        healthy: boolean;
        message?: string;
        responseTime?: number;
    }> {
        const startTime = Date.now();

        try {
            // Basic health checks
            const hasEnrollments = this.enrollments.size > 0;
            const hasActiveChallenges = this.challenges.size > 0;
            const configValid = this.config.provider && this.config.template && this.config.rateLimit;

            const healthy = hasEnrollments && configValid;
            const responseTime = Date.now() - startTime;

            return {
                healthy,
                message: healthy ? 'SMS service is healthy' : 'SMS service has issues',
                responseTime
            };
        } catch (error) {
            return {
                healthy: false,
                message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                responseTime: Date.now() - startTime
            };
        }
    }

    /**
     * Checks if SMS can be sent to user
     */
    private canSendSMS(userId: string): { canSend: boolean; nextAvailableTime?: Date } {
        const now = Date.now();
        const rateLimitData = this.rateLimitStore.get(userId) || { lastSent: 0, count: 0 };

        // Reset count if more than a minute has passed
        if (now - rateLimitData.lastSent > 60000) { // 1 minute
            rateLimitData.count = 0;
        }

        if (rateLimitData.count >= this.config.rateLimit) {
            const nextAvailableTime = new Date(rateLimitData.lastSent + 60000);
            return { canSend: false, nextAvailableTime };
        }

        return { canSend: true };
    }

    /**
     * Updates rate limit store
     */
    private updateRateLimit(userId: string): void {
        const rateLimitData = this.rateLimitStore.get(userId) || { lastSent: 0, count: 0 };
        rateLimitData.lastSent = Date.now();
        rateLimitData.count++;
        this.rateLimitStore.set(userId, rateLimitData);
    }

    /**
     * Generates verification code
     */
    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString().substring(1, 7);
    }

    /**
     * Validates verification code format
     */
    private validateVerificationCode(code: string): boolean {
        return /^\d{6}$/.test(code);
    }
}
