import { Route, Routes, useNavigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import ChatPage from "./pages/chat/ChatPage";
import FeedPage from "./pages/feed/FeedPage";
import SearchPage from "./pages/search/SearchPage";

import '@mantine/core/styles.css';
import './styles/App.css';

import { useEffect } from "react";
import { Frame } from "stompjs";
import { AuthResponse } from "./api/schemas/inferred/auth";
import ActivationForm from "./components/auth/ActivationForm";
import ChatPanel from "./components/chat/message/ChatPanel";
import ChatPlaceholder from "./components/chat/message/ChatPlaceholder";
import FeedContainer from "./components/feed/FeedContainer";
import PostContainer from "./components/feed/PostContainer";
import NavBar from "./components/navbar/Navbar";
import NotificationList from "./components/notification/list/NotificationList";
import ProfileContainer from "./components/profile/ProfileContainer";
import UserProfileContainer from "./components/profile/UserProfileContainer";
import ErrorComponent from "./components/shared/errors/ErrorComponent";
import FullLoadingOverlay from "./components/shared/FullLoadingOverlay";
import SignoutPage from "./pages/auth/signout/SignoutPage";
import NotificationPage from "./pages/notification/NotifiactionPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import { useGetChats } from "./services/data/useChatData";
import { useGetNotifications } from "./services/data/useNotificationData";
import { useGetCurrentUser } from "./services/data/useUserData";
import useJwtAuth from "./services/hook/auth/useJwtAuth";
import useChatSocket from "./services/hook/chat/useChatSocket";
import useNotificationSocket from "./services/hook/notification/useNotificationSocket";
import { useStompClient } from "./services/socket/useStompClient";
import { useAuthStore } from "./services/store/zustand";

const App = () => {

    const navigate = useNavigate();

    const { isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser();
    const { isAuthenticated, setIsAuthenticated, setAuthData } = useAuthStore();


    useStompClient({ onError: (message: Frame | string) => console.error(message) });
    useChatSocket();
    useGetNotifications();
    useNotificationSocket();
    useGetChats();


    const onSuccessFn = (data: AuthResponse) => {
        setAuthData(data);
        setIsAuthenticated(true);
    }

    const { loadAccessToken } = useJwtAuth({ onSuccessFn });

    const initAuth = () => {
        try {
            loadAccessToken();
        } catch (error: unknown) {
            console.error(error);
            navigate("/signin");
        }
    }

    useEffect(initAuth, []);


    if (isUserLoading) return <FullLoadingOverlay />;
    if (!isAuthenticated || isUserError) return <AuthPage />; // TODO: handle Auth using routing instead


    return (
        <>
            {isAuthenticated && !isUserError && <NavBar />}
            <Routes>
                <Route path="/" element={<FeedContainer />} />
                <Route path="/feed/*" element={<FeedPage />}>
                    <Route index element={<FeedContainer />} />
                    <Route path=":postId" element={<PostContainer />} />
                </Route>
                <Route path="/search/*" element={<SearchPage />} />
                <Route path="/chat/*" element={<ChatPage />} >
                    <Route index element={<ChatPlaceholder />} />
                    <Route path=":chatId" element={<ChatPanel />} />
                </Route>
                <Route path="/profile" element={<ProfilePage />}>
                    <Route index element={<UserProfileContainer />} />
                    <Route path=":userId" element={<ProfileContainer />} />
                </Route>
                <Route path="/notification/*" element={<NotificationPage />}>
                    <Route path=":category" element={<NotificationList />} />
                </Route>
                <Route path="/settings/*" element={<SettingsPage />} />
                <Route path="/signin" element={<AuthPage />} />
                <Route path="/signout" element={<SignoutPage />} />
                <Route path="/activation" element={<ActivationForm />} />
                <Route path="*" element={<ErrorComponent message="error 404 page not found" />} />
            </Routes>
        </>
    )
}

export default App