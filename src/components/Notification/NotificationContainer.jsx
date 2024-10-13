import { SegmentedControl } from "@mantine/core";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetNotifications } from "../../hooks/useNotificationData";
import BoxStyled from "../Shared/BoxStyled";
import DefaultContainer from "../Shared/DefaultContainer";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import Typography from "../Shared/Typography";
import styles from "./styles/notificationContainerStyles";

function NotificationContainer() {

    const classes = styles();

    const navigate = useNavigate();
    const [value, setValue] = useState('/notification/all');
    const { isLoading, isError } = useGetNotifications();


    const navigateToPage = (buttonValue) => {
        setValue(buttonValue);
        navigate(buttonValue);
    };

    const ControlPanel = () => (
        <BoxStyled>
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
        </BoxStyled>
    );

    const RenderResult = () => {
        if (isLoading) return <FullLoadingOverlay />
        else if (isError) return <Typography type="h1">{postsQuery.error.message}</Typography>
        else return <ControlPanel />
    };

    return (
        <DefaultContainer>
            <RenderResult />
        </DefaultContainer>
    )
}

export default NotificationContainer