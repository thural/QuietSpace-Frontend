import styles from "./styles/queryContainerStyles"
import {useEffect, useState} from "react";
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

    useEffect(() => {
        if(queryText.length > 0) {
            console.log("query text: ", queryText);
            handleQuerySubmit();
        } else setQueryResult([]);
    }, [queryText]);

    const handleQuerySubmit = async () => {
        await handleFetchUserQuery()
            .then(responseData => setQueryResult(responseData["content"]))
            .catch(error => console.log(error))
    }

    const handleCreateChatFetch = async (recipient) => {
        const createChatRequestBody = {"userIds": [user.id, recipient.id]}

        const response = await fetchCreateChat(CHAT_PATH, createChatRequestBody, auth["token"]);
        if (!response.ok) throw Error("error on fetching created chat");

        return await response.json();
    }

    const handleUserClick = async (event, clickedUser) => {
        event.preventDefault();

        handleCreateChatFetch(clickedUser).then(chatData => {
            setCurrentChatId(chatData["id"]);
            dispatch(loadChat(chatData));
        })
            .catch(error => console.log("error on creating new chat: ", error));
    }

    const handleFetchUserQuery = async () => {
        const response = await fetchUsersByQuery(
            USER_PATH + `/search?query=${queryText}`, auth["token"]);
        if (response.ok) {
            return await response.json();
        } else throw new Error("error on querying users: ")
    }

    const appliedStyle = queryResult.length === 0 ? {display: 'none'} : {display: 'block'}
    const classes = styles();

    return (
        <>
            <div className={classes.seacrhSection}>
                <form className={classes.searchInput}>
                    <input
                        className='input'
                        type='text'
                        name='text'
                        placeholder="search a user ..."
                        maxLength="128"
                        value={queryText}
                        onChange={handleInputChange}
                    />
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