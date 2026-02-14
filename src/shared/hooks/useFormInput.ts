import React, { createContext, useContext, useState, useEffect } from "react";
import { createFormInputHookService } from './FormInputHookService';

/**
 * FormInput context for direct service integration
 */
const FormInputContext = createContext<ReturnType<typeof createFormInputHookService> | null>(null);

/**
 * FormInput provider component that directly integrates with FormInputHookService
 */
export const FormInputProvider: React.FC<{
    children: React.ReactNode;
    initialValue: any;
    options?: { preventDefault?: boolean }
}> = ({ children, initialValue, options = { preventDefault: true } }) => {
    const [service, setService] = useState(() => createFormInputHookService({ initialValue, options }));

    useEffect(() => {
        // Subscribe to value changes
        const unsubscribe = service.subscribe(() => {
            // Value state is managed by individual hook instances
        });

        return () => {
            unsubscribe();
        };
    }, [service]);

    // Update service if props change
    useEffect(() => {
        const newService = createFormInputHookService({ initialValue, options });
        setService(newService);

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [initialValue, options]);

    return (
        <FormInputContext.Provider value= { service } >
        { children }
        </FormInputContext.Provider>
    );
};

/**
 * Custom hook to manage the state of a form input with direct service integration
 * 
 * Optimized to use FormInputHookService directly through context for better performance
 * and cleaner architecture while maintaining backward compatibility.
 * 
 * @template T
 * @param {T} initialValue - The initial value of input.
 * @param {Object} options - Options for the input handling.
 * @param {boolean} [options.preventDefault=true] - Whether to prevent default events on change.
 * @returns {Object} - An object containing the input value, a setter function, and a change handler.
 * @returns {T} value - The current value of input.
 * @returns {function} setValue - Function to update input value.
 * @returns {function} handleChange - Function to handle input change events.
 */
const useFormInput = <T = string>(
    initialValue: T,
    options: { preventDefault?: boolean } = { preventDefault: true }
) => {
    const service = useContext(FormInputContext);

    if (!service) {
        throw new Error('useFormInput must be used within FormInputProvider');
    }

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
        setValue(newService.getValue());

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
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