import React from "react";
import styles from "./styles/chatQueryStyles";

import FlexStyled from "@shared/FlexStyled";
import UserAvatar from "@shared/UserAvatar";
import UserDetails from "@shared/UserDetails";
import { toUpperFirstChar } from "@utils/stringUtils";

const UserCard = ({ data: user, handleItemClick, children }) => {

    const classes = styles();

    const handleClick = (event) => {
        event.preventDefault();
        handleItemClick(event, user);
    }

    return (
        <FlexStyled className={classes.queryCard} onClick={handleClick}>
            <UserAvatar size="2.5rem" radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails user={user} scale={5} />
            {children}
        </FlexStyled>
    )
}

export default UserCard