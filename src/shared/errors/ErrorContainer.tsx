import { Container } from '@/shared/ui/components/layout/Container';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

const ErrorContainer: React.FC<GenericWrapper> = ({ children, ...props }) => {

    return <Container {...props}>
        {children}
    </Container>
}

export default ErrorContainer