import styles from "./styles/queryContainerStyles"
import {useState} from "react";
import {fetchUsersByQuery} from "../../api/userRequests";
import {USER_URL} from "../../constants/ApiPath";
import {useDispatch, useSelector} from "react-redux";
import {loadChat} from "../../redux/chatReducer";

const QueryContainer = ({setCurrentChat}) => {

    const auth = useSelector(state => state.authReducer);
    const user = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    console.log("loggedUser: ", user);

    const [queryText, setQueryText] = useState("");
    const [queryResult, setQueryResult] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setQueryText(value);
    }

    const handleFetchUserQuery = async () => {
        try {
            const response = await fetchUsersByQuery(
                USER_URL + `/search?query=${queryText}`, auth["token"]);
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

    const handleUserClick = (event, clickedUser) => {
        event.preventDefault();
        const newEmptyChat = {
            "id": crypto.randomUUID(),
            "version": 2,
            "ownerId": user.id,
            "users": [
                user,
                clickedUser
            ],
            "messages": [],
            "groupChat": false
        };
        setCurrentChat(newEmptyChat);
        // dispatch(loadChat(newEmptyChat));
        console.log("user query result: ", queryResult);
    }

    const appliedStyle = queryResult.length === 0 ? {display: 'none'} : {display: 'block'}


    const classes = styles();

    return (
        <>
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
            </div>

            <div className={classes.queryContainer} style={appliedStyle}>
                {
                    queryResult.map(user =>
                        <div key={user.id}
                             className={classes.queryItem}
                             onClick={(event) => handleUserClick(event, user)}>
                            <p className="username">{user.username}</p>
                            <p className="email">{user.email}</p>
                        </div>
                    )
                }
            </div>
        </>

    )
}

export default QueryContainer