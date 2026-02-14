/**
 * Enterprise Navigation Hook Service
 * 
 * Class-based service that replaces the useNavigation hook with enterprise patterns.
 * Provides the same API as useNavigation but follows ContainerClassComponent inheritance for DI integration.
 */

import { ContainerClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { createNavigationService } from '../services/NavigationService';
import { Container } from '@/core/modules/dependency-injection';

/**
 * Props interface for NavigationHookService
 */
export interface INavigationHookServiceProps extends IBaseComponentProps {
  // No additional props needed for this service
}

/**
 * State interface for NavigationHookService
 */
export interface INavigationHookServiceState extends IBaseComponentState {
  currentPath: string;
  subscribers: Set<(path: string) => void>;
}

/**
 * Navigation Hook Service - Class-based service that provides useNavigation functionality
 * 
 * This service maintains the same API as the original useNavigation hook but follows
 * enterprise class-based patterns with proper lifecycle management and DI integration.
 */
export class NavigationHookService extends ContainerClassComponent<INavigationHookServiceProps, INavigationHookServiceState> {
  protected container: Container;
  private navigationService = createNavigationService();
  private unsubscribe: (() => void) | null = null;

  constructor(props: INavigationHookServiceProps) {
    super(props);
    // Create a simple container for DI integration
    const container = new Container();
    container.registerInstance('NavigationService', this.navigationService);
    this.container = container;
  }

  protected override getInitialState(): Partial<INavigationHookServiceState> {
    return {
      currentPath: this.navigationService.getCurrentPath(),
      subscribers: new Set()
    };
  }

  protected override onMount(): void {
    // Subscribe to navigation changes
    this.unsubscribe = this.navigationService.subscribe((newPath) => {
      this.safeSetState({
        currentPath: newPath
      });
      this.notifySubscribers();
    });
  }

  protected override onUnmount(): void {
    // Cleanup subscription and service
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.navigationService.destroy();
  }

  /**
   * Get current path
   */
  public getCurrentPath(): string {
    return this.state.currentPath;
  }

  /**
   * Subscribe to navigation changes
   */
  public subscribe(callback: (path: string) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Navigate to a specific path
   */
  public navigatePath(path: string): void {
    this.navigationService.navigatePath(path);
  }

  /**
   * Go back in browser history
   */
  public goBack(): void {
    this.navigationService.goBack();
  }

  /**
   * Go forward in browser history
   */
  public goForward(): void {
    this.navigationService.goForward();
  }

  /**
   * Refresh current page
   */
  public refresh(): void {
    this.navigationService.refresh();
  }

  /**
   * Get navigation history
   */
  public getNavigationHistory(): string[] {
    return this.navigationService.getNavigationHistory();
  }

  /**
   * Check if can go back
   */
  public canGoBack(): boolean {
    return this.navigationService.canGoBack();
  }

  /**
   * Check if can go forward
   */
  public canGoForward(): boolean {
    return this.navigationService.canGoForward();
  }

  /**
   * Get navigation utilities (hook-style API)
   */
  public getNavigationUtilities(): {
    navigatePath: (path: string) => void;
  } {
    return {
      navigatePath: this.navigatePath.bind(this)
    };
  }

  /**
   * Get full navigation utilities (extended API)
   */
  public getFullNavigationUtilities(): {
    navigatePath: (path: string) => void;
    getCurrentPath: () => string;
    goBack: () => void;
    goForward: () => void;
    refresh: () => void;
    getNavigationHistory: () => string[];
    canGoBack: () => boolean;
    canGoForward: () => boolean;
  } {
    return {
      navigatePath: this.navigatePath.bind(this),
      getCurrentPath: this.getCurrentPath.bind(this),
      goBack: this.goBack.bind(this),
      goForward: this.goForward.bind(this),
      refresh: this.refresh.bind(this),
      getNavigationHistory: this.getNavigationHistory.bind(this),
      canGoBack: this.canGoBack.bind(this),
      canGoForward: this.canGoForward.bind(this)
    };
  }

  /**
   * Notify all subscribers of navigation changes
   */
  private notifySubscribers(): void {
    const currentPath = this.getCurrentPath();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentPath);
      } catch (error) {
        console.error('Error in navigation hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new NavigationHookService instance
 */
export const createNavigationHookService = (props: INavigationHookServiceProps = {}): NavigationHookService => {
  return new NavigationHookService(props);
};

export default NavigationHookService;
