import React from "react";
import Connections from "./Connections";
import styles from "./styles/profileContainerStyles";

import { Tabs } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { PiClockClockwise, PiIntersect, PiNote, PiSignOut } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useGetFollowers, useGetFollowings } from "../../hooks/useUserData";
import { viewStore } from "../../hooks/zustand";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "../Shared/BoxStyled";
import OutlineButton from "../Shared/buttons/OutlineButton";
import Conditional from "../Shared/Conditional";
import DefaultContainer from "../Shared/DefaultContainer";
import FlexStyled from "../Shared/FlexStyled";
import Typography from "../Shared/Typography";
import UserAvatar from "../Shared/UserAvatar";


function ProfileContainer() {

    const classes = styles();

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

    const FollowSection = () => (
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

    const EditSection = () => (
        <Link to="/settings" >
            <FlexStyled className={classes.profileEditSection}>
                <OutlineButton
                    color="rgba(32, 32, 32, 1)"
                    fullWidth
                    name="Edit Profile" />
            </FlexStyled>
        </Link>
    );

    const UserDetailsSection = () => (
        <FlexStyled className={classes.identitySection}>
            <BoxStyled className="profileName"><Typography fw={700}>{signedUser.username}</Typography></BoxStyled>
            <UserAvatar size="4.5rem" chars={toUpperFirstChar(signedUser.username)} />
        </FlexStyled>
    );


    return (
        <DefaultContainer>
            <UserDetailsSection />
            <FollowSection />
            <Conditional isEnabled={viewState.followings}>
                <Connections userFetch={followings} title="followings" />
            </Conditional>
            <Conditional isEnabled={viewState.followers}>
                <Connections userFetch={followers} title="followers" />
            </Conditional>
            <EditSection />
            <ProfileTabs />
        </DefaultContainer>
    )
}

export default ProfileContainer