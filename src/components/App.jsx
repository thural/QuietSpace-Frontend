import { USER_PROFILE_URL } from "../constants/ApiPath";
import { Route, Routes } from "react-router-dom";
import styles from "../styles/appStyles";
import ContactPage from "./Contact/ContactPage";
import NavBar from "./Navbar/Navbar";
import PostPage from "./Posts/PostPage";
import ChatPage from "./Chat/ChatPage";

import './App.css'

import { fetchUser } from "../api/userRequests";
import { useQuery } from "@tanstack/react-query";
import AuthPage from "./Auth/AuthPage";
import { authStore } from "../hooks/zustand";

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


    const classes = styles();

    
    return (
        <div className={classes.app}>
            {!isSuccess ? (<AuthPage />) : isLoading ? (<h1>Loading ..</h1>) : (
                <>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<PostPage />} />
                        <Route path="/posts" element={<PostPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </>
            )}
        </div>
    )
}

export default App