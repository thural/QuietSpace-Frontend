import useUserQueries from "@/features/profile/data/userQueries";
import { UserProfileResponse, UserResponse } from "@/features/profile/data/models/user";
import { MouseEventFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import React from "react";
import { useNavigate } from "react-router-dom";
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
    children?: React.ReactNode;
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
    const classes = {}; // Remove JSS styles
    const navigate = useNavigate(); // Hook for navigation
    const queries = useUserQueries(); // Hook to obtain user queries
    const signedUser: UserProfileResponse | undefined = queries.currentUser; // Get the signed-in user data

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
        <div className="user-card" onClick={handleClick}>
            <UserAvatarPhoto userId={data.id} /> {/* Display user's avatar */}
            <UserDetails scale={4} user={data} /> {/* Display user's details */}
            {/* hasFollowToggle && <FollowToggle user={data} /> */}
            {children} {/* Render any additional children */}
        </div>
    );
}

export default UserQueryItem;