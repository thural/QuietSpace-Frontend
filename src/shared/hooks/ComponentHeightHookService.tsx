/**
 * Enterprise Component Height Hook Service
 * 
 * Class-based service that replaces the useComponentHeight hook with enterprise patterns.
 * Provides the same API as useComponentHeight but follows BaseClassComponent inheritance.
 */

import { RefObject } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { getComponentHeightService } from '../services/ComponentHeightService';

/**
 * Props interface for ComponentHeightHookService
 */
export interface IComponentHeightHookServiceProps extends IBaseComponentProps {
  ref: RefObject<HTMLElement>;
}

/**
 * State interface for ComponentHeightHookService
 */
export interface IComponentHeightHookServiceState extends IBaseComponentState {
  height: number;
  subscribers: Set<(height: number) => void>;
}

/**
 * Component Height Hook Service - Class-based service that provides useComponentHeight functionality
 * 
 * This service maintains the same API as the original useComponentHeight hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class ComponentHeightHookService extends BaseClassComponent<IComponentHeightHookServiceProps, IComponentHeightHookServiceState> {
  private componentHeightService = getComponentHeightService();
  private unsubscribe: (() => void) | null = null;

  protected override getInitialState(): Partial<IComponentHeightHookServiceState> {
    return {
      height: this.componentHeightService.getHeight(this.props.ref),
      subscribers: new Set()
    };
  }

  protected override onMount(): void {
    // Subscribe to component height changes
    this.unsubscribe = this.componentHeightService.subscribe(this.props.ref, (newHeight) => {
      this.safeSetState({
        height: newHeight
      });
      this.notifySubscribers();
    });
  }

  protected override onUpdate(prevProps: IComponentHeightHookServiceProps): void {
    // If ref changes, update subscription
    if (prevProps.ref !== this.props.ref) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      
      this.safeSetState({
        height: this.componentHeightService.getHeight(this.props.ref)
      });
      
      this.unsubscribe = this.componentHeightService.subscribe(this.props.ref, (newHeight) => {
        this.safeSetState({
          height: newHeight
        });
        this.notifySubscribers();
      });
    }
  }

  protected override onUnmount(): void {
    // Cleanup subscription
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.componentHeightService.unsubscribe(this.props.ref);
  }

  /**
   * Get current height
   */
  public getHeight(): number {
    return this.state.height;
  }

  /**
   * Subscribe to height changes
   */
  public subscribe(callback: (height: number) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Force height recalculation
   */
  public recalculateHeight(): void {
    const newHeight = this.componentHeightService.getHeight(this.props.ref);
    if (newHeight !== this.state.height) {
      this.safeSetState({
        height: newHeight
      });
      this.notifySubscribers();
    }
  }

  /**
   * Get height utilities (hook-style API)
   */
  public getHeightUtilities(): number {
    return this.state.height;
  }

  /**
   * Notify all subscribers of height changes
   */
  private notifySubscribers(): void {
    const currentHeight = this.getHeight();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentHeight);
      } catch (error) {
        console.error('Error in component height hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new ComponentHeightHookService instance
 */
export const createComponentHeightHookService = (props: IComponentHeightHookServiceProps): ComponentHeightHookService => {
  return new ComponentHeightHookService(props);
};

export default ComponentHeightHookService;
