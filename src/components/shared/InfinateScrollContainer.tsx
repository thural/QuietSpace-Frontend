import Typography from "@/components/shared/Typography";
import useWasSeen from "@/services/hook/common/useWasSeen";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { useEffect } from "react";
import BoxStyled from "./BoxStyled";
import Conditional from "./Conditional";
import LoaderStyled from "./LoaderStyled";

interface InfinateScrollContainerProps extends GenericWrapper {
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
            <Conditional isEnabled={!hasNextPage}>
                <Typography style={{ margin: '1rem' }} ta="center">end of the stream has been reached</Typography>
            </Conditional>
            <Conditional isEnabled={isFetchingNextPage}>
                <LoaderStyled />
            </Conditional>
        </>
    );
}

export default withErrorBoundary(InfinateScrollContainer);