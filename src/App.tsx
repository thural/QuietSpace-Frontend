import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "react-jss";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Frame } from "stompjs";

import '@mantine/core/styles.css';
import './styles/App.css';

import { darkTheme, lightTheme } from "@/theme";
import { AuthResponse } from "./api/schemas/inferred/auth";
import LoadingFallback from "./LoadingFallback";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";
import RoutesConfig from "./RoutesConfig";
import { useGetChats } from "./services/data/useChatData";
import { useGetNotifications } from "./services/data/useNotificationData";
import useJwtAuth from "./services/hook/auth/useJwtAuth";
import useNotificationSocket from "./services/hook/notification/useNotificationSocket";
import useTheme from "./services/hook/shared/useTheme";
import useChatSocket from "./services/socket/useChatSocket";
import { useStompClient } from "./services/socket/useStompClient";
import { useAuthStore } from "./services/store/zustand";
import { AdvancedSecurityProvider } from "./shared/auth/AdvancedSecurityProvider";
import { useAuditLogger } from "./shared/auth/auditLogger";
import AuthGuard from "./shared/auth/AuthGuard";
import ProtectedRoute from "./shared/auth/ProtectedRoute";
import { getLocalThemeMode } from "./utils/localStorageUtils";
import { Navbar } from "./features/navbar";

// Lazy-loaded components for better performance
const NavBar = lazy(() => import("./features/navbar/presentation/components/Navbar"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

/**
 * Main application component with enterprise-grade security.
 * 
 * This component renders either authentication page or main application 
 * based on centralized authentication state from useAuthStore.
 * All security features are automatically handled by AdvancedSecurityProvider.
 * 
 * Route Structure:
 * - "/" → "/feed" (main feed page)
 * - "/dashboard" → dashboard functionality
 * - "/auth/*" → authentication pages (unauthenticated only)
 * - "/admin/*" → admin routes (admin permissions required)
 * - All other routes → handled by RoutesConfig
 * 
 * Security Features (Automatic):
 * - Session timeout management
 * - Multi-tab synchronization  
 * - Security audit logging
 * - Anomaly detection
 * - Automatic token refresh
 * - Centralized auth state management
 * - JWT token expiry checking
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
    useNotificationSocket();
    useGetChats();

    /**
     * Enhanced authentication success callback with audit logging
     * 
     * @param {AuthResponse} data - The authentication response data.
     */
    const onSuccessFn = (data: AuthResponse) => {
        // Log successful authentication (optional - AdvancedSecurityProvider also logs)
        auditLog.logLoginSuccess(data.userId || 'unknown', 'user_' + (data.userId || 'unknown'), {
            timestamp: new Date().toISOString(),
            sessionId: 'session_' + Date.now()
        });

        // Update auth state
        setAuthData(data);
        setIsAuthenticated(true);
    };

    /**
     * Enhanced authentication error callback with audit logging
     * 
     * @param {Error} error - The authentication error.
     */
    const onErrorFn = (error: Error) => {
        // Log failed authentication attempt
        auditLog.logLoginFailed({
            error: error.message,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        }, error.message);

        // Handle error
        console.error('Authentication failed:', error);
        navigate("/signin");
    };

    const { loadAccessToken } = useJwtAuth({ onSuccessFn, onErrorFn });

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
            // Just load access token - everything else is automatic
            loadAccessToken();
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
            <ThemeProvider theme={theme ? theme : storedTheme}>
                <Navbar />
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* === PUBLIC ROUTES === */}
                        <Route path="/" element={<Navigate to="/feed" replace />} />

                        {/* === AUTHENTICATION ROUTES (Unauthenticated Only) === */}
                        <Route path="/auth/*" element={<AuthGuard requireAuth={false}><AuthPage /></AuthGuard>} />

                        {/* === PROTECTED ROUTES (All other routes) === */}
                        <Route path="/*" element={<AuthGuard requireAuth={true}><RoutesConfig /></AuthGuard>} />

                        {/* === ROLE-BASED ROUTES === */}
                        <Route path="/admin/*" element={<ProtectedRoute requiredPermissions={['system:admin']}><RoutesConfig /></ProtectedRoute>} />

                        {/* === ERROR ROUTES === */}
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        <Route path="/signin" element={<AuthPage />} />
                        <Route path="/signout" element={<div>Signout Page</div>} />
                    </Routes>
                </Suspense>
            </ThemeProvider>
        </AdvancedSecurityProvider>
    );
};

export default App;
