import BoxStyled from "../BoxStyled";
import { GenericWrapper } from "../../../types/sharedComponentTypes";

const ErrorContainer: React.FC<GenericWrapper> = ({ children, ...props }) => {

    return <BoxStyled {...props}>
        {children}
    </BoxStyled>
}

export default ErrorContainer