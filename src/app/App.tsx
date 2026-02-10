import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import '@/app/App.css';

import UnauthorizedPage from "@/pages/auth/UnauthorizedPage";
import LoadingFallback from "./LoadingFallback";
import RoutesConfig from "./RoutesConfig";
// import { useGetNotifications } from "@/features/notification/data/useNotificationData";
import { useEnterpriseAuth } from "@/core/modules/authentication";
import AuthGuard from "@/features/auth/presentation/components/guards/AuthGuard";
import { AuthProvider } from "@/features/auth/presentation/providers/AuthProvider";

// Lazy-loaded components for better performance
lazy(() => import("../features/navbar/presentation/components/Navbar"));
const AuthPage = lazy(() => import("../pages/auth/AuthPage"));

/**
 * Main application component with enterprise-grade security and authentication-first routing.
 * 
 * This component enforces strict authentication-first routing where only authentication-related
 * pages are accessible without authentication. All other routes require authentication.
 * 
 * Route Structure:
 * - UNAUTHENTICATED ACCESS: /auth/*, /signin, /signout, /unauthorized
 * - AUTHENTICATED ACCESS: All other routes via RoutesConfig
 *   - /feed, /dashboard, /search, /chat, /profile, /notification, /settings (basic auth required)
 *   - /admin/* (requires SYSTEM_ADMIN permission)
 * 
 * RoutesConfig handles:
 * - Permission-based access control for each feature
 * - Role-based routing with proper permission checks
 * - Nested routing structure for complex features
 * 
 * Security Features (Automatic):
 * - Session timeout management
 * - Multi-tab synchronization  
 * - Security audit logging
 * - Anomaly detection
 * - Automatic token refresh
 * - JWT token expiry checking
 * - Role-based permission mapping
 * 
 * @returns The rendered application component.
 */
const App = () => {
    const navigate = useNavigate();
    const { refreshToken } = useEnterpriseAuth();

    /**
     * Enhanced authentication initialization with improved error handling
     * 
     * AdvancedSecurityProvider handles:
     * - Token restoration from localStorage
     * - Session timeout setup
     * - Multi-tab sync initialization
     * - Audit logging setup
     * - Anomaly detection start
     */
    const initAuth = () => {
        try {
            // Initialize token refresh
            refreshToken();
        } catch (error: unknown) {
            console.error('Authentication initialization failed:', error);

            // Enhanced error handling with specific navigation
            const errorMessage = error instanceof Error ? error.message : String(error);

            if (errorMessage.includes('No refresh token') || errorMessage.includes('undefined')) {
                navigate("/auth/login?reason=no_token");
            } else if (errorMessage.includes('invalid') || errorMessage.includes('expired')) {
                navigate("/auth/login?reason=expired");
            } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                navigate("/auth/login?reason=network");
            } else {
                navigate("/auth/login?reason=error");
            }
        }
    };

    useEffect(initAuth, []);

    return (
        <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* === UNAUTHENTICATED ROUTES ONLY === */}
                    <Route path="/auth/*" element={<AuthGuard requireAuth={false}><AuthPage /></AuthGuard>} />
                    <Route path="/signin" element={<Navigate to="/auth/login" replace />} />
                    <Route path="/signout" element={<Navigate to="/auth/logout" replace />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* === AUTHENTICATION REQUIRED ROUTES === */}
                    <Route path="/*" element={
                        <AuthGuard requireAuth={true}>
                            <>
                                {/* <NavBar /> */}
                                <Routes>
                                    {/* Default redirect for authenticated users */}
                                    <Route path="/" element={<Navigate to="/feed" replace />} />

                                    {/* All authenticated routes handled by RoutesConfig */}
                                    <Route path="/*" element={<RoutesConfig />} />
                                </Routes>
                            </>
                        </AuthGuard>
                    } />
                </Routes>
            </Suspense>
        </AuthProvider>
    );
};

export default App;
