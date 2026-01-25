import styles from "@/features/chat/presentation/styles/userCardStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { ResId } from "@/shared/api/models/commonNative";
import { Container } from '@/shared/ui/components/layout/Container';
import { FlexContainer } from '@/shared/ui/components/layout/FlexContainer';
import { useGetCurrentUser, useGetUserById } from "@/services/data/useUserData";
import { LoadingOverlay } from "@mantine/core";
import UserDetails from "@shared/UserDetails";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserAvatarPhoto from "./UserAvatarPhoto";
import useUserQueries from "@/core/network/api/queries/userQueries";

/**
 * UserCardProps interface.
 * 
 * This interface defines the props for the UserCard component.
 * 
 * @property {ResId} [userId] - The ID of the user whose details are to be displayed.
 * @property {boolean} [isDisplayEmail=false] - Indicates whether to display the user's email.
 * @property {boolean} [isDisplayName=true] - Indicates whether to display the user's name.
 * @property {boolean} [isIgnoreNavigation=false] - If true, disables navigation on click.
 */
export interface UserCardProps extends GenericWrapper {
    userId?: ResId;
    isDisplayEmail?: boolean;
    isDisplayName?: boolean;
    isIgnoreNavigation?: boolean;
}

/**
 * UserCard component.
 * 
 * This component displays a user's card, which includes their avatar and details. It 
 * fetches user data based on the provided user ID or the current user, displaying a loading 
 * overlay while the data is being fetched. The card can navigate to the user's profile 
 * page when clicked, depending on the navigation settings.
 * 
 * @param {UserCardProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserCard component.
 */
const UserCard: React.FC<UserCardProps> = ({
    userId,
    isDisplayEmail = false,
    isDisplayName = true,
    isIgnoreNavigation = false,
    children,
    ...props
}) => {
    const classes = styles(); // Apply styles
    const navigate = useNavigate(); // Hook for navigation
    const { getSignedUser } = useUserQueries(); // Hook to obtain the signed-in user
    const signedUser = getSignedUser(); // Get the signed-in user's data

    // Fetch user data based on userId or current user
    const { data: user, isLoading } = userId ? useGetUserById(userId) : useGetCurrentUser();

    /**
     * Handles navigation to the user's profile.
     * 
     * @param {React.MouseEvent} e - The mouse event triggered by the click.
     */
    const handleUserNavigation = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling
        if (isIgnoreNavigation) return; // Exit if navigation is ignored
        if (userId === signedUser?.id) return navigate(`/profile`); // Navigate to signed user's profile
        navigate(`/profile/${userId}`); // Navigate to the specified user's profile
    }

    // Show loading overlay while fetching data
    if (isLoading || !user) return <LoadingOverlay />;

    return (
        <FlexContainer onClick={handleUserNavigation} className={classes.queryCard} {...props}>
            <UserAvatarPhoto userId={userId} /> {/* Display user's avatar */}
            <Container>
                <UserDetails
                    user={user}
                    scale={5}
                    isDisplayEmail={isDisplayEmail}
                    isDisplayName={isDisplayName}
                /> {/* Display user details */}
                <Container className={classes.detailsSection}>
                    {children} {/* Render any additional children */}
                </Container>
            </Container>
        </FlexContainer>
    );
}

export default UserCard;