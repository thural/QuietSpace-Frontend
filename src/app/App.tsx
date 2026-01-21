import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "react-jss";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Frame } from "stompjs";

import '@mantine/core/styles.css';
import './styles/App.css';

import { darkTheme, lightTheme } from "@/app/theme";
import { AuthResponse } from "../features/auth/data/models/auth";
import UnauthorizedPage from "@/pages/auth/UnauthorizedPage";
import LoadingFallback from "./LoadingFallback";
import RoutesConfig from "./RoutesConfig";
import { useGetChats } from "../features/chat/data/useChatData";
import { useGetNotifications } from "../features/notification/data/useNotificationData";
import useJwtAuth from "../features/auth/application/hooks/useJwtAuth";
import useNotificationSocket from "../features/notification/application/hooks/useNotificationSocket";
import useTheme from "../shared/hooks/useTheme";
import useChatSocket from "../features/chat/data/useChatSocket";
import { useStompClient } from "@/core/network/socket/clients/useStompClient";
import { useAuthStore } from "../core/store/zustand";
import { AdvancedSecurityProvider } from "../shared/auth/AdvancedSecurityProvider";
import { AuthProvider } from "../shared/auth/AuthProvider";
import { useAuditLogger } from "../shared/auth/auditLogger";
import AuthGuard from "../shared/auth/AuthGuard";
import { getLocalThemeMode } from "../shared/utils/localStorageUtils";

// Lazy-loaded components for better performance
const NavBar = lazy(() => import("../features/navbar/presentation/components/Navbar"));
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
 * @returns {JSX.Element} - The rendered application component.
 */
const App = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const {
        setIsAuthenticated,
        setAuthData
    } = useAuthStore();
    const isDarkMode = getLocalThemeMode();
    const storedTheme = isDarkMode ? darkTheme : lightTheme;

    // Security audit logging (optional - for additional tracking)
    const auditLog = useAuditLogger();

    // Socket connections with enhanced error handling
    useStompClient({
        onError: (message: Frame | string) => {
            console.error(message);
            auditLog.logSuspiciousActivity({
                type: 'SOCKET_ERROR',
                message: String(message)
            }, 'MEDIUM');
        }
    });

    // Only initialize sockets when authenticated
    useChatSocket();
    useGetNotifications();
    const { authenticate, initializeTokenRefresh } = useJwtAuth();

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
            initializeTokenRefresh();
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
        <AdvancedSecurityProvider>
            <AuthProvider>
                <ThemeProvider theme={theme ? theme : storedTheme}>
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
                </ThemeProvider>
            </AuthProvider>
        </AdvancedSecurityProvider>
    );
};

export default App;
