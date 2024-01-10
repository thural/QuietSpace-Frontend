import React, {useEffect, useState} from "react"
import MessageContainer from "./MessageContainer"
import ContactContainer from "./ContactContainer";
import styles from "./styles/chatPageStyles"
import {useDispatch, useSelector} from 'react-redux'
import {fetchChats} from "../../api/chatRequests";
import {CHAT_PATH_BY_OWNER} from "../../constants/ApiPath";
import {loadChat} from "../../redux/chatReducer";

const ChatPage = () => {

    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);
    const chats = useSelector(state => state.chatReducer);

    const [currentChat, setCurrentChat] = useState(chats[0])

    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(true);

    const handleFetchChats = async () => {
        try {
            const response = await fetchChats(CHAT_PATH_BY_OWNER + `/${user.id}`, auth.token);
            return await response.json();
        } catch (error) {
            console.log("error from chat fetch: ", error)
            return [];
        }
    }

    useEffect(() => {
        handleFetchChats()
            .then(responseData => dispatch(loadChat(responseData)))
            .then(() => setIsFetching(false));
    }, []);


    const classes = styles()

    return (
        <div className={classes.chat}>
            {
                !isFetching &&
                <ContactContainer
                    currentChat={currentChat}
                    setCurrentChat={setCurrentChat}
                    chats={chats}
                />
            }
            {
                !isFetching &&
                <MessageContainer currentChat={currentChat}/>
            }

        </div>
    )
}

export default ChatPage