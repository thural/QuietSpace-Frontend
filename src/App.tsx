import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "react-jss";
import { useNavigate } from "react-router-dom";
import { Frame } from "stompjs";

import '@mantine/core/styles.css';
import './styles/App.css';

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

// Lazy-loaded components for better performance
const NavBar = lazy(() => import("./features/navbar/Navbar"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

/**
 * Main application component.
 * 
 * This component initializes the application, handles user authentication,
 * manages theme settings, and renders either the authentication page or 
 * the main application routes based on the user's authentication state.
 * 
 * @returns {JSX.Element} - The rendered application component.
 */
const App = () => {
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
     * Initializes authentication by loading the access token.
     * Redirects to the sign-in page on error.
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
        <ThemeProvider theme={theme ? theme : storedTheme}>
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
        </ThemeProvider>
    );
};

export default App;