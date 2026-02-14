/**
 * Enterprise Theme Hook Service
 * 
 * Class-based service that replaces the useTheme hook with enterprise patterns.
 * Provides the same API as useTheme but follows BaseClassComponent inheritance.
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { getThemeService } from '../services/ThemeService';
import { setLocalThemeMode } from '../utils/localStorageUtils';

/**
 * Props interface for ThemeHookService
 */
export interface IThemeHookServiceProps extends IBaseComponentProps {
  // No additional props needed for this service
}

/**
 * State interface for ThemeHookService
 */
export interface IThemeHookServiceState extends IBaseComponentState {
  theme: any;
  isDarkMode: boolean;
  subscribers: Set<(state: { theme: any; isDarkMode: boolean }) => void>;
}

/**
 * Theme Hook Service - Class-based service that provides useTheme functionality
 * 
 * This service maintains the same API as the original useTheme hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class ThemeHookService extends BaseClassComponent<IThemeHookServiceProps, IThemeHookServiceState> {
  private themeService = getThemeService();
  private unsubscribe: (() => void) | null = null;

  protected override getInitialState(): Partial<IThemeHookServiceState> {
    return {
      theme: this.themeService.getCurrentTheme(),
      isDarkMode: this.themeService.getIsDarkMode(),
      subscribers: new Set()
    };
  }

  protected override onMount(): void {
    // Subscribe to theme service changes
    this.unsubscribe = this.themeService.subscribe((newTheme, newIsDarkMode) => {
      this.safeSetState({
        theme: newTheme,
        isDarkMode: newIsDarkMode
      });
      this.notifySubscribers();
    });
  }

  protected override onUnmount(): void {
    // Cleanup subscription
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Get current theme state
   */
  public getState(): { theme: any; isDarkMode: boolean } {
    return {
      theme: this.state.theme,
      isDarkMode: this.state.isDarkMode
    };
  }

  /**
   * Subscribe to theme state changes
   */
  public subscribe(callback: (state: { theme: any; isDarkMode: boolean }) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Sets the theme mode and stores the preference in local storage.
   * 
   * This function updates the theme mode based on the user's choice, 
   * saves the preference in local storage, and reloads the window 
   * to apply the changes.
   * 
   * @param {boolean} isChecked - Indicates whether dark mode is enabled.
   */
  public setThemeMode(isChecked: boolean): void {
    this.themeService.setThemeMode(isChecked);
    window.location.reload(); // Reload the page to apply the new theme
  }

  /**
   * Notify all subscribers of state changes
   */
  private notifySubscribers(): void {
    const currentState = this.getState();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentState);
      } catch (error) {
        console.error('Error in theme hook service subscriber:', error);
      }
    });
  }

  /**
   * Get theme management utilities (hook-style API)
   */
  public getThemeUtilities(): {
    theme: any;
    setThemeMode: (isChecked: boolean) => void;
    isDarkMode: boolean;
    setLocalThemeMode: (isChecked: boolean) => void;
  } {
    return {
      theme: this.state.theme,
      setThemeMode: this.setThemeMode.bind(this),
      isDarkMode: this.state.isDarkMode,
      setLocalThemeMode: setLocalThemeMode
    };
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

// Singleton instance for global use
let themeHookServiceInstance: ThemeHookService | null = null;

/**
 * Factory function to get or create ThemeHookService singleton
 */
export const getThemeHookService = (): ThemeHookService => {
  if (!themeHookServiceInstance) {
    themeHookServiceInstance = new ThemeHookService({});
  }
  return themeHookServiceInstance;
};

/**
 * Factory function to create a new ThemeHookService instance
 */
export const createThemeHookService = (props: IThemeHookServiceProps = {}): ThemeHookService => {
  return new ThemeHookService(props);
};

export default ThemeHookService;
