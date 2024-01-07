import Contact from "./Contact"
import styles from "./styles/contactContainerStyles"

const ContactContainer = ({ contacts }) => {
  const classes = styles()

  return (
    <div className={classes.contacts}>
      {
        contacts.map((contact, index) => <Contact key={index} contact={contact} />)
      }
    </div>
  )
}

export default ContactContainer