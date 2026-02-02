import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/core/modules/state-management/zustand";
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
    const { user, isAuthenticated, setFormData } = useAuthStore();

    useEffect(() => {
        // Auto-populate user permissions based on role
        if (isAuthenticated && user?.role && !user.permissions) {
            const rolePermissions = getRolePermissions(user.role);
            // Update user with role-based permissions
            useAuthStore.setState({
                user: {
                    ...user,
                    permissions: rolePermissions
                }
            });
        }
    }, [user, isAuthenticated]);

    useEffect(() => {
        // Reset form data when user logs out
        if (!isAuthenticated) {
            setFormData({});
        }
    }, [isAuthenticated, setFormData]);

    return <>{children}</>;
};

/**
 * Hook to get authentication utilities
 */
export const useAuthUtils = () => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    const hasRole = (role: string): boolean => {
        return user?.role === role;
    };

    const hasAnyRole = (roles: string[]): boolean => {
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
        user,
        isAuthenticated,
        isLoading,
        hasRole,
        hasAnyRole,
        isGuest,
        isModeratorOrAbove,
        isAdminOrAbove,
        isSuperAdmin,
    };
};

export default AuthProvider;
