import useWasSeen from "@/services/hook/common/useWasSeen";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from "react";
import { Container } from "@/shared/ui/components/layout/Container";
import Conditional from "./Conditional";
import { LoadingSpinner } from "@/shared/ui/components";

/**
 * InfinateScrollContainerProps interface.
 * 
 * This interface defines the props for the InfinateScrollContainer component.
 * 
 * @property {boolean} hasNextPage - Indicates whether there are more pages to fetch.
 * @property {boolean} isFetchingNextPage - Indicates if a fetch operation for the next page is currently in progress.
 * @property {ConsumerFn} fetchNextPage - Function to be called to fetch the next page of data.
 */
export interface IInfinateScrollContainerProps extends GenericWrapper {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: ConsumerFn;
    children?: ReactNode;
}

interface IInfinateScrollContainerState {
    wasSeen: boolean;
}

/**
 * InfinateScrollContainer component.
 * 
 * This component manages the infinite scrolling functionality for a list of items. It listens for
 * scroll events and triggers the fetching of the next page of data when the user scrolls to the bottom
 * of the list. The component also displays a loading indicator while new data is being fetched.
 * 
 * @param {IInfinateScrollContainerProps} props - The component props.
 * @returns {JSX.Element} - The rendered InfinateScrollContainer component.
 */
class InfinateScrollContainer extends PureComponent<IInfinateScrollContainerProps, IInfinateScrollContainerState> {
    private wasSeenRef: React.RefObject<boolean>;

    constructor(props: IInfinateScrollContainerProps) {
        super(props);

        // Initialize ref for visibility detection
        this.wasSeenRef = { current: false };

        this.state = {
            wasSeen: false
        };
    }

    override componentDidMount(): void {
        this.addScrollListener();
    }

    override componentDidUpdate(prevProps: IInfinateScrollContainerProps): void {
        const { hasNextPage, isFetchingNextPage } = this.props;
        const { hasNextPage: prevHasNextPage, isFetchingNextPage: prevIsFetchingNextPage } = prevProps;

        // Re-add scroll listener if dependencies change
        if (hasNextPage !== prevHasNextPage || isFetchingNextPage !== prevIsFetchingNextPage) {
            this.addScrollListener();
        }
    }

    override componentWillUnmount(): void {
        this.removeScrollListener();
    }

    /**
     * Add scroll event listener
     */
    private addScrollListener = (): void => {
        window.addEventListener('scroll', this.handleScrolling);
    };

    /**
     * Remove scroll event listener
     */
    private removeScrollListener = (): void => {
        window.removeEventListener('scroll', this.handleScrolling);
    };

    /**
     * Handle scrolling event.
     * 
     * This function checks if there are more pages to load and whether a fetch operation
     * is already in progress. If not, it calls the fetchNextPage function to load the next page.
     */
    private handleScrolling = (): void => {
        const { hasNextPage, isFetchingNextPage, fetchNextPage } = this.props;
        const { wasSeen } = this.state;

        if (!hasNextPage || isFetchingNextPage) return; // Exit if no next page or already fetching
        console.log("was seen"); // Log visibility event
        fetchNextPage(); // Fetch the next page of data

        // Update wasSeen state
        if (!wasSeen) {
            this.setState({ wasSeen: true });
        }
    };

    override render(): ReactNode {
        const { children, hasNextPage, isFetchingNextPage } = this.props;
        const { wasSeen } = this.state;

        return (
            <>
                {children} {/* Render child components */}
                <Container ref={this.wasSeenRef} /> {/* Reference for visibility detection */}
                <Conditional isEnabled={isFetchingNextPage}>
                    <LoadingSpinner size="sm" /> {/* Show loader while fetching next page */}
                </Conditional>
            </>
        );
    }
}

export default withErrorBoundary(InfinateScrollContainer);