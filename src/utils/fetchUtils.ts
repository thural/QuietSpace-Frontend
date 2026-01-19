import { Page } from "@api/schemas/inferred/common";
import { DEFAULT_PAGE_SIZE } from "@constants/params";

/**
 * Builds a query string for pagination parameters.
 *
 * This function generates a query string containing the page number and page size,
 * which can be used in API requests for paginated data.
 *
 * @param {number} pageNumber - The current page number to retrieve.
 * @param {number} [pageSize=DEFAULT_PAGE_SIZE] - The number of items per page (default is set to DEFAULT_PAGE_SIZE).
 * @returns {string} - The formatted query string for pagination parameters.
 */
export const buildPageParams = (pageNumber: number, pageSize: number = DEFAULT_PAGE_SIZE): string => (
    `?page-number=${pageNumber}&page-size=${pageSize}`
);

/**
 * Retrieves the next page number based on the last retrieved page.
 *
 * This function checks if the last page is the last one available. If it is,
 * it returns undefined; otherwise, it returns the next page number.
 *
 * @param {Page<any>} lastPage - The last page object retrieved from the API.
 * @returns {number | undefined} - The next page number if available; otherwise, undefined.
 */
export const getNextPageParam = (lastPage: Page<any>) => {
    if (lastPage.last) return undefined;
    return lastPage.pageable.pageNumber + 1;
}

/**
 * Retrieves the previous page number based on the last retrieved page.
 *
 * This function checks if the last page is the first one available. If it is,
 * it returns undefined; otherwise, it returns the previous page number.
 *
 * @param {Page<any>} lastPage - The last page object retrieved from the API.
 * @returns {number | undefined} - The previous page number if available; otherwise, undefined.
 */
export const getPreviousPageParam = (lastPage: Page<any>) => {
    if (lastPage.first) return undefined;
    return lastPage.pageable.pageNumber - 1;
}

/**
 * Reduces an array of page objects into a single array of content.
 *
 * This reducer function takes an accumulator (array of items) and the current page,
 * and merges the content of the current page into the accumulator.
 *
 * @param {T[]} accumulator - The accumulated array of items.
 * @param {Page<T>} currentValue - The current page object containing content.
 * @returns {T[]} - The updated array containing items from all processed pages.
 */
export const pageReducer = <T>(accumulator: T[], currentValue: Page<T>): T[] => [
    ...accumulator,
    ...currentValue.content
];