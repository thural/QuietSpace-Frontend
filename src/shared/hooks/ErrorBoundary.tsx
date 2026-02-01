import { ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { BaseClassComponent, IBaseComponentProps } from '@/shared/components/base/BaseClassComponent';

/**
 * Props for ErrorFallback component
 */
interface IErrorFallbackProps extends FallbackProps, IBaseComponentProps {
    // No additional props needed
}

/**
 * State for ErrorFallback component
 */
interface IErrorFallbackState {
    // No state needed for this component
}

/**
 * ErrorFallback component
 * 
 * This component is displayed when an error occurs in a child component 
 * wrapped by the ErrorBoundary. It provides an error message and a 
 * button to retry the operation.
 * 
 * Converted to class-based pattern following enterprise architecture.
 */
export class ErrorFallback extends BaseClassComponent<IErrorFallbackProps, IErrorFallbackState> {
    protected override renderContent(): ReactNode {
        const { error, resetErrorBoundary } = this.props;

        return (
            <div role="alert" data-testid="error-fallback">
                <p>Something went wrong:</p>
                <pre>{error instanceof Error ? error.message : String(error)}</pre>
                <button onClick={resetErrorBoundary} data-testid="error-retry-button">
                    Try again
                </button>
            </div>
        );
    }
}

/**
 * Props for MyErrorBoundary component
 */
interface IMyErrorBoundaryProps extends IBaseComponentProps {
    children: ReactNode;
}

/**
 * State for MyErrorBoundary component
 */
interface IMyErrorBoundaryState {
    // No state needed for this component
}

/**
 * MyErrorBoundary component
 * 
 * This component wraps its children with an ErrorBoundary to catch 
 * JavaScript errors in the component tree below it. If an error occurs, 
 * it displays the ErrorFallback component.
 * 
 * Converted to class-based pattern following enterprise architecture.
 */
export class MyErrorBoundary extends BaseClassComponent<IMyErrorBoundaryProps, IMyErrorBoundaryState> {
    protected override renderContent(): ReactNode {
        const { children } = this.props;

        return (
            <ErrorBoundary FallbackComponent={ErrorFallback} data-testid="error-boundary">
                {children}
            </ErrorBoundary>
        );
    }
}

export default MyErrorBoundary;