import React, {useEffect, useState} from "react"
import MessageContainer from "./MessageContainer"
import ContactContainer from "./ContactContainer";
import Error from "../Misc/Error";
import Loading from "../Misc/Loading";
import styles from "./styles/chatPageStyles"
import {useDispatch, useSelector} from 'react-redux'
import {fetchChats} from "../../api/chatRequests";
import {CHAT_PATH_BY_MEMBER} from "../../constants/ApiPath";
import {loadChat} from "../../redux/chatReducer";

const ChatPage = () => {

    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);
    const chats = useSelector(state => state.chatReducer);

    const [currentChat, setCurrentChat] = useState(chats[0]);

    const dispatch = useDispatch();
    const [isError, setIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const handleFetchChats = async () => {
        try {
            const response = await fetchChats(CHAT_PATH_BY_MEMBER + `/${user.id}`, auth["token"]);
            return await response.json();
        } catch (error) {
            console.log("error from chat fetch: ", error);
            return [];
        }
    }

    useEffect(() => {
        handleFetchChats()
            .then(responseData => dispatch(loadChat(responseData)))
            .then(() => setIsFetching(false))
            .catch(() => setIsError(true));
    }, []);

    useEffect(() => {
        setCurrentChat(chats[0])
    }, [isFetching]);

    useEffect(() => {
        setCurrentChat(chats.find(chat => chat.id === currentChat.id));
    }, [chats]);


    const classes = styles();

    return (
        <div className={classes.chat}>
            {isFetching && <Loading/>}
            {isError && <Error>{'Could not fetch chat data! 🔥'}</Error>}
            {
                !isFetching && currentChat !== undefined &&
                <ContactContainer
                    currentChat={currentChat}
                    setCurrentChat={setCurrentChat}
                    chats={chats}
                />
            }
            {
                !isFetching && currentChat !== undefined &&
                <MessageContainer currentChat={currentChat} setCurrentChat={setCurrentChat}/>
            }

        </div>
    )
}

export default ChatPage