import React, { PureComponent, ReactNode } from 'react';
import ErrorContainer from './ErrorContainer';
import ErrorMessage from './ErrorMessage';
import { PiWarningCircleBold } from "react-icons/pi";

interface IErrorComponentProps {
    message: string | undefined | null;
}

class ErrorComponent extends PureComponent<IErrorComponentProps> {
    render(): ReactNode {
        const { message } = this.props;

        return (
            <ErrorContainer>
                <PiWarningCircleBold />
                <ErrorMessage>{message}</ErrorMessage>
            </ErrorContainer>
        );
    }
}

export default ErrorComponent;