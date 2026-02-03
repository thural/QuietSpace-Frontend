/**
 * Main MFA Service Interface
 *
 * Defines the contract for multi-factor authentication orchestration.
 * This interface provides a unified API for MFA operations while
 * delegating specific implementations to specialized services.
 */

import type { MFAMethod, MFAEnrollment, MFAChallenge, MFAVerification } from '../types/mfa.types';

/**
 * Main MFA service interface
 * 
 * Provides high-level MFA operations including enrollment management,
 * verification challenges, and method discovery.
 */
export interface IMFAService {
    /**
     * Gets available MFA methods for a user
     * 
     * @param userId - User identifier
     * @returns Array of available MFA methods
     */
    getAvailableMethods(userId: string): Promise<MFAMethod[]>;

    /**
     * Initiates MFA enrollment for a specific method
     * 
     * @param userId - User identifier
     * @param methodType - MFA method type
     * @param enrollmentData - Method-specific enrollment data
     * @returns Enrollment result with method-specific data
     */
    enrollMethod(userId: string, methodType: string, enrollmentData: any): Promise<any>;

    /**
     * Verifies MFA enrollment completion
     * 
     * @param userId - User identifier
     * @param enrollmentId - Enrollment identifier
     * @param verificationData - Verification data (code, token, etc.)
     * @returns Verification success status
     */
    verifyEnrollment(userId: string, enrollmentId: string, verificationData: any): Promise<boolean>;

    /**
     * Creates MFA verification challenge
     * 
     * @param userId - User identifier
     * @param requiredMethods - Required MFA methods
     * @returns Created challenge details
     */
    createChallenge(userId: string, requiredMethods: string[]): Promise<MFAChallenge>;

    /**
     * Verifies MFA challenge response
     * 
     * @param challengeId - Challenge identifier
     * @param methodType - MFA method type
     * @param verificationData - Verification response data
     * @returns Verification success status
     */
    verifyChallenge(challengeId: string, methodType: string, verificationData: any): Promise<boolean>;

    /**
     * Gets user's MFA enrollments
     * 
     * @param userId - User identifier
     * @returns Array of user's MFA enrollments
     */
    getUserEnrollments(userId: string): Promise<MFAEnrollment[]>;

    /**
     * Removes MFA enrollment
     * 
     * @param userId - User identifier
     * @param enrollmentId - Enrollment identifier
     * @returns Removal success status
     */
    removeEnrollment(userId: string, enrollmentId: string): Promise<boolean>;

    /**
     * Gets MFA service statistics
     * 
     * @returns Service usage and performance statistics
     */
    getStatistics(): {
        totalEnrollments: number;
        activeChallenges: number;
        methodUsage: Record<string, number>;
        successRate: number;
    };
}
