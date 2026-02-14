/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { IInfinateScrollContainerProps, IInfinateScrollContainerState } from './interfaces';
import {
  infinateScrollContainerBaseStyles,
  scrollTriggerStyles,
  loadingContainerStyles,
  infinateScrollResponsiveStyles
} from './styles';
import { LoadingSpinner } from '../../index';

/**
 * InfinateScrollContainer Component
 * 
 * A specialized container that provides infinite scrolling functionality with
 * pagination, loading states, and scroll event handling. Perfect for data grids,
 * feed lists, and paginated content. Built using enterprise class-based pattern
 * with theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */
export class InfinateScrollContainer extends PureComponent<IInfinateScrollContainerProps, IInfinateScrollContainerState> {
  static displayName = 'InfinateScrollContainer';

  private scrollTriggerRef: React.RefObject<HTMLDivElement | null>;

  constructor(props: IInfinateScrollContainerProps) {
    super(props);

    // Initialize ref for scroll trigger element
    this.scrollTriggerRef = React.createRef();

    // Initialize state
    this.state = {
      wasSeen: false
    };
  }

  override componentDidMount(): void {
    this.addScrollListener();
    this.checkVisibility();
  }

  override componentDidUpdate(prevProps: IInfinateScrollContainerProps): void {
    const { hasNextPage, isFetchingNextPage } = this.props;
    const { hasNextPage: prevHasNextPage, isFetchingNextPage: prevIsFetchingNextPage } = prevProps;

    // Re-check visibility if dependencies change
    if (hasNextPage !== prevHasNextPage || isFetchingNextPage !== prevIsFetchingNextPage) {
      this.checkVisibility();
    }
  }

  override componentWillUnmount(): void {
    this.removeScrollListener();
  }

  /**
   * Add scroll event listener for infinite scroll detection
   */
  private addScrollListener = (): void => {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.checkVisibility);
  };

  /**
   * Remove scroll event listener
   */
  private removeScrollListener = (): void => {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.checkVisibility);
  };

  /**
   * Check if scroll trigger element is visible in viewport
   */
  private checkVisibility = (): void => {
    if (!this.scrollTriggerRef.current) return;

    const rect = this.scrollTriggerRef.current.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (isVisible && !this.state.wasSeen) {
      this.setState({ wasSeen: true });
      this.triggerNextPageLoad();
    }
  };

  /**
   * Handle scroll event with throttling for performance
   */
  private handleScroll = (): void => {
    // Throttle scroll events for better performance
    if (!this.scrollTimeout) {
      this.scrollTimeout = setTimeout(() => {
        this.checkVisibility();
        this.scrollTimeout = null;
      }, 100);
    }
  };

  private scrollTimeout: NodeJS.Timeout | null = null;

  /**
   * Trigger next page load if conditions are met
   */
  private triggerNextPageLoad = (): void => {
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = this.props;

    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  /**
   * Get container styles based on props and theme tokens
   */
  private getContainerStyles = (theme?: any) => {
    return css`
      ${infinateScrollContainerBaseStyles(theme)}
      ${infinateScrollResponsiveStyles(theme)}
    `;
  };

  /**
   * Get scroll trigger styles
   */
  private getScrollTriggerStyles = (theme?: any) => {
    return scrollTriggerStyles(theme);
  };

  /**
   * Get loading container styles
   */
  private getLoadingContainerStyles = (theme?: any) => {
    return loadingContainerStyles(theme);
  };

  override render(): ReactNode {
    const { children, isFetchingNextPage, theme, className, testId, id, style } = this.props;
    const { wasSeen } = this.state;

    const containerStyles = this.getContainerStyles(theme);
    const scrollTriggerStyles = this.getScrollTriggerStyles(theme);
    const loadingContainerStyles = this.getLoadingContainerStyles(theme);

    return (
      <div
        css={containerStyles}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        style={style}
      >
        {/* Render child content */}
        {children}

        {/* Scroll trigger element for visibility detection */}
        <div
          ref={this.scrollTriggerRef}
          css={scrollTriggerStyles}
          aria-hidden="true"
        />

        {/* Loading indicator when fetching next page */}
        {isFetchingNextPage && (
          <div css={loadingContainerStyles}>
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>
    );
  }
}

export default InfinateScrollContainer;
