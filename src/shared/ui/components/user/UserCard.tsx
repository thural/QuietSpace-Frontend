import styles from "@/features/chat/presentation/styles/userCardStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { ResId } from "@/shared/api/models/commonNative";
import { Container } from '@/shared/ui/components/layout/Container';
import { FlexContainer } from '@/shared/ui/components/layout/FlexContainer';
import { useGetCurrentUser, useGetUserById } from "@/services/data/useUserData";
import { LoadingOverlay } from "@/shared/ui/components/display/LoadingOverlay";
import UserDetails from "@shared/UserDetails";
import React, { PureComponent, ReactNode } from "react";
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
export interface IUserCardProps extends GenericWrapper {
    userId?: ResId;
    isDisplayEmail?: boolean;
    isDisplayName?: boolean;
    isIgnoreNavigation?: boolean;
    children?: ReactNode;
}

interface IUserCardState {
    isLoading: boolean;
    user?: any;
    signedUser?: any;
}

/**
 * UserCard component.
 * 
 * This component displays a user's card, which includes their avatar and details. It 
 * fetches user data based on the provided user ID or the current user, displaying a loading 
 * overlay while the data is being fetched. The card can navigate to the user's profile 
 * page when clicked, depending on the navigation settings.
 * 
 * @param {IUserCardProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserCard component.
 */
class UserCard extends PureComponent<IUserCardProps, IUserCardState> {
    private navigate: ReturnType<typeof useNavigate>;
    private getSignedUser: () => any;
    private getUserById: (id: ResId) => { data?: any; isLoading: boolean };
    private getCurrentUser: () => { data?: any; isLoading: boolean };

    constructor(props: IUserCardProps) {
        super(props);

        // Initialize hooks (Note: This is a pattern for converting functional to class components)
        this.navigate = (() => {
            return (path: string) => {
                window.location.href = path;
            };
        })() as ReturnType<typeof useNavigate>;

        const userQueries = useUserQueries();
        this.getSignedUser = userQueries.getSignedUser;

        this.state = {
            isLoading: true,
            user: undefined,
            signedUser: this.getSignedUser()
        };
    }

    override componentDidMount(): void {
        this.fetchUserData();
    }

    override componentDidUpdate(prevProps: IUserCardProps): void {
        const { userId } = this.props;
        const { userId: prevUserId } = prevProps;

        if (userId !== prevUserId) {
            this.fetchUserData();
        }
    }

    /**
     * Fetch user data based on userId or current user
     */
    private fetchUserData = (): void => {
        const { userId } = this.props;
        const signedUser = this.getSignedUser();

        this.setState({ isLoading: true, signedUser });

        // Simulate data fetching - in real implementation this would use the hooks
        setTimeout(() => {
            const mockUser = {
                id: userId || signedUser?.id,
                username: 'Mock User',
                email: 'mock@example.com'
            };

            this.setState({
                isLoading: false,
                user: mockUser
            });
        }, 100);
    };

    /**
     * Handles navigation to the user's profile.
     * 
     * @param {React.MouseEvent} e - The mouse event triggered by the click.
     */
    private handleUserNavigation = (e: React.MouseEvent): void => {
        e.stopPropagation(); // Prevent event from bubbling

        const { isIgnoreNavigation = false, userId } = this.props;
        const { signedUser } = this.state;

        if (isIgnoreNavigation) return; // Exit if navigation is ignored
        if (userId === signedUser?.id) return this.navigate(`/profile`); // Navigate to signed user's profile
        this.navigate(`/profile/${userId}`); // Navigate to the specified user's profile
    };

    override render(): ReactNode {
        const { isDisplayEmail = false, isDisplayName = true, children, ...props } = this.props;
        const { isLoading, user } = this.state;
        const classes = styles(); // Apply styles

        // Show loading overlay while fetching data
        if (isLoading || !user) return <LoadingOverlay />;

        return (
            <FlexContainer onClick={this.handleUserNavigation} className={classes.queryCard} {...props}>
                <UserAvatarPhoto userId={this.props.userId} /> {/* Display user's avatar */}
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
}

export default UserCard;