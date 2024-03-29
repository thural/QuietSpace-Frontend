import { USER_PROFILE_URL } from "../constants/ApiPath";
import { Route, Routes } from "react-router-dom";
import styles from "../styles/appStyles";
import ContactPage from "./Contact/ContactPage";
import NavBar from "./Navbar/Navbar";
import PostPage from "./Posts/PostPage";
import ChatPage from "./Chat/ChatPage";

import './App.css'

import { fetchUser } from "../api/userRequests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AuthPage from "./Auth/AuthPage";
import { authStore } from "../hooks/zustand";

const App = () => {

    const queryClient = useQueryClient();
    const auth = queryClient.getQueryData("auth");

    // console.log("authData: ", auth);

    const { data: authData } = authStore();

    // console.log("auth data from zustang", authData)

    const { data: userData, isLoading, isSuccess, refetch, isError } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await fetchUser(USER_PROFILE_URL, auth.token);
            return await response.json();
        },
        enabled: !!authData?.token
    })

    // if (isSuccess) console.log("user load success: ", userData)
    // else console.log("user load pending ..");

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