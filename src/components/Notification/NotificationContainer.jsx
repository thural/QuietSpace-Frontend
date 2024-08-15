import React, { useEffect, useState } from "react";
import { Container, LoadingOverlay, SegmentedControl } from "@mantine/core";
import styles from "./styles/notificationContainerStyles";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useGetNotifications } from "../../hooks/useNotificationData";

function NotificationContainer() {

    const navigate = useNavigate();

    const [value, setValue] = useState('/notification/all');

    const { data, isLoading, isSuccess, isError } = useGetNotifications();

    console.log("notifications: ", data);


    const navigateToPage = (buttonValue) => {
        setValue(buttonValue);
        navigate(buttonValue);
    };

    useEffect(() => {
        navigate('/notification/all');
    }, []);

    if (isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (isError) return <h1>{postsQuery.error.message}</h1>;

    const classes = styles();

    return (
        <Container size="600px" className={classes.container}>

            <SegmentedControl
                style={{ zIndex: 1 }}
                fullWidth
                color="rgba(32, 32, 32, 1)"
                value={value}
                onChange={navigateToPage}
                data={[
                    { label: 'all', value: '/notification/all' },
                    { label: 'requests', value: '/notification/requests' },
                    { label: 'replies', value: '/notification/replies' },
                    { label: 'reposts', value: '/notification/reposts' },
                ]}
            />

            <Outlet />
        </Container>
    )
}

export default NotificationContainer