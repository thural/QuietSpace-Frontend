import styles from "./styles/contactStyles"

const Contact = ({
                     contact,
                     chats,
                     currentChat,
                     setCurrentChat
                 }) => {

    const classes = styles()

    const chatOfThisContact = chats.find(chat => chat.users[0].id === contact.id);

    // console.log("chat of this contact: ", chatOfThisContact)

    const recentText = Array.from(chatOfThisContact.messages).pop().text;

    const backgroundColor = currentChat.users[0].id === contact.id ? '#e3e3e3' : 'white';
    // console.log("CONTACT from contact component: ", contact);

    return (
        <div
            id={contact.id}

            className={classes.contact}

            onClick={() => {
                setCurrentChat(chatOfThisContact);
            }}

            style={{backgroundColor}}
        >
            <div className={classes.author}>{contact.username}</div>
            <div className={classes.text}><p>{recentText}</p></div>
        </div>
    )
}

export default Contact