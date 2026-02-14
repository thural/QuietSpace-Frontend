import { useEffect, useState } from "react";
import { getThemeHookService } from "./ThemeHookService";

/**
 * Enterprise useTheme hook
 * 
 * Now uses the ThemeHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 *
 * @returns {{
 *     theme: object,                                   // The current theme object (dark or light).
 *     setThemeMode: (isChecked: boolean) => void,     // Function to set the theme mode.
 *     isDarkMode: boolean,                             // Indicates whether the dark mode is currently active.
 *     setLocalThemeMode: (isChecked: boolean) => void // Function to set the theme mode in local storage.
 * }} - An object containing theme management utilities.
 */
const useTheme = () => {
    const service = getThemeHookService();
    const [state, setState] = useState(service.getState());

    useEffect(() => {
        // Subscribe to theme state changes
        const unsubscribe = service.subscribe((newState) => {
            setState(newState);
        });

        return unsubscribe;
    }, [service]);

    return {
        theme: state.theme,
        setThemeMode: service.setThemeMode.bind(service),
        isDarkMode: state.isDarkMode,
        setLocalThemeMode: require('../utils/localStorageUtils').setLocalThemeMode
    };
};

export default useTheme;