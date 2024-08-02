import styles from "./styles/queryContainerStyles";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryUsers } from "../../hooks/useUserData";
import { useCreateChat } from "../../hooks/useChatData";
import { Anchor, Box, Flex, LoadingOverlay, Title } from "@mantine/core";
import QueryItem from "./QueryItem";
import QueryInput from "./QueryInput";

const QueryContainer = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);


    const [focused, setFocused] = useState(false);
    const [queryResult, setQueryResult] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const createChatMutation = useCreateChat();
    const makeQueryMutation = useQueryUsers(setQueryResult);


    const handleItemClick = async (event, clickedUser) => {
        event.preventDefault();
        console.log("clicked user on query item: ", clickedUser);
        const createdChatRequestBody = { "userIds": [user.id, clickedUser.id] }
        createChatMutation.mutate(createdChatRequestBody);
    }

    const handleInputChange = (event) => {
        const value = event.target.value;
        setFocused(true);
        if (value.length) handleQuerySubmit(value);
        else setQueryResult([]);
    }

    const handleQuerySubmit = async (value) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        await makeQueryMutation.mutate(value);
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1000);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') setFocused(false);
    }

    const handleInputFocus = () => {
        setFocused(true);
    }

    const handleInputBlur = () => {
        setFocused(false);
    }


    const appliedStyle = (!focused) ? { display: 'none' } : { display: 'block' }
    const inputProps = { handleInputFocus, handleInputBlur, handleKeyDown, handleInputChange }
    const classes = styles();


    return (
        <Box className={classes.searchContainer} >

            <QueryInput  {...inputProps} />

            <Box className={classes.resultContainer} style={appliedStyle} >
                {makeQueryMutation.isPending ?
                    (<LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />) :
                    (queryResult.length === 0) ?
                        (
                            <Flex className={classes.recentQueries}>
                                <Title order={4}>recent</Title>
                                <Anchor
                                    fw={400}
                                    fz="1rem"
                                    href=""
                                    target="_blank"
                                    underline="never">
                                    clear all
                                </Anchor>
                            </Flex>) :
                        (queryResult.map((user, index) =>
                            <QueryItem key={index} user={user} handleItemClick={handleItemClick} />
                        ))}
            </Box>

        </Box>
    )
}

export default QueryContainer