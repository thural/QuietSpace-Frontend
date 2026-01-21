import 'reflect-metadata';
import { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Frame } from "stompjs";

import '@mantine/core/styles.css';
import './styles/App.css';

// DI imports
import { DIProvider, useService, useDIContainer } from "@core/di";
import { Container } from "@core/di";

// Legacy imports (to be migrated)
import { darkTheme, lightTheme } from "@/app/theme";
import { AuthResponse } from "../features/auth/data/models/auth";
import LoaderStyled from "../shared/LoaderStyled";
import LoadingFallback from "./LoadingFallback";
import RoutesConfig from "./RoutesConfig";
import { useGetChats } from "../features/chat/data/useChatData";
import { useGetNotifications } from "../features/notification/data/useNotificationData";
import { useGetCurrentUser } from "../features/profile/data/useUserData";
import useJwtAuth from "../features/auth/application/hooks/useJwtAuth";
import useNotificationSocket from "../features/notification/application/hooks/useNotificationSocket";
import useTheme from "../shared/hooks/useTheme";
import useChatSocket from "../features/chat/data/useChatSocket";
import { useStompClient } from "../core/network/socket/clients/useStompClient";
import { useAuthStore } from "../core/store/zustand";
import { getLocalThemeMode } from "../shared/utils/localStorageUtils";

// DI Services (new)
import { ThemeService } from "../core/services/ThemeService";

// Lazy-loaded components for better performance
const NavBar = lazy(() => import("../features/navbar/presentation/components/Navbar"));
const AuthPage = lazy(() => import("../pages/auth/AuthPage"));

/**
 * DI-Enabled Application Component.
 * 
 * Integrates dependency injection container with React application.
 * Provides services through DI instead of manual hooks.
 */
const DIApp = () => {
    const navigate = useNavigate();
    const container = useDIContainer();

    // Get services through DI
    const themeService = useService(ThemeService);
    const { theme } = useTheme(); // Keep legacy for now
    const { isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser();
    const { isAuthenticated, setIsAuthenticated, setAuthData } = useAuthStore();
    const isDarkMode = getLocalThemeMode();
    const storedTheme = isDarkMode ? darkTheme : lightTheme;

    useStompClient({ onError: (message: Frame | string) => console.error(message) });
    useChatSocket();
    useGetNotifications();
    useNotificationSocket();
    useGetChats();

    const { initializeTokenRefresh } = useJwtAuth();

    /**
     * Initializes authentication by setting up token refresh.
     * Redirects to sign-in page on error.
     */
    const initAuth = () => {
        try {
            initializeTokenRefresh();
        } catch (error: unknown) {
            console.error(error);
            navigate("/signin");
        }
    };

    useEffect(initAuth, []);

    return (
        <DIProvider container={container}>
            {/* Keep legacy ThemeProvider for now */}
            <div>
                {isUserLoading ? (
                    <LoadingFallback />
                ) : !isAuthenticated || isUserError ? (
                    <Suspense fallback={<LoadingFallback />}>
                        <AuthPage />
                    </Suspense>
                ) : (
                    <>
                        <NavBar />
                        <Suspense fallback={<LoaderStyled />}>
                            <RoutesConfig />
                        </Suspense>
                    </>
                )}
            </div>
        </DIProvider>
    );
};

/**
 * Legacy App Component (for backward compatibility)
 */
const LegacyApp = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser();
    const { isAuthenticated, setIsAuthenticated, setAuthData } = useAuthStore();
    const isDarkMode = getLocalThemeMode();
    const storedTheme = isDarkMode ? darkTheme : lightTheme;

    useStompClient({ onError: (message: Frame | string) => console.error(message) });
    useChatSocket();
    useGetNotifications();
    useNotificationSocket();
    useGetChats();

    const { initializeTokenRefresh } = useJwtAuth();

    /**
     * Initializes authentication by setting up token refresh.
     * Redirects to sign-in page on error.
     */
    const initAuth = () => {
        try {
            initializeTokenRefresh();
        } catch (error: unknown) {
            console.error(error);
            navigate("/signin");
        }
    };

    useEffect(initAuth, []);

    return (
        <div>
            {isUserLoading ? (
                <LoadingFallback />
            ) : !isAuthenticated || isUserError ? (
                <Suspense fallback={<LoadingFallback />}>
                    <AuthPage />
                </Suspense>
            ) : (
                <>
                    <NavBar />
                    <Suspense fallback={<LoaderStyled />}>
                        <RoutesConfig />
                    </Suspense>
                </>
            )}
        </div>
    );
};

export default DIApp;
