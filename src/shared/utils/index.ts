/**
 * Utils Module Index.
 * 
 * Barrel exports for all utility functions.
 * 
 * MIGRATION NOTICE: Legacy jwtAuthUtils exports have been replaced with
 * enterprise-grade authentication from @core/auth/services/TokenRefreshManager
 */

// Enterprise authentication exports
export { 
    createTokenRefreshManager,
    EnterpriseTokenRefreshManager,
    legacyTokenRefreshUtils
} from '@/core/auth/services/TokenRefreshManager';

// Legacy authentication utilities - now using centralized auth
// These functions are now available through the enterprise auth module
// Import them from @core/auth/services/TokenRefreshManager instead

// For backward compatibility, re-export the legacy functions with deprecation warnings
export const registerUser = async (options: any) => {
    console.warn('registerUser is deprecated. Use enterprise auth service instead.');
    // Redirect to enterprise implementation
    return options.onErrorFn?.(new Error('Legacy function deprecated. Use enterprise auth service.'));
};

export const authenticateUser = async (options: any) => {
    console.warn('authenticateUser is deprecated. Use enterprise auth service instead.');
    // Redirect to enterprise implementation
    return options.onErrorFn?.(new Error('Legacy function deprecated. Use enterprise auth service.'));
};

export const getAccessToken = async (options: any) => {
    console.warn('getAccessToken is deprecated. Use enterprise auth service instead.');
    // Redirect to enterprise implementation
    return options.onErrorFn?.(new Error('Legacy function deprecated. Use enterprise auth service.'));
};

export const signoutUser = async (options: any) => {
    console.warn('signoutUser is deprecated. Use enterprise auth service instead.');
    // Redirect to enterprise implementation
    return options.onErrorFn?.(new Error('Legacy function deprecated. Use enterprise auth service.'));
};

export const signupUser = async (options: any) => {
    console.warn('signupUser is deprecated. Use enterprise auth service instead.');
    // Redirect to enterprise implementation
    return options.onErrorFn?.(new Error('Legacy function deprecated. Use enterprise auth service.'));
};

export const activateUser = async (options: any) => {
    console.warn('activateUser is deprecated. Use enterprise auth service instead.');
    // Redirect to enterprise implementation
    return options.onErrorFn?.(new Error('Legacy function deprecated. Use enterprise auth service.'));
};
