import OutlineButton from "@components/shared/buttons/OutlineButton";
import Conditional from "@components/shared/Conditional";
import DefaultContainer from "@components/shared/DefaultContainer";
import { PiSignOut } from "react-icons/pi";
import { Link } from "react-router-dom";
import BoxStyled from "../../shared/BoxStyled";
import FullLoadingOverlay from "../../shared/FullLoadingOverlay";
import UserConnections from "../components/connections/base/UserConnections";
import FollowsSection from "../components/follow-section/FollowSection";
import ProfileControls from "../components/profile-controls/ProfileControls";
import UserDetailsSection from "../components/user-details/UserDetailsSection";
import { useCurrentProfile } from "./hooks/useUserProfile";
import UserProfileTabs from "./UserProfileTabs";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";


const UserProfileContainer = () => {

    let data = undefined;

    try {
        data = useCurrentProfile();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading user profile data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const {
        signedUser,
        userPosts,
        followers,
        followings,
        viewState,
        toggleFollowings,
        toggleFollowers,
        handleSignout
    } = data;


    if (signedUser === undefined || userPosts.isLoading || followers.isLoading || followings.isLoading) return <FullLoadingOverlay />;


    return (
        <DefaultContainer>
            <UserDetailsSection user={signedUser} />
            <FollowsSection
                userId={0}
                posts={userPosts}
                followings={followings}
                followers={followers}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            >
                <BoxStyled className="signout-icon" onClick={handleSignout}><PiSignOut /></BoxStyled>
            </FollowsSection>
            <Conditional isEnabled={viewState.followings && !!followings.data?.totalElements}>
                <UserConnections userFetch={followings} title="followings" />
            </Conditional>
            <Conditional isEnabled={viewState.followers && !!followers.data?.totalElements}>
                <UserConnections userFetch={followers} title="followers" />
            </Conditional>
            <ProfileControls>
                <Link style={{ width: "100%", textDecoration: "none" }} to="/settings" >
                    <OutlineButton
                        color="rgba(32, 32, 32, 1)"
                        fullWidth
                        name="Edit Profile"
                    />
                </Link>
            </ProfileControls>
            <UserProfileTabs />
        </DefaultContainer>
    )
}

export default withErrorBoundary(UserProfileContainer);