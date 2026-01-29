import { ReactNode, ComponentType } from "react";
import { useAuthStore } from "@/core/store/zustand";
import LoaderStyled from "@/shared/LoaderStyled";
import ErrorComponent from "@/shared/errors/ErrorComponent";

interface WithAuthProps {
    requiredPermissions?: string[];
    fallback?: ComponentType;
    showError?: boolean;
}

/**
 * Higher-order component for component-level authentication guards.
 * 
 * Wraps components with authentication and authorization checks.
 * Renders fallback component or error if user is not authenticated/authorized.
 * 
 * @param {WithAuthProps} options - Authentication options
 * @returns {Function} HOC function that wraps the target component
 */
export const withAuth = <P extends object>(
    Component: ComponentType<P>,
    options: WithAuthProps = {}
) => {
    const {
        requiredPermissions = [],
        fallback: FallbackComponent,
        showError = false
    } = options;

    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isLoading, user } = useAuthStore();

        // Show loading spinner while checking authentication
        if (isLoading) {
            return <LoaderStyled />;
        }

        // Show fallback component if provided and not authenticated
        if (!isAuthenticated && FallbackComponent) {
            return <FallbackComponent />;
        }

        // Show error if not authenticated and showError is true
        if (!isAuthenticated && showError) {
            return <ErrorComponent message="Authentication required" />;
        }

        // Check permissions if required
        if (requiredPermissions.length > 0) {
            const hasPermission = requiredPermissions.every(permission => 
                user?.permissions?.includes(permission)
            );
            
            if (!hasPermission) {
                return <ErrorComponent message="Insufficient permissions" />;
            }
        }

        // Render original component if authenticated and authorized
        return <Component {...props} />;
    };
};

/**
 * Hook for checking authentication status and permissions
 * 
 * @param {string[]} requiredPermissions - Optional permissions to check
 * @returns {Object} Authentication status and helper functions
 */
export const useAuth = (requiredPermissions: string[] = []) => {
    const { isAuthenticated, isLoading, user, isError, error } = useAuthStore();

    const hasPermission = requiredPermissions.every(permission => 
        user?.permissions?.includes(permission)
    );

    const isAuthorized = isAuthenticated && hasPermission;

    return {
        isAuthenticated,
        isLoading,
        isAuthorized,
        hasPermission,
        user,
        isError,
        error
    };
};

/**
 * Permission-based component renderer
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.permissions - Required permissions
 * @param {ReactNode} props.children - Children to render if authorized
 * @param {ReactNode} props.fallback - Fallback to render if not authorized
 */
export const PermissionGate = ({ 
    permissions, 
    children, 
    fallback = null 
}: {
    permissions: string[];
    children: ReactNode;
    fallback?: ReactNode;
}) => {
    const { isAuthorized } = useAuth(permissions);

    return isAuthorized ? <>{children}</> : <>{fallback}</>;
};

export default withAuth;
