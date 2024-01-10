import Contact from "./Contact"
import styles from "./styles/contactContainerStyles"

const ContactContainer = ({currentChat, setCurrentChat, chats}) => {
    const contacts = chats.map(chat => chat.users[0]);
    const classes = styles();

    console.log("chat users: ", contacts);

    return (
        <div className={classes.contacts}>
            {
                contacts.map((contact, index) =>
                    <Contact
                        key={index}
                        chats={chats}
                        contact={contact}
                        currentChat={currentChat}
                        setCurrentChat={setCurrentChat}
                    />
                )
            }
        </div>
    )
}

export default ContactContainer