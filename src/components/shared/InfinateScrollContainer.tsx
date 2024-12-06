import useWasSeen from "@/services/hook/common/useWasSeen";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { useEffect } from "react";
import BoxStyled from "./BoxStyled";
import Conditional from "./Conditional";
import LoaderStyled from "./LoaderStyled";

export interface InfinateScrollContainerProps extends GenericWrapper {
    hasNextPage: boolean
    isFetchingNextPage: boolean
    fetchNextPage: ConsumerFn
}

const InfinateScrollContainer: React.FC<InfinateScrollContainerProps> = ({
    hasNextPage, isFetchingNextPage, fetchNextPage, children
}) => {

    const [wasSeen, wasSeenRef] = useWasSeen();

    const handleScrolling = () => {
        if (!hasNextPage || isFetchingNextPage) return;
        console.log("was seen");
        fetchNextPage();
    };

    useEffect(handleScrolling, [hasNextPage, wasSeen, isFetchingNextPage]);

    return (
        <>
            {children}
            <BoxStyled ref={wasSeenRef} />
            <Conditional isEnabled={isFetchingNextPage}>
                <LoaderStyled />
            </Conditional>
        </>
    );
}

export default withErrorBoundary(InfinateScrollContainer);