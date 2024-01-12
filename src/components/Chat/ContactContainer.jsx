import Contact from "./Contact"
import styles from "./styles/contactContainerStyles"
import {useState} from "react";
import {fetchUsersByQuery} from "../../api/userRequests";
import {USER_URL} from "../../constants/ApiPath";
import {useSelector} from "react-redux";

const ContactContainer = ({currentChat, setCurrentChat, chats}) => {
    const contacts = chats.map(chat => chat.users[0]);
    const auth = useSelector(state => state.authReducer);
    const classes = styles();

    const [queryText, setQueryText] = useState("");
    const [queryResult, setQueryResult] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setQueryText(value);
    }

    const handleFetchUserQuery = async () => {
        try {
            const response = await fetchUsersByQuery(
                USER_URL + `/search?query=${queryText}`,auth["token"]);
            const responseData = await response.json();
            setQueryResult(responseData["content"]);

        } catch (error) {
            console.log("error on querying users: ", error);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleFetchUserQuery();
    }

    const appliedStyle = queryResult.length === 0 ? {display: 'none'} : {display:'block'}

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

                <div className={classes.queryContainer} style={appliedStyle}>
                    {
                        queryResult.map(user =>
                            <div key={user.id} className={classes.queryItem}>
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