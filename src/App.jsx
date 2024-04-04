import { USER_PROFILE_URL } from "./constants/ApiPath";
import { Route, Routes } from "react-router-dom";
import ContactPage from "./components/Contact/ContactPage";
import NavBar from "./components/Navbar/Navbar";
import PostPage from "./pages/feed/PostPage";
import AuthPage from "./pages/auth/AuthPage";
import ChatPage from "./pages/chat/ChatPage";
import SearchPage from "./pages/search/SearchPage";

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import './App.css'

import { fetchUser } from "./api/userRequests";
import { useQuery } from "@tanstack/react-query";
import { authStore } from "./hooks/zustand";
import ProfilePage from "./pages/profile/ProfilePage";

const App = () => {

    const { data: authData } = authStore();


    const { data: userData, isLoading, isSuccess, refetch, isError } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await fetchUser(USER_PROFILE_URL, authData.token)
            return await response.json();
        },
        enabled: !!authData?.token,
    })



    return (
        <MantineProvider>
            {!isSuccess ? (<AuthPage />) : isLoading ? (<h1>Loading ..</h1>) : (
                <>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<PostPage />} />
                        <Route path="/posts" element={<PostPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </>
            )}
        </MantineProvider>
    )
}

export default App