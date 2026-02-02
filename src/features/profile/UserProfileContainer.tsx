import ErrorComponent from "@/shared/errors/ErrorComponent";
import Overlay from "@/shared/Overlay";
import { useCurrentProfile } from "@features/feed/application/hooks/useUserProfile";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { Button } from "../../shared/ui/components";
import DefaultContainer from "@/shared/DefaultContainer";
import { PiSignOut } from "react-icons/pi";
import { Link } from "react-router-dom";
import { Container } from "@/shared/ui/components/layout/Container";
import LoaderStyled from "@/shared/LoaderStyled";
// import UserConnections from "./components/connections/UserConnections";
import FollowsSection from "./components/follow-section/FollowSection";
import ProfileControls from "./components/profile-controls/ProfileControls";
import UserProfileTabs from "./components/tabs/UserProfileTabs";
import UserDetailsSection from "./components/user-details/UserDetailsSection";

/**
 * UserProfileContainer component.
 * 
 * This component fetches and displays the current user's profile, including their details, followers, and followings.
 * It handles loading states, errors, and provides functionality for signing out and navigating to profile settings.
 * 
 * @returns {JSX.Element} - The rendered UserProfileContainer component wrapped with error boundary handling.
 */
const UserProfileContainer = () => {
    let data = undefined;

    // Attempt to fetch the current user's profile data
    try {
        data = useCurrentProfile(); // Fetch user profile data
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading user profile data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />; // Display error if fetching fails
    }

    const {
        signedUser,
        userPosts,
        followers,
        followings,
        followingsCount,
        followersCount,
        viewFollowers,
        viewFollowings,
        toggleFollowings,
        toggleFollowers,
        handleSignout
    } = data;

    // Show a loader while data is being fetched
    if (signedUser === undefined || userPosts.isLoading || followers.isLoading || followings.isLoading) {
        return <LoaderStyled />;
    }

    return (
        <DefaultContainer>
            <UserDetailsSection user={signedUser} /> {/* Display user details */}
            <FollowsSection {...data}>
                <div className="signout-icon" onClick={handleSignout} style={{ cursor: 'pointer' }}>
                    <PiSignOut /> {/* Sign out icon */}
                </div>
            </FollowsSection>
            {/* Overlay for displaying followings */}
            <Overlay isOpen={viewFollowings && !!followingsCount} onClose={toggleFollowings}>
                {/* <UserConnections userFetch={followings} title="followings" toggleView={toggleFollowings} /> */}
            </Overlay>
            {/* Overlay for displaying followers */}
            <Overlay isOpen={viewFollowers && !!followersCount} onClose={toggleFollowers}>
                {/* <UserConnections userFetch={followers} title="followers" toggleView={toggleFollowers} /> */}
            </Overlay>
            <ProfileControls>
                <Link style={{ width: "100%", textDecoration: "none" }} to="/settings">
                    <Button
                        variant="secondary"
                        fullWidth
                    >
                        Edit Profile
                    </Button>
                </Link>
            </ProfileControls>
            <UserProfileTabs userId={signedUser.id} /> {/* Render user profile tabs */}
        </DefaultContainer>
    );
}

export default withErrorBoundary(UserProfileContainer);