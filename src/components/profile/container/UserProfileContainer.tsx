import React from "react";


import { useGetPosts } from "@hooks/usePostData";
import { useGetFollowers, useGetFollowings } from "@hooks/useUserData";
import { viewStore } from "@hooks/zustand";
import { Tabs } from "@mantine/core";
import OutlineButton from "@shared/buttons/OutlineButton";
import Conditional from "@shared/Conditional";
import DefaultContainer from "@shared/DefaultContainer";
import { useQueryClient } from "@tanstack/react-query";
import { PiClockClockwise, PiIntersect, PiNote, PiSignOut } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import BoxStyled from "../../shared/BoxStyled";
import FullLoadingOverlay from "../../shared/FullLoadingOverlay";
import Connections from "../components/connections/base/Connections";
import FollowsSection from "../components/follow-section/FollowSection";
import ProfileControls from "../components/profile-controls/ProfileControls";
import UserDetailsSection from "../components/user-details/UserDetailsSection";


const UserProfileContainer = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: viewState, setViewData } = viewStore();
    const signedUser = queryClient.getQueryData(["user"]);
    const followers = useGetFollowers(signedUser.id);
    const followings = useGetFollowings(signedUser.id);
    const { data: userPosts, isLoading: isPostsLoading } = useGetPosts();


    if (!signedUser || isPostsLoading) return <FullLoadingOverlay />;

    console.log("user data: ", signedUser);


    const toggleFollowings = () => {
        setViewData({ followings: true });
    }

    const toggleFollowers = () => {
        setViewData({ followers: true });
    }

    const handleSignout = () => {
        navigate("/signout");
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
                <Connections userFetch={followings} title="followings" />
            </Conditional>
            <Conditional isEnabled={viewState.followers}>
                <Connections userFetch={followers} title="followers" />
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