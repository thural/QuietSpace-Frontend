import React from "react";
import Connections from "./Connections";
import styles from "./styles/profileContainerStyles";

import { Avatar, Box, Button, Container, Flex, Tabs, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { PiClockClockwise, PiIntersect, PiNote, PiSignOut } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useGetFollowers, useGetFollowings } from "../../hooks/useUserData";
import { viewStore } from "../../hooks/zustand";
import { toUpperFirstChar } from "../../utils/stringUtils";


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
        <Flex className={classes.followSection}>
            <Text style={{ cursor: "pointer" }} ta="center" fw="400" size="lg">{0} posts</Text>
            <Flex style={{ justifyContent: "space-around", gap: "2rem" }}>
                <Text
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowings}>
                    {followings?.length} followings
                </Text>
                <Text
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowers}>
                    {followers?.length} followers
                </Text>
            </Flex>
            <Box className="signout-icon" onClick={handleSignout}><PiSignOut /></Box>
        </Flex>
    );

    const EditSection = () => (
        <Link to="/settings" >
            <Flex className={classes.profileEditSection}>
                <Button
                    variant="outline"
                    color="rgba(32, 32, 32, 1)"
                    radius="md"
                    fullWidth>Edit Profile
                </Button>
            </Flex>
        </Link>
    );

    const UserDetailsSection = () => (
        <Flex className={classes.identitySection}>
            <Box className="profileName"><Text fw={700}>{signedUser.username}</Text></Box>
            <Avatar color="black" size="4.8rem" radius="10rem">{toUpperFirstChar(signedUser.username)}</Avatar>
        </Flex>
    );


    return (
        <Container size="600px" className={classes.container}>
            <UserDetailsSection />
            <FollowSection />
            {viewState.followings && <Connections userFetch={followings} title="followings" />}
            {viewState.followers && <Connections userFetch={followers} title="followers" />}
            <EditSection />
            <ProfileTabs />
        </Container>
    )
}

export default ProfileContainer