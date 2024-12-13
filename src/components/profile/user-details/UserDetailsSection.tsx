import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import styles from "@/styles/profile/userDetailsSectionStyles";

import { UserProfileResponse, UserResponse } from "@/api/schemas/inferred/user";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { isUserProfile } from "@/utils/typeUtils";

/**
 * UserDetailsSectionProps interface.
 * 
 * This interface defines the props for the UserDetailsSection component.
 * 
 * @property {UserResponse | UserProfileResponse} user - The user profile data, which can be of either type.
 */
export interface UserDetailsSectionProps extends GenericWrapper {
    user: UserResponse | UserProfileResponse;
}

/**
 * UserDetailsSection component.
 * 
 * This component displays the user details including their username and bio.
 * It also renders the user's avatar. The bio is derived based on the type of user data provided.
 * 
 * @param {UserDetailsSectionProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserDetailsSection component.
 */
const UserDetailsSection: React.FC<UserDetailsSectionProps> = ({ user }) => {
    const classes = styles(); // Apply custom styles

    // Determine the bio based on the user type
    const bio = isUserProfile(user) ? user.settings.bio : user.bio;

    return (
        <FlexStyled className={classes.detailsSection}>
            <BoxStyled>
                <Typography type="h2" fw={700}>{user.username}</Typography> {/* Display username */}
                <Typography
                    style={{ whiteSpace: "pre-wrap", lineHeight: "1.25rem" }}
                    size="1rem"
                    lineclamp={4} // Limit the number of lines for the bio
                >
                    {bio} {/* Display bio */}
                </Typography>
            </BoxStyled>
            <UserAvatarPhoto size="6rem" userId={user.id} /> {/* Render user avatar */}
        </FlexStyled>
    );
};

export default UserDetailsSection;