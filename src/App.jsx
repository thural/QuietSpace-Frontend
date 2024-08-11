import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import PostPage from "./pages/feed/PostPage";
import AuthPage from "./pages/auth/AuthPage";
import ChatPage from "./pages/chat/ChatPage";
import SearchPage from "./pages/search/SearchPage";

import '@mantine/core/styles.css';
import './App.css'

import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotifiactionPage";
import AllNotifications from "./pages/notification/AllNotifications";
import RequestNotifications from "./pages/notification/RequestNotifications";
import ReplyNotifications from "./pages/notification/ReplyNotifications";
import RepostNotifications from "./pages/notification/RepostNotifications";
import SettingsPage from "./pages/settings/SettingsPage";
import SignoutPage from "./pages/signout/SignoutPage";
import ActivationForm from "./components/Auth/ActivationForm";
import { LoadingOverlay, Title } from '@mantine/core';
import { useGetFollowers, useGetFollowings, useGetCurrentUser } from "./hooks/useUserData";
import { useStompClient } from "./hooks/useStompClient";
import useJwtAuth from "./hooks/useJwtAuth";
import { useEffect } from "react";
import { useAuthStore } from "./hooks/zustand";

const App = () => {

    const { isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser();
    const { data: followers } = useGetFollowers();
    const { data: followings } = useGetFollowings();
    const { isAuthenticated, setIsAuthenticated, setAuthData } = useAuthStore();


    const onSuccessFn = (data) => {
        console.log("auth data in App...... ", data);
        setAuthData(data);
        setIsAuthenticated(true);
    }


    const { loadAccessToken } = useJwtAuth({ onSuccessFn });
    useEffect(loadAccessToken, []);



    const {
        disconnect,
        subscribe,
        subscribeWithId,
        unSubscribe,
        sendMessage,
        setAutoReconnect,
        isClientConnected,
        isConnecting,
        isDisconnected,
        isError,
        error
    } = useStompClient({});


    useEffect(() => {
        if (!isAuthenticated) return;
        if (!isClientConnected) return;

        const body = {
            chatId: crypto.randomUUID(),
            senderId: crypto.randomUUID(),
            recipientId: crypto.randomUUID(),
            text: "hi all"
        }

        subscribe("/public/chat");
        // subscribe("/public");
        sendMessage("/app/public/chat", body);
    }, [isClientConnected]);


    if (isUserLoading) {
        return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    }

    if (!isAuthenticated || isUserError) return <AuthPage />;

    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<PostPage />} />
                <Route path="/posts/*" element={<PostPage />} />
                <Route path="/search/*" element={<SearchPage />} />
                <Route path="/chat/*" element={<ChatPage />} />
                <Route path="/profile/*" element={<ProfilePage />} />
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
            </Routes>
        </>
    )
}

export default App