import styles from "./styles/queryContainerStyles";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryUsers } from "../../hooks/useUserData";
import { useCreateChat } from "../../hooks/useChatData";
import { useChatStore } from "../../hooks/zustand";
import { Anchor, Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";

const QueryContainer = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const searchInput = React.useRef(null);
    if (document.activeElement === searchInput.current) {
        console.log("search is focused");
        // Do something when the input is focused
    }


    const [queryText, setQueryText] = useState("");
    const [queryResult, setQueryResult] = useState([]);

    const { setActiveChatId } = useChatStore();
    const createChatMutation = useCreateChat(setActiveChatId);
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


    const appliedStyle = (queryText.length === 0 && !searchInput.current) ? { display: 'none' } : { display: 'block' }
    const classes = styles();


    return (
        <Box className={classes.searchContainer} ref={searchInput}>

            <form className={classes.searchInput} >
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

            <div className={classes.resultContainer} style={appliedStyle} >


                {makeQueryMutation.isPending ? (<h1>loading...</h1>) :

                    (queryResult.length === 0) ? (
                        <Flex className={classes.recentQueries}>
                            <Title order={4}>recent</Title>
                            <Anchor
                                fw={400}
                                fz="lg"
                                href=""
                                target="_blank"
                                underline="never"
                            >
                                clear all
                            </Anchor>
                        </Flex>
                    ) :
                        (
                            queryResult.map(user =>
                                <Flex className={classes.queryCard}>
                                    <Avatar
                                        color="black"
                                        size="2.5rem"
                                        radius="10rem"
                                        src={generatePfp("beam")}>
                                        {user.username[0].toUpperCase()}
                                    </Avatar>
                                    <div key={user.id}
                                        className={classes.queryItem}
                                        onClick={(event) => handleUserClick(event, user)}
                                    >
                                        <Title order={5} className="username">{user.username}</Title>
                                        <Text lineClamp={1} truncate="end" className="email">{user.email}</Text>
                                    </div>
                                </Flex>

                            )
                        )}
            </div>


        </Box>
    )
}

export default QueryContainer