import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback: React.FC<{ error: Error, resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
    <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
    </div>
);

const logErrorToService = (error: Error, info: React.ErrorInfo) => {
    console.error("Logging error to service: ", error, info);
};

export const withErrorBoundary = (Component: React.FC, fallback?: React.FC) => {

    return (
        <ErrorBoundary
            FallbackComponent={fallback || ErrorFallback}
            onError={logErrorToService}
        >
            <Component />
        </ErrorBoundary>
    )
}