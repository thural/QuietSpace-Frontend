/**
 * SMS Service Interface
 *
 * Defines contract for SMS verification authentication.
 * This interface focuses solely on SMS-related operations following
 * the Single Responsibility Principle.
 */

/**
 * SMS configuration
 */
export interface SMSConfig {
    /** SMS service provider */
    provider: 'twilio' | 'aws-sns' | 'custom';
    /** Template for SMS messages */
    template: string;
    /** Rate limiting for SMS */
    rateLimit: number; // requests per minute
}

/**
 * SMS enrollment data
 */
export interface SMSEnrollmentData {
    /** Phone number (masked) */
    phoneNumber: string;
    /** Country code */
    countryCode: string;
    /** Verification status */
    verified: boolean;
    /** Last verification timestamp */
    lastVerified?: number;
}

/**
 * SMS verification result
 */
export interface SMSVerificationResult {
    /** Whether verification was successful */
    valid: boolean;
    /** Remaining attempts */
    remainingAttempts: number;
    /** Time until next SMS can be sent */
    nextSMSTime?: number;
}

/**
 * SMS service interface
 * 
 * Provides SMS-specific operations including enrollment,
 * verification, and rate limiting.
 */
export interface ISMSService {
    /**
     * Initiates SMS verification enrollment
     * 
     * @param userId - User identifier
     * @param phoneNumber - Phone number
     * @param countryCode - Country code
     * @returns SMS enrollment data
     */
    enrollSMS(userId: string, phoneNumber: string, countryCode: string): Promise<SMSEnrollmentData>;

    /**
     * Verifies SMS enrollment code
     * 
     * @param userId - User identifier
     * @param enrollmentId - Enrollment identifier
     * @param code - Verification code
     * @returns Verification result
     */
    verifySMSEnrollment(userId: string, enrollmentId: string, code: string): Promise<SMSVerificationResult>;

    /**
     * Sends SMS verification code
     * 
     * @param phoneNumber - Phone number
     * @param code - Verification code
     * @returns Send success status
     */
    sendSMSVerification(phoneNumber: string, code: string): Promise<boolean>;

    /**
     * Generates verification code
     * 
     * @param length - Code length (default: 6)
     * @returns Generated verification code
     */
    generateVerificationCode(length?: number): string;

    /**
     * Masks phone number for display
     * 
     * @param phoneNumber - Phone number to mask
     * @returns Masked phone number
     */
    maskPhoneNumber(phoneNumber: string): string;

    /**
     * Validates phone number format
     * 
     * @param phoneNumber - Phone number to validate
     * @param countryCode - Country code
     * @returns Whether phone number is valid
     */
    validatePhoneNumber(phoneNumber: string, countryCode: string): boolean;

    /**
     * Checks if SMS can be sent (rate limiting)
     * 
     * @param userId - User identifier
     * @returns Whether SMS can be sent and next available time
     */
    canSendSMS(userId: string): { canSend: boolean; nextAvailableTime?: number };

    /**
     * Gets SMS service statistics
     * 
     * @returns SMS-specific usage statistics
     */
    getStatistics(): {
        totalEnrollments: number;
        successfulVerifications: number;
        failedVerifications: number;
        totalSMSSent: number;
        averageDeliveryTime: number;
    };
}
