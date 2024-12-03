import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import styles from "@/styles/profile/userDetailsSectionStyles";

import { UserProfileResponse, UserResponse } from "@/api/schemas/inferred/user";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { isUserProfile } from "@/utils/typeUtils";

export interface UserDetailsSectionProps extends GenericWrapper {
    user: UserResponse | UserProfileResponse
}

const UserDetailsSection: React.FC<UserDetailsSectionProps> = ({ user }) => {

    const classes = styles();

    const bio = isUserProfile(user) ? user.settings.bio : user.bio;

    return (
        <FlexStyled className={classes.detailsSection}>
            <BoxStyled>
                <Typography type="h2" fw={700}>{user.username}</Typography>
                <Typography style={{ whiteSpace: "pre-wrap", lineHeight: "1.25rem" }} size="1rem" lineclamp={4}>{bio}</Typography>
            </BoxStyled>
            <UserAvatarPhoto size="6rem" userId={user.id} />
        </FlexStyled>
    )
};

export default UserDetailsSection