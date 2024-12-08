import { Page } from "@/api/schemas/inferred/common";
import { DEFAULT_PAGE_SIZE } from "@/constants/params";

export const buildPageParams = (pageNumber: number, pageSize: number = DEFAULT_PAGE_SIZE): string => (
    `?page-number=${pageNumber}&page-size=${pageSize}`
);

export const getNextPageParam = (lastPage: Page<any>) => {
    if (lastPage.last) return undefined;
    return lastPage.pageable.pageNumber + 1;
}

export const getPreviousPageParam = (lastPage: Page<any>) => {
    if (lastPage.first) return undefined;
    return lastPage.pageable.pageNumber - 1;
}

export const pageReducer = <T>(accumulator: T[], currentValue: Page<T>): T[] => [...accumulator, ...currentValue.content];