import { Box } from "@mantine/core";
import withForwardedRef from "./hooks/withForwardedRef";

const BoxStyled = ({ forwardedRef, children, ...props }) => {
    return <Box ref={forwardedRef} {...props}>{children}</Box>
}

export default withForwardedRef(BoxStyled)