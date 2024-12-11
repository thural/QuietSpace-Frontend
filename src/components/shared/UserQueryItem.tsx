import styles from "@/styles/shared/userQueryItemStyles";

import useUserQueries from "@/api/queries/userQueries";
import { UserProfileResponse, UserResponse } from "@/api/schemas/inferred/user";
import { MouseEventFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import React from "react";
import { useNavigate } from "react-router-dom";
import Conditional from "./Conditional";
import FlexStyled from "./FlexStyled";
import FollowToggle from "./FollowToggle";
import UserAvatarPhoto from "./UserAvatarPhoto";
import UserDetails from "./UserDetails";



interface UserQueryItemProps extends GenericWrapper {
    data: UserResponse
    hasFollowToggle?: boolean
    handleItemClick?: MouseEventFn
}

const UserQueryItem: React.FC<UserQueryItemProps> = ({ data, hasFollowToggle = true, children, handleItemClick }) => {

    const classes = styles();
    const navigate = useNavigate();
    const { getSignedUser } = useUserQueries();
    const signedUser: UserProfileResponse | undefined = getSignedUser();
    if (signedUser === undefined) throw new Error("signedUser is undefined");


    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (data.id === signedUser.id) return navigate('/profile');
        handleItemClick && handleItemClick(event);
        navigate(`/profile/${data.id}`);
    }


    return (
        <FlexStyled className={classes.userCard} onClick={handleClick}>
            <UserAvatarPhoto userId={data.id} />
            <UserDetails scale={4} user={data} />
            <Conditional isEnabled={hasFollowToggle}>
                <FollowToggle user={data} />
            </Conditional>
            {children}
        </FlexStyled>
    )
}

export default UserQueryItem