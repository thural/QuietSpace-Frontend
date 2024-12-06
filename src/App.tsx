import { useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "react-jss";
import { Frame } from "stompjs";

import '@mantine/core/styles.css';
import './styles/App.css';

import { darkTheme, lightTheme } from "@/theme";
import LoadingFallback from "./LoadingFallback";
import RoutesConfig from "./RoutesConfig";
import { useGetChats } from "./services/data/useChatData";
import { useGetNotifications } from "./services/data/useNotificationData";
import { useGetCurrentUser } from "./services/data/useUserData";
import useJwtAuth from "./services/hook/auth/useJwtAuth";
import useChatSocket from "./services/hook/chat/useChatSocket";
import useNotificationSocket from "./services/hook/notification/useNotificationSocket";
import useTheme from "./services/hook/shared/useTheme";
import { useStompClient } from "./services/socket/useStompClient";
import { useAuthStore } from "./services/store/zustand";
import { getLocalThemeMode } from "./utils/localStorageUtils";
import { AuthResponse } from "./api/schemas/inferred/auth";

const NavBar = lazy(() => import("./components/navbar/Navbar"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

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

    const onSuccessFn = (data: AuthResponse) => {
        setAuthData(data);
        setIsAuthenticated(true);
    };

    const { loadAccessToken } = useJwtAuth({ onSuccessFn });

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
                <Suspense fallback={<LoadingFallback />}>
                    <NavBar />
                    <RoutesConfig />
                </Suspense>
            )}
        </ThemeProvider>
    );
};

export default App;