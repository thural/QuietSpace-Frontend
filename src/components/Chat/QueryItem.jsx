import React from "react";
import styles from "./styles/queryContainerStyles";

import { Flex, Text, Title } from "@mantine/core";
import { toUpperFirstChar } from "../../utils/stringUtils";
import UserAvatar from "../Shared/UserAvatar";
import { Box } from "@mantine/core";

const QueryItem = ({ user, handleItemClick, children }) => {

    const classes = styles();

    const handleClick = (event) => {
        event.preventDefault();
        handleItemClick(event, user);
    }

    const UserDetails = () => (
        <Box key={user.id} className={classes.queryItem}>
            <Title order={5} className="username">{user.username}</Title>
            <Text lineClamp={1} truncate="end" className="email">{user.email}</Text>
        </Box>
    );

    return (
        <Flex className={classes.queryCard} onClick={handleClick}>
            <UserAvatar size="2.5rem" radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails />
            {children}
        </Flex>
    )
}

export default QueryItem