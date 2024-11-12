import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import styles from "./styles/userCardStyles";

import { ResId } from "@/api/schemas/native/common";
import BoxStyled from "@/components/shared/BoxStyled";
import { useGetUserById } from "@/services/data/useUserData";
import { LoadingOverlay } from "@mantine/core";
import FlexStyled from "@shared/FlexStyled";
import UserAvatar from "@shared/UserAvatar";
import UserDetails from "@shared/UserDetails";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";

export interface UserCardProps extends GenericWrapper {
    userId: ResId
    isDisplayEmail?: boolean
    isDisplayName?: boolean
}

const UserCard: React.FC<UserCardProps> = ({ userId, isDisplayEmail = false, isDisplayName = true, children, ...props }) => {

    const classes = styles();

    const { data: user, isLoading } = useGetUserById(userId);

    if (isLoading) return <LoadingOverlay />

    return (
        <FlexStyled className={classes.queryCard} {...props}>
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