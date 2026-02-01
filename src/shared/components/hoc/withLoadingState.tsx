import { ReactNode } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../base/BaseClassComponent';

/**
 * Props for withLoadingState HOC
 */
export interface IWithLoadingStateProps {
  isLoading?: boolean;
  loadingComponent?: ReactNode;
  loadingText?: string;
  delay?: number;
  minLoadingTime?: number;
}

/**
 * State for withLoadingState HOC
 */
export interface IWithLoadingStateState extends IBaseComponentState {
  showLoading: boolean;
  loadingStartTime: number | null;
}

/**
 * Higher-order component that provides loading state functionality
 * Wraps a component with loading indicators and delayed loading
 */
export function withLoadingState<P extends IBaseComponentProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return class WithLoadingState extends BaseClassComponent<
    P & IWithLoadingStateProps,
    IWithLoadingStateState
  > {
    private loadingTimer: number | null = null;

    protected override getInitialState(): Partial<IWithLoadingStateState> {
      return {
        showLoading: false,
        loadingStartTime: null
      };
    }

    protected override onUpdate(prevProps: P & IWithLoadingStateProps): void {
      const { isLoading, delay = 0, minLoadingTime = 0 } = this.props;
      const { isLoading: prevIsLoading } = prevProps;

      // Handle loading state changes
      if (isLoading !== prevIsLoading) {
        if (isLoading) {
          this.startLoading(delay);
        } else {
          this.stopLoading(minLoadingTime);
        }
      }
    }

    protected override onUnmount(): void {
      this.clearLoadingTimer();
      super.onUnmount();
    }

    private startLoading(delay: number): void {
      this.clearLoadingTimer();

      if (delay > 0) {
        // Delay showing loading state
        this.loadingTimer = window.setTimeout(() => {
          this.safeSetState({
            showLoading: true,
            loadingStartTime: Date.now()
          });
        }, delay);
      } else {
        // Show loading immediately
        this.safeSetState({
          showLoading: true,
          loadingStartTime: Date.now()
        });
      }
    }

    private stopLoading(minLoadingTime: number): void {
      this.clearLoadingTimer();

      if (this.state.loadingStartTime) {
        const loadingDuration = Date.now() - this.state.loadingStartTime;

        if (loadingDuration < minLoadingTime) {
          // Ensure minimum loading time
          const remainingTime = minLoadingTime - loadingDuration;
          this.loadingTimer = window.setTimeout(() => {
            this.safeSetState({
              showLoading: false,
              loadingStartTime: null
            });
          }, remainingTime);
        } else {
          // Hide loading immediately
          this.safeSetState({
            showLoading: false,
            loadingStartTime: null
          });
        }
      } else {
        // No loading was shown, hide immediately
        this.safeSetState({
          showLoading: false,
          loadingStartTime: null
        });
      }
    }

    private clearLoadingTimer(): void {
      if (this.loadingTimer) {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = null;
      }
    }

    private renderDefaultLoading(): ReactNode {
      const { loadingText = 'Loading...' } = this.props;

      return (
        <div className="loading-indicator" data-testid="loading-indicator">
          <div className="loading-spinner" />
          <span className="loading-text">{loadingText}</span>
        </div>
      );
    }

    protected override renderContent(): ReactNode {
      const { showLoading } = this.state;
      const {
        isLoading,
        loadingComponent,
        loadingText,
        delay,
        minLoadingTime,
        ...restProps
      } = this.props;

      if (showLoading) {
        return loadingComponent || this.renderDefaultLoading();
      }

      return <WrappedComponent {...(restProps as P)} />;
    }
  };
}

export default withLoadingState;
