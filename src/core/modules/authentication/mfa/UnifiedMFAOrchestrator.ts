/**
 * Unified MFA Orchestrator
 *
 * Consolidates MFA functionality using unified MFAMethod interface
 * to replace complex MFAOrchestrator and reduce complexity.
 */

import type { MFAMethod, MFAMethodType, MFAChallenge, MFAVerification, MFAEnrollment, MFAResult } from './MFAMethod';
import { UnifiedTOTPService } from './services/UnifiedTOTPService';
import { UnifiedSMSService } from './services/UnifiedSMSService';
import { UnifiedBackupCodeService } from './services/UnifiedBackupCodeService';

/**
 * Unified MFA Orchestrator
 * 
 * Simplified version that uses unified MFAMethod interface
 * instead of separate services to reduce complexity.
 */
export class UnifiedMFAOrchestrator {
    readonly name = 'UnifiedMFAOrchestrator';
    
    private readonly methods = new Map<MFAMethodType, MFAMethod>();
    private readonly enrollments = new Map<string, MFAEnrollment[]>();
    private readonly challenges = new Map<string, MFAChallenge>();
    private readonly statistics = {
        totalEnrollments: 0,
        activeChallenges: 0,
        methodUsage: new Map<MFAMethodType, number>(),
        successfulChallenges: 0,
        failedChallenges: 0
    };

    constructor() {
        // Initialize unified MFA methods
        this.methods.set(MFAMethodType.TOTP, new UnifiedTOTPService());
        this.methods.set(MFAMethodType.SMS, new UnifiedSMSService());
        this.methods.set(MFAMethodType.BACKUP_CODE, new UnifiedBackupCodeService());
    }

    /**
     * Gets available MFA methods for a user
     */
    async getAvailableMethods(userId: string): Promise<MFAMethodType[]> {
        const userEnrollments = this.enrollments.get(userId) || [];
        const availableTypes: MFAMethodType[] = [];

        for (const [methodType, method] of this.methods) {
            const enrollment = userEnrollments.find(e => e.type === methodType && e.status === 'active');
            if (enrollment && method.isAvailable) {
                availableTypes.push(methodType);
            }
        }

        return availableTypes;
    }

    /**
     * Enrolls user in MFA method
     */
    async enroll(userId: string, methodType: MFAMethodType, config: Record<string, any>): Promise<MFAResult> {
        try {
            const method = this.methods.get(methodType);
            if (!method) {
                return {
                    success: false,
                    error: {
                        type: 'method_not_found',
                        message: `MFA method ${methodType} not found`,
                        code: 'MFA_METHOD_NOT_FOUND'
                    }
                };
            }

            // Enroll using method
            const result = await method.enroll(userId, config);
            
            if (result.success) {
                // Store enrollment
                const userEnrollments = this.enrollments.get(userId) || [];
                userEnrollments.push(result.data!.enrollment);
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
                    message: error instanceof Error ? error.message : 'MFA enrollment failed',
                    code: 'MFA_ENROLLMENT_FAILED'
                }
            };
        }
    }

    /**
     * Creates MFA challenge
     */
    async createChallenge(userId: string, methodType: MFAMethodType, metadata?: Record<string, any>): Promise<MFAResult> {
        try {
            const method = this.methods.get(methodType);
            if (!method) {
                return {
                    success: false,
                    error: {
                        type: 'method_not_found',
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
                        type: 'not_enrolled',
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
                    type: 'challenge_creation_failed',
                    message: error instanceof Error ? error.message : 'MFA challenge creation failed',
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

            const method = this.methods.get(challenge.type);
            if (!method) {
                return {
                    success: false,
                    error: {
                        type: 'method_not_found',
                        message: `MFA method ${challenge.type} not found`,
                        code: 'MFA_METHOD_NOT_FOUND'
                    }
                };
            }

            // Verify using method
            const verification: MFAVerification = {
                challengeId,
                response,
                metadata
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
                    message: error instanceof Error ? error.message : 'MFA verification failed',
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
            const method = this.methods.get(methodType);
            if (!method) {
                return {
                    success: false,
                    error: {
                        type: 'method_not_found',
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
                    type: 'disable_failed',
                    message: error instanceof Error ? error.message : 'MFA disable failed',
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

        for (const [methodType, method] of this.methods) {
            try {
                results[methodType] = await method.healthCheck();
            } catch (error) {
                results[methodType] = {
                    healthy: false,
                    message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                };
            }
        }

        return results;
    }

    /**
     * Gets available method types
     */
    getAvailableMethodTypes(): MFAMethodType[] {
        return Array.from(this.methods.keys());
    }

    /**
     * Checks if method is available
     */
    isMethodAvailable(methodType: MFAMethodType): boolean {
        const method = this.methods.get(methodType);
        return method ? method.isAvailable : false;
    }
}
