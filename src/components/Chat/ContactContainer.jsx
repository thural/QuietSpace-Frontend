import Contact from "./Contact"
import styles from "./styles/contactContainerStyles"
import QueryContainer from "./QueryContainer";

const ContactContainer = ({currentChat, setCurrentChat, chats}) => {
    const contacts = chats.map(chat => chat.users[0]);
    const classes = styles();


    return (
        <div className={classes.contacts}>

            <QueryContainer setCurrentChat={setCurrentChat}/>

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