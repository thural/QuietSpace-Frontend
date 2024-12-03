export const getLocalThemeMode = () => {
    const localData: string | null = localStorage.getItem("theme");
    return (localData === null || localData === "false") ? false : true;
}

export const setLocalThemeMode = (isDarkTheme: boolean) => {
    localStorage.setItem("theme", String(isDarkTheme));
}