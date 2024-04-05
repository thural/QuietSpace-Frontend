import React, { useState } from "react";

import { Avatar, Box, Button, Container, Flex, Image, Input, Loader, LoadingOverlay, SegmentedControl, Tabs, Text } from "@mantine/core";
import { PiClockClockwise, PiGear, PiImage, PiIntersect, PiNote, PiSignOut } from "react-icons/pi";

import styles from "./styles/notificationContainerStyles";
import AllNotifications from "../../pages/notification/AllNotifications";
import RequestNotifications from "../../pages/notification/RequestNotifications";
import ReplyNotifications from "../../pages/notification/ReplyNotifications";
import RepostNotifications from "../../pages/notification/RepostNotifications";
import { Route, Routes, useNavigate } from "react-router-dom";

function NotificationContainer() {

    const [value, setValue] = useState('/notification/all');

    const classes = styles();

    const navigate = useNavigate();


    const redirectToPage = (buttonValue) => {
        setValue(buttonValue);
        navigate(buttonValue);
    };

    return (
        <Container size="600px" style={{ marginTop: "1rem" }}>

            <SegmentedControl
                fullWidth
                color="rgba(32, 32, 32, 1)"
                value={value}
                onChange={redirectToPage}
                data={[
                    { label: 'All', value: '/notification/all' },
                    { label: 'Requests', value: '/notification/requests' },
                    { label: 'Replies', value: '/notification/replies' },
                    { label: 'Reposts', value: '/notification/reposts' },
                ]}
            />

            <Routes>
                <Route path="/notification/all" element={<AllNotifications />} />
                <Route path="/notification/requests" element={<RequestNotifications />} />
                <Route path="/notification/replies" element={<ReplyNotifications />} />
                <Route path="/notification/reposts" element={<RepostNotifications />} />
            </Routes>

        </Container>
    )
}

export default NotificationContainer