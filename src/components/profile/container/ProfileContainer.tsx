import Connections from "../components/connections/base/Connections";

import { useGetPostsByUserId } from "@hooks/usePostData";
import { useGetFollowers, useGetFollowings, useGetUserById } from "@hooks/useUserData";
import { viewStore } from "@hooks/zustand";
import { Tabs } from "@mantine/core";
import Conditional from "@shared/Conditional";
import DefaultContainer from "@shared/DefaultContainer";
import { PiClockClockwise, PiIntersect, PiNote } from "react-icons/pi";
import { useOutletContext, useParams } from "react-router-dom";
import OutlineButton from "@shared/buttons/OutlineButton";
import FollowToggle from "@shared/FollowToggle";
import FullLoadingOverlay from "@shared/FullLoadingOverlay";
import FollowsSection from "../components/follow-section/FollowSection";
import ProfileControls from "../components/profile-controls/ProfileControls";
import UserDetailsSection from "../components/user-details/UserDetailsSection";
import { useQueryClient } from "@tanstack/react-query";
import PrivateBlock from "../components/shared/PrivateBlock";
import Typography from "@shared/Typography"


function ProfileContainer() {

    const { userId } = useParams();
    const { textContext } = useOutletContext();

    const queryClient = useQueryClient();
    const { data: viewState, setViewData } = viewStore();
    const { data: user, isLoading: isUserLoading } = useGetUserById(userId);
    const followers = useGetFollowers(userId); // TODO: fetch conditionally on user profile privacy
    const followings = useGetFollowings(userId); // TODO: fetch conditionally on user profile privacy
    const { data: userPosts, isLoading: isPostsLoading } = useGetPostsByUserId(userId);

    if (isUserLoading || isPostsLoading || followers.isLoading || followings.isLoading) return <FullLoadingOverlay />;

    const signedUser = queryClient.getQueryData(["user"]);
    const isFollowing = followers.data.some(user => user.id === signedUser.id);

    const isHasAccess = (!user.isPrivateAccount || isFollowing);

    console.log("user followers: ", followers.data);
    console.log("user on UserProfile: ", user);
    console.log("is following: ", isFollowing);
    console.log("isHasAccess: ", isHasAccess);


    const toggleFollowings = () => {
        setViewData({ followings: true });
    }

    const toggleFollowers = () => {
        setViewData({ followers: true });
    }


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
            <Tabs.Panel value="timeline"></Tabs.Panel>
            <Tabs.Panel value="interests"></Tabs.Panel>
            <Tabs.Panel value="saved"></Tabs.Panel>
        </Tabs>
    );

    const OutlineButtonStyled = ({ ...props }) => (
        <OutlineButton color="rgba(32, 32, 32, 1)" fullWidth {...props} />
    )


    return (
        <DefaultContainer>

            <UserDetailsSection user={user} />

            <FollowsSection
                followers={followers.data}
                followings={followings.data}
                posts={userPosts}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            />

            <Conditional isEnabled={isHasAccess && viewState.followings}>
                <Connections userFetch={followings} title="followings" />
            </Conditional>

            <Conditional isEnabled={isHasAccess && viewState.followers}>
                <Connections userFetch={followers} title="followers" />
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