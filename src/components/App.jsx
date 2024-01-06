import {POST_URL, USER_URL, USER_PROFILE_URL} from "../constants/ApiPath"
import {Route, Routes} from "react-router-dom"
import styles from "../styles/appStyles"
import MainContext from "./MainContext"
import Contact from "./Contact/Contact"
import NavBar from "./Navbar/Navbar"
import Posts from "./Posts/Posts"
import {useEffect} from "react"
import Home from "./Home/Home"
import Chat from "./Chat/Chat"
import './App.css'

import {fetchUser} from "../api/userRequests"
import {fetchPosts} from "../api/postRequests";
import {useDispatch, useSelector} from 'react-redux'
import {loadChat} from "../redux/chatReducer"
import {loadUser} from "../redux/userReducer"
import {loadPosts} from "../redux/postReducer"

const App = () => {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.authReducer);
    const user = useSelector(state => state.userReducer);

    console.log("AUTH: ", auth);
    console.log("USER: ", user);

    const handleFetchUser = async () => {
        if (auth.token != null) {
            const userResponse = await fetchUser(USER_PROFILE_URL, auth.token)
            const userResponseData = await userResponse.json();
            dispatch(loadUser(userResponseData));
        } else {
            dispatch(loadUser({}));
        }
    }

    const handleFetchPosts = async () => {
        if (auth.token != null) {
            const response = await fetchPosts(POST_URL, auth.token);
            const responseData = await response.json();
            dispatch(loadPosts(responseData["content"]));
        } else {
            dispatch(loadPosts([]));
        }
    }

    const fetchChat = async () => {
        try {
            const data = await fetch('http://localhost:5000/api/chats')
            const chatData = await data.json()
            dispatch(loadChat(chatData))
        } catch (err) {
            console.log(err)
        }
    }

    // useEffect(() => {
    //   fetchUser().then(fetchPosts(), fetchChat())
    // }, [])

    useEffect(() => {
        handleFetchUser().then(handleFetchPosts().then(console.log("USER: ", user)))
    }, [auth]);

    const classes = styles()

    return (
        <div className={classes.app}>
            <MainContext.Provider value={{fetchUser: handleFetchUser, fetchPosts, fetchChat}}>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/posts" element={<Posts/>}/>
                    <Route path="/chat" element={<Chat/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                </Routes>
            </MainContext.Provider>
        </div>
    )
}

export default App