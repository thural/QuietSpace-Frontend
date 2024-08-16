import React, { useState } from "react";
import { Container, LoadingOverlay, SegmentedControl } from "@mantine/core";
import styles from "./styles/notificationContainerStyles";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetNotifications } from "../../hooks/useNotificationData";

function NotificationContainer() {

    const navigate = useNavigate();

    const [value, setValue] = useState('/notification/all');

    const { data, isLoading, isError } = useGetNotifications();

    console.log("notifications: ", data);


    const navigateToPage = (buttonValue) => {
        setValue(buttonValue);
        navigate(buttonValue);
    };



    const classes = styles();

    return (
        <Container size="600px" className={classes.container}>
            {isLoading ? <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                : isError ? <h1>{postsQuery.error.message}</h1>
                    : <>
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
                    </>
            }



        </Container>
    )
}

export default NotificationContainer