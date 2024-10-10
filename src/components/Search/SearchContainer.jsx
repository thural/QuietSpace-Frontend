import React, { useEffect, useRef, useState } from "react";
import { Container } from "@mantine/core";

import styles from "./styles/searchContainerStyles";
import { useQueryPosts } from "../../hooks/usePostData";
import { useQueryUsers } from "../../hooks/useUserData";
import SearchBar from "./SearchBar";
import UserQuery from "./UserQuery";
import PostQuery from "./PostQuery";

function SearchContainer() {

    const classes = styles();

    const queryInputRef = useRef();
    const [focused, setFocused] = useState(false);
    const [userQueryList, setUserQueryResult] = useState([]);
    const [postQueryResult, setPostQueryResult] = useState([]);
    const fetchUserQuery = useQueryUsers(setUserQueryResult);
    const fetchPostQuery = useQueryPosts(setPostQueryResult);


    useEffect(() => {
        fetchUserQuery.mutate(".");
    }, []);

    useEffect(() => {
        if (!userQueryList.length) setFocused(false);
    }, [userQueryList])


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


    return (
        <Container size="600px" className={classes.container}>
            <SearchBar
                handleInputChange={handleInputChange}
                handleInputFocus={handleInputFocus}
                handleInputBlur={handleInputBlur}
                handleKeyDown={handleKeyDown}
                style={searchAppliedStyle}
            />
            <UserQuery
                handleItemClick={handleItemClick}
                fetchUserQuery={fetchUserQuery}
                userQueryList={userQueryList}
                style={resultAppliedStyle}
            />
            <PostQuery
                fetchPostQuery={fetchPostQuery}
                postQueryResult={postQueryResult}
            />
        </Container>
    )
}

export default SearchContainer