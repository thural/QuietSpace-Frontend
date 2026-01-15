import ErrorComponent from "@/shared/errors/ErrorComponent";
import Overlay from "@/shared/Overlay";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import OutlineButton from "@/shared/buttons/OutlineButton";
import Conditional from "@/shared/Conditional";
import DefaultContainer from "@/shared/DefaultContainer";
import FollowToggle from "@/shared/FollowToggle";
import Typography from "@/shared/Typography";
import { useParams } from "react-router-dom";
import useUserProfile from "@/services/hook/profile/useUserProfile";
import LoaderStyled from "@/shared/LoaderStyled";
import PrivateBlock from "@/shared/PrivateBlock";
import {
    ConnectionsList as UserConnections,
    ProfileHeader as UserDetailsSection,
    ProfileStats as FollowsSection,
    ProfileControls,
    ProfileTabs,
} from "./components";

/**
 * ProfileContainer component.
 * 
 * This component fetches and displays the user profile based on the user ID obtained from the URL parameters.
 * It handles loading states, errors, and conditional rendering of various sections based on user access and data availability.
 * 
 * @returns {JSX.Element} - The rendered ProfileContainer component wrapped with error boundary handling.
 */
function ProfileContainer() {
    const { userId } = useParams(); // Get userId from URL parameters
    let data = undefined;

    // Attempt to fetch user profile data
    try {
        if (userId === undefined) throw new Error("userId is undefined"); // Ensure userId is defined
        data = useUserProfile(userId); // Fetch user profile data
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading user profile data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />; // Display error component if fetching fails
    }

    const {
        user,
        postsCount,
        followingsCount,
        followersCount,
        followers,
        followings,
        isHasAccess,
        userPosts,
        viewFollowers,
        viewFollowings,
        toggleFollowers,
        toggleFollowings,
    } = data;

    // Display a loader while data is being fetched
    if (user.isLoading || userPosts.isLoading || followers.isLoading || followings.isLoading || !user.data) {
        return <LoaderStyled />;
    }

    // Styled OutlineButton component for consistency
    const OutlineButtonStyled = ({ ...props }) => (
        <OutlineButton color="gray" fullWidth {...props} />
    );

    return (
        <DefaultContainer>
            <UserDetailsSection user={user.data} /> {/* Display user details */}
            <FollowsSection
                userId={userId}
                postsCount={postsCount}
                followingsCount={followingsCount}
                followersCount={followersCount}
                toggleFollowings={toggleFollowings} // Function to toggle followings view
                toggleFollowers={toggleFollowers} // Function to toggle followers view
            />
            {/* Overlay for followings */}
            <Overlay isOpen={viewFollowings && isHasAccess.data && !!followingsCount} onClose={toggleFollowings}>
                <UserConnections toggleView={toggleFollowings} userFetch={followings} title="followings" />
            </Overlay>
            {/* Overlay for followers */}
            <Overlay isOpen={viewFollowers && isHasAccess.data && !!followersCount} onClose={toggleFollowings}>
                <UserConnections toggleView={toggleFollowings} userFetch={followers} title="followers" />
            </Overlay>
            <ProfileControls>
                <FollowToggle followers={followers} Button={OutlineButtonStyled} user={user.data} />
            </ProfileControls>
            {/* Conditionally render ProfileTabs if the user has access */}
            <Conditional isEnabled={isHasAccess.data}>
                <ProfileTabs userId={userId} />
            </Conditional>
            {/* Render PrivateBlock if the account is private */}
            <Conditional isEnabled={!isHasAccess.data}>
                <PrivateBlock message="this account is private">
                    <Typography>follow user to see their content</Typography>
                    <FollowToggle Button={OutlineButtonStyled} user={user.data} />
                </PrivateBlock>
            </Conditional>
        </DefaultContainer>
    );
}

export default withErrorBoundary(ProfileContainer);