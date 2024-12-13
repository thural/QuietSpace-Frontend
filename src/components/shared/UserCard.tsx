import styles from "@/styles/chat/userCardStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";

import { ResId } from "@/api/schemas/native/common";
import BoxStyled from "@/components/shared/BoxStyled";
import { useGetCurrentUser, useGetUserById } from "@/services/data/useUserData";
import { LoadingOverlay } from "@mantine/core";
import FlexStyled from "@shared/FlexStyled";
import UserDetails from "@shared/UserDetails";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserAvatarPhoto from "./UserAvatarPhoto";
import useUserQueries from "@/api/queries/userQueries";

export interface UserCardProps extends GenericWrapper {
    userId?: ResId
    isDisplayEmail?: boolean
    isDisplayName?: boolean
    isIgnoreNavigation?: boolean
}

const UserCard: React.FC<UserCardProps> = ({
    userId,
    isDisplayEmail = false,
    isDisplayName = true,
    isIgnoreNavigation = false,
    children,
    ...props
}) => {

    const classes = styles();
    const navigate = useNavigate();
    const { getSignedUser } = useUserQueries();
    const signedUser = getSignedUser();

    const { data: user, isLoading } = userId ? useGetUserById(userId) : useGetCurrentUser();

    const handleUserNavigation = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isIgnoreNavigation) return;
        if (userId === signedUser?.id) return navigate(`/profile`);
        navigate(`/profile/${userId}`);
    }

    if (isLoading || !user) return <LoadingOverlay />;

    return (
        <FlexStyled onClick={handleUserNavigation} className={classes.queryCard} {...props}>
            <UserAvatarPhoto userId={userId} />
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