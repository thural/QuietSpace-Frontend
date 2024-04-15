import React from "react";
import styles from "./styles/queryContainerStyles";

import { Avatar, Flex, Text, Title } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";

const QueryItem = ({ user, handleItemClick }) => {

    const classes = styles();

    return (
        <Flex className={classes.queryCard}>
            <Avatar
                color="black"
                size="2.5rem"
                radius="10rem"
                src={generatePfp("beam")}>
                {user.username[0].toUpperCase()}
            </Avatar>
            <div key={user.id}
                className={classes.queryItem}
                onClick={handleItemClick}
            >
                <Title order={5} className="username">{user.username}</Title>
                <Text lineClamp={1} truncate="end" className="email">{user.email}</Text>
            </div>
        </Flex>
    )
}

export default QueryItem