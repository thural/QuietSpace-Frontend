import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { LoadingSpinner } from "@/shared/ui/components";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermissions?: string[];
    fallback?: string;
}

/**
 * ProtectedRoute component for route-level security.
 * 
 * Protects routes by checking authentication status and optional permissions.
 * Redirects unauthenticated users to signin page.
 * 
 * @param {ProtectedRouteProps} props - Component props
 * @param {ReactNode} props.children - Child components to render if authenticated
 * @param {string[]} props.requiredPermissions - Optional permissions required
 * @param {string} props.fallback - Optional redirect path (defaults to /signin)
 * @returns {JSX.Element} - Protected route component
 */
export const ProtectedRoute = ({
    children,
    requiredPermissions = [],
    fallback = "/signin"
}: ProtectedRouteProps) => {
    const { isAuthenticated, authData } = useFeatureAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    // Note: useFeatureAuth doesn't have isLoading, so we assume auth state is ready
    if (!authData && !isAuthenticated) {
        return <LoadingSpinner size="md" />;
    }

    // Redirect to signin if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={fallback} state={{ from: location }} replace />;
    }

    // Check permissions if required
    if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.every(permission =>
            authData?.user?.permissions?.includes(permission)
        );

        if (!hasPermission) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Render children if authenticated and authorized
    return <>{children}</>;
};

export default ProtectedRoute;
