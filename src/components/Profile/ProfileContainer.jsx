import React, { useState } from "react";
import { Avatar, Box, Button, Container, Flex, Tabs, Text } from "@mantine/core";
import { PiClockClockwise, PiIntersect, PiNote, PiSignOut } from "react-icons/pi";

import styles from "./styles/profileContainerStyles";
import { generatePfpUrls } from "../../utils/randomPfp";
import { Link } from "react-router-dom";
import FollowContainer from "./FollowContainer";
import { viewStore } from "../../hooks/zustand";
import { useQueryClient } from "@tanstack/react-query";


function ProfileContainer() {

    const classes = styles();
    const queryClient = useQueryClient();
    const signedUser = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();


    const toggleFollowings = () => {
        setViewData({ followings: true });
    }

    const generatedPfpUrls = generatePfpUrls(4, "beam");

    return (
        <Container size="600px" className={classes.container}>
            <Flex className={classes.identitySection}>
                <Box className="profileName">
                    <Text fw={700}>{signedUser.username}</Text>
                </Box>
                <Avatar color="black" size="4.8rem" radius="10rem" src={generatedPfpUrls.getUrl()}>{signedUser.username.charAt(0)}</Avatar>
            </Flex>

            <Flex className={classes.followingSection}>
                <Avatar.Group className={classes.avatarGroup} onClick={toggleFollowings}>
                    <Avatar src={generatedPfpUrls.getUrl()} />
                    <Avatar src={generatedPfpUrls.getUrl()} />
                    <Avatar src={generatedPfpUrls.getUrl()} />
                    <Avatar>+5</Avatar>
                    <Text ta="center" fw="400">followings</Text>
                </Avatar.Group>
                <Box className="signout-icon" onClick={() => console.log("implement logout function")}><PiSignOut /></Box>
            </Flex>

            {viewData.followings && <FollowContainer />}

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
        </Container>
    )
}

export default ProfileContainer