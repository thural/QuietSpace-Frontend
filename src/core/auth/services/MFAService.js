/**
 * Enterprise Multi-Factor Authentication (MFA) Service
 * 
 * Provides comprehensive MFA support with:
 * - TOTP (Time-based One-Time Password) authentication
 * - SMS verification for phone number-based authentication
 * - Biometric authentication (fingerprint, face recognition)
 * - Backup codes for account recovery
 * - QR code generation for easy device enrollment
 * - Security key support (WebAuthn/FIDO2)
 * - Email verification as fallback method
 */

import { AuthErrorType } from '../types/auth.domain.types.js';

/**
 * Helper function to create AuthResult
 * @param {boolean} success 
 * @param {*} data 
 * @param {Object} [error] 
 * @returns {AuthResult}
 */
function createAuthResult(success, data, error) {
    if (success) {
        return { success, data };
    }
    return { success, error };
}

/**
 * MFA enrollment interface
 */
export class MFAEnrollment {
    /** @type {string} */
    id;
    /** @type {string} */
    userId;
    /** @type {string} */
    method;
    /** @type {'pending'|'active'|'disabled'|'revoked'} */
    status;
    /** @type {Object|undefined} */
    deviceInfo;
    /** @type {Object} */
    metadata;

    /**
     * @param {Object} data 
     */
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.method = data.method;
        this.status = data.status;
        this.deviceInfo = data.deviceInfo;
        this.metadata = data.metadata;
    }
}

/**
 * Supported MFA methods
 */
export const MFAMethods = Object.freeze({
    TOTP: 'totp',
    SMS: 'sms',
    BIOMETRICS: 'biometrics',
    BACKUP_CODES: 'backup_codes',
    SECURITY_KEY: 'security_key',
    EMAIL: 'email'
});

/**
 * Enterprise MFA Service Implementation
 */
export class MFAService {
    /** @type {string} */
    name = 'MFA Service';
    /** @type {Record<string, any>} */
    config = {
        enableTOTP: true,
        enableSMS: true,
        enableBiometrics: false,
        enableBackupCodes: true,
        enableSecurityKeys: false,
        enableEmail: true,
        totpConfig: {
            issuer: 'QuietSpace',
            period: 30,
            digits: 6,
            algorithm: 'SHA1'
        },
        smsConfig: {
            provider: 'twilio',
            template: 'Your verification code is: {code}',
            rateLimit: 5 // requests per minute
        },
        backupCodesConfig: {
            count: 10,
            length: 8,
            format: 'alphanumeric'
        }
    };

    /** @type {Map<string, MFAEnrollment>} */
    #enrollments = new Map();
    /** @type {Map<string, string>} */
    #verificationCodes = new Map();
    /** @type {Map<string, number>} */
    #rateLimitMap = new Map();

    constructor(config = {}) {
        Object.assign(this.config, config);
    }

    /**
     * Enrolls user in MFA
     * @param {string} userId 
     * @param {string} method 
     * @param {Object} [deviceInfo] 
     * @returns {Promise<AuthResult<MFAEnrollment>>}
     */
    async enroll(userId, method, deviceInfo) {
        try {
            if (!Object.values(MFAMethods).includes(method)) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: `Unsupported MFA method: ${method}`,
                        code: 'MFA_UNSUPPORTED_METHOD'
                    }
                };
            }

            // Check if method is enabled
            const configKey = `enable${method.charAt(0).toUpperCase() + method.slice(1).replace('_', '')}`;
            if (!this.config[configKey]) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: `MFA method ${method} is not enabled`,
                        code: 'MFA_METHOD_DISABLED'
                    }
                };
            }

            // Check if user already has enrollment for this method
            const existingEnrollment = Array.from(this.#enrollments.values())
                .find(enrollment => enrollment.userId === userId && enrollment.method === method);

            if (existingEnrollment && existingEnrollment.status === 'active') {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: `User already enrolled in ${method}`,
                        code: 'MFA_ALREADY_ENROLLED'
                    }
                };
            }

            // Create enrollment
            const enrollment = {
                id: this.#generateId(),
                userId,
                method,
                status: 'pending',
                deviceInfo,
                metadata: {
                    enrolledAt: Date.now(),
                    usageCount: 0
                }
            };

            // Handle method-specific enrollment
            const enrollmentResult = await this.#handleMethodEnrollment(enrollment);

            if (!enrollmentResult.success) {
                return enrollmentResult;
            }

            this.#enrollments.set(enrollment.id, enrollment);

            return {
                success: true,
                data: enrollment
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `MFA enrollment failed: ${error.message}`,
                    code: 'MFA_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Verifies MFA code
     * @param {string} userId 
     * @param {string} method 
     * @param {string} code 
     * @returns {Promise<AuthResult<boolean>>}
     */
    async verify(userId, method, code) {
        try {
            // Find active enrollment
            const enrollment = Array.from(this.#enrollments.values())
                .find(e => e.userId === userId && e.method === method && e.status === 'active');

            if (!enrollment) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'No active MFA enrollment found',
                        code: 'MFA_NO_ACTIVE_ENROLLMENT'
                    }
                };
            }

            // Check rate limiting
            if (this.#isRateLimited(userId)) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'Too many verification attempts. Please try again later.',
                        code: 'MFA_RATE_LIMITED'
                    }
                };
            }

            // Verify based on method
            const verificationResult = await this.#verifyMethodCode(enrollment, code);

            if (verificationResult.success) {
                // Update enrollment metadata
                enrollment.metadata.lastUsed = Date.now();
                enrollment.metadata.usageCount++;
                enrollment.metadata.verifiedAt = Date.now();

                // Clear verification code if exists
                this.#verificationCodes.delete(`${userId}:${method}`);
            }

            return verificationResult;
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `MFA verification failed: ${error.message}`,
                    code: 'MFA_VERIFICATION_ERROR'
                }
            };
        }
    }

    /**
     * Sends verification code
     * @param {string} userId 
     * @param {string} method 
     * @param {string} target 
     * @returns {Promise<AuthResult<void>>}
     */
    async sendCode(userId, method, target) {
        try {
            // Find active enrollment
            const enrollment = Array.from(this.#enrollments.values())
                .find(e => e.userId === userId && e.method === method && e.status === 'active');

            if (!enrollment) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'No active MFA enrollment found',
                        code: 'MFA_NO_ACTIVE_ENROLLMENT'
                    }
                };
            }

            // Check rate limiting
            if (this.#isRateLimited(userId)) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'Too many code requests. Please try again later.',
                        code: 'MFA_RATE_LIMITED'
                    }
                };
            }

            // Generate and send code based on method
            const sendResult = await this.#sendVerificationCode(enrollment, target);

            if (sendResult.success) {
                // Update rate limit
                this.#updateRateLimit(userId);
            }

            return sendResult;
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to send verification code: ${error.message}`,
                    code: 'MFA_SEND_CODE_ERROR'
                }
            };
        }
    }

    /**
     * Gets user enrollments
     * @param {string} userId 
     * @returns {MFAEnrollment[]}
     */
    getUserEnrollments(userId) {
        return Array.from(this.#enrollments.values())
            .filter(enrollment => enrollment.userId === userId);
    }

    /**
     * Disables MFA enrollment
     * @param {string} enrollmentId 
     * @returns {AuthResult<void>}
     */
    async disableEnrollment(enrollmentId) {
        try {
            const enrollment = this.#enrollments.get(enrollmentId);

            if (!enrollment) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'Enrollment not found',
                        code: 'MFA_ENROLLMENT_NOT_FOUND'
                    }
                };
            }

            enrollment.status = 'disabled';
            this.#enrollments.set(enrollmentId, enrollment);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to disable enrollment: ${error.message}`,
                    code: 'MFA_DISABLE_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Generates backup codes
     * @param {string} userId 
     * @returns {AuthResult<string[]>}
     */
    async generateBackupCodes(userId) {
        try {
            const codes = [];
            const { count, length, format } = this.config.backupCodesConfig;

            for (let i = 0; i < count; i++) {
                codes.push(this.#generateBackupCode(length, format));
            }

            // Store hashed versions of codes
            codes.forEach(code => {
                const hashedCode = this.#hashCode(code);
                this.#verificationCodes.set(`${userId}:backup:${hashedCode}`, {
                    code: hashedCode,
                    createdAt: Date.now(),
                    used: false
                });
            });

            return {
                success: true,
                data: codes
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to generate backup codes: ${error.message}`,
                    code: 'MFA_GENERATE_BACKUP_CODES_ERROR'
                }
            };
        }
    }

    /**
     * Handles method-specific enrollment
     * @param {MFAEnrollment} enrollment 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #handleMethodEnrollment(enrollment) {
        try {
            switch (enrollment.method) {
                case MFAMethods.TOTP:
                    return await this.#enrollTOTP(enrollment);
                case MFAMethods.SMS:
                    return await this.#enrollSMS(enrollment);
                case MFAMethods.BIOMETRICS:
                    return await this.#enrollBiometrics(enrollment);
                case MFAMethods.SECURITY_KEY:
                    return await this.#enrollSecurityKey(enrollment);
                case MFAMethods.EMAIL:
                    return await this.#enrollEmail(enrollment);
                case MFAMethods.BACKUP_CODES:
                    return await this.#enrollBackupCodes(enrollment);
                default:
                    return {
                        success: false,
                        error: {
                            type: 'validation_error',
                            message: `Unsupported enrollment method: ${enrollment.method}`,
                            code: 'MFA_UNSUPPORTED_ENROLLMENT_METHOD'
                        }
                    };
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Method enrollment failed: ${error.message}`,
                    code: 'MFA_METHOD_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Enrolls in TOTP
     * @param {MFAEnrollment} enrollment 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #enrollTOTP(enrollment) {
        try {
            // Generate TOTP secret
            const secret = this.#generateTOTPSecret();

            // Generate QR code data
            const qrData = this.#generateTOTPQRCode(enrollment.userId, secret);

            // Store secret (in real implementation, this would be encrypted)
            enrollment.metadata.totpSecret = secret;
            enrollment.metadata.qrCode = qrData;
            enrollment.status = 'active';

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `TOTP enrollment failed: ${error.message}`,
                    code: 'MFA_TOTP_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Enrolls in SMS
     * @param {MFAEnrollment} enrollment 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #enrollSMS(enrollment) {
        try {
            // In a real implementation, this would verify the phone number
            // For demo purposes, just mark as active
            enrollment.status = 'active';

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `SMS enrollment failed: ${error.message}`,
                    code: 'MFA_SMS_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Enrolls in biometrics
     * @param {MFAEnrollment} enrollment 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #enrollBiometrics(enrollment) {
        try {
            // In a real implementation, this would use WebAuthn API
            // For demo purposes, just mark as active
            enrollment.status = 'active';

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Biometric enrollment failed: ${error.message}`,
                    code: 'MFA_BIOMETRIC_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Enrolls in security key
     * @param {MFAEnrollment} enrollment 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #enrollSecurityKey(enrollment) {
        try {
            // In a real implementation, this would use WebAuthn/FIDO2
            // For demo purposes, just mark as active
            enrollment.status = 'active';

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Security key enrollment failed: ${error.message}`,
                    code: 'MFA_SECURITY_KEY_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Enrolls in email
     * @param {MFAEnrollment} enrollment 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #enrollEmail(enrollment) {
        try {
            // In a real implementation, this would verify the email address
            // For demo purposes, just mark as active
            enrollment.status = 'active';

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Email enrollment failed: ${error.message}`,
                    code: 'MFA_EMAIL_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Enrolls in backup codes
     * @param {MFAEnrollment} enrollment 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #enrollBackupCodes(enrollment) {
        try {
            // Generate backup codes
            const generateResult = await this.generateBackupCodes(enrollment.userId);

            if (!generateResult.success) {
                return generateResult;
            }

            enrollment.status = 'active';
            enrollment.metadata.backupCodes = generateResult.data;

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Backup codes enrollment failed: ${error.message}`,
                    code: 'MFA_BACKUP_CODES_ENROLLMENT_ERROR'
                }
            };
        }
    }

    /**
     * Verifies method-specific code
     * @param {MFAEnrollment} enrollment 
     * @param {string} code 
     * @returns {Promise<AuthResult<boolean>>}
     * @private
     */
    async #verifyMethodCode(enrollment, code) {
        try {
            switch (enrollment.method) {
                case MFAMethods.TOTP:
                    return await this.#verifyTOTP(enrollment, code);
                case MFAMethods.SMS:
                    return await this.#verifySMS(enrollment, code);
                case MFAMethods.BIOMETRICS:
                    return await this.#verifyBiometrics(enrollment, code);
                case MFAMethods.SECURITY_KEY:
                    return await this.#verifySecurityKey(enrollment, code);
                case MFAMethods.EMAIL:
                    return await this.#verifyEmail(enrollment, code);
                case MFAMethods.BACKUP_CODES:
                    return await this.#verifyBackupCode(enrollment, code);
                default:
                    return {
                        success: false,
                        error: {
                            type: 'validation_error',
                            message: `Unsupported verification method: ${enrollment.method}`,
                            code: 'MFA_UNSUPPORTED_VERIFICATION_METHOD'
                        }
                    };
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Method verification failed: ${error.message}`,
                    code: 'MFA_METHOD_VERIFICATION_ERROR'
                }
            };
        }
    }

    /**
     * Verifies TOTP code
     * @param {MFAEnrollment} enrollment 
     * @param {string} code 
     * @returns {Promise<AuthResult<boolean>>}
     * @private
     */
    async #verifyTOTP(enrollment, code) {
        try {
            // In a real implementation, this would verify the TOTP code
            // For demo purposes, accept any 6-digit code
            if (code.length === 6 && /^\d{6}$/.test(code)) {
                return {
                    success: true,
                    data: true
                };
            }

            return {
                success: false,
                error: {
                    type: 'validation_error',
                    message: 'Invalid TOTP code',
                    code: 'MFA_INVALID_TOTP_CODE'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `TOTP verification failed: ${error.message}`,
                    code: 'MFA_TOTP_VERIFICATION_ERROR'
                }
            };
        }
    }

    /**
     * Verifies SMS code
     * @param {MFAEnrollment} enrollment 
     * @param {string} code 
     * @returns {Promise<AuthResult<boolean>>}
     * @private
     */
    async #verifySMS(enrollment, code) {
        try {
            const storedCode = this.#verificationCodes.get(`${enrollment.userId}:sms`);

            if (!storedCode) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'No SMS code found',
                        code: 'MFA_NO_SMS_CODE'
                    }
                };
            }

            if (storedCode.code === code && !storedCode.used) {
                storedCode.used = true;
                return {
                    success: true,
                    data: true
                };
            }

            return {
                success: false,
                error: {
                    type: 'validation_error',
                    message: 'Invalid SMS code',
                    code: 'MFA_INVALID_SMS_CODE'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `SMS verification failed: ${error.message}`,
                    code: 'MFA_SMS_VERIFICATION_ERROR'
                }
            };
        }
    }

    /**
     * Verifies biometric data
     * @param {MFAEnrollment} enrollment 
     * @param {string} code 
     * @returns {Promise<AuthResult<boolean>>}
     * @private
     */
    async #verifyBiometrics(enrollment, code) {
        try {
            // In a real implementation, this would use WebAuthn API
            // For demo purposes, accept any non-empty code
            if (code && code.length > 0) {
                return {
                    success: true,
                    data: true
                };
            }

            return {
                success: false,
                error: {
                    type: 'validation_error',
                    message: 'Invalid biometric data',
                    code: 'MFA_INVALID_BIOMETRIC_DATA'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Biometric verification failed: ${error.message}`,
                    code: 'MFA_BIOMETRIC_VERIFICATION_ERROR'
                }
            };
        }
    }

    /**
     * Verifies security key
     * @param {MFAEnrollment} enrollment 
     * @param {string} code 
     * @returns {Promise<AuthResult<boolean>>}
     * @private
     */
    async #verifySecurityKey(enrollment, code) {
        try {
            // In a real implementation, this would use WebAuthn/FIDO2
            // For demo purposes, accept any non-empty code
            if (code && code.length > 0) {
                return {
                    success: true,
                    data: true
                };
            }

            return {
                success: false,
                error: {
                    type: 'validation_error',
                    message: 'Invalid security key response',
                    code: 'MFA_INVALID_SECURITY_KEY_RESPONSE'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Security key verification failed: ${error.message}`,
                    code: 'MFA_SECURITY_KEY_VERIFICATION_ERROR'
                }
            };
        }
    }

    /**
     * Verifies email code
     * @param {MFAEnrollment} enrollment 
     * @param {string} code 
     * @returns {Promise<AuthResult<boolean>>}
     * @private
     */
    async #verifyEmail(enrollment, code) {
        try {
            const storedCode = this.#verificationCodes.get(`${enrollment.userId}:email`);

            if (!storedCode) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'No email code found',
                        code: 'MFA_NO_EMAIL_CODE'
                    }
                };
            }

            if (storedCode.code === code && !storedCode.used) {
                storedCode.used = true;
                return {
                    success: true,
                    data: true
                };
            }

            return {
                success: false,
                error: {
                    type: 'validation_error',
                    message: 'Invalid email code',
                    code: 'MFA_INVALID_EMAIL_CODE'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Email verification failed: ${error.message}`,
                    code: 'MFA_EMAIL_VERIFICATION_ERROR'
                }
            };
        }
    }

    /**
     * Verifies backup code
     * @param {MFAEnrollment} enrollment 
     * @param {string} code 
     * @returns {Promise<AuthResult<boolean>>}
     * @private
     */
    async #verifyBackupCode(enrollment, code) {
        try {
            const hashedCode = this.#hashCode(code);
            const storedCode = this.#verificationCodes.get(`${enrollment.userId}:backup:${hashedCode}`);

            if (!storedCode) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'Invalid backup code',
                        code: 'MFA_INVALID_BACKUP_CODE'
                    }
                };
            }

            if (!storedCode.used) {
                storedCode.used = true;
                return {
                    success: true,
                    data: true
                };
            }

            return {
                success: false,
                error: {
                    type: 'validation_error',
                    message: 'Backup code already used',
                    code: 'MFA_BACKUP_CODE_USED'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Backup code verification failed: ${error.message}`,
                    code: 'MFA_BACKUP_CODE_VERIFICATION_ERROR'
                }
            };
        }
    }

    /**
     * Sends verification code
     * @param {MFAEnrollment} enrollment 
     * @param {string} target 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #sendVerificationCode(enrollment, target) {
        try {
            switch (enrollment.method) {
                case MFAMethods.SMS:
                    return await this.#sendSMSCode(enrollment, target);
                case MFAMethods.EMAIL:
                    return await this.#sendEmailCode(enrollment, target);
                default:
                    return {
                        success: false,
                        error: {
                            type: 'validation_error',
                            message: `Code sending not supported for ${enrollment.method}`,
                            code: 'MFA_CODE_SENDING_NOT_SUPPORTED'
                        }
                    };
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to send verification code: ${error.message}`,
                    code: 'MFA_SEND_VERIFICATION_CODE_ERROR'
                }
            };
        }
    }

    /**
     * Sends SMS code
     * @param {MFAEnrollment} enrollment 
     * @param {string} phoneNumber 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #sendSMSCode(enrollment, phoneNumber) {
        try {
            const code = this.#generateVerificationCode();

            // Store code
            this.#verificationCodes.set(`${enrollment.userId}:sms`, {
                code,
                createdAt: Date.now(),
                used: false
            });

            // In a real implementation, this would send via SMS service
            console.log(`SMS sent to ${phoneNumber}: ${this.config.smsConfig.template.replace('{code}', code)}`);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to send SMS: ${error.message}`,
                    code: 'MFA_SEND_SMS_ERROR'
                }
            };
        }
    }

    /**
     * Sends email code
     * @param {MFAEnrollment} enrollment 
     * @param {string} emailAddress 
     * @returns {Promise<AuthResult<void>>}
     * @private
     */
    async #sendEmailCode(enrollment, emailAddress) {
        try {
            const code = this.#generateVerificationCode();

            // Store code
            this.#verificationCodes.set(`${enrollment.userId}:email`, {
                code,
                createdAt: Date.now(),
                used: false
            });

            // In a real implementation, this would send via email service
            console.log(`Email sent to ${emailAddress}: Your verification code is: ${code}`);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to send email: ${error.message}`,
                    code: 'MFA_SEND_EMAIL_ERROR'
                }
            };
        }
    }

    /**
     * Checks if user is rate limited
     * @param {string} userId 
     * @returns {boolean}
     * @private
     */
    #isRateLimited(userId) {
        const lastRequest = this.#rateLimitMap.get(userId);
        if (!lastRequest) return false;

        const timeSinceLastRequest = Date.now() - lastRequest;
        const rateLimitPeriod = 60000 / this.config.smsConfig.rateLimit; // Convert to milliseconds

        return timeSinceLastRequest < rateLimitPeriod;
    }

    /**
     * Updates rate limit
     * @param {string} userId 
     * @private
     */
    #updateRateLimit(userId) {
        this.#rateLimitMap.set(userId, Date.now());
    }

    /**
     * Generates TOTP secret
     * @returns {string}
     * @private
     */
    #generateTOTPSecret() {
        const randomBytes = new Uint8Array(20);
        crypto.getRandomValues(randomBytes);
        return btoa(String.fromCharCode(...randomBytes)).replace(/[^a-zA-Z0-9]/g, '');
    }

    /**
     * Generates TOTP QR code data
     * @param {string} userId 
     * @param {string} secret 
     * @returns {string}
     * @private
     */
    #generateTOTPQRCode(userId, secret) {
        const issuer = this.config.totpConfig.issuer;
        const label = `${issuer}:${userId}`;
        const params = new URLSearchParams({
            secret,
            issuer,
            algorithm: this.config.totpConfig.algorithm,
            digits: this.config.totpConfig.digits.toString(),
            period: this.config.totpConfig.period.toString()
        });

        return `otpauth://totp/${label}?${params.toString()}`;
    }

    /**
     * Generates verification code
     * @returns {string}
     * @private
     */
    #generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Generates backup code
     * @param {number} length 
     * @param {string} format 
     * @returns {string}
     * @private
     */
    #generateBackupCode(length, format) {
        const chars = format === 'numeric' ? '0123456789' :
            format === 'alphanumeric' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' :
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Hashes code for storage
     * @param {string} code 
     * @returns {string}
     * @private
     */
    #hashCode(code) {
        // In a real implementation, this would use a proper hashing algorithm
        // For demo purposes, use a simple hash
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    /**
     * Generates unique ID
     * @returns {string}
     * @private
     */
    #generateId() {
        return `mfa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
