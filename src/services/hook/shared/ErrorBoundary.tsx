import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { GenericWrapper } from '@/types/sharedComponentTypes';

/**
 * ErrorFallback component.
 * 
 * This component is displayed when an error occurs in a child component 
 * wrapped by the ErrorBoundary. It provides an error message and a 
 * button to retry the operation.
 * 
 * @param {FallbackProps} props - The props provided by the ErrorBoundary.
 * @param {Error} props.error - The error that caused the fallback.
 * @param {Function} props.resetErrorBoundary - Function to reset the error boundary.
 * @returns {JSX.Element} - The rendered ErrorFallback component.
 */
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
    <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
    </div>
);

/**
 * MyErrorBoundary component.
 * 
 * This component wraps its children with an ErrorBoundary to catch 
 * JavaScript errors in the component tree below it. If an error occurs, 
 * it displays the ErrorFallback component.
 * 
 * @param {GenericWrapper} props - The props for the component.
 * @param {React.ReactNode} props.children - The children components to wrap.
 * @returns {JSX.Element} - The rendered MyErrorBoundary component.
 */
export const MyErrorBoundary: React.FC<GenericWrapper> = ({ children }) => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
    </ErrorBoundary>
);