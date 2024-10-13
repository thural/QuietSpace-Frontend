import { Flex } from "@mantine/core";
import withForwardedRef from "./hooks/withForwardedRef";

const FlexStyled = ({ forwardedRef, children, ...props }) => {
    return <Flex ref={forwardedRef} {...props}>{children}</Flex>
}

export default withForwardedRef(FlexStyled)