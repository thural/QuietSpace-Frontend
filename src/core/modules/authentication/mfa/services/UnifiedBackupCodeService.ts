/**
 * Unified Backup Code Service
 *
 * Implements MFAMethod interface for backup code authentication
 * to consolidate MFA functionality and reduce complexity.
 */

import type { MFAMethod, MFAMethodType, MFAChallenge, MFAVerification, MFAEnrollment, MFAResult } from '../MFAMethod';

/**
 * Backup Code Service implementing unified MFAMethod interface
 */
export class UnifiedBackupCodeService implements MFAMethod {
    readonly name = 'UnifiedBackupCodeService';
    readonly type = MFAMethodType.BACKUP_CODE;
    readonly capabilities = ['backup_codes', 'code_generation', 'code_validation'];
    readonly isAvailable = true;

    private readonly enrollments = new Map<string, MFAEnrollment>();
    private readonly config: Record<string, any> = {
        codeLength: 8,
        maxCodes: 10,
        expiryDays: 365
    };

    constructor(config: Record<string, any> = {}) {
        Object.assign(this.config, config);
    }

    /**
     * Enrolls user in backup codes
     */
    async enroll(userId: string, config: Record<string, any>): Promise<MFAResult> {
        try {
            const codes = this.generateBackupCodes();
            const enrollment: MFAEnrollment = {
                id: `backup_${Date.now()}`,
                userId,
                type: MFAMethodType.BACKUP_CODE,
                status: 'active',
                config: {
                    ...this.config,
                    ...config,
                    codes
                },
                enrolledAt: new Date()
            };

            this.enrollments.set(userId, enrollment);

            return {
                success: true,
                data: {
                    enrollment,
                    backupCodes: codes
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'enrollment_failed',
                    message: error instanceof Error ? error.message : 'Backup code enrollment failed',
                    code: 'BACKUP_CODE_ENROLLMENT_FAILED'
                }
            };
        }
    }

    /**
     * Creates MFA challenge (not applicable for backup codes)
     */
    async createChallenge(userId: string, metadata?: Record<string, any>): Promise<MFAResult> {
        return {
            success: false,
            error: {
                type: 'not_supported',
                message: 'Backup codes do not support challenge creation',
                code: 'BACKUP_CODE_NOT_SUPPORTED'
            }
        };
    }

    /**
     * Verifies backup code
     */
    async verify(challengeId: string, response: string, metadata?: Record<string, any>): Promise<MFAResult> {
        try {
            const enrollment = this.enrollments.get(userId);
            if (!enrollment || enrollment.status !== 'active') {
                return {
                    success: false,
                    error: {
                        type: 'not_enrolled',
                        message: 'User not enrolled in backup codes',
                        code: 'BACKUP_CODE_NOT_ENROLLED'
                    }
                };
            }

            const isValid = this.validateBackupCode(response, enrollment.config.codes);
            
            if (isValid) {
                // Remove used code if single-use
                if (enrollment.config.singleUse) {
                    const codeIndex = enrollment.config.codes.indexOf(response);
                    if (codeIndex > -1) {
                        enrollment.config.codes.splice(codeIndex, 1);
                    }
                }

                return {
                    success: true,
                    data: {
                        verified: true,
                        remainingCodes: enrollment.config.codes.length
                    }
                };
            } else {
                return {
                    success: false,
                    error: {
                        type: 'verification_failed',
                        message: 'Invalid backup code',
                        code: 'BACKUP_CODE_VERIFICATION_FAILED'
                    }
                };
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'verification_failed',
                    message: error instanceof Error ? error.message : 'Backup code verification failed',
                    code: 'BACKUP_CODE_VERIFICATION_FAILED'
                }
            };
        }
    }

    /**
     * Disables backup codes for user
     */
    async disable(userId: string): Promise<MFAResult> {
        try {
            const enrollment = this.enrollments.get(userId);
            if (enrollment) {
                enrollment.status = 'disabled';
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
                    type: 'disable_failed',
                    message: error instanceof Error ? error.message : 'Backup code disable failed',
                    code: 'BACKUP_CODE_DISABLE_FAILED'
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
            // Validate code length
            if (config.codeLength && (config.codeLength < 6 || config.codeLength > 12)) {
                return {
                    success: false,
                    error: {
                        type: 'invalid_config',
                        message: 'Code length must be between 6 and 12 characters',
                        code: 'BACKUP_CODE_INVALID_CONFIG'
                    }
                };
            }

            // Validate max codes
            if (config.maxCodes && (config.maxCodes < 5 || config.maxCodes > 20)) {
                return {
                    success: false,
                    error: {
                        type: 'invalid_config',
                        message: 'Max codes must be between 5 and 20',
                        code: 'BACKUP_CODE_INVALID_CONFIG'
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
                    type: 'validation_failed',
                    message: error instanceof Error ? error.message : 'Backup code config validation failed',
                    code: 'BACKUP_CODE_VALIDATION_FAILED'
                }
            };
        }
    }

    /**
     * Gets method metadata
     */
    getMetadata(): Record<string, any> {
        return {
            type: 'backup_code',
            codeLength: this.config.codeLength,
            maxCodes: this.config.maxCodes,
            expiryDays: this.config.expiryDays,
            enrollmentCount: this.enrollments.size,
            singleUse: this.config.singleUse || false
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
            const configValid = this.config.codeLength && this.config.maxCodes;

            const healthy = hasEnrollments && configValid;
            const responseTime = Date.now() - startTime;

            return {
                healthy,
                message: healthy ? 'Backup code service is healthy' : 'Backup code service has issues',
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
     * Generates backup codes
     */
    private generateBackupCodes(): string[] {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
        const codes: string[] = [];
        
        for (let i = 0; i < this.config.maxCodes; i++) {
            let code = '';
            for (let j = 0; j < this.config.codeLength; j++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            codes.push(code);
        }
        
        return codes;
    }

    /**
     * Validates backup code
     */
    private validateBackupCode(code: string, validCodes: string[]): boolean {
        return validCodes.includes(code) && code.length === this.config.codeLength;
    }
}
