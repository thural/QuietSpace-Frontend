import { useState, useEffect } from "react";
import { createFormInputHookService } from './FormInputHookService';

/**
 * Custom hook to manage the state of a form input.
 * 
 * Now uses the FormInputHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
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
    const [service, setService] = useState(() => createFormInputHookService({ initialValue, options }));
    const [value, setValue] = useState(service.getValue());

    useEffect(() => {
        // Subscribe to value changes
        const unsubscribe = service.subscribe((newValue) => {
            setValue(newValue);
        });

        return unsubscribe;
    }, [service]);

    // Update service if props change
    useEffect(() => {
        const newService = createFormInputHookService({ initialValue, options });
        setService(newService);
        setValue(newService.getValue());
    }, [initialValue, options]);

    return {
        value,
        setValue: (newValue: T) => {
            service.setValue(newValue);
            setValue(newValue);
        },
        handleChange: service.handleChange
    };
};

export default useFormInput;