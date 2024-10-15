import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import AuthPage from "./pages/auth/AuthPage";
import ChatPage from "./pages/chat/ChatPage";
import PostPage from "./pages/feed/PostPage";
import SearchPage from "./pages/search/SearchPage";

import '@mantine/core/styles.css';
import './App.css';

import { useEffect } from "react";
import ActivationForm from "./components/Auth/ActivationForm";
import ProfileContainer from "./components/Profile/ProfileContainer";
import FullLoadingOverlay from "./components/shared/FullLoadingOverlay";
import Typography from "./components/shared/Typography";
import useChatSocket from "./hooks/useChatSocket";
import useJwtAuth from "./hooks/useJwtAuth";
import { useGetNotifications } from "./hooks/useNotificationData";
import useNotificationSocket from "./hooks/useNotificationSocket";
import { useStompClient } from "./hooks/useStompClient";
import { useGetCurrentUser, useGetFollowers, useGetFollowings } from "./hooks/useUserData";
import { useAuthStore } from "./hooks/zustand";
import AllNotifications from "./pages/notification/AllNotifications";
import NotificationPage from "./pages/notification/NotifiactionPage";
import ReplyNotifications from "./pages/notification/ReplyNotifications";
import RepostNotifications from "./pages/notification/RepostNotifications";
import RequestNotifications from "./pages/notification/RequestNotifications";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import SignoutPage from "./pages/signout/SignoutPage";

const App = () => {

    const { isLoading: isUserLoading, isError: isUserError, data: userData } = useGetCurrentUser();
    const { isAuthenticated, setIsAuthenticated, setAuthData } = useAuthStore();


    useStompClient({});
    useChatSocket();
    useGetFollowers();
    useGetFollowings();
    useGetNotifications();
    useNotificationSocket();


    const onSuccessFn = (data) => {
        setAuthData(data);
        setIsAuthenticated(true);
    }

    const { loadAccessToken } = useJwtAuth({ onSuccessFn });
    useEffect(loadAccessToken, []);


    if (isUserLoading) return <FullLoadingOverlay />;
    if (!isAuthenticated || isUserError) return <AuthPage />;


    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<PostPage />} />
                <Route path="/posts/*" element={<PostPage />} />
                <Route path="/search/*" element={<SearchPage />} />
                <Route path="/chat/*" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />}>
                    <Route index element={<ProfileContainer />} />
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