import { ReactNode, useEffect } from "react";
import { useFeatureAuth } from '@/core/hooks/useAuthentication';
import { getRolePermissions } from "../../domain/permissions";

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
        if (isAuthenticated && authData?.user) {
            const user = authData.user as any;
            if (user.role && !user.permissions) {
                const rolePermissions = getRolePermissions(user.role);
                // Note: In the new auth system, permissions would be managed by the auth service
                // This is a placeholder for the migration - the actual implementation
                // would depend on how the new auth service handles user data updates
                console.log('Setting role permissions:', rolePermissions);
            }
        }
    }, [authData, isAuthenticated]);

    useEffect(() => {
        // Reset form data when user logs out
        if (!isAuthenticated) {
            // Note: Form data reset would be handled by the auth service or a separate form state
            console.log('User logged out, form data would be reset');
        }
    }, [isAuthenticated]);

    return <>{children}</>;
};

/**
 * Hook to get authentication utilities
 */
export const useAuthUtils = () => {
    const { isAuthenticated, authData } = useFeatureAuth();

    const hasRole = (role: string): boolean => {
        // Type assertion for now - in real implementation, authData would be properly typed
        const user = authData?.user as any;
        return user?.role === role;
    };

    const hasAnyRole = (roles: string[]): boolean => {
        const user = authData?.user as any;
        return user?.role ? roles.includes(user.role) : false;
    };

    const isGuest = (): boolean => {
        return !isAuthenticated || hasRole('guest');
    };

    const isModeratorOrAbove = (): boolean => {
        return hasAnyRole(['moderator', 'admin', 'super_admin']);
    };

    const isAdminOrAbove = (): boolean => {
        return hasAnyRole(['admin', 'super_admin']);
    };

    const isSuperAdmin = (): boolean => {
        return hasRole('super_admin');
    };

    return {
        user: authData?.user,
        isAuthenticated,
        isLoading: false, // Would come from auth service in real implementation
        hasRole,
        hasAnyRole,
        isGuest,
        isModeratorOrAbove,
        isAdminOrAbove,
        isSuperAdmin,
    };
};

export default AuthProvider;
