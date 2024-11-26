export const getFirstThreeWords = (str: string) => {
    if (!str.trim() || str.split(/\s+/).length < 3) {
        return str.trim();
    }

    return str.split(/\s+/, 3).join(" ");
}

export const parseCount = (number: number) => {
    if (number < 1000) {
        return number;
    } else if (number >= 1000 && number < 1_000_000) {
        return (number / 1000).toFixed(1) + "K";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
        return (number / 1_000_000).toFixed(1) + "M";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
        return (number / 1_000_000_000).toFixed(1) + "B";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
        return (number / 1_000_000_000_000).toFixed(1) + "T";
    }
}

export const toUpperFirstChar = (name: string) => {
    return name?.charAt(0).toUpperCase();
}

export const processRecentText = (text: string) => text.startsWith("##MP##") ? "shared a post" : text;

export const extractId = (text: string) => {
    const idStart = text.indexOf('##MP## ') + 7;
    const idEnd = idStart + 36;
    return text.substring(idStart, idEnd);
}

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

