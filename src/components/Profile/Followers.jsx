import React, { useEffect, useRef, useState } from "react";
import { Anchor, Box, Center, Container, Flex, Input, Loader, LoadingOverlay, Title } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";

import styles from "./styles/searchbarStyles";
import { useGetFollowers, useGetFollowings, useQueryUsers } from "../../hooks/useUserData";
import UserQueryItem from "./UserQueryItem";
import Overlay from "../Overlay/Overlay";

function Followers() {

    const queryInputRef = useRef();
    const followers = useGetFollowers();
    const [followersResult, setFollowersResult] = useState(followers.data);


    const filterByQuery = (value) => {
        return followers.data
            .filter(f => (f.username.includes(value) || f.email.includes(value)));
    }

    const handleInputChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        console.log("value at input change at follow container", value)
        if (value.length) {
            setFollowersResult(filterByQuery(value));
        } else {
            setFollowersResult(followers.data);
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
            <Overlay closable={{ followers: false }} />
            <Box className={classes.container} >
                <Center><Title order={3}>followers</Title></Center>
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
                        followers.isPending ? <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> :
                            followers.isError ? <h1>{fetchUserQuery.error.message}</h1> :
                                followersResult.map((user, index) =>
                                    <UserQueryItem key={index} user={user} handleItemClick={handleItemClick} />)
                    }
                </Box>
            </Box>
        </>
    )
}

export default Followers