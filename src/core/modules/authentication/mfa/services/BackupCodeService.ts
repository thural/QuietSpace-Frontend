/**
 * Backup Code Service Implementation
 *
 * Implements backup code authentication with secure generation
 * and verification following Single Responsibility Principle.
 */

import type { IBackupCodeService, BackupCodesConfig, BackupCodesEnrollmentData, BackupCodeVerificationResult } from '../interfaces/IBackupCodeService';

/**
 * Backup code service implementation
 * 
 * Provides backup code functionality including generation,
 * verification, and management.
 */
export class BackupCodeService implements IBackupCodeService {
    readonly name = 'BackupCodeService';
    private readonly config: BackupCodesConfig;
    private readonly statistics = {
        totalGenerations: 0,
        successfulVerifications: 0,
        failedVerifications: 0,
        totalCodesGenerated: 0
    };
    private readonly userCodes = new Map<string, BackupCodesEnrollmentData>();

    constructor(config: Partial<BackupCodesConfig> = {}) {
        this.config = {
            count: 10,
            length: 8,
            format: 'alphanumeric',
            ...config
        };
    }

    /**
     * Generates backup codes for user
     */
    async generateBackupCodes(userId: string, config?: BackupCodesConfig): Promise<BackupCodesEnrollmentData> {
        try {
            // Use provided config or fall back to instance config
            const finalConfig = { ...this.config, ...config };

            // Generate backup codes
            const codes: string[] = [];
            for (let i = 0; i < finalConfig.count; i++) {
                codes.push(this.generateBackupCode(finalConfig.length, finalConfig.format));
            }

            const enrollmentData: BackupCodesEnrollmentData = {
                codes,
                usedCodes: [],
                generatedAt: Date.now(),
                ...(finalConfig.format === 'numeric' ? {} : { expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) })
            };

            // Store user codes
            this.userCodes.set(userId, enrollmentData);

            this.statistics.totalGenerations++;
            this.statistics.totalCodesGenerated += finalConfig.count;

            return enrollmentData;
        } catch (error) {
            throw new Error(`Failed to generate backup codes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Verifies backup code
     */
    async verifyBackupCode(userId: string, code: string): Promise<BackupCodeVerificationResult> {
        try {
            const userEnrollment = this.userCodes.get(userId);

            if (!userEnrollment) {
                return {
                    valid: false,
                    alreadyUsed: false,
                    remainingCodes: 0
                };
            }

            // Check if codes are expired
            if (userEnrollment.expiresAt && Date.now() > userEnrollment.expiresAt) {
                return {
                    valid: false,
                    alreadyUsed: false,
                    remainingCodes: 0
                };
            }

            // Check if code has already been used
            if (userEnrollment.usedCodes.includes(code)) {
                return {
                    valid: false,
                    alreadyUsed: true,
                    remainingCodes: userEnrollment.codes.length - userEnrollment.usedCodes.length
                };
            }

            // Check if code is valid
            const isValid = userEnrollment.codes.includes(code);

            if (isValid) {
                // Mark code as used
                userEnrollment.usedCodes.push(code);
                this.userCodes.set(userId, userEnrollment);
                this.statistics.successfulVerifications++;
            } else {
                this.statistics.failedVerifications++;
            }

            const remainingCodes = userEnrollment.codes.length - userEnrollment.usedCodes.length;

            return {
                valid: isValid,
                alreadyUsed: false,
                remainingCodes
            };
        } catch (error) {
            this.statistics.failedVerifications++;
            throw new Error(`Failed to verify backup code: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Gets remaining backup codes for user
     */
    async getRemainingCodes(userId: string): Promise<string[]> {
        const userEnrollment = this.userCodes.get(userId);

        if (!userEnrollment) {
            return [];
        }

        // Check expiration
        if (userEnrollment.expiresAt && Date.now() > userEnrollment.expiresAt) {
            return [];
        }

        // Return unused codes
        return userEnrollment.codes.filter(code => !userEnrollment.usedCodes.includes(code));
    }

    /**
     * Regenerates backup codes for user
     */
    async regenerateBackupCodes(userId: string, config: BackupCodesConfig): Promise<BackupCodesEnrollmentData> {
        try {
            // Remove existing codes
            this.userCodes.delete(userId);

            // Generate new codes
            return this.generateBackupCodes(userId, config);
        } catch (error) {
            throw new Error(`Failed to regenerate backup codes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generates single backup code
     */
    generateBackupCode(length: number, format: string): string {
        let chars: string;

        switch (format) {
            case 'numeric':
                chars = '0123456789';
                break;
            case 'alphanumeric':
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                break;
            case 'mixed':
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                break;
            default:
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Validates backup code format
     */
    validateBackupCodeFormat(code: string, format: string): boolean {
        let regex: RegExp;

        switch (format) {
            case 'numeric':
                regex = /^\d+$/;
                break;
            case 'alphanumeric':
                regex = /^[A-Z0-9]+$/;
                break;
            case 'mixed':
                regex = /^[A-Za-z0-9]+$/;
                break;
            default:
                regex = /^[A-Z0-9]+$/;
        }

        return regex.test(code) && code.length >= 6;
    }

    /**
     * Checks backup code expiration
     */
    async areBackupCodesExpired(userId: string): Promise<boolean> {
        const userEnrollment = this.userCodes.get(userId);

        if (!userEnrollment || !userEnrollment.expiresAt) {
            return false; // No expiration set
        }

        return Date.now() > userEnrollment.expiresAt;
    }

    /**
     * Gets backup code service statistics
     */
    getStatistics() {
        const activeUsers = this.userCodes.size;
        const averageCodesPerUser = activeUsers > 0
            ? this.statistics.totalCodesGenerated / activeUsers
            : 0;

        return {
            totalGenerations: this.statistics.totalGenerations,
            successfulVerifications: this.statistics.successfulVerifications,
            failedVerifications: this.statistics.failedVerifications,
            averageCodesPerUser,
            expiredGenerations: 0 // Could be tracked if needed
        };
    }
}
