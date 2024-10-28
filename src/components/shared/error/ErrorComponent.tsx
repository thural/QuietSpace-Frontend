import React from 'react';
import ErrorContainer from './ErrorContainer';
import ErrorMessage from './ErrorMessage';
import styles from './styles/errorContainerStyles';
import { PiWarningCircleBold } from "react-icons/pi";

interface ErrorComponentProps {
    message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
    const classes = styles();
    return (
        <ErrorContainer className={classes.container}>
            <PiWarningCircleBold />
            <ErrorMessage>{message}</ErrorMessage>
        </ErrorContainer>
    );
};

export default ErrorComponent;