/**
 * Enterprise Multi Select Hook Service
 * 
 * Class-based service that replaces the useMultiSelect hook with enterprise patterns.
 * Provides the same API as useMultiSelect but follows BaseClassComponent inheritance.
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';

/**
 * Props interface for MultiSelectHookService
 */
export interface IMultiSelectHookServiceProps extends IBaseComponentProps {
  // No additional props needed for this service
}

/**
 * State interface for MultiSelectHookService
 */
export interface IMultiSelectHookServiceState<T = string> extends IBaseComponentState {
  selectedItems: T[];
  subscribers: Set<(selectedItems: T[]) => void>;
}

/**
 * Multi Select Hook Service - Class-based service that provides useMultiSelect functionality
 * 
 * This service maintains the same API as the original useMultiSelect hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class MultiSelectHookService<T = string> extends BaseClassComponent<IMultiSelectHookServiceProps, IMultiSelectHookServiceState<T>> {
  protected override getInitialState(): Partial<IMultiSelectHookServiceState<T>> {
    return {
      selectedItems: [],
      subscribers: new Set()
    };
  }

  /**
   * Get current selected items
   */
  public getSelectedItems(): T[] {
    return this.state.selectedItems;
  }

  /**
   * Subscribe to selection changes
   */
  public subscribe(callback: (selectedItems: T[]) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Set selected items directly
   */
  public setSelectedItems(items: T[]): void {
    this.safeSetState({
      selectedItems: [...items]
    });
    this.notifySubscribers();
  }

  /**
   * Toggles selection state of a given item.
   * 
   * If item is currently selected, it will be removed from the selection.
   * If item is not selected, it will be added to the selection.
   * 
   * @param {T} item - The item to toggle in selection.
   */
  public toggleSelection(item: T): void {
    const currentSelected = this.state.selectedItems;
    const isSelected = currentSelected.includes(item);

    const newSelectedItems = isSelected
      ? currentSelected.filter(selectedItem => selectedItem !== item)
      : [...currentSelected, item];

    this.safeSetState({
      selectedItems: newSelectedItems
    });
    this.notifySubscribers();
  }

  /**
   * Add item to selection
   */
  public addItem(item: T): void {
    if (!this.state.selectedItems.includes(item)) {
      const newSelectedItems = [...this.state.selectedItems, item];
      this.safeSetState({
        selectedItems: newSelectedItems
      });
      this.notifySubscribers();
    }
  }

  /**
   * Remove item from selection
   */
  public removeItem(item: T): void {
    const newSelectedItems = this.state.selectedItems.filter(selectedItem => selectedItem !== item);
    this.safeSetState({
      selectedItems: newSelectedItems
    });
    this.notifySubscribers();
  }

  /**
   * Clear all selections
   */
  public clearSelection(): void {
    if (this.state.selectedItems.length > 0) {
      this.safeSetState({
        selectedItems: []
      });
      this.notifySubscribers();
    }
  }

  /**
   * Check if item is selected
   */
  public isItemSelected(item: T): boolean {
    return this.state.selectedItems.includes(item);
  }

  /**
   * Get selection count
   */
  public getSelectionCount(): number {
    return this.state.selectedItems.length;
  }

  /**
   * Get multi select utilities (hook-style API)
   */
  public getMultiSelectUtilities(): {
    selectedItems: T[];
    toggleSelection: (item: T) => void;
    setSelectedItems: (items: T[]) => void;
  } {
    return {
      selectedItems: this.state.selectedItems,
      toggleSelection: this.toggleSelection.bind(this),
      setSelectedItems: this.setSelectedItems.bind(this)
    };
  }

  /**
   * Notify all subscribers of selection changes
   */
  private notifySubscribers(): void {
    const currentSelectedItems = this.getSelectedItems();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentSelectedItems);
      } catch (error) {
        console.error('Error in multi select hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new MultiSelectHookService instance
 */
export const createMultiSelectHookService = <T = string>(props: IMultiSelectHookServiceProps = {}): MultiSelectHookService<T> => {
  return new MultiSelectHookService<T>(props);
};

export default MultiSelectHookService;
