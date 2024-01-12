import Contact from "./Contact"
import styles from "./styles/contactContainerStyles"
import {useState} from "react";

const ContactContainer = ({currentChat, setCurrentChat, chats}) => {
    const contacts = chats.map(chat => chat.users[0]);
    const classes = styles();

    const [queryText, setQueryText] = useState("");
    const [queryResult, setQueryResult] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setQueryText(value);
    }

    const handleSubmit = (event) => {
        //TODO: implement user search api
    }

    return (
        <div className={classes.contacts}>
            <div className={classes.seacrhSection}>

                <form className={classes.searchInput} onSubmit={handleSubmit}>
                    <input
                        className='input'
                        type='text'
                        name='text'
                        placeholder="search a user ..."
                        maxLength="128"
                        value={queryText}
                        onChange={handleInputChange}
                    />
                    <button className={classes.submitBtn} type='submit'>search</button>
                </form>

                <div className={classes.queryContainer}>
                    {
                        queryResult.map(user =>
                            <div className={classes.queryItem}>
                                <p className="username">{user.username}</p>
                                <p className="email">{user.email}</p>
                            </div>
                        )
                    }
                </div>

            </div>
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