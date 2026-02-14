/**
 * Enterprise Form Input Hook Service
 * 
 * Class-based service that replaces the useFormInput hook with enterprise patterns.
 * Provides the same API as useFormInput but follows BaseClassComponent inheritance.
 */

import { ChangeEvent } from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';

/**
 * Props interface for FormInputHookService
 */
export interface IFormInputHookServiceProps<T = string> extends IBaseComponentProps {
  initialValue: T;
  options?: { preventDefault?: boolean };
}

/**
 * State interface for FormInputHookService
 */
export interface IFormInputHookServiceState<T = string> extends IBaseComponentState {
  value: T;
  subscribers: Set<(value: T) => void>;
}

/**
 * Form Input Hook Service - Class-based service that provides useFormInput functionality
 * 
 * This service maintains the same API as the original useFormInput hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class FormInputHookService<T = string> extends BaseClassComponent<IFormInputHookServiceProps<T>, IFormInputHookServiceState<T>> {
  private options = { preventDefault: true };

  protected override getInitialState(): Partial<IFormInputHookServiceState<T>> {
    // Merge default options with provided options
    this.options = { ...this.options, ...this.props.options };
    
    return {
      value: this.props.initialValue,
      subscribers: new Set()
    };
  }

  protected override onUpdate(prevProps: IFormInputHookServiceProps<T>): void {
    // Update options if they changed
    if (prevProps.options !== this.props.options) {
      this.options = { ...this.options, ...this.props.options };
    }
  }

  /**
   * Get current value
   */
  public getValue(): T {
    return this.state.value;
  }

  /**
   * Subscribe to value changes
   */
  public subscribe(callback: (value: T) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Set value
   */
  public setValue(value: T): void {
    if (value !== this.state.value) {
      this.safeSetState({
        value
      });
      this.notifySubscribers();
    }
  }

  /**
   * Handles the change event for the input.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input.
   */
  public handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (this.options.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setValue(e.target.value as T);
  };

  /**
   * Reset value to initial value
   */
  public reset(): void {
    this.setValue(this.props.initialValue);
  }

  /**
   * Get form input utilities (hook-style API)
   */
  public getFormInputUtilities(): {
    value: T;
    setValue: (value: T) => void;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  } {
    return {
      value: this.state.value,
      setValue: this.setValue.bind(this),
      handleChange: this.handleChange
    };
  }

  /**
   * Notify all subscribers of value changes
   */
  private notifySubscribers(): void {
    const currentValue = this.getValue();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentValue);
      } catch (error) {
        console.error('Error in form input hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new FormInputHookService instance
 */
export const createFormInputHookService = <T = string>(props: IFormInputHookServiceProps<T>): FormInputHookService<T> => {
  return new FormInputHookService<T>(props);
};

export default FormInputHookService;
