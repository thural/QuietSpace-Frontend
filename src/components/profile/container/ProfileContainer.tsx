import UserConnections from "../components/connections/base/UserConnections";
import { useParams } from "react-router-dom";
import Conditional from "@components/shared/Conditional";
import DefaultContainer from "@components/shared/DefaultContainer";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FollowToggle from "@components/shared/FollowToggle";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import FollowsSection from "../components/follow-section/FollowSection";
import ProfileControls from "../components/profile-controls/ProfileControls";
import UserDetailsSection from "../components/user-details/UserDetailsSection";
import PrivateBlock from "../components/shared/PrivateBlock";
import Typography from "@components/shared/Typography"
import useUserProfile from "./hooks/useUserProfile";
import ProfileTabs from "./ProfileTabs";
import { nullishValidationdError } from "@/utils/errorUtils";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import Overlay from "@/components/shared/Overlay/Overlay";


function ProfileContainer() {

    const { userId } = useParams();
    let data = undefined;

    try {
        if (userId === undefined) throw nullishValidationdError({ userId });
        data = useUserProfile(userId);
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading user profile data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const {
        user,
        followers,
        followings,
        isHasAccess,
        userPosts,
        viewFollowers,
        viewFollowings,
        toggleFollowers,
        toggleFollowings,
    } = data;


    if (user.isLoading || userPosts.isLoading || followers.isLoading || followings.isLoading || !user.data) return <FullLoadingOverlay />;

    const OutlineButtonStyled = ({ ...props }) => (
        <OutlineButton color="rgba(32, 32, 32, 1)" fullWidth {...props} />
    )

    return (
        <DefaultContainer>
            <UserDetailsSection user={user.data} />
            <FollowsSection
                userId={userId}
                posts={userPosts}
                followings={followings}
                followers={followers}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            />
            <Overlay isOpen={viewFollowings && isHasAccess.data && !!followings.data?.totalElements} onClose={toggleFollowings}>
                <UserConnections userFetch={followings} title="followings" />
            </Overlay>
            <Overlay isOpen={viewFollowers && isHasAccess.data && !!followers.data?.totalElements} onClose={toggleFollowers}>
                <UserConnections userFetch={followers} title="followers" />
            </Overlay>
            <ProfileControls>
                <FollowToggle followers={followers} Button={OutlineButtonStyled} user={user.data} />
            </ProfileControls>
            <Conditional isEnabled={isHasAccess.data}>
                <ProfileTabs />
            </Conditional>
            <Conditional isEnabled={!isHasAccess.data} >
                <PrivateBlock message="this account is private" >
                    <Typography>follow user to see their content</Typography>
                    <FollowToggle Button={OutlineButtonStyled} user={user.data} />
                </PrivateBlock>
            </Conditional>
        </DefaultContainer>
    )
}

export default withErrorBoundary(ProfileContainer);