/**
 * SMS Service Implementation (Mock)
 *
 * Implements SMS verification authentication with
 * mock functionality for demonstration purposes.
 */

import type { ISMSService, SMSConfig, SMSEnrollmentData, SMSVerificationResult } from '../interfaces/ISMSService';

/**
 * SMS service implementation
 * 
 * Provides SMS functionality including enrollment,
 * verification, and rate limiting.
 */
export class SMSService implements ISMSService {
    readonly name = 'SMSService';
    private readonly config: SMSConfig;
    private readonly statistics = {
        totalEnrollments: 0,
        successfulVerifications: 0,
        failedVerifications: 0,
        totalSMSSent: 0,
        totalDeliveryTime: 0
    };
    private readonly rateLimitStore = new Map<string, { lastSent: number; count: number }>();
    private readonly verificationStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

    constructor(config: Partial<SMSConfig> = {}) {
        this.config = {
            provider: 'twilio',
            template: 'Your verification code is: {code}',
            rateLimit: 5, // 5 SMS per minute
            ...config
        };
    }

    /**
     * Initiates SMS verification enrollment
     */
    async enrollSMS(userId: string, phoneNumber: string, countryCode: string): Promise<SMSEnrollmentData> {
        const startTime = Date.now();
        
        try {
            // Check rate limiting
            const rateLimitCheck = this.canSendSMS(userId);
            if (!rateLimitCheck.canSend) {
                throw new Error(`Rate limit exceeded. Try again at ${new Date(rateLimitCheck.nextAvailableTime!).toLocaleTimeString()}`);
            }

            // Validate phone number
            if (!this.validatePhoneNumber(phoneNumber, countryCode)) {
                throw new Error('Invalid phone number format');
            }

            // Generate verification code
            const verificationCode = this.generateVerificationCode();
            
            // Send SMS
            const sendSuccess = await this.sendSMSVerification(phoneNumber, verificationCode);
            if (!sendSuccess) {
                throw new Error('Failed to send SMS verification');
            }

            // Store verification
            this.verificationStore.set(userId, {
                code: verificationCode,
                expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
                attempts: 0
            });

            // Update rate limiting
            this.updateRateLimit(userId);

            const enrollmentData: SMSEnrollmentData = {
                phoneNumber: this.maskPhoneNumber(phoneNumber),
                countryCode,
                verified: false
            };

            this.statistics.totalEnrollments++;
            this.statistics.totalDeliveryTime += Date.now() - startTime;

            return enrollmentData;
        } catch (error) {
            throw new Error(`Failed to enroll SMS: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Verifies SMS enrollment code
     */
    async verifySMSEnrollment(userId: string, enrollmentId: string, code: string): Promise<SMSVerificationResult> {
        const startTime = Date.now();
        
        try {
            const verification = this.verificationStore.get(userId);
            
            if (!verification) {
                throw new Error('No pending SMS verification found');
            }

            // Check expiration
            if (Date.now() > verification.expiresAt) {
                this.verificationStore.delete(userId);
                return {
                    valid: false,
                    remainingAttempts: 0,
                    nextSMSTime: Date.now() + 60000 // 1 minute cooldown
                };
            }

            // Check attempts
            if (verification.attempts >= 3) {
                this.verificationStore.delete(userId);
                return {
                    valid: false,
                    remainingAttempts: 0,
                    nextSMSTime: Date.now() + 60000 // 1 minute cooldown
                };
            }

            verification.attempts++;

            // Verify code
            const isValid = verification.code === code;
            
            if (isValid) {
                this.statistics.successfulVerifications++;
                this.verificationStore.delete(userId);
            } else {
                this.statistics.failedVerifications++;
            }

            return {
                valid: isValid,
                remainingAttempts: 3 - verification.attempts,
                nextSMSTime: isValid ? undefined : Date.now() + 60000
            };
        } catch (error) {
            this.statistics.failedVerifications++;
            throw new Error(`Failed to verify SMS enrollment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            this.statistics.totalDeliveryTime += Date.now() - startTime;
        }
    }

    /**
     * Sends SMS verification code
     */
    async sendSMSVerification(phoneNumber: string, code: string): Promise<boolean> {
        try {
            // Mock SMS sending - in real implementation, use SMS provider API
            const message = this.config.template.replace('{code}', code);
            console.log(`[MOCK] Sending SMS to ${phoneNumber}: ${message}`);
            
            this.statistics.totalSMSSent++;
            return true;
        } catch (error) {
            console.error('Failed to send SMS:', error);
            return false;
        }
    }

    /**
     * Generates verification code
     */
    generateVerificationCode(length: number = 6): string {
        const digits = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return result;
    }

    /**
     * Masks phone number for display
     */
    maskPhoneNumber(phoneNumber: string): string {
        if (phoneNumber.length <= 4) {
            return phoneNumber;
        }
        const start = phoneNumber.substring(0, 2);
        const end = phoneNumber.substring(phoneNumber.length - 2);
        const middle = '*'.repeat(phoneNumber.length - 4);
        return start + middle + end;
    }

    /**
     * Validates phone number format
     */
    validatePhoneNumber(phoneNumber: string, countryCode: string): boolean {
        // Basic validation - should be digits only
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 15 && /^\d+$/.test(countryCode);
    }

    /**
     * Checks if SMS can be sent (rate limiting)
     */
    canSendSMS(userId: string): { canSend: boolean; nextAvailableTime?: number } {
        const now = Date.now();
        const userLimit = this.rateLimitStore.get(userId);
        
        if (!userLimit) {
            return { canSend: true };
        }

        const timeSinceLastSent = now - userLimit.lastSent;
        
        // Reset count if more than a minute has passed
        if (timeSinceLastSent > 60000) {
            return { canSend: true };
        }

        // Check if under rate limit
        if (userLimit.count < this.config.rateLimit) {
            return { canSend: true };
        }

        // Calculate next available time
        const nextAvailableTime = userLimit.lastSent + 60000;
        return { canSend: false, nextAvailableTime };
    }

    /**
     * Gets SMS service statistics
     */
    getStatistics() {
        const averageDeliveryTime = this.statistics.totalSMSSent > 0 
            ? this.statistics.totalDeliveryTime / this.statistics.totalSMSSent 
            : 0;

        return {
            totalEnrollments: this.statistics.totalEnrollments,
            successfulVerifications: this.statistics.successfulVerifications,
            failedVerifications: this.statistics.failedVerifications,
            totalSMSSent: this.statistics.totalSMSSent,
            averageDeliveryTime
        };
    }

    /**
     * Updates rate limiting for user
     */
    private updateRateLimit(userId: string): void {
        const now = Date.now();
        const userLimit = this.rateLimitStore.get(userId);
        
        if (!userLimit || now - userLimit.lastSent > 60000) {
            // New user or reset after minute
            this.rateLimitStore.set(userId, { lastSent: now, count: 1 });
        } else {
            // Increment count within minute
            this.rateLimitStore.set(userId, { lastSent: now, count: userLimit.count + 1 });
        }
    }
}
