import { CenterContainer } from "@/shared/ui/components/layout/CenterContainer";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import Typography from "../ui/components/utility/Typography";
import React, { PureComponent, ReactNode } from 'react';

interface IErrorMessageProps extends GenericWrapper {
    children?: ReactNode;
}

class ErrorMessage extends PureComponent<IErrorMessageProps> {
    render(): ReactNode {
        const { children } = this.props;

        return (
            <CenterContainer>
                <Typography>{children}</Typography>
            </CenterContainer>
        );
    }
}

export default ErrorMessage;