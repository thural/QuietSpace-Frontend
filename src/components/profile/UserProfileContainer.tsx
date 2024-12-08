import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import Overlay from "@/components/shared/Overlay";
import { useCurrentProfile } from "@/services/hook/profile/useUserProfile";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import DefaultContainer from "@components/shared/DefaultContainer";
import { PiSignOut } from "react-icons/pi";
import { Link } from "react-router-dom";
import BoxStyled from "../shared/BoxStyled";
import LoaderStyled from "../shared/LoaderStyled";
import UserConnections from "./connections/UserConnections";
import FollowsSection from "./follow-section/FollowSection";
import ProfileControls from "./profile-controls/ProfileControls";
import UserProfileTabs from "./tabs/UserProfileTabs";
import UserDetailsSection from "./user-details/UserDetailsSection";


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
        followingsCount,
        followersCount,
        viewFollowers,
        viewFollowings,
        toggleFollowings,
        toggleFollowers,
        handleSignout
    } = data;


    if (signedUser === undefined || userPosts.isLoading || followers.isLoading || followings.isLoading) return <LoaderStyled />;


    return (
        <DefaultContainer>
            <UserDetailsSection user={signedUser} />
            <FollowsSection {...data}>
                <BoxStyled className="signout-icon" onClick={handleSignout}><PiSignOut /></BoxStyled>
            </FollowsSection>
            <Overlay isOpen={viewFollowings && !!followingsCount} onClose={toggleFollowings}>
                <UserConnections userFetch={followings} title="followings" />
            </Overlay>
            <Overlay isOpen={viewFollowers && !!followersCount} onClose={toggleFollowers}>
                <UserConnections userFetch={followers} title="followers" />
            </Overlay>
            <ProfileControls>
                <Link style={{ width: "100%", textDecoration: "none" }} to="/settings" >
                    <OutlineButton
                        color="rgba(32, 32, 32, 1)"
                        fullWidth
                        name="Edit Profile"
                    />
                </Link>
            </ProfileControls>
            <UserProfileTabs userId={signedUser.id} />
        </DefaultContainer>
    )
}

export default withErrorBoundary(UserProfileContainer);