import Contact from "./Contact"
import styles from "./styles/contactContainerStyles"
import QueryContainer from "./QueryContainer";
import {useSelector} from "react-redux";

const ContactContainer = ({currentChat, setCurrentChat, chats}) => {
    const user = useSelector(state => state.userReducer);
    const contacts = chats.map(chat => chat.users.find(member => member.id !== user.id));
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