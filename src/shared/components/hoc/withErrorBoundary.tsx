import { ReactNode, ErrorInfo } from 'react';
import { BaseClassComponent, IBaseComponentProps } from '../base/BaseClassComponent';

/**
 * Props for withErrorBoundary HOC
 */
export interface IWithErrorBoundaryProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
}

/**
 * State for withErrorBoundary HOC
 */
export interface IWithErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Higher-order component that provides error boundary functionality
 * Wraps a component with error catching and fallback rendering
 */
export function withErrorBoundary<P extends IBaseComponentProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return class WithErrorBoundary extends BaseClassComponent<
    P & IWithErrorBoundaryProps,
    IWithErrorBoundaryState
  > {
    protected override getInitialState(): Partial<IWithErrorBoundaryState> {
      return {
        hasError: false,
        error: null,
        errorInfo: null
      };
    }

    protected override onError(error: Error, errorInfo: ErrorInfo): void {
      // Call custom error handler if provided
      this.props.onError?.(error, errorInfo);
    }

    private handleRetry = (): void => {
      this.safeSetState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    };

    private renderDefaultFallback(): ReactNode {
      const { error, errorInfo } = this.state;

      return (
        <div className="error-boundary-fallback" data-testid="error-fallback">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{error?.message}</pre>
            {process.env.NODE_ENV === 'development' && (
              <pre>{errorInfo?.componentStack}</pre>
            )}
          </details>
          {this.props.enableRetry && (
            <button onClick={this.handleRetry} data-testid="error-retry">
              Try Again
            </button>
          )}
        </div>
      );
    }

    protected override renderContent(): ReactNode {
      const { hasError } = this.state;
      const { fallback, enableRetry = true, ...restProps } = this.props;

      if (hasError) {
        return fallback || this.renderDefaultFallback();
      }

      return <WrappedComponent {...(restProps as P)} />;
    }
  };
}

export default withErrorBoundary;
