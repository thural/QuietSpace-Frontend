import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import styles from "./styles/userCardStyles";

import { User } from "@/api/schemas/inferred/user";
import FlexStyled from "@shared/FlexStyled";
import UserAvatar from "@shared/UserAvatar";
import UserDetails from "@shared/UserDetails";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import BoxStyled from "@/components/shared/BoxStyled";

export interface UserCardProps extends GenericWrapper {
    user: User
    isDisplayEmail?: boolean
    isDisplayName?: boolean
}

const UserCard: React.FC<UserCardProps> = ({ user, isDisplayEmail = false, isDisplayName = true, children, ...props }) => {

    const classes = styles();

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