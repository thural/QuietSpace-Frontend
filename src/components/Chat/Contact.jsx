import styles from "./styles/contactStyles"

const Contact = ({
                     contact,
                     chats,
                     currentChat,
                     setCurrentChat
                 }) => {

    const chatOfThisContact = chats.find(chat => chat.users.some(user => user.id === contact.id));
    const recentText = Array.from(chatOfThisContact.messages).pop().text;
    const backgroundColor = currentChat.users[0].id === contact.id ? '#e3e3e3' : 'white';

    const handleClick = () => {
        setCurrentChat(chatOfThisContact);
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