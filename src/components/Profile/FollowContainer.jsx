import React, { useEffect, useRef, useState } from "react";
import { Anchor, Box, Center, Container, Flex, Input, Loader, LoadingOverlay, Title } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";

import styles from "./styles/searchbarStyles";
import { useGetFollowings, useQueryUsers } from "../../hooks/useUserData";
import UserQueryItem from "./UserQueryItem";
import Overlay from "../Overlay/Overlay";

function FollowContainer() {

    const queryInputRef = useRef();
    const [userQueryResult, setUserQueryResult] = useState([]);

    console.log("user query result at followings ", userQueryResult);

    const fetchUserQuery = useQueryUsers(setUserQueryResult);
    const followings = useGetFollowings();


    useEffect(() => {
        fetchUserQuery.mutate(".");
    }, []);

    const handleInputChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        console.log("value at input change at follow container", value)
        if (value.length) {
            fetchUserQuery.mutate(value);
        } else {
            fetchUserQuery.mutate(".");
        }
    }

    const handleItemClick = () => {
        // TODO: implement and call follow feature
    }

    const handleInputFocus = (event) => {
    }

    const handleInputBlur = () => {
        // setFocused(false);
    }

    const classes = styles();

    return (
        <>
            <Overlay closable={{ followings: false }} />
            <Box className={classes.container} >
                <Center><Title order={3}>followings</Title></Center>
                <Box className={classes.searchbar} >
                    <PiMagnifyingGlassBold className={classes.searchIcon} />
                    <Input
                        variant="unstyled"
                        className={classes.searchInput}
                        placeholder="search a topic..."
                        onFocus={handleInputFocus}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        ref={queryInputRef}
                    />
                </Box>
                <Box className={classes.resultContainer} >
                    {
                        fetchUserQuery.isPending ? <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> :
                            fetchUserQuery.isError ? <h1>{fetchUserQuery.error.message}</h1> :
                                userQueryResult.map((user, index) =>
                                    <UserQueryItem key={index} user={user} handleItemClick={handleItemClick} />)
                    }
                </Box>
            </Box>
        </>
    )
}

export default FollowContainer