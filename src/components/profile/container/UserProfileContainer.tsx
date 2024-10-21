import { Tabs } from "@mantine/core";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import Conditional from "@components/shared/Conditional";
import DefaultContainer from "@components/shared/DefaultContainer";
import { PiClockClockwise, PiIntersect, PiNote, PiSignOut } from "react-icons/pi";
import { Link } from "react-router-dom";
import BoxStyled from "../../shared/BoxStyled";
import FullLoadingOverlay from "../../shared/FullLoadingOverlay";
import UserConnections from "../components/connections/base/UserConnections";
import FollowsSection from "../components/follow-section/FollowSection";
import ProfileControls from "../components/profile-controls/ProfileControls";
import UserDetailsSection from "../components/user-details/UserDetailsSection";
import Typography from "@/components/shared/Typography";
import { useCurrentProfile } from "./hooks/useUserProfile";


const UserProfileContainer = () => {

    const {
        signedUser,
        userPosts,
        followers,
        followings,
        viewState,
        toggleFollowings,
        toggleFollowers,
        handleSignout
    } = useCurrentProfile();


    if (signedUser === undefined || userPosts.isLoading || followers.isLoading || followings.isLoading) return <FullLoadingOverlay />;


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


    return (
        <DefaultContainer>
            <UserDetailsSection user={signedUser} />
            <FollowsSection
                followers={followers}
                followings={followings}
                posts={userPosts}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            >
                <BoxStyled className="signout-icon" onClick={handleSignout}><PiSignOut /></BoxStyled>
            </FollowsSection>
            <Conditional isEnabled={viewState.followings}>
                <UserConnections userFetch={followings} title="followings" />
            </Conditional>
            <Conditional isEnabled={viewState.followers}>
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
            <ProfileTabs />
        </DefaultContainer>
    )
}

export default UserProfileContainer