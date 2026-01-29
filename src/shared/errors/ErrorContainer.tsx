import { Container } from '@/shared/ui/components/layout/Container';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';

interface IErrorContainerProps extends GenericWrapper {
    children?: ReactNode;
}

class ErrorContainer extends PureComponent<IErrorContainerProps> {
    render(): ReactNode {
        const { children, ...props } = this.props;

        return (
            <Container {...props}>
                {children}
            </Container>
        );
    }
}

export default ErrorContainer;