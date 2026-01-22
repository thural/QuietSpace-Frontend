import 'reflect-metadata';
import React, {lazy, Suspense, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Frame} from "stompjs";

import '@mantine/core/styles.css';
import './styles/App.css';

// DI imports
import {DIProvider, useService} from "@core/di";
import { initializeApp } from "@core/di/AppContainer";

// Legacy imports (to be migrated)
import LoaderStyled from "../shared/LoaderStyled";
import LoadingFallback from "./LoadingFallback";
import RoutesConfig from "./RoutesConfig";
import {useGetChats} from "@chat/data/useChatData.ts";
import {useGetNotifications} from "@notification/data";
import {useGetCurrentUser} from "@profile/data";
import useJwtAuth from "../features/auth/application/hooks/useJwtAuth";
import { useEnterpriseAuthHook } from "../features/auth/application/hooks/useEnterpriseAuthHook";
import useNotificationSocket from "../features/notification/application/hooks/useNotificationSocket";
import useChatSocket from "../features/chat/data/useChatSocket";
import {useStompClient} from "../core/network/socket/clients/useStompClient";
import {useAuthStore} from "../core/store/zustand";

// DI Services (new)
import {ThemeService} from "../core/services/ThemeService";

// Lazy-loaded components for better performance
const NavBar = lazy(() => import("../features/navbar/presentation/components/Navbar"));
const AuthPage = lazy(() => import("../pages/auth/AuthPage"));

/**
 * DI-Enabled Application Component.
 * 
 * Fully integrates with dependency inversion system using initializeApp.
 * All services are provided through the DI container.
 */
const DIApp = () => {
    const navigate = useNavigate();
    const container = React.useMemo(() => initializeApp(), []);

    // Get services through DI
    const themeService = useService(ThemeService);
    const { isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser();
    const { isAuthenticated } = useAuthStore();
    
    // Initialize theme on app startup
    useEffect(() => {
        // Apply theme class to document body
        const applyTheme = () => {
            const isDark = themeService.isDarkMode();
            document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
            document.body.className = isDark ? 'dark-theme' : 'light-theme';
        };
        
        applyTheme();
        
        // Listen for theme changes (if you add theme change events later)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme') {
                applyTheme();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [themeService]);
    
    // Theme is now managed by DI - no legacy theme handling needed
    
    useStompClient({ onError: (message: Frame | string) => console.error(message) });
    useChatSocket();
    useGetNotifications();
    useNotificationSocket();
    useGetChats();

    const { initializeTokenRefresh } = useJwtAuth();
    const { validateSession } = useEnterpriseAuthHook();

    /**
     * Initializes authentication by setting up token refresh and validating session.
     * Redirects to sign-in page on error.
     */
    const initAuth = () => {
        try {
            initializeTokenRefresh();
            // Optional: Validate session with enterprise security
            validateSession().catch(console.error);
        } catch (error: unknown) {
            console.error(error);
            navigate("/signin");
        }
    };

    useEffect(initAuth, []);

    return (
        <DIProvider container={container}>
            {/* Theme is now managed by DI ThemeService */}
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

export default DIApp;
