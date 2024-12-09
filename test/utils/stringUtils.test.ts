import {
    getFirstThreeWords,
    parseCount,
    toUpperFirstChar,
    processRecentText,
    extractId,
    formatFileSize,
    FileSizeUnit
} from '@/utils/stringUtils';

describe('stringUtils', () => {
    describe('getFirstThreeWords', () => {
        it('should return the entire string if it has less than three words', () => {
            expect(getFirstThreeWords("Hello")).toBe("Hello");
            expect(getFirstThreeWords("Hello World")).toBe("Hello World");
            expect(getFirstThreeWords("One Two Three")).toBe("One Two Three");
        });

        it('should return the first three words of a string', () => {
            expect(getFirstThreeWords("This is a test string")).toBe("This is a");
        });

        it('should return an empty string when input is empty', () => {
            expect(getFirstThreeWords("   ")).toBe("");
        });
    });

    describe('parseCount', () => {
        it('should return the number if it is less than 1000', () => {
            expect(parseCount(999)).toBe("999");
        });

        it('should return the number in K format if it is between 1000 and 1,000,000', () => {
            expect(parseCount(1500)).toBe("1.5K");
            expect(parseCount(9999)).toBe("10K");
            expect(parseCount(999999)).toBe("1000K");
            expect(parseCount(1000000)).toBe("1M");
        });

        it('should return the number in M format if it is between 1,000,000 and 1,000,000,000', () => {
            expect(parseCount(1500000)).toBe("1.5M");
            expect(parseCount(9999999)).toBe("10M");
            expect(parseCount(10000000)).toBe("10M");
            expect(parseCount(1000000000)).toBe("1B");
        });

        it('should return the number in B format if it is between 1,000,000,000 and 1,000,000,000,000', () => {
            expect(parseCount(1500000000)).toBe("1.5B");
            expect(parseCount(999999999999)).toBe("1T");
            expect(parseCount(1000000000000)).toBe("1T");
        });

        it('should return the number in T format if it is 1,000,000,000,000 or more', () => {
            expect(parseCount(1500000000000)).toBe("1.5T");
        });
    });

    describe('toUpperFirstChar', () => {
        it('should return the first character in uppercase', () => {
            expect(toUpperFirstChar("hello")).toBe("H");
            expect(toUpperFirstChar("world")).toBe("W");
        });

        it('should return undefined for an empty string', () => {
            expect(toUpperFirstChar("")).toBeUndefined();
        });
    });

    describe('processRecentText', () => {
        it('should return "shared a post" if text starts with "##MP##"', () => {
            expect(processRecentText("##MP## This is a test")).toBe("shared a post");
        });

        it('should return the original text if it does not start with "##MP##"', () => {
            expect(processRecentText("This is a test")).toBe("This is a test");
        });
    });

    describe('extractId', () => {
        it('should return the ID from a string that starts with "##MP##"', () => {
            const input = "##MP## 12345678-1234-5678-1234-567812345678 some other text";
            expect(extractId(input)).toBe("12345678-1234-5678-1234-567812345678");
        });

        it('should return an empty string if no valid ID is found', () => {
            const input = "No ID here";
            expect(extractId(input)).toBe("");
        });
    });

    describe('formatFileSize', () => {
        it('should format sizes correctly in bytes', () => {
            expect(formatFileSize(500)).toBe("500.00 B");
        });

        it('should format sizes correctly in kilobytes', () => {
            expect(formatFileSize(1500)).toBe("1.46 KB");
        });

        it('should format sizes correctly in megabytes', () => {
            expect(formatFileSize(1500000)).toBe("1.43 MB");
        });

        it('should format sizes correctly in gigabytes', () => {
            expect(formatFileSize(1500000000)).toBe("1.40 GB");
        });

        it('should format sizes correctly in terabytes', () => {
            expect(formatFileSize(1500000000000)).toBe("1.36 TB");
        });
    });
});
