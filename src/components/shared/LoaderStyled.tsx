import { Center, Loader } from "@mantine/core"

const LoaderStyled = ({ color = "gray", size = 30 }) => {
    return (
        <Center>
            <Loader color={color} size={size} />
        </Center>
    );
}

export default LoaderStyled