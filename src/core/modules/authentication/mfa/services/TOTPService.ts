/**
 * TOTP Service Implementation (Mock)
 *
 * Implements Time-based One-Time Password authentication with
 * mock functionality for demonstration purposes.
 */

import type { ITOTPService, TOTPConfig, TOTPEnrollmentData, TOTPVerificationResult } from '../interfaces/ITOTPService';

/**
 * TOTP service implementation
 * 
 * Provides TOTP functionality including secret generation,
 * QR code creation, and code verification.
 */
export class TOTPService implements ITOTPService {
    readonly name = 'TOTPService';
    private readonly config: TOTPConfig;
    private readonly statistics = {
        totalEnrollments: 0,
        successfulVerifications: 0,
        failedVerifications: 0,
        totalVerificationTime: 0
    };

    constructor(config: Partial<TOTPConfig> = {}) {
        this.config = {
            issuer: 'QuietSpace',
            period: 30,
            digits: 6,
            algorithm: 'SHA1',
            ...config
        };
    }

    /**
     * Generates TOTP secret and QR code for enrollment
     */
    async generateTOTPSecret(userId: string, accountName: string): Promise<TOTPEnrollmentData> {
        const startTime = Date.now();

        try {
            // Generate mock secret
            const secret = this.generateMockSecret();

            // Generate mock QR code (data URI)
            const qrCode = `data:image/png;base64,mock_qr_code_for_${secret}`;

            // Generate manual entry key
            const manualEntryKey = secret;

            // Generate backup codes for setup
            const backupCodes = this.generateTOTPBackupCodes();

            this.statistics.totalEnrollments++;

            return {
                secret,
                qrCode,
                manualEntryKey,
                backupCodes
            };
        } catch (error) {
            throw new Error(`Failed to generate TOTP secret: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            this.statistics.totalVerificationTime += Date.now() - startTime;
        }
    }

    /**
     * Verifies TOTP code
     */
    async verifyTOTPCode(secret: string, code: string, window: number = 1): Promise<TOTPVerificationResult> {
        const startTime = Date.now();

        try {
            // Mock verification - in real implementation, use otplib
            const isValid = this.mockVerifyTOTP(code);
            const remainingTime = this.getRemainingTime();

            if (isValid) {
                this.statistics.successfulVerifications++;
            } else {
                this.statistics.failedVerifications++;
            }

            return {
                valid: isValid,
                remainingTime,
                currentCode: process.env.NODE_ENV === 'test' ? this.generateMockTOTP(secret) : undefined
            };
        } catch (error) {
            this.statistics.failedVerifications++;
            throw new Error(`Failed to verify TOTP code: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            this.statistics.totalVerificationTime += Date.now() - startTime;
        }
    }

    /**
     * Generates current TOTP code for testing
     */
    async generateCurrentCode(secret: string): Promise<string> {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('Current code generation is only available in test environment');
        }

        return this.generateMockTOTP(secret);
    }

    /**
     * Gets remaining time until next code
     */
    getRemainingTime(period: number = this.config.period): number {
        const currentTime = Math.floor(Date.now() / 1000);
        const currentPeriod = Math.floor(currentTime / period);
        const nextPeriod = (currentPeriod + 1) * period;
        return nextPeriod - currentTime;
    }

    /**
     * Validates TOTP secret format
     */
    validateSecret(secret: string): boolean {
        try {
            // Basic validation: should be base32 string
            return /^[A-Z2-7]+=*$/.test(secret) && secret.length >= 16;
        } catch {
            return false;
        }
    }

    /**
     * Gets TOTP service statistics
     */
    getStatistics() {
        const totalVerifications = this.statistics.successfulVerifications + this.statistics.failedVerifications;
        const averageVerificationTime = totalVerifications > 0
            ? this.statistics.totalVerificationTime / totalVerifications
            : 0;

        return {
            totalEnrollments: this.statistics.totalEnrollments,
            successfulVerifications: this.statistics.successfulVerifications,
            failedVerifications: this.statistics.failedVerifications,
            averageVerificationTime
        };
    }

    /**
     * Generates backup codes for TOTP setup
     */
    private generateTOTPBackupCodes(count: number = 10): string[] {
        const codes: string[] = [];
        for (let i = 0; i < count; i++) {
            codes.push(this.generateTOTPBackupCode());
        }
        return codes;
    }

    /**
     * Generates single backup code for TOTP
     */
    private generateTOTPBackupCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Generates mock TOTP secret
     */
    private generateMockSecret(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let result = '';
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Mock TOTP verification
     */
    private mockVerifyTOTP(code: string): boolean {
        // Mock verification - accept 6-digit codes
        return /^\d{6}$/.test(code) && code !== '000000';
    }

    /**
     * Generates mock TOTP code
     */
    private generateMockTOTP(secret: string): string {
        // Mock TOTP generation based on secret
        const hash = this.simpleHash(secret + Math.floor(Date.now() / 30000)); // 30-second window
        return (hash % 1000000).toString().padStart(6, '0');
    }

    /**
     * Simple hash function for mock TOTP
     */
    private simpleHash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
}
