import { useThemeStore } from "@/services/store/zustand";
import { darkTheme, lightTheme } from "@/theme";
import { getLocalThemeMode, setLocalThemeMode } from "@/utils/localStorageUtils";
import { useEffect } from "react";



const useTheme = () => {
    const { data: isDarkMode, setThemeStore } = useThemeStore();
    const themeMode: boolean = getLocalThemeMode();

    useEffect(() => setThemeStore(themeMode), []);

    const setThemeMode = (isChecked: boolean) => {
        setLocalThemeMode(isChecked);
        setThemeStore(isChecked);
    };

    const theme = isDarkMode ? darkTheme : lightTheme;
    return { theme, setThemeMode, isDarkMode, setLocalThemeMode };
};

export default useTheme;
