import { useEffect, useState } from "react";
import { getThemeService } from "../services/ThemeService";
import { setLocalThemeMode } from "@/shared/utils/localStorageUtils";

/**
 * Enterprise useTheme hook
 * 
 * Now uses the ThemeService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise patterns.
 *
 * @returns {{
 *     theme: object,                                   // The current theme object (dark or light).
 *     setThemeMode: (isChecked: boolean) => void,     // Function to set the theme mode.
 *     isDarkMode: boolean,                             // Indicates whether the dark mode is currently active.
 *     setLocalThemeMode: (isChecked: boolean) => void // Function to set the theme mode in local storage.
 * }} - An object containing theme management utilities.
 */
const useTheme = () => {
    const service = getThemeService();
    const [theme, setTheme] = useState(service.getCurrentTheme());
    const [isDarkMode, setIsDarkMode] = useState(service.getIsDarkMode());

    useEffect(() => {
        // Subscribe to theme changes
        const unsubscribe = service.subscribe((newTheme, newIsDarkMode) => {
            setTheme(newTheme);
            setIsDarkMode(newIsDarkMode);
        });

        return unsubscribe;
    }, [service]);

    /**
     * Sets the theme mode and stores the preference in local storage.
     *
     * This function updates the theme mode based on the user's choice, 
     * saves the preference in local storage, and reloads the window 
     * to apply the changes.
     *
     * @param {boolean} isChecked - Indicates whether dark mode is enabled.
     */
    const setThemeMode = (isChecked: boolean) => {
        service.setThemeMode(isChecked);
        window.location.reload(); // Reload the page to apply the new theme
    };

    return { theme, setThemeMode, isDarkMode, setLocalThemeMode };
};

export default useTheme;