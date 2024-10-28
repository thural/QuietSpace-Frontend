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
        viewState,
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
            <Conditional isEnabled={isHasAccess.data && viewState.followings && !!followings.data?.totalElements}>
                <UserConnections userFetch={followings} title="followings" />
            </Conditional>
            <Conditional isEnabled={isHasAccess.data && viewState.followers && !!followers.data?.totalElements}>
                <UserConnections userFetch={followers} title="followers" />
            </Conditional>
            <ProfileControls>
                <FollowToggle Button={OutlineButtonStyled} user={user} />
            </ProfileControls>
            <Conditional isEnabled={isHasAccess.data}>
                <ProfileTabs />
            </Conditional>
            <Conditional isEnabled={!isHasAccess.data} >
                <PrivateBlock message="this account is private" >
                    <Typography>follow user to see their content</Typography>
                    <FollowToggle Button={OutlineButtonStyled} user={user} />
                </PrivateBlock>
            </Conditional>
        </DefaultContainer>
    )
}

export default withErrorBoundary(ProfileContainer);