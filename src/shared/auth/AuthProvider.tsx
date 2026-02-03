import { ReactNode, useEffect, useState } from "react";
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
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Auto-populate user permissions based on role
        // Note: This functionality may need to be moved to the auth service
        // as useFeatureAuth doesn't provide direct user state modification
        if (isAuthenticated && authData?.user && typeof authData.user === 'object' && authData.user !== null) {
            const user = authData.user as any;
            if (user.role && !user.permissions) {
                const rolePermissions = getRolePermissions(user.role);
                console.log('User permissions would be set to:', rolePermissions);
                // TODO: Implement permission setting through auth service
            }
        }
    }, [authData, isAuthenticated]);

    useEffect(() => {
        // Reset form data when user logs out
        if (!isAuthenticated) {
            setFormData({});
        }
    }, [isAuthenticated]);

    return <>{children}</>;
};

/**
 * Hook to get authentication utilities
 */
export const useAuthUtils = () => {
    const { isAuthenticated, authData } = useFeatureAuth();
    const user = authData?.user || null;

    const hasRole = (role: string): boolean => {
        return user && typeof user === 'object' && 'role' in user ? user.role === role : false;
    };

    const hasAnyRole = (roles: string[]): boolean => {
        return user && typeof user === 'object' && 'role' in user ? roles.includes(user.role) : false;
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
