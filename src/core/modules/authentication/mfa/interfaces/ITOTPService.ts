/**
 * TOTP Service Interface
 *
 * Defines contract for Time-based One-Time Password authentication.
 * This interface focuses solely on TOTP-related operations following
 * the Single Responsibility Principle.
 */

/**
 * TOTP configuration
 */
export interface TOTPConfig {
    /** Issuer name for TOTP */
    issuer: string;
    /** Token validity period in seconds */
    period: number;
    /** Number of digits in TOTP code */
    digits: number;
    /** Algorithm used for TOTP */
    algorithm: 'SHA1' | 'SHA256' | 'SHA512';
}

/**
 * TOTP enrollment data
 */
export interface TOTPEnrollmentData {
    /** Secret key for TOTP */
    secret: string;
    /** QR code data URI */
    qrCode: string;
    /** Manual entry key */
    manualEntryKey: string;
    /** Verification codes for setup */
    backupCodes: string[];
}

/**
 * TOTP verification result
 */
export interface TOTPVerificationResult {
    /** Whether verification was successful */
    valid: boolean;
    /** Remaining time until next code */
    remainingTime: number;
    /** Current TOTP code (for testing only) */
    currentCode?: string;
}

/**
 * TOTP service interface
 * 
 * Provides TOTP-specific operations including enrollment,
 * verification, and QR code generation.
 */
export interface ITOTPService {
    /**
     * Generates TOTP secret and QR code for enrollment
     * 
     * @param userId - User identifier
     * @param accountName - Account name for TOTP
     * @returns TOTP enrollment data with secret and QR code
     */
    generateTOTPSecret(userId: string, accountName: string): Promise<TOTPEnrollmentData>;

    /**
     * Verifies TOTP code
     * 
     * @param secret - TOTP secret
     * @param code - TOTP code to verify
     * @param window - Time window for verification (default: 1)
     * @returns Verification result with validity and timing info
     */
    verifyTOTPCode(secret: string, code: string, window?: number): Promise<TOTPVerificationResult>;

    /**
     * Generates current TOTP code for testing
     * 
     * @param secret - TOTP secret
     * @returns Current TOTP code
     */
    generateCurrentCode(secret: string): Promise<string>;

    /**
     * Gets remaining time until next code
     * 
     * @param period - TOTP period in seconds
     * @returns Remaining seconds until next code
     */
    getRemainingTime(period?: number): number;

    /**
     * Validates TOTP secret format
     * 
     * @param secret - TOTP secret to validate
     * @returns Whether secret is valid
     */
    validateSecret(secret: string): boolean;

    /**
     * Gets TOTP service statistics
     * 
     * @returns TOTP-specific usage statistics
     */
    getStatistics(): {
        totalEnrollments: number;
        successfulVerifications: number;
        failedVerifications: number;
        averageVerificationTime: number;
    };
}
