import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage"
import ChatPage from "./pages/chat/ChatPage";
import FeedPage from "./pages/feed/FeedPage";
import SearchPage from "./pages/search/SearchPage";

import '@mantine/core/styles.css';
import './App.css';

import { useEffect } from "react";
import FullLoadingOverlay from "./components/shared/FullLoadingOverlay";
import Typography from "./components/shared/Typography";
import useChatSocket from "./services/useChatSocket";
import useJwtAuth from "./services/useJwtAuth";
import { useGetNotifications } from "./services/data/useNotificationData";
import useNotificationSocket from "./services/useNotificationSocket";
import { useStompClient } from "./services/useStompClient";
import { useGetCurrentUser } from "./services/data/useUserData";
import { useAuthStore } from "./services/zustand";
import AllNotifications from "./pages/notification/AllNotifications";
import NotificationPage from "./pages/notification/NotifiactionPage";
import ReplyNotifications from "./pages/notification/ReplyNotifications";
import RepostNotifications from "./pages/notification/RepostNotifications";
import RequestNotifications from "./pages/notification/RequestNotifications";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import SignoutPage from "./pages/signout/SignoutPage";
import NavBar from "./components/navbar/container/Navbar";
import ProfileContainer from "./components/profile/container/ProfileContainer";
import UserProfileContainer from "./components/profile/container/UserProfileContainer";
import ActivationForm from "./components/auth/components/activation/ActivationForm";
import { Auth } from "./api/schemas/inferred/auth";

const App = () => {

    const { isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser();
    const { isAuthenticated, setIsAuthenticated, setAuthData } = useAuthStore();


    useStompClient({});
    useChatSocket();
    useGetNotifications();
    useNotificationSocket();


    const onSuccessFn = (data: Auth) => {
        setAuthData(data);
        setIsAuthenticated(true);
    }

    const { loadAccessToken } = useJwtAuth({ onSuccessFn });
    useEffect(loadAccessToken, []);


    if (isUserLoading) return <FullLoadingOverlay />;
    if (!isAuthenticated || isUserError) return <AuthPage />; // TODO: handle Auth using routing instead


    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/posts/*" element={<FeedPage />} />
                <Route path="/search/*" element={<SearchPage />} />
                <Route path="/chat/*" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />}>
                    <Route index element={<UserProfileContainer />} />
                    <Route path=":userId" element={<ProfileContainer />} />
                </Route>
                <Route path="/notification/*" element={<NotificationPage />}>
                    <Route path="all" element={<AllNotifications />} />
                    <Route path="requests" element={<RequestNotifications />} />
                    <Route path="replies" element={<ReplyNotifications />} />
                    <Route path="reposts" element={<RepostNotifications />} />
                </Route>
                <Route path="/settings/*" element={<SettingsPage />} />
                <Route path="/signin" element={<AuthPage />} />
                <Route path="/signout" element={<SignoutPage />} />
                <Route path="/activation" element={<ActivationForm />} />
                <Route path="*" element={<Typography type="h1">Not Found</Typography>} />
            </Routes>
        </>
    )
}

export default App