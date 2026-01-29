import {
    UserDetailsSectionContainer,
    UserDetailsSectionHeader,
    UserDetailsSectionTitle,
    UserDetailsSectionContent
} from "../styles/UserDetailsSectionStyles";
import { UserProfileResponse, UserResponse } from "@/features/profile/data/models/user";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { isUserProfile } from "@/shared/utils/typeUtils";

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
    // Determine the bio based on the user type
    const bio = isUserProfile(user) ? user.settings.bio : (user as UserResponse).bio;

    return (
        <UserDetailsSectionContainer>
            <UserDetailsSectionHeader>
                <UserDetailsSectionTitle>{user.username}</UserDetailsSectionTitle>
            </UserDetailsSectionHeader>
            <UserDetailsSectionContent>
                <div style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.25rem",
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {bio || ''}
                </div>
            </UserDetailsSectionContent>
            <div style={{
                width: '6rem',
                height: '6rem',
                borderRadius: '50%',
                background: '#ccc',
                flexShrink: 0
            }} />
        </UserDetailsSectionContainer>
    );
};

export default UserDetailsSection;