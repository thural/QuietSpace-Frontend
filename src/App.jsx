import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import PostPage from "./pages/feed/PostPage";
import ChatPage from "./pages/chat/ChatPage";
import SearchPage from "./pages/search/SearchPage";

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import './App.css'

import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotifiactionPage";
import AllNotifications from "./pages/notification/AllNotifications";
import RequestNotifications from "./pages/notification/RequestNotifications";
import ReplyNotifications from "./pages/notification/ReplyNotifications";
import RepostNotifications from "./pages/notification/RepostNotifications";
import SettingsPage from "./pages/settings/SettingsPage";
import { useGetCurrentUser } from "./hooks/useUserData";
import useAuth from "./hooks/useAuth";

const App = () => {

    const isAuthenticated = useAuth();

    const { data: userData,
        isLoading: isUserLoading,
        isSuccess: isUserSuccess,
        refetch: refetchUser,
        isError: isUserError
    } = useGetCurrentUser();

    if(!isAuthenticated) return <h1>User has not signed in yet ...</h1>
    
    return (
        <MantineProvider>
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
                </Routes>
            </>
        </MantineProvider>
    )
}

export default App