import 'reflect-metadata';
import { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Frame } from "stompjs";

import '@mantine/core/styles.css';
import './styles/App.css';

// DI imports
import { DIProvider, useService, useDIContainer } from "./core/di";
import { Container } from "./core/di";

// Legacy imports (to be migrated)
import { darkTheme, lightTheme } from "@/theme";
import { AuthResponse } from "./api/schemas/inferred/auth";
import LoaderStyled from "./shared/LoaderStyled";
import LoadingFallback from "./LoadingFallback";
import RoutesConfig from "./RoutesConfig";
import { useGetChats } from "./services/data/useChatData";
import { useGetNotifications } from "./services/data/useNotificationData";
import { useGetCurrentUser } from "./services/data/useUserData";
import useJwtAuth from "./services/hook/auth/useJwtAuth";
import useNotificationSocket from "./services/hook/notification/useNotificationSocket";
import useTheme from "./services/hook/shared/useTheme";
import useChatSocket from "./services/socket/useChatSocket";
import { useStompClient } from "./services/socket/useStompClient";
import { useAuthStore } from "./services/store/zustand";
import { getLocalThemeMode } from "./utils/localStorageUtils";

// DI Services (new)
import { ThemeService } from "./core/services/ThemeService";

// Lazy-loaded components for better performance
const NavBar = lazy(() => import("./features/navbar/presentation/components/Navbar"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

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

    /**
     * Callback function executed on successful authentication.
     * 
     * @param {AuthResponse} data - The authentication response data.
     */
    const onSuccessFn = (data: AuthResponse) => {
        setAuthData(data);
        setIsAuthenticated(true);
    };

    const { loadAccessToken } = useJwtAuth({ onSuccessFn });

    /**
     * Initializes authentication by loading access token.
     * Redirects to sign-in page on error.
     */
    const initAuth = () => {
        try {
            loadAccessToken();
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

    /**
     * Callback function executed on successful authentication.
     * 
     * @param {AuthResponse} data - The authentication response data.
     */
    const onSuccessFn = (data: AuthResponse) => {
        setAuthData(data);
        setIsAuthenticated(true);
    };

    const { loadAccessToken } = useJwtAuth({ onSuccessFn });

    /**
     * Initializes authentication by loading access token.
     * Redirects to sign-in page on error.
     */
    const initAuth = () => {
        try {
            loadAccessToken();
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
