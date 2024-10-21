import UserConnections from "../components/connections/base/UserConnections";
import { Tabs } from "@mantine/core";
import { PiClockClockwise, PiIntersect, PiNote } from "react-icons/pi";
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


function ProfileContainer() {

    const { userId } = useParams();

    const {
        user,
        followers,
        followings,
        isHasAccess,
        userPosts,
        viewState,
        toggleFollowers,
        toggleFollowings,
    } = useUserProfile(userId);


    if (user.isLoading || userPosts.isLoading || followers.isLoading || followings.isLoading) return <FullLoadingOverlay />;


    const ProfileTabs = () => (
        <Tabs color="black" defaultValue="timeline" style={{ margin: '1rem 0' }}>
            <Tabs.List justify="center" grow>
                <Tabs.Tab value="timeline" leftSection={<PiClockClockwise size={24} />}>
                    Timeline
                </Tabs.Tab>
                <Tabs.Tab value="interests" leftSection={<PiIntersect size={24} />}>
                    Interests
                </Tabs.Tab>
                <Tabs.Tab value="saved" leftSection={<PiNote size={24} />}>
                    Saves
                </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="timeline">
                <Typography>activity timeline</Typography>
            </Tabs.Panel>
            <Tabs.Panel value="interests">
                <Typography>user interests</Typography>
            </Tabs.Panel>
            <Tabs.Panel value="saved">
                <Typography>saved posts</Typography>
            </Tabs.Panel>
        </Tabs>
    );

    const OutlineButtonStyled = ({ ...props }) => (
        <OutlineButton color="rgba(32, 32, 32, 1)" fullWidth {...props} />
    )

    return (
        <DefaultContainer>
            <UserDetailsSection user={user.data} />followifollowingsngs
            <FollowsSection
                followers={followers}
                followings={followings}
                posts={userPosts}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            />
            <Conditional isEnabled={isHasAccess && viewState.followings}>
                <UserConnections userFetch={followings} title="followings" />
            </Conditional>
            <Conditional isEnabled={isHasAccess && viewState.followers}>
                <UserConnections userFetch={followers} title="followers" />
            </Conditional>
            <ProfileControls>
                <FollowToggle Button={OutlineButtonStyled} user={user} />
            </ProfileControls>
            <Conditional isEnabled={isHasAccess}>
                <ProfileTabs />
            </Conditional>
            <Conditional isEnabled={!isHasAccess} >
                <PrivateBlock message="this account is private" >
                    <Typography>follow user to see their content</Typography>
                    <FollowToggle Button={OutlineButtonStyled} user={user} />
                </PrivateBlock>
            </Conditional>
        </DefaultContainer>
    )
}

export default ProfileContainer