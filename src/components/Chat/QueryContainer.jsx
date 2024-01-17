import styles from "./styles/queryContainerStyles"
import {useState} from "react";
import {fetchUserById, fetchUsersByQuery} from "../../api/userRequests";
import {CHAT_PATH, USER_PATH} from "../../constants/ApiPath";
import {useDispatch, useSelector} from "react-redux";
import {fetchCreateChat} from "../../api/chatRequests";
import {loadChat} from "../../redux/chatReducer";

const QueryContainer = ({setCurrentChatId}) => {

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
            return await fetchUsersByQuery(
                USER_PATH + `/search?query=${queryText}`, auth["token"]);
        } catch (error) {
            console.log("error on querying users: ", error);
        }
    }

    const handleCreateChatFetch = async (recipient) => {

        try {
            const user1Response = await fetchUserById(USER_PATH + `/${user.id}`, auth["token"]);
            const user2Response = await fetchUserById(USER_PATH + `/${recipient.id}`, auth["token"]);

            const user1 = await user1Response.json();
            const user2 = await user2Response.json();

            const createChatRequestBody = {"users": [user1, user2]}

            return await fetchCreateChat(
                CHAT_PATH, createChatRequestBody, auth["token"]);
        } catch (error) {
            console.log("error on fetching created chat: ", error);
        }
    }

    const handleQuerySubmit = async (event) => {
        event.preventDefault();
        const queryResponse = await handleFetchUserQuery();
        const responseData = await queryResponse.json();
        const filteredQueryResult = responseData["content"].filter(contact => contact.id !== user.id);
        setQueryResult(filteredQueryResult);
    }

    const handleUserClick = async (event, clickedUser) => {
        event.preventDefault();
        try {
            const createdChatResponse = await handleCreateChatFetch(clickedUser);
            if(createdChatResponse.ok){
                const createdChatData = await createdChatResponse.json();
                setCurrentChatId(createdChatData["id"]);
                dispatch(loadChat(createdChatData));
            }
        } catch (error) {
            console.log("error on creating new chat: ", error)
        }
    }

    const appliedStyle = queryResult.length === 0 ? {display: 'none'} : {display: 'block'}


    const classes = styles();

    return (
        <>
            <div className={classes.seacrhSection}>
                <form className={classes.searchInput} onSubmit={handleQuerySubmit}>
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