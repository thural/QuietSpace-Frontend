import styles from "./styles/queryContainerStyles";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryUsers } from "../../hooks/useUserData";
import { useCreateChat } from "../../hooks/useChatData";

const QueryContainer = ({ setCurrentChatId }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const [queryText, setQueryText] = useState("");
    const [queryResult, setQueryResult] = useState([]);

    const createChatMutation = useCreateChat(setCurrentChatId);
    const makeQueryMutation = useQueryUsers(queryText, setQueryResult);


    const handleUserClick = async (event, clickedUser) => {
        event.preventDefault();
        const createdChatRequestBody = { "userIds": [user.id, clickedUser.id] }
        createChatMutation.mutate(createdChatRequestBody);
    }

    const handleInputChange = (event) => {
        const value = event.target.value;
        setQueryText(value);
    }

    const handleQuerySubmit = async () => {
        makeQueryMutation.mutate();
    }


    useEffect(() => {
        if (queryText.length > 0) handleQuerySubmit();
        else setQueryResult([]);
    }, [queryText]);


    const appliedStyle = queryResult.length === 0 ? { display: 'none' } : { display: 'block' }
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
                {!makeQueryMutation.isSuccess ? (<h1>loading...</h1>) : (
                    queryResult.map(user =>
                        <div key={user.id}
                            className={classes.queryItem}
                            onClick={(event) => handleUserClick(event, user)}
                        >
                            <p className="username">{user.username}</p>
                            <p className="email">{user.email}</p>
                        </div>
                    )
                )}
            </div>
        </>
    )
}

export default QueryContainer