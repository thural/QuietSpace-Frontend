import Contact from "./Contact"
import styles from "./styles/contactContainerStyles"
import {useState} from "react";

const ContactContainer = ({contacts, currentContact, setCurrentContact}) => {

    const classes = styles()

    return (
        <div className={classes.contacts}>
            {
                contacts.map((contact, index) =>
                    <Contact
                        key={index}
                        contact={contact}
                        currentContact={currentContact}
                        setCurrentContact={setCurrentContact}
                    />
                )
            }
        </div>
    )
}

export default ContactContainer