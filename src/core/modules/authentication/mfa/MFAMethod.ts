/**
 * Unified MFA Method Interface
 *
 * Consolidates all MFA methods into a single interface
 * following Interface Segregation Principle while reducing complexity.
 */

import type { AuthResult } from '../types/auth.domain.types';

/**
 * MFA method types
 */
export enum MFAMethodType {
    TOTP = 'totp',
    SMS = 'sms',
    BACKUP_CODE = 'backup_code',
    EMAIL = 'email',
    PUSH = 'push',
    HARDWARE_TOKEN = 'hardware_token'
}

/**
 * MFA challenge request
 */
export interface MFAChallenge {
    /** Challenge identifier */
    id: string;

    /** MFA method type */
    type: MFAMethodType;

    /** Challenge data (method-specific) */
    data: Record<string, any>;

    /** Challenge expiration time */
    expiresAt: Date;

    /** Whether challenge is active */
    isActive: boolean;

    /** Challenge metadata */
    metadata?: Record<string, any>;
}

/**
 * MFA verification request
 */
export interface MFAVerification {
    /** Challenge identifier */
    challengeId: string;

    /** User response/code */
    response: string;

    /** Additional verification data */
    metadata?: Record<string, any>;
}

/**
 * MFA enrollment data
 */
export interface MFAEnrollment {
    /** Enrollment identifier */
    id: string;

    /** User identifier */
    userId: string;

    /** MFA method type */
    type: MFAMethodType;

    /** Enrollment status */
    status: 'active' | 'inactive' | 'pending' | 'disabled';

    /** Enrollment configuration */
    config: Record<string, any>;

    /** Enrollment metadata */
    metadata?: Record<string, any>;

    /** Enrollment timestamp */
    enrolledAt: Date;

    /** Last used timestamp */
    lastUsedAt?: Date;
}

/**
 * MFA result
 */
export interface MFAResult {
    /** Whether operation was successful */
    success: boolean;

    /** Result data (method-specific) */
    data?: any;

    /** Error information */
    error?: {
        type: string;
        message: string;
        code?: string;
        details?: Record<string, any>;
    };

    /** Result metadata */
    metadata?: Record<string, any>;
}

/**
 * Unified MFA Method Interface
 * 
 * Consolidates all MFA functionality into a single interface
 * while maintaining SOLID principles.
 */
export interface MFAMethod {
    /** Method name */
    readonly name: string;

    /** Method type */
    readonly type: MFAMethodType;

    /** Method capabilities */
    readonly capabilities: string[];

    /** Whether method is available */
    readonly isAvailable: boolean;

    /**
     * Enrolls user in MFA method
     */
    enroll(userId: string, config: Record<string, any>): Promise<MFAResult>;

    /**
     * Creates authentication challenge
     */
    createChallenge(userId: string, metadata?: Record<string, any>): Promise<AuthResult<MFAChallenge>>;

    /**
     * Verifies MFA challenge response
     */
    verify(challengeId: string, response: string, metadata?: Record<string, any>): Promise<MFAResult>;

    /**
     * Disables MFA method for user
     */
    disable(userId: string): Promise<MFAResult>;

    /**
     * Enables MFA method for user
     */
    enable(userId: string): Promise<MFAResult>;

    /**
     * Removes MFA enrollment
     */
    remove(userId: string): Promise<MFAResult>;

    /**
     * Gets enrollment status for user
     */
    getEnrollment(userId: string): Promise<MFAEnrollment | null>;

    /**
     * Validates method configuration
     */
    validateConfig(config: Record<string, any>): AuthResult<boolean>;

    /**
     * Gets method metadata
     */
    getMetadata(): Record<string, any>;

    /**
     * Performs health check
     */
    healthCheck(): Promise<{
        healthy: boolean;
        message?: string;
        responseTime?: number;
    }>;
}

/**
 * MFA method factory interface
 */
export interface MFAMethodFactory {
    /** Creates MFA method instance */
    create(config: Record<string, any>): MFAMethod;

    /** Gets method type */
    getType(): MFAMethodType;

    /** Validates factory configuration */
    validateConfig(config: Record<string, any>): AuthResult<boolean>;
}

/**
 * MFA registry for managing multiple methods
 */
export class MFARegistry {
    private methods: Map<MFAMethodType, MFAMethod> = new Map();
    private factories: Map<MFAMethodType, MFAMethodFactory> = new Map();

    /**
     * Registers MFA method factory
     */
    registerFactory(type: MFAMethodType, factory: MFAMethodFactory): void {
        this.factories.set(type, factory);
    }

    /**
     * Creates MFA method instance
     */
    createMethod(type: MFAMethodType, config: Record<string, any>): MFAMethod | null {
        const factory = this.factories.get(type);
        if (!factory) {
            return null;
        }

        const validation = factory.validateConfig(config);
        if (!validation.success) {
            throw new Error(`Invalid config for ${type}: ${validation.error?.message}`);
        }

        return factory.create(config);
    }

    /**
     * Gets available method types
     */
    getAvailableTypes(): MFAMethodType[] {
        return Array.from(this.factories.keys());
    }

    /**
     * Gets method by type
     */
    getMethod(type: MFAMethodType): MFAMethod | null {
        return this.methods.get(type) || null;
    }

    /**
     * Registers method instance
     */
    registerMethod(method: MFAMethod): void {
        this.methods.set(method.type, method);
    }

    /**
     * Gets all registered methods
     */
    getAllMethods(): MFAMethod[] {
        return Array.from(this.methods.values());
    }

    /**
     * Clears all methods
     */
    clear(): void {
        this.methods.clear();
        this.factories.clear();
    }
}

/**
 * Global MFA registry instance
 */
export const mfaRegistry = new MFARegistry();
