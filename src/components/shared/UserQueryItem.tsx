import styles from "../../styles/shared/userQueryItemStyles";

import { getSignedUser } from "@/api/queries/userQueries";
import { User } from "@/api/schemas/inferred/user";
import { nullishValidationdError } from "@/utils/errorUtils";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GenericWrapper } from "../../types/sharedComponentTypes";
import Conditional from "./Conditional";
import FlexStyled from "./FlexStyled";
import FollowToggle from "./FollowToggle";
import UserAvatar from "./UserAvatar";
import UserDetails from "./UserDetails";



interface UserQueryItemProps extends GenericWrapper {
    data: User
    hasFollowToggle?: boolean
}

const UserQueryItem: React.FC<UserQueryItemProps> = ({ data, hasFollowToggle = true, children }) => {

    const classes = styles();
    const navigate = useNavigate();
    const signedUser: User | undefined = getSignedUser();
    if (signedUser === undefined) throw nullishValidationdError({ signedUser });


    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (data.id === signedUser.id) return navigate('/profile');
        navigate(`/profile/${data.id}`);
    }


    return (
        <FlexStyled className={classes.userCard} onClick={handleClick}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(data.username)} />
            <UserDetails scale={4} user={data} />
            <Conditional isEnabled={hasFollowToggle}>
                <FollowToggle user={data} />
            </Conditional>
            {children}
        </FlexStyled>
    )
}

export default UserQueryItem