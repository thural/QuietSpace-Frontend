/**
 * Enterprise Hover State Hook Service
 * 
 * Class-based service that replaces the useHoverState hook with enterprise patterns.
 * Provides the same API as useHoverState but follows BaseClassComponent inheritance.
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';

/**
 * Props interface for HoverStateHookService
 */
export interface IHoverStateHookServiceProps extends IBaseComponentProps {
  // No additional props needed for this service
}

/**
 * State interface for HoverStateHookService
 */
export interface IHoverStateHookServiceState extends IBaseComponentState {
  isHovering: boolean;
  subscribers: Set<(isHovering: boolean) => void>;
}

/**
 * Hover State Hook Service - Class-based service that provides useHoverState functionality
 * 
 * This service maintains the same API as the original useHoverState hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class HoverStateHookService extends BaseClassComponent<IHoverStateHookServiceProps, IHoverStateHookServiceState> {
  protected override getInitialState(): Partial<IHoverStateHookServiceState> {
    return {
      isHovering: false,
      subscribers: new Set()
    };
  }

  /**
   * Get current hover state
   */
  public getHoverState(): boolean {
    return this.state.isHovering;
  }

  /**
   * Subscribe to hover state changes
   */
  public subscribe(callback: (isHovering: boolean) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Set hover state to true
   */
  public setHovering(): void {
    if (!this.state.isHovering) {
      this.safeSetState({
        isHovering: true
      });
      this.notifySubscribers();
    }
  }

  /**
   * Set hover state to false
   */
  public setNotHovering(): void {
    if (this.state.isHovering) {
      this.safeSetState({
        isHovering: false
      });
      this.notifySubscribers();
    }
  }

  /**
   * Toggle hover state
   */
  public toggleHover(): void {
    this.safeSetState({
      isHovering: !this.state.isHovering
    });
    this.notifySubscribers();
  }

  /**
   * Handles the mouse over event.
   * 
   * Sets the hover state to true.
   */
  public handleMouseOver = (): void => {
    this.setHovering();
  };

  /**
   * Handles the mouse out event.
   * 
   * Sets the hover state to false.
   */
  public handleMouseOut = (): void => {
    this.setNotHovering();
  };

  /**
   * Get hover state utilities (hook-style API)
   */
  public getHoverStateUtilities(): {
    isHovering: boolean;
    handleMouseOver: () => void;
    handleMouseOut: () => void;
  } {
    return {
      isHovering: this.state.isHovering,
      handleMouseOver: this.handleMouseOver.bind(this),
      handleMouseOut: this.handleMouseOut.bind(this)
    };
  }

  /**
   * Notify all subscribers of hover state changes
   */
  private notifySubscribers(): void {
    const currentHoverState = this.getHoverState();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentHoverState);
      } catch (error) {
        console.error('Error in hover state hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new HoverStateHookService instance
 */
export const createHoverStateHookService = (props: IHoverStateHookServiceProps = {}): HoverStateHookService => {
  return new HoverStateHookService(props);
};

export default HoverStateHookService;
