export const getFirstThreeWords = (str: string) => {
    if (!str.trim() || str.split(/\s+/).length <= 3) {
        return str.trim();
    }

    return str.split(/\s+/, 3).join(" ");
};

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

export const toUpperFirstChar = (name: string) => {
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : undefined;
};

export const processRecentText = (text: string) => text.startsWith("##MP##") ? "shared a post" : text;

export const extractId = (text: string) => {
    const idStart = text.indexOf('##MP## ') + 7; // Start after "##MP## "
    if (idStart === 6) return ""; // No valid ID found
    const idEnd = idStart + 36; // Fixed length for UUID
    const id = text.substring(idStart, idEnd).trim(); // Trim to avoid extra spaces
    return id.length === 36 ? id : ""; // Ensure we only return valid length
};

export enum FileSizeUnit {
    B = "B",
    KB = "KB",
    MB = "MB",
    GB = "GB",
    TB = "TB",
}

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
