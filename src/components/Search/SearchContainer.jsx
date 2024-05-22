import React, {useEffect, useRef, useState} from "react";
import { Box, Container, Input, Loader, LoadingOverlay } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";

import styles from "./styles/searchbarStyles";
import Post from "../Posts/Post";
import {useQueryPosts} from "../../hooks/usePostData";
import {generatePfp} from "../../utils/randomPfp";
import {useQueryUsers} from "../../hooks/useUserData";
import QueryItem from "../Chat/QueryItem";

function SearchContainer() {

    const queryInputRef = useRef();
    const [userQueryResult, setUserQueryResult] = useState([]);
    const [postQueryResult, setPostQueryResult] = useState([]);

    const fetchUserQuery = useQueryUsers(setUserQueryResult);
    const fetchPostQuery = useQueryPosts(setPostQueryResult);

    console.log("USER QUERY IN SEARCHBAR", userQueryResult);
    console.log("POSTS QUERY IN SEARCHBAR", postQueryResult);

    useEffect(() => {
        fetchUserQuery.mutate(".");
    }, []);

    const handleInputChange = (event) => {
        event.preventDefault();
        if(postQueryResult.length) return;
        const value = event.target.value;
        if (value.length) fetchUserQuery.mutate(value);
        else setUserQueryResult([]);
    }

    const handleKeyDown = (event) => {
        if (!queryInputRef.current.value.length) return;
        if (event.key === 'Enter') fetchPostQuery.mutate(queryInputRef.current.value);
    }

    const handleItemClick = () => {
        // TODO: implement and call follow feature
    }

    const classes = styles();

    return (
        <Container size="600px" className={classes.container}>
            <Box className={classes.searchbar}>
                <PiMagnifyingGlassBold className={classes.searchIcon} />
                <Input
                    variant="unstyled"
                    className={classes.searchInput}
                    placeholder="search a topic..."
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    ref={queryInputRef}
                />
                <PiMicrophone className={classes.searchIcon} />
            </Box>
            {
                fetchUserQuery.isPending ? <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> :
                    fetchUserQuery.isError ? <h1>{fetchPostQuery.error.message}</h1> :
                        postQueryResult.length === 0 && userQueryResult.map((user, index) =>
                            <QueryItem key={index} user={user} handleItemClick={handleItemClick} />)
            }
            {
                fetchPostQuery.isPending ? <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> :
                    fetchPostQuery.isError ? <h1>{fetchPostQuery.error.message}</h1> :
                        postQueryResult?.map((post, index) => (<Post key={post["id"]} post={post} avatarUrl={generatePfp("beam")} />))
            }
        </Container>
    )
}

export default SearchContainer