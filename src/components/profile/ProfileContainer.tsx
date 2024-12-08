import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import Overlay from "@/components/shared/Overlay";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { assertNullisValues } from "@/utils/errorUtils";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import Conditional from "@components/shared/Conditional";
import DefaultContainer from "@components/shared/DefaultContainer";
import FollowToggle from "@components/shared/FollowToggle";
import Typography from "@components/shared/Typography";
import { useParams } from "react-router-dom";
import useUserProfile from "../../services/hook/profile/useUserProfile";
import LoaderStyled from "../shared/LoaderStyled";
import PrivateBlock from "../shared/PrivateBlock";
import UserConnections from "./connections/UserConnections";
import FollowsSection from "./follow-section/FollowSection";
import ProfileControls from "./profile-controls/ProfileControls";
import ProfileTabs from "./tabs/ProfileTabs";
import UserDetailsSection from "./user-details/UserDetailsSection";


function ProfileContainer() {

    const { userId } = useParams();
    let data = undefined;

    try {
        if (userId === undefined) throw assertNullisValues({ userId });
        data = useUserProfile(userId);
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading user profile data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
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


    if (user.isLoading || userPosts.isLoading || followers.isLoading || followings.isLoading || !user.data) return <LoaderStyled />;

    const OutlineButtonStyled = ({ ...props }) => (
        <OutlineButton color="gray" fullWidth {...props} />
    )

    return (
        <DefaultContainer>
            <UserDetailsSection user={user.data} />
            <FollowsSection
                userId={userId}
                postsCount={postsCount}
                followingsCount={followingsCount}
                followersCount={followersCount}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            />
            <Overlay isOpen={viewFollowings && isHasAccess.data && !!followingsCount} onClose={toggleFollowings}>
                <UserConnections toggleView={toggleFollowings} userFetch={followings} title="followings" />
            </Overlay>
            <Overlay isOpen={viewFollowers && isHasAccess.data && !!followersCount} onClose={toggleFollowers}>
                <UserConnections toggleView={toggleFollowers} userFetch={followers} title="followers" />
            </Overlay>
            <ProfileControls>
                <FollowToggle followers={followers} Button={OutlineButtonStyled} user={user.data} />
            </ProfileControls>
            <Conditional isEnabled={isHasAccess.data}>
                <ProfileTabs userId={userId} />
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