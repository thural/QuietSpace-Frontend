import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import styles from "@/styles/profile/userDetailsSectionStyles";

import { UserResponse } from "@/api/schemas/inferred/user";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import { GenericWrapper } from "@/types/sharedComponentTypes";

export interface UserDetailsSectionProps extends GenericWrapper {
    user: UserResponse
}

const UserDetailsSection: React.FC<UserDetailsSectionProps> = ({ user }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.detailsSection}>
            <BoxStyled className="profileName"><Typography fw={700}>{user.username}</Typography></BoxStyled>
            <UserAvatarPhoto size="4.5rem" userId={user.id} />
        </FlexStyled>
    )
};

export default UserDetailsSection