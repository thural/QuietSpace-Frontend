import { Flex } from "@mantine/core";
import withForwardedRefAndErrBoundary from "./hooks/withForwardedRef";
import { GenericWrapperWithRef } from "./types/sharedComponentTypes";

const FlexStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, children, ...props }) => {
    return <Flex ref={forwardedRef} {...props}>{children}</Flex>
}

export default withForwardedRefAndErrBoundary(FlexStyled)