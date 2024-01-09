import React, {useEffect, useState} from "react"
import MessageContainer from "./MessageContainer"
import ContactContainer from "./ContactContainer"
import styles from "./styles/chatPageStyles"
import {useSelector} from 'react-redux'

const ChatPage = () => {

    const chats = useSelector(state => state.chatReducer)

    const duoChats = chats.map(chat => chat.isGroupChat === false);
    const groupChats = chats.map(chat => chat.isGroupChat === true);

    const [currentChat, setCurrentChat] = useState(duoChats[0]);

    const contacts = duoChats.map(chat => chat.members);
    const messages = currentChat.messages;

    const {currentContact, setCurrentContact} = useState(contacts[0]);

    useEffect(() => {
        setCurrentChat(chats.find(chat => chat.members[0].id === currentContact.id))
    }, [currentContact]);

    const reversedMessages = [...messages].reverse();

    const classes = styles()

    return (
        <div className={classes.chat}>
            <ContactContainer
                contacts={contacts}
                currentContact={currentContact}
                setCurrentContact={setCurrentContact}
            />
            <MessageContainer messages={reversedMessages}/>
        </div>
    )
}

export default ChatPage