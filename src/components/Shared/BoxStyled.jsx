import { Box } from "@mantine/core";

const BoxStyled = ({ children, ...props }) => {
    return <Box {...props}>{children}</Box>
}

export default BoxStyled