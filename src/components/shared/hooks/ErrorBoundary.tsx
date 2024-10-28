import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
    <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
    </div>
);

export const MyErrorBoundary: React.FC = ({ children }) => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
    </ErrorBoundary>
);