import styles from "./styles/contactStyles"

const Contact = ({contact, recentText, currentContact, setCurrentContact}) => {

    const classes = styles()

    const backgroundColor = currentContact.id === contact.id ? '#e3e3e3' : 'white';

    console.log("CONTACT from contact component: ", contact);

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

export default Contact