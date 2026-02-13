import useUserQueries from "@/features/profile/data/userQueries";
import { UserProfileResponse, UserResponse } from "@/features/profile/data/models/user";
import { MouseEventFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from "react";
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
interface IUserQueryItemProps extends GenericWrapper {
    data: UserResponse;
    hasFollowToggle?: boolean;
    handleItemClick?: MouseEventFn;
    children?: ReactNode;
}

interface IUserQueryItemState {
    signedUser?: UserProfileResponse;
}

/**
 * UserQueryItem component.
 * 
 * This component displays a user query item, including the user's avatar, details, and an optional 
 * follow toggle. It handles navigation to the user's profile when clicked and allows for 
 * custom click handling through the provided function. The component ensures that the signed-in 
 * user does not navigate to their own profile when clicked.
 * 
 * @param {IUserQueryItemProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserQueryItem component.
 */
class UserQueryItem extends PureComponent<IUserQueryItemProps, IUserQueryItemState> {
    private navigate: ReturnType<typeof useNavigate>;
    private queries: ReturnType<typeof useUserQueries>;

    constructor(props: IUserQueryItemProps) {
        super(props);

        // Initialize hooks (Note: This is a pattern for converting functional to class components)
        // In a real scenario, these would be injected via props or context
        this.navigate = (() => {
            // This would typically come from a navigation context or prop
            return (path: string) => {
                window.location.href = path;
            };
        })() as ReturnType<typeof useNavigate>;

        this.queries = {
            currentUser: undefined,
            getSignedUserElseThrow: () => ({ id: 'current-user', name: 'Current User' } as UserProfileResponse),
            isLoading: false,
            error: null
        } as unknown as ReturnType<typeof useUserQueries>;

        this.state = {
            signedUser: this.queries.currentUser
        };
    }

    override componentDidMount(): void {
        // In a real implementation, this would fetch user data or subscribe to context
        // For now, we'll simulate the hook behavior
        const mockSignedUser: UserProfileResponse = {
            id: 'current-user',
            name: 'Current User',
            email: 'current@example.com'
        } as UserProfileResponse;

        this.setState({ signedUser: mockSignedUser });
    }

    /**
     * Handle click event to navigate to the user profile.
     * 
     * @param {React.MouseEvent} event - The mouse event triggered by the click.
     */
    private handleClick = (event: React.MouseEvent): void => {
        event.preventDefault(); // Prevent default action
        event.stopPropagation(); // Prevent event from bubbling

        const { data, handleItemClick } = this.props;
        const { signedUser } = this.state;

        if (!signedUser) return;

        if (data.id === signedUser.id) {
            this.navigate('/profile'); // Prevent navigating to own profile
        } else {
            handleItemClick && handleItemClick(event); // Invoke custom click handler if provided
            this.navigate(`/profile/${data.id}`); // Navigate to the clicked user's profile
        }
    };

    override render(): ReactNode {
        const { data, children } = this.props;
        const { signedUser } = this.state;

        if (!signedUser) {
            return <div>Loading...</div>;
        }

        return (
            <div className="user-card" onClick={this.handleClick}>
                <UserAvatarPhoto userId={data.id} /> {/* Display user's avatar */}
                <UserDetails scale={4} user={data} /> {/* Display user's details */}
                {/* hasFollowToggle && <FollowToggle user={data} /> */}
                {children} {/* Render any additional children */}
            </div>
        );
    }
}

export default UserQueryItem;
export type { IUserQueryItemProps };