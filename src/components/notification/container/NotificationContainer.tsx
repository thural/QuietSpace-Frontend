import BoxStyled from "@components/shared/BoxStyled";
import DefaultContainer from "@components/shared/DefaultContainer";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import { useGetNotifications } from "@/services/data/useNotificationData";
import { SegmentedControl } from "@mantine/core";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";

function NotificationContainer() {

    const navigate = useNavigate();
    const [value, setValue] = useState('/notification/all');


    let data = undefined;

    try {
        data = useGetNotifications();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading notification data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const { isLoading, isError, error } = data;


    const navigateToPage = (buttonValue: string) => {
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
        if (isError) return <ErrorComponent message={error.message} />
        return <ControlPanel />
    };

    return (
        <DefaultContainer>
            <RenderResult />
        </DefaultContainer>
    )
}

export default withErrorBoundary(NotificationContainer);