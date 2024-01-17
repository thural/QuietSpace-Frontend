import Contact from "./Contact"
import styles from "./styles/contactContainerStyles"
import QueryContainer from "./QueryContainer";
import {useSelector} from "react-redux";

const ContactContainer = ({currentChatId, setCurrentChatId}) => {
    const users = useSelector(state => state.userReducer);
    const chats = useSelector(state => state.chatReducer);
    const contacts = chats.map(chat => chat.users.find(member => member.id !== users.id));
    const classes = styles();


    return (
        <div className={classes.contacts}>

            <QueryContainer setCurrentChatId={setCurrentChatId}/>

            {
                contacts.map((contact, index) =>
                    <Contact
                        key={index}
                        contact={contact}
                        currentChatId={currentChatId}
                        setCurrentChatId={setCurrentChatId}
                    />
                )
            }

        </div>
    )
}

export default ContactContainer