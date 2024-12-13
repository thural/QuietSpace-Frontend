/**
 * Retrieves the first three words from a given string.
 * 
 * @param {string} str - The input string from which to extract the first three words.
 * @returns {string} - The first three words of the string, or the original string if it has three or fewer words.
 */
export const getFirstThreeWords = (str: string) => {
    if (!str.trim() || str.split(/\s+/).length <= 3) {
        return str.trim();
    }

    return str.split(/\s+/, 3).join(" ");
};

/**
 * Parses a number and formats it based on its size.
 * 
 * This function converts numbers into a human-readable format. 
 * For example, it converts:
 * - Numbers less than 1000 to their string representation.
 * - Numbers in the thousands to "K" format.
 * - Numbers in the millions to "M" format.
 * - Numbers in the billions to "B" format.
 * - Numbers in the trillions to "T" format.
 *
 * @param {number} number - The number to parse and format.
 * @returns {string} - The formatted number as a string.
 */
export const parseCount = (number: number) => {
    if (number < 1000) {
        return number.toString(); // Return as a string for consistency
    } else if (number < 1_000_000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, '') + "K"; // Keep 1 decimal
    } else if (number < 1_000_000_000) {
        return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M"; // Keep 1 decimal
    } else if (number < 1_000_000_000_000) {
        if (number >= 999_950_000_000) {
            return "1T"; // Special case to round up to the next tier
        }
        return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + "B"; // Keep 1 decimal
    } else {
        return (number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + "T"; // Keep 1 decimal
    }
};

/**
 * Converts the first character of a string to uppercase.
 * 
 * @param {string} name - The input string to process.
 * @returns {string | undefined} - The string with the first character in uppercase, or undefined if input is empty.
 */
export const toUpperFirstChar = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : undefined;
};

/**
 * Processes text to determine if it indicates a shared post.
 * 
 * If the text starts with "##MP##", it returns "shared a post".
 * Otherwise, it returns the original text.
 * 
 * @param {string} text - The input text to process.
 * @returns {string} - The processed text indicating a shared post or the original text.
 */
export const processRecentText = (text: string) =>
    text.startsWith("##MP##") ? "shared a post" : text;

/**
 * Extracts a unique identifier from a specific formatted string.
 * 
 * This function looks for the identifier that follows "##MP## " in the input text.
 * It expects the identifier to be a UUID of fixed length (36 characters).
 * 
 * @param {string} text - The input text containing the identifier.
 * @returns {string} - The extracted identifier if valid, or an empty string if not found.
 */
export const extractId = (text: string) => {
    const idStart = text.indexOf('##MP## ') + 7; // Start after "##MP## "
    if (idStart === 6) return ""; // No valid ID found
    const idEnd = idStart + 36; // Fixed length for UUID
    const id = text.substring(idStart, idEnd).trim(); // Trim to avoid extra spaces
    return id.length === 36 ? id : ""; // Ensure we only return valid length
};

/**
 * Enumeration for file size units.
 * 
 * @enum {string}
 */
export enum FileSizeUnit {
    B = "B",
    KB = "KB",
    MB = "MB",
    GB = "GB",
    TB = "TB",
}

/**
 * Formats a file size from bytes to a human-readable string.
 * 
 * The function converts the file size to the appropriate unit (B, KB, MB, GB, TB)
 * and formats the size to two decimal places.
 * 
 * @param {number} fileSizeInBytes - The size of the file in bytes.
 * @returns {string} - The formatted file size with the appropriate unit.
 */
export const formatFileSize = (fileSizeInBytes: number): string => {
    const units: FileSizeUnit[] =
        [FileSizeUnit.B, FileSizeUnit.KB, FileSizeUnit.MB, FileSizeUnit.GB, FileSizeUnit.TB];
    let size = fileSizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
};