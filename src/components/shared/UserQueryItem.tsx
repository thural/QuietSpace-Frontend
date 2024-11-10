import styles from "./styles/userQueryItemStyles";

import { getSignedUser } from "@/api/queries/userQueries";
import { User } from "@/api/schemas/inferred/user";
import { nullishValidationdError } from "@/utils/errorUtils";
import { toUpperFirstChar } from "@utils/stringUtils";
import { useNavigate } from "react-router-dom";
import FlexStyled from "./FlexStyled";
import FollowToggle from "./FollowToggle";
import UserAvatar from "./UserAvatar";
import UserDetails from "./UserDetails";
import React from "react";

const UserQueryItem = ({ user }: { user: User }) => {

    const classes = styles();
    const navigate = useNavigate();
    const signedUser: User | undefined = getSignedUser();
    if (signedUser === undefined) throw nullishValidationdError({ signedUser });


    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (user.id === signedUser.id) return navigate('/profile');
        navigate(`/profile/${user.id}`);
    }


    return (
        <FlexStyled className={classes.userCard} onClick={handleClick}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails scale={4} user={user} />
            <FollowToggle onClick={(e: React.MouseEvent) => e.preventDefault()} user={user} />
        </FlexStyled>
    )
}

export default UserQueryItem