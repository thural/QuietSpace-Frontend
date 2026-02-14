/**
 * Enterprise Component Initial Height Hook Service
 * 
 * Class-based service that replaces the useComponentInitialHeight hook with enterprise patterns.
 * Provides the same API as useComponentInitialHeight but follows BaseClassComponent inheritance.
 */

import { ReactElement } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { getComponentInitialHeightService } from '../services/ComponentInitialHeightService';

/**
 * Props interface for ComponentInitialHeightHookService
 */
export interface IComponentInitialHeightHookServiceProps extends IBaseComponentProps {
  component: ReactElement;
}

/**
 * State interface for ComponentInitialHeightHookService
 */
export interface IComponentInitialHeightHookServiceState extends IBaseComponentState {
  height: number;
  subscribers: Set<(height: number) => void>;
}

/**
 * Component Initial Height Hook Service - Class-based service that provides useComponentInitialHeight functionality
 * 
 * This service maintains the same API as the original useComponentInitialHeight hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class ComponentInitialHeightHookService extends BaseClassComponent<IComponentInitialHeightHookServiceProps, IComponentInitialHeightHookServiceState> {
  private initialHeightService = getComponentInitialHeightService();
  private unsubscribe: (() => void) | null = null;

  protected override getInitialState(): Partial<IComponentInitialHeightHookServiceState> {
    return {
      height: 0,
      subscribers: new Set()
    };
  }

  protected override onMount(): void {
    // Subscribe to initial height changes
    this.unsubscribe = this.initialHeightService.subscribe((newHeight) => {
      this.safeSetState({
        height: newHeight
      });
      this.notifySubscribers();
    });

    // Calculate initial height
    this.initialHeightService.calculateInitialHeight(this.props.component).then(calculatedHeight => {
      this.safeSetState({
        height: calculatedHeight
      });
      this.notifySubscribers();
    }).catch(error => {
      console.error('Error calculating initial height:', error);
    });
  }

  protected override onUpdate(prevProps: IComponentInitialHeightHookServiceProps): void {
    // If component changes, recalculate height
    if (prevProps.component !== this.props.component) {
      this.initialHeightService.calculateInitialHeight(this.props.component).then(calculatedHeight => {
        this.safeSetState({
          height: calculatedHeight
        });
        this.notifySubscribers();
      }).catch(error => {
        console.error('Error calculating initial height:', error);
      });
    }
  }

  protected override onUnmount(): void {
    // Cleanup subscription
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Get current initial height
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
   * Force recalculation of initial height
   */
  public recalculateHeight(): Promise<number> {
    return this.initialHeightService.calculateInitialHeight(this.props.component).then(calculatedHeight => {
      this.safeSetState({
        height: calculatedHeight
      });
      this.notifySubscribers();
      return calculatedHeight;
    });
  }

  /**
   * Get synchronous height calculation (best effort)
   */
  public getHeightSync(): number {
    return this.initialHeightService.calculateInitialHeightSync(this.props.component);
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
        console.error('Error in component initial height hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new ComponentInitialHeightHookService instance
 */
export const createComponentInitialHeightHookService = (props: IComponentInitialHeightHookServiceProps): ComponentInitialHeightHookService => {
  return new ComponentInitialHeightHookService(props);
};

export default ComponentInitialHeightHookService;
