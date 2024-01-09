import {USER_PROFILE_URL} from "../constants/ApiPath"
import {Route, Routes} from "react-router-dom"
import styles from "../styles/appStyles"
import ContactPage from "./Contact/ContactPage"
import NavBar from "./Navbar/Navbar"
import PostPage from "./Posts/PostPage"
import ChatPage from "./Chat/ChatPage";
import {useEffect} from "react"
import HomePage from "./Home/HomePage"
import './App.css'

import {fetchUser} from "../api/userRequests"
import {useDispatch, useSelector} from 'react-redux'
import {loadUser} from "../redux/userReducer"

const App = () => {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.authReducer);

    const handleFetchUser = async () => {
        if (auth.token != null) {
            const userResponse = await fetchUser(USER_PROFILE_URL, auth.token);
            const userResponseData = await userResponse.json();
            dispatch(loadUser(userResponseData));
        } else {
            dispatch(loadUser({}));
        }
    }


    useEffect(() => {
        handleFetchUser().then(() => console.log("user loaded"));
    }, [auth]);

    const classes = styles()

    return (
        <div className={classes.app}>
            <NavBar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/posts" element={<PostPage/>}/>
                <Route path="/chat" element={<ChatPage/>}/>
                <Route path="/contact" element={<ContactPage/>}/>
            </Routes>
        </div>
    )
}

export default App