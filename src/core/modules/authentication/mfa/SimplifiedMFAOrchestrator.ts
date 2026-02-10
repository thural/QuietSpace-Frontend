/**
 * Simplified MFA Orchestrator
 *
 * Consolidates MFA functionality using unified MFAMethod interface
 * to reduce complexity while maintaining all features.
 */

import type { AuthResult, AuthErrorType } from '../types/auth.domain.types';
import type { MFAMethod, MFAMethodType, MFAChallenge, MFAVerification, MFAEnrollment, MFAResult } from './MFAMethod';
import { mfaRegistry } from './MFAMethod';

/**
 * Simplified MFA Orchestrator
 * 
 * Uses strategy pattern with unified MFAMethod interface
 * to reduce complexity and improve maintainability.
 */
export class SimplifiedMFAOrchestrator {
    readonly name = 'SimplifiedMFAOrchestrator';

    private readonly enrollments = new Map<string, MFAEnrollment[]>();
    private readonly challenges = new Map<string, MFAChallenge>();
    private readonly statistics = {
        totalEnrollments: 0,
        activeChallenges: 0,
        methodUsage: new Map<MFAMethodType, number>(),
        successfulChallenges: 0,
        failedChallenges: 0
    };

    constructor(
        private readonly availableMethods: MFAMethod[] = []
    ) {
        // Register all available methods
        this.availableMethods.forEach(method => {
            mfaRegistry.registerMethod(method);
        });
    }

    /**
     * Gets available MFA methods for a user
     */
    async getAvailableMethods(userId: string): Promise<MFAMethodType[]> {
        const userEnrollments = this.enrollments.get(userId) || [];
        const availableTypes: MFAMethodType[] = [];

        for (const method of this.availableMethods) {
            const enrollment = userEnrollments.find(e => e.type === method.type);
            if (enrollment && enrollment.status === 'active') {
                availableTypes.push(method.type);
            }
        }

        return availableTypes;
    }

    /**
     * Enrolls user in MFA method
     */
    async enroll(userId: string, methodType: MFAMethodType, config: Record<string, any>): Promise<MFAResult> {
        try {
            const method = mfaRegistry.getMethod(methodType);
            if (!method) {
                return {
                    success: false,
                    error: {
                        type: 'method_not_found' as AuthErrorType,
                        message: `MFA method ${methodType} not found`,
                        code: 'MFA_METHOD_NOT_FOUND'
                    }
                };
            }

            // Validate configuration
            const validation = method.validateConfig(config);
            if (!validation.success) {
                return {
                    success: false,
                    error: {
                        type: 'invalid_config',
                        message: `Invalid configuration: ${validation.error?.message}`,
                        code: 'MFA_INVALID_CONFIG'
                    }
                };
            }

            // Enroll using method
            const result = await method.enroll(userId, config);

            if (result.success) {
                // Store enrollment
                const userEnrollments = this.enrollments.get(userId) || [];
                const newEnrollment: MFAEnrollment = {
                    id: `enrollment_${Date.now()}`,
                    userId,
                    type: methodType,
                    status: 'active',
                    config,
                    enrolledAt: new Date()
                };

                userEnrollments.push(newEnrollment);
                this.enrollments.set(userId, userEnrollments);
                this.statistics.totalEnrollments++;
                this.statistics.methodUsage.set(methodType, (this.statistics.methodUsage.get(methodType) || 0) + 1);
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'enrollment_failed',
                    message: error instanceof Error ? error.message : 'Enrollment failed',
                    code: 'MFA_ENROLLMENT_FAILED'
                }
            };
        }
    }

    /**
     * Creates MFA challenge
     */
    async createChallenge(userId: string, methodType: MFAMethodType, metadata?: Record<string, any>): Promise<AuthResult<MFAChallenge>> {
        try {
            const method = mfaRegistry.getMethod(methodType);
            if (!method) {
                return {
                    success: false,
                    error: {
                        type: 'method_not_found' as AuthErrorType,
                        message: `MFA method ${methodType} not found`,
                        code: 'MFA_METHOD_NOT_FOUND'
                    }
                };
            }

            // Check if user is enrolled
            const userEnrollments = this.enrollments.get(userId) || [];
            const enrollment = userEnrollments.find(e => e.type === methodType && e.status === 'active');

            if (!enrollment) {
                return {
                    success: false,
                    error: {
                        type: 'not_enrolled' as AuthErrorType,
                        message: `User not enrolled in ${methodType}`,
                        code: 'MFA_NOT_ENROLLED'
                    }
                };
            }

            // Create challenge using method
            const result = await method.createChallenge(userId, { enrollment, ...metadata });

            if (result.success) {
                // Store challenge
                this.challenges.set(result.data!.id, result.data);
                this.statistics.activeChallenges++;
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'challenge_creation_failed' as AuthErrorType,
                    message: error instanceof Error ? error.message : 'Challenge creation failed',
                    code: 'MFA_CHALLENGE_FAILED'
                }
            };
        }
    }

    /**
     * Verifies MFA challenge response
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
                        code: 'MFA_CHALLENGE_NOT_FOUND'
                    }
                };
            }

            const method = mfaRegistry.getMethod(challenge.type);
            if (!method) {
                return {
                    success: false,
                    error: {
                        type: 'method_not_found' as AuthErrorType,
                        message: `MFA method ${challenge.type} not found`,
                        code: 'MFA_METHOD_NOT_FOUND'
                    }
                };
            }

            // Verify using method
            const verification: MFAVerification = {
                challengeId,
                response,
                metadata: metadata || {}
            };

            const result = await method.verify(challengeId, response, verification);

            if (result.success) {
                // Remove challenge
                this.challenges.delete(challengeId);
                this.statistics.activeChallenges--;
                this.statistics.successfulChallenges++;
            } else {
                this.statistics.failedChallenges++;
            }

            return result;
        } catch (error) {
            this.statistics.failedChallenges++;
            return {
                success: false,
                error: {
                    type: 'verification_failed',
                    message: error instanceof Error ? error.message : 'Verification failed',
                    code: 'MFA_VERIFICATION_FAILED'
                }
            };
        }
    }

    /**
     * Disables MFA method for user
     */
    async disableMethod(userId: string, methodType: MFAMethodType): Promise<MFAResult> {
        try {
            const method = mfaRegistry.getMethod(methodType);
            if (!method) {
                return {
                    success: false,
                    error: {
                        type: 'method_not_found' as AuthErrorType,
                        message: `MFA method ${methodType} not found`,
                        code: 'MFA_METHOD_NOT_FOUND'
                    }
                };
            }

            const result = await method.disable(userId);

            if (result.success) {
                // Update enrollment status
                const userEnrollments = this.enrollments.get(userId) || [];
                const enrollment = userEnrollments.find(e => e.type === methodType);
                if (enrollment) {
                    enrollment.status = 'disabled';
                }
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'disable_failed' as AuthErrorType,
                    message: error instanceof Error ? error.message : 'Disable failed',
                    code: 'MFA_DISABLE_FAILED'
                }
            };
        }
    }

    /**
     * Gets enrollment status for user
     */
    async getEnrollment(userId: string, methodType: MFAMethodType): Promise<MFAEnrollment | null> {
        const userEnrollments = this.enrollments.get(userId) || [];
        return userEnrollments.find(e => e.type === methodType) || null;
    }

    /**
     * Gets all enrollments for user
     */
    async getAllEnrollments(userId: string): Promise<MFAEnrollment[]> {
        return this.enrollments.get(userId) || [];
    }

    /**
     * Gets orchestrator statistics
     */
    getStatistics(): {
        totalEnrollments: number;
        activeChallenges: number;
        methodUsage: Record<string, number>;
        successfulChallenges: number;
        failedChallenges: number;
        successRate: number;
    } {
        const total = this.statistics.successfulChallenges + this.statistics.failedChallenges;
        const successRate = total > 0 ? (this.statistics.successfulChallenges / total) * 100 : 0;

        const methodUsage: Record<string, number> = {};
        this.statistics.methodUsage.forEach((count, type) => {
            methodUsage[type] = count;
        });

        return {
            ...this.statistics,
            methodUsage,
            successRate
        };
    }

    /**
     * Resets statistics
     */
    resetStatistics(): void {
        this.statistics.totalEnrollments = 0;
        this.statistics.activeChallenges = 0;
        this.statistics.methodUsage.clear();
        this.statistics.successfulChallenges = 0;
        this.statistics.failedChallenges = 0;
    }

    /**
     * Performs health check on all methods
     */
    async performHealthChecks(): Promise<Record<MFAMethodType, { healthy: boolean; message?: string; responseTime?: number }>> {
        const results: Record<string, any> = {};

        for (const method of this.availableMethods) {
            try {
                results[method.type] = await method.healthCheck();
            } catch (error) {
                results[method.type] = {
                    healthy: false,
                    message: error instanceof Error ? error.message : 'Health check failed'
                };
            }
        }

        return results;
    }

    /**
     * Gets available method types
     */
    getAvailableMethodTypes(): MFAMethodType[] {
        return this.availableMethods.map(method => method.type);
    }

    /**
     * Checks if method is available
     */
    isMethodAvailable(methodType: MFAMethodType): boolean {
        return this.availableMethods.some(method => method.type === methodType && method.isAvailable);
    }
}
