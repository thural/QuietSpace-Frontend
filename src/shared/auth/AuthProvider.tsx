import { ReactNode, useEffect } from "react";
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { getRolePermissions } from "./permissions";

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider component for authentication initialization and utilities.
 * 
 * Provides authentication context, initializes user permissions based on role,
 * and handles auth-related side effects.
 * 
 * @param {AuthProviderProps} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { isAuthenticated, authData } = useFeatureAuth();

    useEffect(() => {
        // Auto-populate user permissions based on role
        // Note: This functionality may need to be moved to the auth service
        // as useFeatureAuth doesn't provide direct user state modification
        if (isAuthenticated && authData?.user && typeof authData.user === 'object' && authData.user !== null) {
            const user = authData.user as any;
            if (user.role && typeof user.role === 'string' && !user.permissions) {
                const rolePermissions = getRolePermissions(user.role);
                console.log('User permissions would be set to:', rolePermissions);
                // TODO: Implement permission setting through auth service
            }
        }
    }, [authData, isAuthenticated]);

    return <>{children}</>;
};

/**
 * Hook to get authentication utilities
 */
export const useAuthUtils = () => {
    const { isAuthenticated, authData } = useFeatureAuth();
    const user = authData?.user || null;

    const hasRole = (role: string): boolean => {
        if (!user || typeof user !== 'object' || !('role' in user)) {
            return false;
        }
        const userRole = user.role;
        return typeof userRole === 'string' && userRole === role;
    };

    const hasAnyRole = (roles: string[]): boolean => {
        if (!user || typeof user !== 'object' || !('role' in user)) {
            return false;
        }
        const userRole = user.role;
        return typeof userRole === 'string' && roles.includes(userRole);
    };

    const isGuest = (): boolean => {
        return !isAuthenticated;
    };

    const isModeratorOrAbove = (): boolean => {
        return hasAnyRole(['moderator', 'admin', 'superadmin']);
    };

    const isAdminOrAbove = (): boolean => {
        return hasAnyRole(['admin', 'superadmin']);
    };

    const isSuperAdmin = (): boolean => {
        return hasRole('superadmin');
    };

    return {
        user,
        isAuthenticated,
        isLoading: false, // useFeatureAuth doesn't provide loading state
        hasRole,
        hasAnyRole,
        isGuest,
        isModeratorOrAbove,
        isAdminOrAbove,
        isSuperAdmin
    };
};

export default AuthProvider;
