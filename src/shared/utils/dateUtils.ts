import { format } from 'date-fns';

/**
 * Checks if a given date string has expired compared to the current date.
 *
 * This function takes a date string, converts it to a Date object, and compares it
 * with the current date to determine if it is in the past.
 *
 * @param {string} dateStr - The date string to check, formatted in a recognized date format.
 * @returns {boolean} - Returns true if the date has expired; otherwise, false.
 */
export const isDateExpired = (dateStr: string): boolean => {
    const inputDate = new Date(dateStr);
    const currentDate = new Date();
    return inputDate < currentDate;
}

/**
 * Gets the current date and time adjusted by a specified offset.
 *
 * This function calculates the current date and time, applies an offset (in milliseconds),
 * and formats it as an ISO 8601 string.
 *
 * @param {number} [offset=0] - The offset in milliseconds to add to the current date and time.
 * @returns {string} - The formatted date and time string in ISO 8601 format.
 */
export const getOffsetDateTime = (offset = 0) => {
    const offsetDateTime = offset + +new Date();
    return format(offsetDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX");
}