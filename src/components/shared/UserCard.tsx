import styles from "@/styles/chat/userCardStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";

import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { UserProfileResponse } from "@/api/schemas/inferred/user";
import { ResId } from "@/api/schemas/native/common";
import BoxStyled from "@/components/shared/BoxStyled";
import { useGetCurrentUser, useGetUserById } from "@/services/data/useUserData";
import { LoadingOverlay } from "@mantine/core";
import FlexStyled from "@shared/FlexStyled";
import UserAvatar from "@shared/UserAvatar";
import UserDetails from "@shared/UserDetails";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPhotoData } from "@/utils/dataUtils";

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

    const { data: user, isLoading } = userId ? useGetUserById(userId) : useGetCurrentUser();

    const handleUserNavigation = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isIgnoreNavigation) return;
        if (userId === user?.id) return navigate(`/profile`);
        navigate(`/profile/${userId}`);
    }

    if (isLoading || !user) return <LoadingOverlay />;

    const photoData = formatPhotoData(user.photo?.type, user.photo?.data);

    return (
        <FlexStyled onClick={handleUserNavigation} className={classes.queryCard} {...props}>
            <UserAvatar size="2.5rem" radius="10rem" src={photoData} chars={toUpperFirstChar(user.username)} />
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