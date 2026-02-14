import React, { createContext, useContext, useEffect, useState } from "react";
import { getThemeHookService } from "./ThemeHookService";

/**
 * Theme context for direct service integration
 */
const ThemeContext = createContext<ReturnType<typeof getThemeHookService> | null>(null);

/**
 * Theme provider component that directly integrates with ThemeHookService
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const service = getThemeHookService();
    const [state, setState] = useState(service.getState());

    useEffect(() => {
        // Subscribe to theme state changes
        const unsubscribe = service.subscribe(setState);
        return unsubscribe;
    }, [service]);

    return (
        <ThemeContext.Provider value={service}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Enterprise useTheme hook with direct service integration
 * 
 * Optimized to use ThemeHookService directly through context for better performance
 * and cleaner architecture while maintaining backward compatibility.
 *
 * @returns {{
 *     theme: object,                                   // The current theme object (dark or light).
 *     setThemeMode: (isChecked: boolean) => void,     // Function to set theme mode.
 *     isDarkMode: boolean,                             // Indicates whether dark mode is currently active.
 *     setLocalThemeMode: (isChecked: boolean) => void // Function to set theme mode in local storage.
 * }} - An object containing theme management utilities.
 */
const useTheme = () => {
    const service = useContext(ThemeContext);
    
    if (!service) {
        throw new Error('useTheme must be used within ThemeProvider');
    }

    const state = service.getState();
    
    return {
        theme: state.theme,
        setThemeMode: service.setThemeMode.bind(service),
        isDarkMode: state.isDarkMode,
        setLocalThemeMode: require('../utils/localStorageUtils').setLocalThemeMode
    };
};

export default useTheme;