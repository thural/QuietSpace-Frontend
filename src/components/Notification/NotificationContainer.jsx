import React, { useState } from "react";

import { Container, SegmentedControl } from "@mantine/core";

import styles from "./styles/notificationContainerStyles";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";

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
                style={{ zIndex: 1 }}
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

            <Outlet />
        </Container>
    )
}

export default NotificationContainer