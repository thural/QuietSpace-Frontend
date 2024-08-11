import React, { useEffect, useRef, useState } from "react";
import { Anchor, Box, Container, Flex, Input, Loader, LoadingOverlay, Title } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";

import styles from "./styles/searchbarStyles";
import Post from "../Posts/Post";
import { useQueryPosts } from "../../hooks/usePostData";
import { generatePfp } from "../../utils/randomPfp";
import { useQueryUsers } from "../../hooks/useUserData";
import UserQueryItem from "./UserQueryItem";

function SearchContainer() {

    const queryInputRef = useRef();
    const [focused, setFocused] = useState(false);
    const [userQueryResult, setUserQueryResult] = useState([]);
    const [postQueryResult, setPostQueryResult] = useState([]);

    const fetchUserQuery = useQueryUsers(setUserQueryResult);
    const fetchPostQuery = useQueryPosts(setPostQueryResult);


    useEffect(() => {
        fetchUserQuery.mutate(".");
    }, []);

    useEffect(() => {
        if (!userQueryResult.length) setFocused(false);
    }, [userQueryResult])

    const handleInputChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length) {
            setFocused(true);
            fetchUserQuery.mutate(value);
        } else {
            setFocused(false);
            setUserQueryResult([]);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') setFocused(false);
        if (!queryInputRef.current.value.length) return;
        if (event.key === 'Enter') fetchPostQuery.mutate(queryInputRef.current.value);
    }

    const handleItemClick = () => {
        // TODO: implement and call follow feature
    }

    const handleInputFocus = (event) => {
        if (event.target.value.length) setFocused(true);
    }

    const handleInputBlur = () => {
        // setFocused(false);
    }

    const resultAppliedStyle = focused ? { display: 'block' } : { display: 'none' };
    const searchAppliedStyle = focused ? { boxShadow: '0 4px 8px -4px rgba(72, 72, 72, 0.3)' } : {};
    const classes = styles();

    return (
        <Container size="600px" className={classes.container}>
            <Box className={classes.searchbar} style={searchAppliedStyle}>
                <PiMagnifyingGlassBold className={classes.searchIcon} />
                <Input
                    variant="unstyled"
                    className={classes.searchInput}
                    placeholder="search a topic..."
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    ref={queryInputRef}
                />
                <PiMicrophone className={classes.searchIcon} />
            </Box>
            <Box className={classes.resultContainer} style={resultAppliedStyle} >
                {
                    fetchUserQuery.isPending ? <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> :
                        fetchUserQuery.isError ? <h1>{fetchPostQuery.error.message}</h1> :
                            userQueryResult.map((user, index) =>
                                <UserQueryItem key={index} user={user} handleItemClick={handleItemClick} />)
                }
            </Box>
            {
                fetchPostQuery.isPending ? <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> :
                    fetchPostQuery.isError ? <h1>{fetchPostQuery.error.message}</h1> :
                        postQueryResult?.map((post, index) => (<Post key={post["id"]} post={post} avatarUrl={generatePfp("beam")} />))
            }
        </Container>
    )
}

export default SearchContainer