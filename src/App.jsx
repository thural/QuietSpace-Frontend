import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import PostPage from "./pages/feed/PostPage";
import AuthPage from "./pages/auth/AuthPage";
import ChatPage from "./pages/chat/ChatPage";
import SearchPage from "./pages/search/SearchPage";

import '@mantine/core/styles.css';
import { LoadingOverlay, MantineProvider } from '@mantine/core';
import './App.css'

import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotifiactionPage";
import AllNotifications from "./pages/notification/AllNotifications";
import RequestNotifications from "./pages/notification/RequestNotifications";
import ReplyNotifications from "./pages/notification/ReplyNotifications";
import RepostNotifications from "./pages/notification/RepostNotifications";
import SettingsPage from "./pages/settings/SettingsPage";
import SignoutPage from "./pages/signout/SignoutPage";
import { useGetCurrentUser } from "./hooks/useUserData";
import { useAuthStore } from "./hooks/zustand";
import { loadAccessToken } from "./hooks/useToken";
import ActivationPage from "./pages/auth/ActivationPage";

const App = () => {

    const { data: userData,
        isLoading: isUserLoading,
        isSuccess: isUserSuccess,
        refetch: refetchUser,
        isError: isUserError
    } = useGetCurrentUser();

    const { forceLogin } = useAuthStore();
    const { isSuccess, isLoading, isError, error } = loadAccessToken();

    if (isLoading || isUserLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;


    return (
        <>
            {(forceLogin || !isUserSuccess) ? (<AuthPage />) : (
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
                        <Route path="/activation" element={<ActivationPage />} />
                    </Routes>
                </>
            )}
        </>
    )
}

export default App