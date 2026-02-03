import { ReactNode, ComponentType } from "react";
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { LoadingSpinner } from "@/shared/ui/components";
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
        const { isAuthenticated, authData } = useFeatureAuth();

        // Show loading spinner while checking authentication
        // Note: useFeatureAuth doesn't have isLoading, so we assume auth state is ready
        if (!authData && !isAuthenticated) {
            return <LoadingSpinner size="md" />;
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
                authData?.user?.permissions?.includes(permission)
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
    const { isAuthenticated, authData } = useFeatureAuth();

    const hasPermission = requiredPermissions.every(permission =>
        authData?.user?.permissions?.includes(permission)
    );

    const isAuthorized = isAuthenticated && hasPermission;

    return {
        isAuthenticated,
        isLoading: false, // useFeatureAuth doesn't provide loading state
        isAuthorized,
        hasPermission,
        user: authData?.user,
        isError: false,
        error: null
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
