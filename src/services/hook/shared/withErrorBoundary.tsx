import { Center } from '@mantine/core';
import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

/**
 * Fallback component to display when an error occurs.
 *
 * This component renders an error message and a button to reset the error boundary,
 * allowing the user to retry the failed operation.
 *
 * @param {FallbackProps} props - The props provided by the ErrorBoundary, including the error and reset function.
 * @returns {JSX.Element} - The rendered fallback UI.
 */
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
    <Center style={{ margin: "5rem" }}>
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    </Center>
);

/**
 * Higher-order component that wraps a given component with an ErrorBoundary.
 *
 * This function takes a React component and returns a new component that 
 * catches any errors that occur within it, displaying the ErrorFallback 
 * component in case of an error.
 *
 * @param {React.ComponentType<P>} Component - The component to be wrapped with the error boundary.
 * @returns {React.FC<P>} - A new component that includes error boundary functionality.
 */
const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
    return (props: P) => (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Component {...props} />
        </ErrorBoundary>
    );
};

export default withErrorBoundary;