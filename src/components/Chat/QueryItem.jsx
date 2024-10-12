import React from "react";
import styles from "./styles/queryContainerStyles";

import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "../Shared/BoxStyled";
import FlexStyled from "../Shared/FlexStyled";
import Typography from "../Shared/Typography";
import UserAvatar from "../Shared/UserAvatar";

const QueryItem = ({ user, handleItemClick, children }) => {

    const classes = styles();

    const handleClick = (event) => {
        event.preventDefault();
        handleItemClick(event, user);
    }

    const UserDetails = () => (
        <BoxStyled key={user.id} className={classes.queryItem}>
            <Typography type="h5" className="username">{user.username}</Typography>
            <Typography lineClamp={1} truncate="end" className="email">{user.email}</Typography>
        </BoxStyled>
    );

    return (
        <FlexStyled className={classes.queryCard} onClick={handleClick}>
            <UserAvatar size="2.5rem" radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails />
            {children}
        </FlexStyled>
    )
}

export default QueryItem