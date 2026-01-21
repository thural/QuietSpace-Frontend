import { useCallback, useState } from "react";

/**
 * Custom hook to manage multiple selections of items.
 * 
 * @template T
 * @returns {Object} - An object containing the selected items and related methods.
 * @returns {T[]} selectedItems - The currently selected items.
 * @returns {function} toggleSelection - Function to toggle the selection of an item.
 * @returns {function} setSelectedItems - Function to set the selected items directly.
 */
const useMultiSelect = <T = string>() => {
    const [selectedItems, setSelectedItems] = useState<T[]>([]);

    /**
     * Toggles the selection state of a given item.
     * 
     * If the item is currently selected, it will be removed from the selection.
     * If the item is not selected, it will be added to the selection.
     * 
     * @param {T} item - The item to toggle in the selection.
     */
    const toggleSelection = useCallback((item: T) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(item)
                ? prevSelected.filter(selectedItem => selectedItem !== item)
                : [...prevSelected, item]
        );
    }, []);

    return { selectedItems, toggleSelection, setSelectedItems };
};

export default useMultiSelect;