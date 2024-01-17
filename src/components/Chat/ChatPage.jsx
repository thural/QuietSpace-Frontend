import React, {useEffect, useState} from "react";
import MessageContainer from "./MessageContainer";
import ContactContainer from "./ContactContainer";
import Error from "../Misc/Error";
import Loading from "../Misc/Loading";
import styles from "./styles/chatPageStyles";
import {useDispatch, useSelector} from 'react-redux';
import {fetchChats} from "../../api/chatRequests";
import {CHAT_PATH_BY_MEMBER} from "../../constants/ApiPath";
import {loadChat} from "../../redux/chatReducer";

const ChatPage = ({isChatFetching, isChatError }) => {
    const chats = useSelector(state => state.chatReducer);
    const [currentChatId, setCurrentChatId] = useState(chats[0]["id"]);
    const classes = styles();

    return (
        <div className={classes.chat}>
            {isChatFetching && <Loading/>}
            {isChatError && <Error>{'Could not fetch chat data! 🔥'}</Error>}
            {
                chats.length > 0 &&
                <ContactContainer
                    currentChatId={currentChatId}
                    setCurrentChatId={setCurrentChatId}
                />
            }
            {
                !isChatFetching && currentChatId !== undefined &&
                <MessageContainer
                    currentChatId={currentChatId}
                    setCurrentChatId={setCurrentChatId}
                />
            }
        </div>
    )
}

export default ChatPage