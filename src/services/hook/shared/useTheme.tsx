import { useThemeStore } from "@/services/store/zustand";
import { darkTheme, lightTheme } from "@/theme";
import { getLocalThemeMode, setLocalThemeMode } from "@/utils/localStorageUtils";
import { useEffect } from "react";

/**
 * Custom hook for managing the application theme.
 *
 * This hook provides functionality to switch between light and dark themes 
 * based on user preferences stored in local storage. It initializes the theme 
 * based on the stored preference and provides a method to toggle the theme.
 *
 * @returns {{
 *     theme: object,                                   // The current theme object (dark or light).
 *     setThemeMode: (isChecked: boolean) => void,     // Function to set the theme mode.
 *     isDarkMode: boolean,                             // Indicates whether the dark mode is currently active.
 *     setLocalThemeMode: (isChecked: boolean) => void // Function to set the theme mode in local storage.
 * }} - An object containing theme management utilities.
 */
const useTheme = () => {
    const { data: isDarkMode, setThemeStore } = useThemeStore();
    const themeMode: boolean = getLocalThemeMode();

    useEffect(() => {
        // Initialize the theme store with the value from local storage.
        setThemeStore(themeMode);
    }, [setThemeStore, themeMode]);

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
        setLocalThemeMode(isChecked); // Store the theme preference in local storage.
        setThemeStore(isChecked);      // Update the theme in the Zustand store.
        window.location.reload();      // Reload the page to apply the new theme.
    };

    // Determine the current theme based on the dark mode preference.
    const theme = isDarkMode ? darkTheme : lightTheme;

    return { theme, setThemeMode, isDarkMode, setLocalThemeMode };
};

export default useTheme;