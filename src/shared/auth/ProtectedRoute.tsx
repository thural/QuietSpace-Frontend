import { Navigate, useLocation } from "react-router-dom";
import { Component, ReactNode } from "react";
import { useAuthStore, AuthState, User } from "@/core/store/zustand";
import { LoadingSpinner } from "@/shared/ui/components";

// Define strict TypeScript interfaces
interface IProtectedRouteProps {
    children: ReactNode;
    requiredPermissions?: string[];
    fallback?: string;
}

interface IProtectedRouteState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    isInitialized: boolean;
    location: Location | null;
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
export class ProtectedRoute extends Component<IProtectedRouteProps, IProtectedRouteState> {
    // Use private properties for services
    private unsubscribe?: () => void;

    // Constructor with method binding
    constructor(props: IProtectedRouteProps) {
        super(props);

        // Initialize state properly
        this.state = {
            isAuthenticated: false,
            isLoading: true,
            user: null,
            isInitialized: false,
            location: null
        };
    }

    // Group lifecycle methods
    componentDidMount(): void {
        this.initializeAuth();
    }

    componentWillUnmount(): void {
        // Cleanup subscriptions
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    // Extract complex logic into private methods
    private initializeAuth = (): void => {
        // Get initial auth state using the hook directly
        const authState = useAuthStore.getState();

        this.setState({
            isAuthenticated: authState.isAuthenticated,
            isLoading: authState.isLoading,
            user: authState.user,
            isInitialized: true,
            location: window.location
        });

        // Subscribe to auth changes using Zustand's subscribe method
        this.unsubscribe = useAuthStore.subscribe((state) => {
            this.setState({
                isAuthenticated: state.isAuthenticated,
                isLoading: state.isLoading,
                user: state.user
            });
        });
    };

    // Extract permission checking logic
    private hasRequiredPermissions = (user: User | null, requiredPermissions: string[]): boolean => {
        if (requiredPermissions.length === 0) {
            return true;
        }

        return requiredPermissions.every(permission =>
            user?.permissions?.includes(permission)
        );
    };

    // Extract render helpers for clean JSX
    private renderLoadingState = (): ReactNode => {
        return <LoadingSpinner size="md" />;
    };

    private renderRedirectToSignIn = (): ReactNode => {
        const { fallback } = this.props;
        const { location } = this.state;

        return (
            <Navigate to={fallback} state={{ from: location }} replace />
        );
    };

    private renderUnauthorized = (): ReactNode => {
        return <Navigate to="/unauthorized" replace />;
    };

    private renderChildren = (): ReactNode => {
        const { children } = this.props;
        return <>{children}</>;
    };

    // Keep render method clean and focused
    render(): ReactNode {
        // Destructure props and state for readability
        const { requiredPermissions = [], fallback = "/signin" } = this.props;
        const { isAuthenticated, isLoading, user, isInitialized } = this.state;

        // Handle initialization state
        if (!isInitialized) {
            return this.renderLoadingState();
        }

        // Show loading spinner while checking authentication
        if (isLoading) {
            return this.renderLoadingState();
        }

        // Redirect to signin if not authenticated
        if (!isAuthenticated) {
            return this.renderRedirectToSignIn();
        }

        // Check permissions if required
        if (requiredPermissions.length > 0) {
            const hasPermission = this.hasRequiredPermissions(user, requiredPermissions);

            if (!hasPermission) {
                return this.renderUnauthorized();
            }
        }

        // Render children if authenticated and authorized
        return this.renderChildren();
    }
}

export default ProtectedRoute;
