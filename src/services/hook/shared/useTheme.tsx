import { lightTheme, darkTheme } from "@/theme";
import { useState } from "react";



const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const theme = isDarkMode ? darkTheme : lightTheme;
    return { theme, toggleTheme };
};

export default useTheme;
