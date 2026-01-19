import ErrorComponent from "@shared/errors/ErrorComponent";
import { useGetNotifications } from "@services/data/useNotificationData";
import withErrorBoundary from "@services/hook/shared/withErrorBoundary";
import type { GenericWrapper } from "@shared-types/sharedComponentTypes";
import DefaultContainer from "@shared/DefaultContainer";
import { SegmentedControl } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderStyled from "@shared/LoaderStyled";

/**
 * NotificationContainer component.
 * 
 * This component serves as a wrapper for displaying notifications. It manages the loading state 
 * and error handling for fetching notifications. Users can navigate between different types of 
 * notifications (all, requests, replies, reposts, mentions) using a segmented control interface.
 * If there is an error fetching notifications, an error component is displayed.
 * 
 * @param {GenericWrapper} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the container.
 * @returns {JSX.Element} - The rendered NotificationContainer component.
 */
const NotificationContainer: React.FC<GenericWrapper> = ({ children }) => {
    const navigate = useNavigate();
    const [value, setValue] = useState('/notification/all');

    let data;

    try {
        data = useGetNotifications(); // Fetch notifications data
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `Error loading notification data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const { isLoading, isError, error } = data;

    // Display a loading indicator while fetching data
    if (isLoading) return <LoaderStyled />;

    // Display an error component if there was an error fetching notifications
    if (isError) return <ErrorComponent message={error.message} />;

    /**
     * Navigates to a specified notification page based on the segmented control value.
     * 
     * @param {string} buttonValue - The value of the button clicked in the segmented control.
     */
    const navigateToPage = (buttonValue: string) => {
        setValue(buttonValue); // Update the current value
        navigate(buttonValue); // Navigate to the selected notification type
    };

    /**
     * ControlPanel component.
     * 
     * This component renders a segmented control for selecting notification categories
     * and displays any child components passed to the NotificationContainer.
     * 
     * @returns {JSX.Element} - The rendered ControlPanel component.
     */
    const ControlPanel = () => (
        <>
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
            {children} {/* Render child components */}
        </>
    );

    return (
        <DefaultContainer>
            <ControlPanel />
        </DefaultContainer>
    );
}

export default withErrorBoundary(NotificationContainer);