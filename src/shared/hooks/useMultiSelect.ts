import { useEffect, useState } from "react";
import { createMultiSelectHookService } from './MultiSelectHookService';

/**
 * Custom hook to manage multiple selections of items.
 * 
 * Now uses the MultiSelectHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 * 
 * @template T
 * @returns {Object} - An object containing selected items and related methods.
 * @returns {T[]} selectedItems - The currently selected items.
 * @returns {function} toggleSelection - Function to toggle selection of an item.
 * @returns {function} setSelectedItems - Function to set selected items directly.
 */
const useMultiSelect = <T = string>() => {
    const [service] = useState(() => createMultiSelectHookService<T>());
    const [selectedItems, setSelectedItems] = useState(service.getSelectedItems());

    useEffect(() => {
        // Subscribe to selection changes
        const unsubscribe = service.subscribe((newSelectedItems) => {
            setSelectedItems(newSelectedItems);
        });

        return unsubscribe;
    }, [service]);

    return {
        selectedItems,
        toggleSelection: service.toggleSelection,
        setSelectedItems: (items: T[]) => {
            service.setSelectedItems(items);
            setSelectedItems(items);
        }
    };
};

export default useMultiSelect;