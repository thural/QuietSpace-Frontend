/**
 * Backup Code Service Interface
 *
 * Defines contract for backup code authentication.
 * This interface focuses solely on backup code operations following
 * the Single Responsibility Principle.
 */

/**
 * Backup codes configuration
 */
export interface BackupCodesConfig {
    /** Number of backup codes to generate */
    count: number;
    /** Length of each backup code */
    length: number;
    /** Code format */
    format: 'alphanumeric' | 'numeric' | 'mixed';
}

/**
 * Backup codes enrollment data
 */
export interface BackupCodesEnrollmentData {
    /** Generated backup codes */
    codes: string[];
    /** Used codes tracking */
    usedCodes: string[];
    /** Generation timestamp */
    generatedAt: number;
    /** Expiration timestamp */
    expiresAt?: number;
}

/**
 * Backup code verification result
 */
export interface BackupCodeVerificationResult {
    /** Whether verification was successful */
    valid: boolean;
    /** Whether code was already used */
    alreadyUsed: boolean;
    /** Remaining backup codes */
    remainingCodes: number;
}

/**
 * Backup code service interface
 * 
 * Provides backup code-specific operations including generation,
 * verification, and management.
 */
export interface IBackupCodeService {
    /**
     * Generates backup codes for user
     * 
     * @param userId - User identifier
     * @param config - Backup codes configuration
     * @returns Generated backup codes data
     */
    generateBackupCodes(userId: string, config: BackupCodesConfig): Promise<BackupCodesEnrollmentData>;

    /**
     * Verifies backup code
     * 
     * @param userId - User identifier
     * @param code - Backup code to verify
     * @returns Verification result
     */
    verifyBackupCode(userId: string, code: string): Promise<BackupCodeVerificationResult>;

    /**
     * Gets remaining backup codes for user
     * 
     * @param userId - User identifier
     * @returns Array of remaining backup codes
     */
    getRemainingCodes(userId: string): Promise<string[]>;

    /**
     * Regenerates backup codes for user
     * 
     * @param userId - User identifier
     * @param config - Backup codes configuration
     * @returns New backup codes data
     */
    regenerateBackupCodes(userId: string, config: BackupCodesConfig): Promise<BackupCodesEnrollmentData>;

    /**
     * Generates single backup code
     * 
     * @param length - Code length
     * @param format - Code format
     * @returns Generated backup code
     */
    generateBackupCode(length: number, format: string): string;

    /**
     * Validates backup code format
     * 
     * @param code - Backup code to validate
     * @param format - Expected format
     * @returns Whether code format is valid
     */
    validateBackupCodeFormat(code: string, format: string): boolean;

    /**
     * Checks backup code expiration
     * 
     * @param userId - User identifier
     * @returns Whether backup codes are expired
     */
    areBackupCodesExpired(userId: string): Promise<boolean>;

    /**
     * Gets backup code service statistics
     * 
     * @returns Backup code-specific usage statistics
     */
    getStatistics(): {
        totalGenerations: number;
        successfulVerifications: number;
        failedVerifications: number;
        averageCodesPerUser: number;
        expiredGenerations: number;
    };
}
