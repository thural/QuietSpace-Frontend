/**
 * Enterprise Error Boundary Service
 * 
 * A class-based service that replaces the withErrorBoundary HOC
 * with enterprise patterns for error boundary management.
 */

import React, { ComponentType, ReactNode, PureComponent } from 'react';
import { CenterContainer } from "@/shared/ui/components/layout/CenterContainer";
import { FallbackProps } from 'react-error-boundary';

// Service interface for type safety
export interface IErrorBoundaryService {
    wrapComponent<P extends object>(Component: ComponentType<P>): ComponentType<P>;
    setFallbackComponent(component: ComponentType<FallbackProps>): void;
    setErrorCallback(callback: (error: Error, errorInfo: React.ErrorInfo) => void): void;
    subscribe(callback: (error: Error, errorInfo: React.ErrorInfo) => void): () => void;
    unsubscribe(callback: (error: Error, errorInfo: React.ErrorInfo) => void): void;
    destroy(): void;
}

// Error subscription entry
interface ErrorSubscription {
    callback: (error: Error, errorInfo: React.ErrorInfo) => void;
    id: string;
}

// Error boundary state interface
interface IErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Enterprise Error Boundary Component
 */
class EnterpriseErrorBoundary extends PureComponent<
    { children: ReactNode; onError?: (error: Error, errorInfo: React.ErrorInfo) => void; fallbackComponent?: ComponentType<FallbackProps> },
    IErrorBoundaryState
> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
        return {
            hasError: true,
            error
        };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({
            error,
            errorInfo
        });

        // Call error callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    private handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    override render(): ReactNode {
        const { hasError, error } = this.state;
        const { children, fallbackComponent: FallbackComponent } = this.props;

        if (hasError && error) {
            const Fallback = FallbackComponent || DefaultErrorFallback;
            return <Fallback error={error as Error} resetErrorBoundary={this.handleReset} />;
        }

        return children;
    }
}

/**
 * Default Error Fallback Component
 */
const DefaultErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
    <CenterContainer style={{ margin: "5rem" }}>
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{(error as Error).message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    </CenterContainer>
);

/**
 * ErrorBoundaryService - Enterprise service for managing error boundaries
 * 
 * Provides centralized error boundary management with custom fallback components,
 * error callbacks, subscription notifications, and proper cleanup.
 */
class ErrorBoundaryService implements IErrorBoundaryService {
    private fallbackComponent: ComponentType<FallbackProps> = DefaultErrorFallback;
    private errorCallback: ((error: Error, errorInfo: React.ErrorInfo) => void) | null = null;
    private subscriptions: Map<string, ErrorSubscription> = new Map();
    private isDestroyed: boolean = false;
    private subscriptionIdCounter: number = 0;

    /**
     * Wrap a component with error boundary functionality
     */
    public wrapComponent = <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
        if (this.isDestroyed) {
            return Component;
        }

        return (props: P) => (
            <EnterpriseErrorBoundary
                onError={this.handleError.bind(this)}
                fallbackComponent={this.fallbackComponent}
            >
                <Component {...props} />
            </EnterpriseErrorBoundary>
        );
    };

    /**
     * Handle errors and notify subscribers
     */
    private handleError = (error: Error, errorInfo: React.ErrorInfo): void => {
        if (this.isDestroyed) return;

        // Call error callback if set
        if (this.errorCallback) {
            try {
                this.errorCallback(error, errorInfo);
            } catch (callbackError) {
                console.error('Error in error callback:', callbackError);
            }
        }

        // Notify subscribers
        this.notifySubscribers(error, errorInfo);
    };

    /**
     * Set custom fallback component
     */
    public setFallbackComponent = (component: ComponentType<FallbackProps>): void => {
        if (this.isDestroyed) return;
        this.fallbackComponent = component;
    };

    /**
     * Set error callback
     */
    public setErrorCallback = (callback: (error: Error, errorInfo: React.ErrorInfo) => void): void => {
        if (this.isDestroyed) return;
        this.errorCallback = callback;
    };

    /**
     * Subscribe to error events
     */
    public subscribe = (callback: (error: Error, errorInfo: React.ErrorInfo) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => { };
        }

        const id = `error_subscription_${++this.subscriptionIdCounter}`;
        const subscription: ErrorSubscription = {
            callback,
            id
        };

        this.subscriptions.set(id, subscription);

        // Return unsubscribe function
        return () => {
            this.unsubscribeById(id);
        };
    };

    /**
     * Unsubscribe by ID
     */
    private unsubscribeById = (id: string): void => {
        this.subscriptions.delete(id);
    };

    /**
     * Unsubscribe by callback
     */
    public unsubscribe = (callback: (error: Error, errorInfo: React.ErrorInfo) => void): void => {
        const idsToDelete: string[] = [];

        this.subscriptions.forEach((subscription, id) => {
            if (subscription.callback === callback) {
                idsToDelete.push(id);
            }
        });

        idsToDelete.forEach(id => this.unsubscribeById(id));
    };

    /**
     * Notify all subscribers of errors
     */
    private notifySubscribers = (error: Error, errorInfo: React.ErrorInfo): void => {
        if (this.isDestroyed) return;

        this.subscriptions.forEach(subscription => {
            try {
                subscription.callback(error, errorInfo);
            } catch (callbackError) {
                console.error('Error in error subscription callback:', callbackError);
            }
        });
    };

    /**
     * Get current fallback component
     */
    public getFallbackComponent = (): ComponentType<FallbackProps> => {
        return this.fallbackComponent;
    };

    /**
     * Get subscription count
     */
    public getSubscriptionCount = (): number => {
        return this.subscriptions.size;
    };

    /**
     * Check if service is active
     */
    public isActive = (): boolean => {
        return !this.isDestroyed;
    };

    /**
     * Create a higher-order component with current settings
     */
    public createHOC = <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
        return this.wrapComponent(Component);
    };

    /**
     * Reset to default settings
     */
    public reset = (): void => {
        if (this.isDestroyed) return;

        this.fallbackComponent = DefaultErrorFallback;
        this.errorCallback = null;
    };

    /**
     * Destroy the service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.subscriptions.clear();
        this.fallbackComponent = DefaultErrorFallback;
        this.errorCallback = null;
    };
}

// Singleton instance for application-wide use
let errorBoundaryServiceInstance: ErrorBoundaryService | null = null;

/**
 * Factory function to get or create the ErrorBoundaryService singleton
 */
export const getErrorBoundaryService = (): ErrorBoundaryService => {
    if (!errorBoundaryServiceInstance) {
        errorBoundaryServiceInstance = new ErrorBoundaryService();
    }
    return errorBoundaryServiceInstance;
};

/**
 * Factory function to create a new ErrorBoundaryService instance
 */
export const createErrorBoundaryService = (): ErrorBoundaryService => {
    return new ErrorBoundaryService();
};

/**
 * Hook-style wrapper for backward compatibility
 * 
 * @returns error boundary utilities
 */
export const useErrorBoundaryService = () => {
    const service = getErrorBoundaryService();

    return {
        wrapComponent: service.wrapComponent,
        setFallbackComponent: service.setFallbackComponent,
        setErrorCallback: service.setErrorCallback,
        subscribe: service.subscribe,
        unsubscribe: service.unsubscribe,
        createHOC: service.createHOC,
        reset: service.reset
    };
};

/**
 * Backward compatibility HOC function
 */
export const withErrorBoundary = <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
    const service = getErrorBoundaryService();
    return service.wrapComponent(Component);
};

export default ErrorBoundaryService;
