import useWasSeen from "@/services/hook/common/useWasSeen";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { useEffect } from "react";
import BoxStyled from "./BoxStyled";
import Conditional from "./Conditional";
import LoaderStyled from "./LoaderStyled";

/**
 * InfinateScrollContainerProps interface.
 * 
 * This interface defines the props for the InfinateScrollContainer component.
 * 
 * @property {boolean} hasNextPage - Indicates whether there are more pages to fetch.
 * @property {boolean} isFetchingNextPage - Indicates if a fetch operation for the next page is currently in progress.
 * @property {ConsumerFn} fetchNextPage - Function to be called to fetch the next page of data.
 */
export interface InfinateScrollContainerProps extends GenericWrapper {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: ConsumerFn;
}

/**
 * InfinateScrollContainer component.
 * 
 * This component manages the infinite scrolling functionality for a list of items. It listens for
 * scroll events and triggers the fetching of the next page of data when the user scrolls to the bottom
 * of the list. The component also displays a loading indicator while new data is being fetched.
 * 
 * @param {InfinateScrollContainerProps} props - The component props.
 * @returns {JSX.Element} - The rendered InfinateScrollContainer component.
 */
const InfinateScrollContainer: React.FC<InfinateScrollContainerProps> = ({
    hasNextPage, isFetchingNextPage, fetchNextPage, children
}) => {

    // Custom hook to determine if the component is visible on the screen
    const [wasSeen, wasSeenRef] = useWasSeen();

    /**
     * Handle scrolling event.
     * 
     * This function checks if there are more pages to load and whether a fetch operation
     * is already in progress. If not, it calls the fetchNextPage function to load the next page.
     */
    const handleScrolling = () => {
        if (!hasNextPage || isFetchingNextPage) return; // Exit if no next page or already fetching
        console.log("was seen"); // Log visibility event
        fetchNextPage(); // Fetch the next page of data
    };

    // Effect hook to handle scrolling
    useEffect(() => {
        handleScrolling(); // Call handleScrolling whenever dependencies change
    }, [hasNextPage, wasSeen, isFetchingNextPage]);

    return (
        <>
            {children} {/* Render child components */}
            <BoxStyled ref={wasSeenRef} /> {/* Reference for visibility detection */}
            <Conditional isEnabled={isFetchingNextPage}>
                <LoaderStyled /> {/* Show loader while fetching next page */}
            </Conditional>
        </>
    );
}

export default withErrorBoundary(InfinateScrollContainer);