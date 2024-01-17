import styles from "./styles/contactStyles"
import {useSelector} from "react-redux";

const Contact = ({
                     contact,
                     currentChatId,
                     setCurrentChatId
                 }) => {

    const chats = useSelector(state => state.chatReducer);
    const currentChat = chats.find(chat => chat.id === currentChatId);
    const chatOfThisContact = chats.find(chat => chat.users.some(user => user.id === contact.id));
    const isCurrentChatEmpty = chatOfThisContact.messages.length === 0;

    const recentText = isCurrentChatEmpty ? "" : Array.from(chatOfThisContact.messages).pop().text;
    const backgroundColor = currentChat.users[0].id === contact.id ? '#e3e3e3' : 'white';

    const handleClick = () => {
        setCurrentChatId(chatOfThisContact["id"]);
    }

    const classes = styles();

    return (
        <div id={contact.id} className={classes.contact} onClick={handleClick} style={{backgroundColor}}>
            <div className={classes.author}>{contact.username}</div>
            <div className={classes.text}><p>{recentText}</p></div>
        </div>
    )
}

export default Contact