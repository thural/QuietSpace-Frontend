import React from "react";
import Connections from "./Connections";
import styles from "./styles/profileContainerStyles";

import { useGetFollowers, useGetFollowings } from "@hooks/useUserData";
import { viewStore } from "@hooks/zustand";
import { Tabs } from "@mantine/core";
import BoxStyled from "@shared/BoxStyled";
import OutlineButton from "@shared/buttons/OutlineButton";
import Conditional from "@shared/Conditional";
import DefaultContainer from "@shared/DefaultContainer";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { useQueryClient } from "@tanstack/react-query";
import { toUpperFirstChar } from "@utils/stringUtils";
import { PiClockClockwise, PiIntersect, PiNote, PiSignOut } from "react-icons/pi";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";


function ProfileContainer() {

    const classes = styles();

    const { userId } = useParams();
    const { textContext } = useOutletContext();

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: viewState, setViewData } = viewStore();
    const signedUser = queryClient.getQueryData(["user"]);
    const followers = useGetFollowers();
    const followings = useGetFollowings();


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

    const FollowsSection = ({ followers, followings, handleSignout }) => (
        <FlexStyled className={classes.followSection}>
            <Typography style={{ cursor: "pointer" }} ta="center" fw="400" size="lg">{0} posts</Typography>
            <FlexStyled style={{ justifyContent: "space-around", gap: "2rem" }}>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowings}>
                    {followings?.length} followings
                </Typography>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowers}>
                    {followers?.length} followers
                </Typography>
            </FlexStyled>
            <BoxStyled className="signout-icon" onClick={handleSignout}><PiSignOut /></BoxStyled>
        </FlexStyled>
    );

    const ProfileControls = ({ children }) => (
        <FlexStyled className={classes.profileEditSection}>
            {children}
        </FlexStyled>
    );

    const UserDetailsSection = ({ user }) => (
        <FlexStyled className={classes.identitySection}>
            <BoxStyled className="profileName"><Typography fw={700}>{user.username}</Typography></BoxStyled>
            <UserAvatar size="4.5rem" chars={toUpperFirstChar(user.username)} />
        </FlexStyled>
    );


    return (
        <DefaultContainer>
            <UserDetailsSection user={signedUser} />
            <FollowsSection
                followers={followers}
                followings={followings}
                handleSignout={handleSignout}
            />
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
                        name="Edit Profile" />
                </Link>
            </ProfileControls>
            <ProfileTabs />
        </DefaultContainer>
    )
}

export default ProfileContainer