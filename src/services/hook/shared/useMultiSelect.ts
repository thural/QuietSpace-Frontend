import { useCallback, useState } from "react";

const useMultiSelect = <T = string>() => {
    const [selectedItems, setSelectedItems] = useState<T[]>([]);

    const toggleSelection = useCallback((item: T) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(item)
                ? prevSelected.filter(selectedItem => selectedItem !== item)
                : [...prevSelected, item]
        );
    }, []);

    return { selectedItems, toggleSelection, setSelectedItems };
};

export default useMultiSelect