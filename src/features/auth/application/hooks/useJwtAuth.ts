/**
 * @deprecated useEnterpriseAuth from @/core/modules/authentication instead
 * This hook is deprecated and will be removed in a future version.
 * Please migrate to useEnterpriseAuth for better enterprise patterns and security.
 */

import { useEnterpriseAuth } from '@/core/modules/authentication';

export const useJwtAuth = () => {
    // Show deprecation warning in development
    if (process.env.NODE_ENV === 'development') {
        console.warn(
            '⚠️ useJwtAuth is deprecated!\n' +
            'Please migrate to useEnterpriseAuth from @/core/modules/authentication\n' +
            'This provides better enterprise patterns, security, and maintainability.\n' +
            'Example: import { useEnterpriseAuth } from "@/core/modules/authentication";'
        );
    }

    // Redirect to enterprise auth
    const enterpriseAuth = useEnterpriseAuth();
    
    // Maintain backward compatibility by mapping to old interface
    return {
        // Map to old interface names
        authenticate: enterpriseAuth.authenticate,
        signup: enterpriseAuth.signup,
        activate: enterpriseAuth.activate,
        signout: enterpriseAuth.signout,
        refreshToken: enterpriseAuth.refreshToken,
        resendActivationCode: enterpriseAuth.resendActivationCode,
        
        // Map state properties
        authStatus: enterpriseAuth.isAuthenticated ? { isAuthenticated: true } : null,
        isLoading: enterpriseAuth.isLoading,
        isError: !!enterpriseAuth.error,
        error: enterpriseAuth.error,
        
        // Map utility methods
        refetchAuth: () => {}, // No-op for compatibility
        isAuthenticated: enterpriseAuth.isAuthenticated
    };
};

export default useJwtAuth;
