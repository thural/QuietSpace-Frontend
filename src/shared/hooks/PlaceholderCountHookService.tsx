/**
 * Enterprise Placeholder Count Hook Service
 * 
 * Class-based service that replaces the usePlaceholderCount hook with enterprise patterns.
 * Provides the same API as usePlaceholderCount but follows BaseClassComponent inheritance.
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { createPlaceholderCountService } from '../services/PlaceholderCountService';

/**
 * Props interface for PlaceholderCountHookService
 */
export interface IPlaceholderCountHookServiceProps extends IBaseComponentProps {
  placeholderHeight: number;
}

/**
 * State interface for PlaceholderCountHookService
 */
export interface IPlaceholderCountHookServiceState extends IBaseComponentState {
  count: number;
  subscribers: Set<(count: number) => void>;
}

/**
 * Placeholder Count Hook Service - Class-based service that provides usePlaceholderCount functionality
 * 
 * This service maintains the same API as the original usePlaceholderCount hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class PlaceholderCountHookService extends BaseClassComponent<IPlaceholderCountHookServiceProps, IPlaceholderCountHookServiceState> {
  private placeholderCountService = createPlaceholderCountService(this.props.placeholderHeight);
  private unsubscribe: (() => void) | null = null;

  protected override getInitialState(): Partial<IPlaceholderCountHookServiceState> {
    return {
      count: this.placeholderCountService.getPlaceholderCount(),
      subscribers: new Set()
    };
  }

  protected override onMount(): void {
    // Subscribe to placeholder count changes
    this.unsubscribe = this.placeholderCountService.subscribe((newCount) => {
      this.safeSetState({
        count: newCount
      });
      this.notifySubscribers();
    });
  }

  protected override onUpdate(prevProps: IPlaceholderCountHookServiceProps): void {
    // If placeholder height changes, update service
    if (prevProps.placeholderHeight !== this.props.placeholderHeight) {
      this.placeholderCountService.setPlaceholderHeight(this.props.placeholderHeight);
    }
  }

  protected override onUnmount(): void {
    // Cleanup subscription and service
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.placeholderCountService.destroy();
  }

  /**
   * Get current placeholder count
   */
  public getCount(): number {
    return this.state.count;
  }

  /**
   * Subscribe to count changes
   */
  public subscribe(callback: (count: number) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Set placeholder height and recalculate
   */
  public setPlaceholderHeight(height: number): void {
    this.placeholderCountService.setPlaceholderHeight(height);
  }

  /**
   * Get current placeholder height
   */
  public getPlaceholderHeight(): number {
    return this.placeholderCountService.getPlaceholderHeight();
  }

  /**
   * Force recalculation of placeholders
   */
  public recalculate(): void {
    this.placeholderCountService.recalculate();
  }

  /**
   * Get viewport information
   */
  public getViewportInfo(): {
    width: number;
    height: number;
    placeholderCount: number;
    placeholderHeight: number;
    availableSpace: number;
  } {
    return this.placeholderCountService.getViewportInfo();
  }

  /**
   * Get count utilities (hook-style API)
   */
  public getCountUtilities(): number {
    return this.state.count;
  }

  /**
   * Notify all subscribers of count changes
   */
  private notifySubscribers(): void {
    const currentCount = this.getCount();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentCount);
      } catch (error) {
        console.error('Error in placeholder count hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new PlaceholderCountHookService instance
 */
export const createPlaceholderCountHookService = (props: IPlaceholderCountHookServiceProps): PlaceholderCountHookService => {
  return new PlaceholderCountHookService(props);
};

export default PlaceholderCountHookService;
