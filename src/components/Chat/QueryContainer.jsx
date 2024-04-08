import styles from "./styles/queryContainerStyles";
import { useEffect, useState } from "react";
import { fetchUsersByQuery } from "../../api/userRequests";
import { CHAT_PATH, USER_PATH } from "../../constants/ApiPath";
import { fetchCreateChat } from "../../api/chatRequests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const QueryContainer = ({ setCurrentChatId }) => {

    const queryClient = useQueryClient();
    const auth = queryClient.getQueryData("auth");
    const user = queryClient.getQueryData(["user"]);

    console.log("user data in query container: ", user);

    const [queryText, setQueryText] = useState("");
    const [queryResult, setQueryResult] = useState([]);

    const makeQueryMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchUsersByQuery(USER_PATH, queryText, auth["token"]);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            setQueryResult(data["content"])
            console.log("user query success:", data);
        },
        onError: (error, variables, context) => {
            console.log("error on querying users: ", error.message);
        },
    })

    const createChatMutation = useMutation({
        mutationFn: async (chatBody) => {
            const response = await fetchCreateChat(CHAT_PATH, chatBody, auth["token"]);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(["chats", data.id], chatBody); // manually cache data
            setCurrentChatId(chatData["id"]);
            console.log("chat created successfully:", data);
        },
        onError: (error, variables, context) => {
            console.log("error on fetching created chat: ", error.message);
        },
    })

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