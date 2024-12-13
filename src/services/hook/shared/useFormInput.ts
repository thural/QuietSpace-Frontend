import { useCallback, useState } from "react";

/**
 * Custom hook to manage the state of a form input.
 * 
 * @template T
 * @param {T} initialValue - The initial value of the input.
 * @param {Object} options - Options for the input handling.
 * @param {boolean} [options.preventDefault=true] - Whether to prevent default events on change.
 * @returns {Object} - An object containing the input value, a setter function, and a change handler.
 * @returns {T} value - The current value of the input.
 * @returns {function} setValue - Function to update the input value.
 * @returns {function} handleChange - Function to handle input change events.
 */
const useFormInput = <T = string>(
    initialValue: T,
    options: { preventDefault?: boolean } = { preventDefault: true }
) => {
    const [value, setValue] = useState<T>(initialValue);

    /**
     * Handles the change event for the input.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input.
     */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (options.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }
        setValue(e.target.value as T);
    }, [options.preventDefault]);

    return { value, setValue, handleChange };
};

export default useFormInput;