import React from "react";
import styles from "./styles/queryContainerStyles";

import { toUpperFirstChar } from "../../utils/stringUtils";
import FlexStyled from "../Shared/FlexStyled";
import UserAvatar from "../Shared/UserAvatar";
import UserDetails from "../Shared/UserDetails";

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