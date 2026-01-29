import { CenterContainer } from "@/shared/ui/components/layout/CenterContainer";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import Typography from "../Typography";

const ErrorMessage: React.FC<GenericWrapper> = ({ children }) => (
    <CenterContainer>
        <Typography>{children}</Typography>
    </CenterContainer>
)

export default ErrorMessage