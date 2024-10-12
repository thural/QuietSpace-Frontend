import { Flex } from "@mantine/core";

const FlexStyled = ({ children, ...props }) => {
    return <Flex {...props}>{children}</Flex>
}

export default FlexStyled