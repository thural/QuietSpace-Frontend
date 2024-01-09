import {useSelector} from "react-redux"
import styles from "./styles/contactStyles"

const ContactSection = ({contact, recentText, currentContact, setCurrentContact}) => {

    const classes = styles()
    const user = useSelector(state => state.userReducer)

    const backgroundColor = currentContact.id === contact.id ? '#e3e3e3' : 'white';

    return (
        <div
            id={contact.id}

            className={classes.contact}

            onClick={() => {
                setCurrentContact(contact.id)
            }}

            style={{backgroundColor}}
        >
            <div className={classes.author}>{contact.username}</div>
            <div className={classes.text}><p>{recentText}</p></div>
        </div>
    )
}

export default ContactSection