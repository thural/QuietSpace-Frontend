/**
 * Enterprise Search Query Hook Service
 * 
 * Class-based service that replaces the useSearchQuery hook with enterprise patterns.
 * Provides the same API as useSearchQuery but follows BaseClassComponent inheritance.
 */

import { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';

// Import UserResponse type
interface UserResponse {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

/**
 * Props interface for SearchQueryHookService
 */
export interface ISearchQueryHookServiceProps<T = UserResponse> extends IBaseComponentProps {
  queryFn: (value: string) => void;
  options?: {
    debounceTime?: number;
    minQueryLength?: number;
  };
}

/**
 * State interface for SearchQueryHookService
 */
export interface ISearchQueryHookServiceState<T = UserResponse> extends IBaseComponentState {
  focused: boolean;
  queryResult: T[];
  isSubmitting: boolean;
  subscribers: Set<(state: ISearchQueryHookServiceState<T>) => void>;
}

/**
 * Search Query Hook Service - Class-based service that provides useSearchQuery functionality
 * 
 * This service maintains the same API as the original useSearchQuery hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class SearchQueryHookService<T = UserResponse> extends BaseClassComponent<ISearchQueryHookServiceProps<T>, ISearchQueryHookServiceState<T>> {
  private debounceTimer: number | null = null;

  protected override getInitialState(): Partial<ISearchQueryHookServiceState<T>> {
    return {
      focused: false,
      queryResult: [],
      isSubmitting: false,
      subscribers: new Set()
    };
  }

  /**
   * Get current search state
   */
  public getSearchState(): ISearchQueryHookServiceState<T> {
    return this.state;
  }

  /**
   * Subscribe to search state changes
   */
  public subscribe(callback: (state: ISearchQueryHookServiceState<T>) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Set query result directly
   */
  public setQueryResult(results: T[]): void {
    this.safeSetState({
      queryResult: results
    });
    this.notifySubscribers();
  }

  /**
   * Handles submission of a search query.
   * 
   * @param {string} value - The query string to submit.
   */
  public handleQuerySubmit = async (value: string): Promise<void> => {
    const minQueryLength = this.props.options?.minQueryLength ?? 1;
    const debounceTime = this.props.options?.debounceTime ?? 1000;

    if (this.state.isSubmitting || value.length < minQueryLength) return;

    this.safeSetState({
      isSubmitting: true
    });
    this.notifySubscribers();

    try {
      this.props.queryFn(value);
      
      // Debounce the completion
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      this.debounceTimer = setTimeout(() => {
        this.safeSetState({
          isSubmitting: false
        });
        this.notifySubscribers();
      }, debounceTime) as unknown as number;
    } catch (error) {
      console.error('Search query error:', error);
      this.safeSetState({
        isSubmitting: false
      });
      this.notifySubscribers();
    }
  };

  /**
   * Handles changes in the input field.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
   */
  public handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    
    this.safeSetState({
      focused: true
    });

    if (value.length) {
      this.handleQuerySubmit(value);
    } else {
      this.setQueryResult([]);
    }
    this.notifySubscribers();
  };

  /**
   * Handles key down events in the input field.
   * 
   * @param {React.KeyboardEvent} event - The key down event from the input.
   */
  public handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.safeSetState({
        focused: false
      });
      this.notifySubscribers();
    }
  };

  /**
   * Handles focus events on the input field.
   */
  public handleInputFocus = (): void => {
    this.safeSetState({
      focused: true
    });
    this.notifySubscribers();
  };

  /**
   * Handles blur events on the input field.
   * 
   * @param {React.FocusEvent} event - The blur event from the input.
   * @param {React.RefObject<HTMLDivElement>} resultListRef - Reference to the result list element.
   */
  public handleInputBlur = (event: FocusEvent, resultListRef: React.RefObject<HTMLDivElement>): void => {
    if (resultListRef.current && resultListRef.current.contains(event.relatedTarget as Node)) return;
    
    this.safeSetState({
      focused: false
    });
    this.notifySubscribers();
  };

  /**
   * Get search query utilities (hook-style API)
   */
  public getSearchQueryUtilities(): {
    focused: boolean;
    queryResult: T[];
    isSubmitting: boolean;
    setQueryResult: (results: T[]) => void;
    handleQuerySubmit: (value: string) => Promise<void>;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (event: KeyboardEvent) => void;
    handleInputFocus: () => void;
    handleInputBlur: (event: FocusEvent, resultListRef: React.RefObject<HTMLDivElement>) => void;
  } {
    return {
      focused: this.state.focused,
      queryResult: this.state.queryResult,
      isSubmitting: this.state.isSubmitting,
      setQueryResult: this.setQueryResult.bind(this),
      handleQuerySubmit: this.handleQuerySubmit.bind(this),
      handleInputChange: this.handleInputChange.bind(this),
      handleKeyDown: this.handleKeyDown.bind(this),
      handleInputFocus: this.handleInputFocus.bind(this),
      handleInputBlur: this.handleInputBlur.bind(this)
    };
  }

  /**
   * Notify all subscribers of state changes
   */
  private notifySubscribers(): void {
    const currentState = this.getSearchState();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentState);
      } catch (error) {
        console.error('Error in search query hook service subscriber:', error);
      }
    });
  }

  protected override onUnmount(): void {
    // Cleanup debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new SearchQueryHookService instance
 */
export const createSearchQueryHookService = <T = UserResponse>(props: ISearchQueryHookServiceProps<T>): SearchQueryHookService<T> => {
  return new SearchQueryHookService<T>(props);
};

export default SearchQueryHookService;
