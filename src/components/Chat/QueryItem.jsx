import React from "react";
import styles from "./styles/queryContainerStyles";

import { Avatar, Flex, Text, Title } from "@mantine/core";
import { toUpperFirstChar } from "../../utils/stringUtils";

const QueryItem = ({ user, handleItemClick }) => {

    const classes = styles();

    const handleClick = (event) => {
        event.preventDefault();
        handleItemClick(event, user);
    }

    return (
        <Flex className={classes.queryCard} onClick={handleClick}>
            <Avatar color="black" size="2.5rem" radius="10rem">{toUpperFirstChar(user.username)}</Avatar>
            <div key={user.id} className={classes.queryItem}>
                <Title order={5} className="username">{user.username}</Title>
                <Text lineClamp={1} truncate="end" className="email">{user.email}</Text>
            </div>
        </Flex>
    )
}

export default QueryItem