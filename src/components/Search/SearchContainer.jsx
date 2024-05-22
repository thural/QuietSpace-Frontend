import React, {useRef, useState} from "react";
import { Box, Container, Input, Loader, LoadingOverlay } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";

import styles from "./styles/searchbarStyles";
import Post from "../Posts/Post";
import {useQueryPosts} from "../../hooks/usePostData";
import {generatePfp} from "../../utils/randomPfp";

function SearchContainer() {

    const queryInputRef = useRef();
    const [postQueryResult, setPostQueryResult] = useState([]);

    const fetchPostQuery = useQueryPosts(setPostQueryResult);

    console.log("POSTS QUERY IN SEARCHBAR", postQueryResult);

    const handleKeyDown = (event) => {
        if (!queryInputRef.current.value.length) return;
        if (event.key === 'Enter') fetchPostQuery.mutate(queryInputRef.current.value);
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
                    ref={queryInputRef}
                />
                <PiMicrophone className={classes.searchIcon} />
            </Box>
            {
                (fetchPostQuery.isPending) ? <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> :
                fetchPostQuery.isError ? <h1>{fetchPostQuery.error.message}</h1> :
                postQueryResult?.map((post, index) => (<Post key={post["id"]} post={post} avatarUrl={generatePfp("beam")} />))
            }
        </Container>
    )
}

export default SearchContainer