import { CHAT_PATH_BY_MEMBER, POST_URL, USER_PROFILE_URL } from "../constants/ApiPath";
import { Route, Routes } from "react-router-dom";
import styles from "../styles/appStyles";
import ContactPage from "./Contact/ContactPage";
import NavBar from "./Navbar/Navbar";
import PostPage from "./Posts/PostPage";
import ChatPage from "./Chat/ChatPage";
import React, { useEffect, useState } from "react";

import './App.css'

import { fetchUser } from "../api/userRequests";
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from "../redux/userReducer"
import { fetchChats } from "../api/chatRequests";
import { loadChat } from "../redux/chatReducer";
import { fetchPosts } from "../api/postRequests";
import { loadPosts } from "../redux/postReducer";
import AuthPage from "./Auth/AuthPage";

const App = () => {
    const dispatch = useDispatch();

    const auth = useSelector(state => state.authReducer);
    const user = useSelector(state => state.userReducer);
    const formView = useSelector(state => state.formViewReducer);

    const [isChatError, setIsChatError] = useState(false);
    const [isChatFetching, setIsChatFetching] = useState(true);


    const handleFetchUser = async () => {
        if (auth["token"] != null) {
            const userResponse = await fetchUser(USER_PROFILE_URL, auth.token);
            const userResponseData = await userResponse.json();
            if (userResponse.ok) {
                dispatch(loadUser(userResponseData));
                console.log("user loaded: ", userResponseData);
            }
        } else {
            dispatch(loadUser({}));
        }
    }

    // const handleFetchPosts = async () => {
    //     if (auth["token"] != null) {
    //         const response = await fetchPosts(POST_URL, auth.token);
    //         const responseData = await response.json();
    //         dispatch(loadPosts(responseData["content"]));
    //     } else {
    //         dispatch(loadPosts([]));
    //     }
    // }

    const handleFetchChats = async () => {
        try {
            const response = await fetchChats(CHAT_PATH_BY_MEMBER + `/${user.id}`, auth["token"]);
            const chatData = await response.json();
            setIsChatFetching(false);
            dispatch(loadChat(chatData));
            console.log("chat data from fetch: ", chatData);
        } catch (error) {
            setIsChatError(true);
            dispatch(loadChat([]));
            console.log("error from chat fetch: ", error);
        }
    }


    useEffect(() => {
        handleFetchUser().then(() => console.log("user fetched"));
    }, [auth]);

    // useEffect(() => {
    //     handleFetchPosts().then(() => console.log("posts loaded"))
    // }, [user]);

    useEffect(() => {
        handleFetchChats()
            .then(() => console.log("chats loaded"));
    }, [user]);


    const classes = styles();

    return (
        <div className={classes.app}>
                {
                    formView.auth && <AuthPage />
                }
                <NavBar />
                <Routes>
                    <Route path="/" element={<PostPage />} />
                    <Route path="/posts" element={<PostPage />} />
                    <Route path="/chat" element={
                        <ChatPage
                            isChatFetching={isChatFetching}
                            isChatError={isChatError}
                        />
                    } />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
        </div>
    )
}

export default App