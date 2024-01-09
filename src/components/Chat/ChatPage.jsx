import React, {useEffect, useState} from "react"
import MessageContainer from "./MessageContainer"
import ContactContainer from "./ContactContainer"
import styles from "./styles/chatPageStyles"
import {useDispatch, useSelector} from 'react-redux'
import {fetchChats} from "../../api/chatRequests";
import {CHAT_PATH_BY_OWNER} from "../../constants/ApiPath";
import {loadChat} from "../../redux/chatReducer";

const ChatPage = () => {

    const user = useSelector(state => state.userReducer);
    const chats = useSelector(state => state.chatReducer);
    const auth = useSelector(state => state.authReducer);

    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(true);

    const [currentChat, setCurrentChat] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [currentContact, setCurrentContact] = useState(null);


    const handleFetchChats = async () => {
        try {
            const response = await fetchChats(CHAT_PATH_BY_OWNER + `/${user.id}`, auth.token);
            const responseData = await response.json();
            dispatch(loadChat(responseData));
            return responseData;
        } catch (error) {
            console.log("error from chat fetch: ", error)
            return [];
        }
    }

    let duoChats = null;

    useEffect(() => {

        handleFetchChats()
            .then(() => {
                duoChats = chats.map(chat => {
                    if (chat.groupChat === false) return chat;
                })
            })
            .then(() => setCurrentChat(duoChats[0]))
            .then(() => setContacts(duoChats.map(chat => chat.members[0])))
            .then(() => {
                setCurrentChat(chats.find(chat => chat.members[0].id === currentContact.id));
            })
            .then(data => console.log("chat data: ", data))
            .then(() => setIsFetching(false));
    }, [user]);

    // const reversedMessages = [...messages].reverse();

    const classes = styles()

    return (
        <div className={classes.chat}>
            {
                !isFetching &&
                <ContactContainer
                    contacts={contacts}
                    currentContact={currentContact}
                    setCurrentContact={setCurrentContact}
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