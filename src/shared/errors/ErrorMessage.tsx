import { Center } from "@mantine/core";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import Typography from "../Typography";

const ErrorMessage: React.FC<GenericWrapper> = ({ children }) => (
    <Center>
        <Typography>{children}</Typography>
    </Center>
)

export default ErrorMessage