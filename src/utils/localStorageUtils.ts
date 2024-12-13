/**
 * Retrieves the local theme mode from local storage.
 *
 * This function checks the local storage for a stored theme value. If the value is
 * not present or is explicitly set to "false", it returns `false`, indicating that
 * the light theme is preferred. Otherwise, it returns `true`, indicating that the dark
 * theme is preferred.
 *
 * @returns {boolean} - Returns `true` if the dark theme is set, `false` otherwise.
 */
export const getLocalThemeMode = () => {
    const localData: string | null = localStorage.getItem("theme");
    return (localData === null || localData === "false") ? false : true;
}

/**
 * Sets the local theme mode in local storage.
 *
 * This function stores the theme preference in local storage. It takes a boolean
 * indicating whether the dark theme is enabled and saves it as a string value.
 *
 * @param {boolean} isDarkTheme - A boolean indicating if the dark theme should be enabled (`true`) or disabled (`false`).
 */
export const setLocalThemeMode = (isDarkTheme: boolean) => {
    localStorage.setItem("theme", String(isDarkTheme));
}