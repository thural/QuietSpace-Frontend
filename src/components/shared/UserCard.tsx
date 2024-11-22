import styles from "@/styles/chat/userCardStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";

import { ResId } from "@/api/schemas/native/common";
import BoxStyled from "@/components/shared/BoxStyled";
import { useGetUserById } from "@/services/data/useUserData";
import { LoadingOverlay } from "@mantine/core";
import FlexStyled from "@shared/FlexStyled";
import UserAvatar from "@shared/UserAvatar";
import UserDetails from "@shared/UserDetails";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { User } from "@/api/schemas/inferred/user";

export interface UserCardProps extends GenericWrapper {
    userId: ResId
    isDisplayEmail?: boolean
    isDisplayName?: boolean
}

const UserCard: React.FC<UserCardProps> = ({ userId, isDisplayEmail = false, isDisplayName = true, children, ...props }) => {

    const classes = styles();
    const navigate = useNavigate();
    const signedUser: User = getSignedUserElseThrow();

    const { data: user, isLoading } = useGetUserById(userId);

    const handleUserNavigation = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userId === signedUser.id) return navigate(`/profile`);
        navigate(`/profile/${userId}`);
    }

    if (isLoading || !user) return <LoadingOverlay />;

    return (
        <FlexStyled onClick={handleUserNavigation} className={classes.queryCard} {...props}>
            <UserAvatar size="2.5rem" radius="10rem" chars={toUpperFirstChar(user.username)} />
            <BoxStyled>
                <UserDetails user={user} scale={5} isDisplayEmail={isDisplayEmail} isDisplayName={isDisplayName} />
                <BoxStyled className={classes.detailsSection}>
                    {children}
                </BoxStyled>
            </BoxStyled>
        </FlexStyled>
    )
}

export default UserCard