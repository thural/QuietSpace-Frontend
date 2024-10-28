import { Center } from '@mantine/core';
import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
    <Center style={{ margin: "5rem" }}>
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    </Center>
);

const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
    return (props: P) => (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Component {...props} />
        </ErrorBoundary>
    );
};

export default withErrorBoundary;