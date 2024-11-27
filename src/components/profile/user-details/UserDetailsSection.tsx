import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import styles from "@/styles/profile/userDetailsSectionStyles";
import { toUpperFirstChar } from "@/utils/stringUtils";

import { UserResponse } from "@/api/schemas/inferred/user";
import { GenericWrapper } from "@/types/sharedComponentTypes";

export interface UserDetailsSectionProps extends GenericWrapper {
    user: UserResponse
}

const UserDetailsSection: React.FC<UserDetailsSectionProps> = ({ user }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.detailsSection}>
            <BoxStyled className="profileName"><Typography fw={700}>{user.username}</Typography></BoxStyled>
            <UserAvatar size="4.5rem" chars={toUpperFirstChar(user.username)} />
        </FlexStyled>
    )
};

export default UserDetailsSection