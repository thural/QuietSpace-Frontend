export const getFirstThreeWords = (str) => {
    if (!str.trim() || str.split(/\s+/).length < 3) {
        return str.trim();
    }

    return str.split(/\s+/, 3).join(" ");
}