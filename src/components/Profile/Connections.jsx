import React, { useRef, useState } from "react";
import { Box, Center, Input, LoadingOverlay, Title } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";

import styles from "./styles/searchbarStyles";
import UserQueryItem from "../Shared/UserQueryItem";
import Overlay from "../Overlay/Overlay";

function Connections({ userList, title }) {

    const classes = styles();

    const queryInputRef = useRef();
    const [followersResult, setFollowersResult] = useState(userList.data);


    const filterByQuery = (value) => {
        return userList.data
            .filter(f => (f.username.includes(value) || f.email.includes(value)));
    }

    const handleInputChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length) {
            setFollowersResult(filterByQuery(value));
        } else {
            setFollowersResult(userList.data);
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

    const SearchBar = () => (
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
    )

    const UserList = ({ users }) => {
        const RenderResult = () => {
            if (users.isPending) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            else if (userList.isError) return <h1>{fetchUserQuery.error.message}</h1>
            else followersResult.map((user, index) => <UserQueryItem key={index} user={user} handleItemClick={handleItemClick} />)
        }
        return <Box className={classes.resultContainer}><RenderResult /></Box>
    }


    return (
        <>
            <Overlay closable={{ followers: false }} />
            <Box className={classes.container} >
                <Center><Title order={3}>{title}</Title></Center>
                <SearchBar />
                <UserList users={userList} />
            </Box>
        </>
    )
}

export default Connections