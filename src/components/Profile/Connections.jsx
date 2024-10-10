import React, { useState } from "react";
import { Box, Center, Title } from "@mantine/core";

import styles from "./styles/searchbarStyles";
import Overlay from "../Overlay/Overlay";
import UserList from "./UserList";
import SearchBar from "./SearchBar";

function Connections({ userList, title }) {

    const classes = styles();
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
        // TODO: setFocused(false);
    }


    return (
        <>
            <Overlay closable={{ followers: false }} />
            <Box className={classes.container} >
                <Center><Title order={3}>{title}</Title></Center>
                <SearchBar
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    handleInputFocus={handleInputFocus}
                />
                <UserList users={userList} handleItemClick={handleItemClick} followersResult={followersResult} />
            </Box>
        </>
    )
}

export default Connections