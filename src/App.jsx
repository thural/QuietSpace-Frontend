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
import { useQueryClient } from "@tanstack/react-query";

const App = () => {

    const { isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser();
    const { data: followers } = useGetFollowers();
    const { data: followings } = useGetFollowings();
    const { isAuthenticated, setIsAuthenticated, setAuthData } = useAuthStore();

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);


    const onSuccessFn = (data) => {
        console.log("auth data in App...... ", data);
        setAuthData(data);
        setIsAuthenticated(true);
    }


    const { loadAccessToken } = useJwtAuth({ onSuccessFn });
    useEffect(loadAccessToken, []);

    const onSubscribe = (message) => {
        alert(message);
    }


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
    } = useStompClient({ onSubscribe });


    useEffect(() => {
        if (!isAuthenticated) return;
        if (!isClientConnected) return;
        if (!user) return;

        const body = {
            chatId: "9f7c963c-d28b-42c1-8212-b699465bea12",
            senderId: user.id,
            recipientId: "93425b43-3dd4-4703-81c8-7b9c21aaea92",
            text: "hiii tommy"
        }


        console.log("username on app page: ", user.username);
        console.log("user-id on app page: ", user.id);
        subscribe("/public/chat");
        subscribe(`/user/${user.id}/private/chat`);
        subscribe(`/user/private/chat`);
        subscribe(`/user/${user.id}/queue/messages`);
        // subscribe("/public");
        // sendMessage("/app/public/chat", body);
        if (user.id !== "93425b43-3dd4-4703-81c8-7b9c21aaea92") sendMessage("/app/private/chat", body);
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