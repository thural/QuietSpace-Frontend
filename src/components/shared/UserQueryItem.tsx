import styles from "@/styles/shared/userQueryItemStyles";
import useUserQueries from "@/api/queries/userQueries";
import { UserProfileResponse, UserResponse } from "@/api/schemas/inferred/user";
import { MouseEventFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import React from "react";
import { useNavigate } from "react-router-dom";
import Conditional from "./Conditional";
import FlexStyled from "./FlexStyled";
import FollowToggle from "./FollowToggle";
import UserAvatarPhoto from "./UserAvatarPhoto";
import UserDetails from "./UserDetails";

/**
 * UserQueryItemProps interface.
 * 
 * This interface defines the props for the UserQueryItem component.
 * 
 * @property {UserResponse} data - The user data to be displayed in the item.
 * @property {boolean} [hasFollowToggle=true] - Indicates whether to display the follow toggle.
 * @property {MouseEventFn} [handleItemClick] - Optional function to handle item click events.
 */
interface UserQueryItemProps extends GenericWrapper {
    data: UserResponse;
    hasFollowToggle?: boolean;
    handleItemClick?: MouseEventFn;
}

/**
 * UserQueryItem component.
 * 
 * This component displays a user query item, including the user's avatar, details, and an optional 
 * follow toggle. It handles navigation to the user's profile when clicked and allows for 
 * custom click handling through the provided function. The component ensures that the signed-in 
 * user does not navigate to their own profile when clicked.
 * 
 * @param {UserQueryItemProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserQueryItem component.
 */
const UserQueryItem: React.FC<UserQueryItemProps> = ({
    data,
    hasFollowToggle = true,
    children,
    handleItemClick
}) => {
    const classes = styles(); // Apply styles
    const navigate = useNavigate(); // Hook for navigation
    const { getSignedUser } = useUserQueries(); // Hook to obtain the signed-in user
    const signedUser: UserProfileResponse | undefined = getSignedUser(); // Get the signed-in user data

    if (signedUser === undefined) throw new Error("signedUser is undefined"); // Ensure signedUser is defined

    /**
     * Handle click event to navigate to the user profile.
     * 
     * @param {React.MouseEvent} event - The mouse event triggered by the click.
     */
    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault(); // Prevent default action
        event.stopPropagation(); // Prevent event from bubbling
        if (data.id === signedUser.id) return navigate('/profile'); // Prevent navigating to own profile
        handleItemClick && handleItemClick(event); // Invoke custom click handler if provided
        navigate(`/profile/${data.id}`); // Navigate to the clicked user's profile
    }

    return (
        <FlexStyled className={classes.userCard} onClick={handleClick}>
            <UserAvatarPhoto userId={data.id} /> {/* Display user's avatar */}
            <UserDetails scale={4} user={data} /> {/* Display user's details */}
            <Conditional isEnabled={hasFollowToggle}>
                <FollowToggle user={data} /> {/* Display follow toggle if enabled */}
            </Conditional>
            {children} {/* Render any additional children */}
        </FlexStyled>
    );
}

export default UserQueryItem;