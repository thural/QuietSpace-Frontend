import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import { useGetNotifications } from "@/services/data/useNotificationData";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import BoxStyled from "@components/shared/BoxStyled";
import DefaultContainer from "@components/shared/DefaultContainer";
import { SegmentedControl } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderStyled from "../shared/LoaderStyled";

const NotificationContainer: React.FC<GenericWrapper> = ({ children }) => {

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

    const { data: pagedData, isLoading, isError, error } = data;


    if (isLoading) return <LoaderStyled />;
    if (isError) return <ErrorComponent message={error.message} />;

    const content = pagedData.pages.flatMap((page) => page.content);
    console.log("paged notification data content: ", content)


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
                    { label: 'mentions', value: '/notification/mentions' },
                ]}
            />
            {children}
        </BoxStyled>
    );

    return (
        <DefaultContainer>
            <ControlPanel />
        </DefaultContainer>
    )
}

export default withErrorBoundary(NotificationContainer);