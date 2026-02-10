/**
 * Composite Authentication Interfaces
 *
 * Consolidates related interfaces to reduce client-side complexity
 * while maintaining SOLID principles and improving developer experience.
 */

import type { IAuthenticator } from './IAuthenticator';
import type { ITokenManager } from './ITokenManager';
import type { IUserManager } from './IUserManager';
import type { IProviderManager } from './IProviderManager';
import type { IAuthValidator } from './IAuthValidator';
import type { IAuthRepository } from './authInterfaces';

/**
 * Composite Authentication Core Interface
 * 
 * Combines authentication and token management responsibilities
 * for simpler client usage.
 */
export interface IAuthCore extends IAuthenticator, ITokenManager {
    /**
     * Gets core capabilities
     */
    getCoreCapabilities(): string[];
    
    /**
     * Performs comprehensive authentication with token management
     */
    authenticateWithToken(credentials: any): Promise<any>;
    
    /**
     * Validates and refreshes token if needed
     */
    validateAndRefresh(): Promise<any>;
}

/**
 * Composite Authentication Management Interface
 * 
 * Combines user and provider management responsibilities
 * for simplified client usage.
 */
export interface IAuthManagement extends IUserManager, IProviderManager {
    /**
     * Gets management capabilities
     */
    getManagementCapabilities(): string[];
    
    /**
     * Performs comprehensive user management
     */
    manageUser(userId: string, operations: any[]): Promise<any>;
    
    /**
     * Performs comprehensive provider management
     */
    manageProviders(operations: any[]): Promise<any>;
}

/**
 * Composite Authentication Service Interface
 * 
 * Combines core authentication with management capabilities
 * for complete authentication service functionality.
 */
export interface ICompositeAuthService extends IAuthCore, IAuthManagement {
    /**
     * Gets all capabilities
     */
    getAllCapabilities(): string[];
    
    /**
     * Performs full authentication workflow
     */
    completeAuthentication(credentials: any, options?: any): Promise<any>;
    
    /**
     * Gets service health status
     */
    getServiceHealth(): Promise<{
        core: any;
        management: any;
        overall: any;
    }>;
}

/**
 * Composite Validation Interface
 * 
 * Combines authentication validation with repository validation
 * for comprehensive validation capabilities.
 */
export interface ICompositeValidator extends IAuthValidator {
    /**
     * Validates user credentials and repository data
     */
    validateWithRepository(credentials: any, repository: IAuthRepository): Promise<any>;
    
    /**
     * Performs comprehensive validation
     */
    validateComprehensive(data: any): Promise<{
        isValid: boolean;
        errors: any[];
        warnings: any[];
    }>;
}

/**
 * Authentication Service Factory Interface
 * 
 * Provides factory methods for creating composite services
 * with proper dependency injection.
 */
export interface ICompositeAuthFactory {
    /**
     * Creates core authentication service
     */
    createAuthCore(dependencies: any): IAuthCore;
    
    /**
     * Creates management service
     */
    createAuthManagement(dependencies: any): IAuthManagement;
    
    /**
     * Creates composite service
     */
    createCompositeService(dependencies: any): ICompositeAuthService;
    
    /**
     * Creates composite validator
     */
    createCompositeValidator(dependencies: any): ICompositeValidator;
}

/**
 * Authentication Context Interface
 * 
 * Provides context for authentication operations
 * with simplified API surface.
 */
export interface IAuthContext {
    /**
     * Current authentication state
     */
    readonly state: {
        isAuthenticated: boolean;
        user: any;
        token: any;
        permissions: string[];
        roles: string[];
    };
    
    /**
     * Authentication methods
     */
    authenticate(credentials: any): Promise<any>;
    signout(): Promise<void>;
    refresh(): Promise<void>;
    
    /**
     * State management
     */
    subscribe(listener: (state: any) => void): () => void;
    unsubscribe(listener: (state: any) => void): () => void;
}

/**
 * Authentication Plugin Interface
 * 
 * Simplified plugin interface for composite services
 * with easier integration points.
 */
export interface ICompositeAuthPlugin {
    readonly name: string;
    readonly version: string;
    readonly type: 'core' | 'management' | 'validation' | 'utility';
    
    /**
     * Initializes plugin with composite service
     */
    initialize(service: ICompositeAuthService): Promise<void>;
    
    /**
     * Executes plugin hook
     */
    execute(hook: string, ...args: any[]): Promise<any>;
    
    /**
     * Gets plugin capabilities
     */
    getCapabilities(): string[];
    
    /**
     * Cleans up plugin
     */
    cleanup(): Promise<void>;
}

/**
 * Authentication Configuration Interface
 * 
 * Simplified configuration interface for composite services
 * with better organization and validation.
 */
export interface ICompositeAuthConfig {
    /**
     * Core authentication configuration
     */
    core: {
        provider: string;
        tokenExpiry: number;
        refreshThreshold: number;
        maxRetries: number;
    };
    
    /**
     * Management configuration
     */
    management: {
        maxUsers: number;
        sessionTimeout: number;
        concurrentSessions: number;
    };
    
    /**
     * Validation configuration
     */
    validation: {
        passwordPolicy: any;
        rateLimit: any;
        securityRules: any;
    };
    
    /**
     * Feature flags
     */
    features: {
        mfaRequired: boolean;
        auditEnabled: boolean;
        encryptionEnabled: boolean;
        multiProvider: boolean;
    };
    
    /**
     * Gets configuration value by path
     */
    get<T>(path: string): T;
    
    /**
     * Sets configuration value by path
     */
    set<T>(path: string, value: T): void;
    
    /**
     * Validates configuration
     */
    validate(): {
        isValid: boolean;
        errors: string[];
    };
}

/**
 * Utility functions for composite interfaces
 */
export class CompositeAuthUtils {
    /**
     * Creates composite service from individual services
     */
    static createCompositeService(
        authenticator: IAuthenticator,
        tokenManager: ITokenManager,
        userManager: IUserManager,
        providerManager: IProviderManager
    ): ICompositeAuthService {
        return new CompositeAuthServiceImpl(
            authenticator,
            tokenManager,
            userManager,
            providerManager
        );
    }
    
    /**
     * Merges capabilities from multiple services
     */
    static mergeCapabilities(...services: { getCapabilities(): string[] }[]): string[] {
        const allCapabilities = new Set<string>();
        
        for (const service of services) {
            const capabilities = service.getCapabilities();
            capabilities.forEach(cap => allCapabilities.add(cap));
        }
        
        return Array.from(allCapabilities);
    }
    
    /**
     * Validates composite service dependencies
     */
    static validateDependencies(dependencies: any): {
        isValid: boolean;
        missing: string[];
    } {
        const required = ['authenticator', 'tokenManager', 'userManager', 'providerManager'];
        const missing: string[] = [];
        
        for (const dep of required) {
            if (!dependencies[dep]) {
                missing.push(dep);
            }
        }
        
        return {
            isValid: missing.length === 0,
            missing
        };
    }
}

/**
 * Internal implementation of composite service
 */
class CompositeAuthServiceImpl implements ICompositeAuthService {
    constructor(
        private readonly authenticator: IAuthenticator,
        private readonly tokenManager: ITokenManager,
        private readonly userManager: IUserManager,
        private readonly providerManager: IProviderManager
    ) {}
    
    getCoreCapabilities(): string[] {
        return CompositeAuthUtils.mergeCapabilities(
            this.authenticator,
            this.tokenManager
        );
    }
    
    getManagementCapabilities(): string[] {
        return CompositeAuthUtils.mergeCapabilities(
            this.userManager,
            this.providerManager
        );
    }
    
    getAllCapabilities(): string[] {
        return CompositeAuthUtils.mergeCapabilities(
            this.authenticator,
            this.tokenManager,
            this.userManager,
            this.providerManager
        );
    }
    
    // Delegate to individual services
    async authenticate(credentials: any): Promise<any> {
        return this.authenticator.authenticate(credentials);
    }
    
    async validateSession(): Promise<any> {
        return this.authenticator.validateSession();
    }
    
    async refreshToken(): Promise<any> {
        return this.tokenManager.refreshToken();
    }
    
    // Add other method delegations...
    configure(config: any): void {
        this.authenticator.configure(config);
        this.tokenManager.configure(config);
        this.userManager.configure(config);
        this.providerManager.configure(config);
    }
    
    getCapabilities(): string[] {
        return this.getAllCapabilities();
    }
    
    // Add remaining interface implementations...
    async authenticateWithToken(credentials: any): Promise<any> {
        // Implementation would combine authentication and token management
        return this.authenticator.authenticate(credentials);
    }
    
    async validateAndRefresh(): Promise<any> {
        // Implementation would validate and refresh as needed
        return this.validateSession();
    }
    
    async manageUser(userId: string, operations: any[]): Promise<any> {
        // Implementation would delegate to user manager
        return Promise.resolve({});
    }
    
    async manageProviders(operations: any[]): Promise<any> {
        // Implementation would delegate to provider manager
        return Promise.resolve({});
    }
    
    async completeAuthentication(credentials: any, options?: any): Promise<any> {
        // Implementation would perform full workflow
        return this.authenticate(credentials);
    }
    
    async getServiceHealth(): Promise<any> {
        // Implementation would aggregate health from all services
        return Promise.resolve({
            core: await this.authenticator.healthCheck(),
            management: {},
            overall: {}
        });
    }
}
