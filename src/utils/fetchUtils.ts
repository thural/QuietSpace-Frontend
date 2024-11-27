import { Page } from "@/api/schemas/inferred/common";
import { PostResponse } from "@/api/schemas/inferred/post";
import { UserPage } from "@/api/schemas/inferred/user";

export const buildPageParams = (pageNumber: number, pageSize: number = 9): string => (
    `?page-number=${pageNumber}&page-size=${pageSize}`
);

export const getNextPageParam = (lastPage: Page<PostResponse>) => {
    if (lastPage.last) return undefined;
    return lastPage.pageable.pageNumber + 1;
}

export const getPreviousPageParam = (lastPage: UserPage) => {
    if (lastPage.first) return undefined;
    return lastPage.pageable.pageNumber - 1;
}

export const pageReducer = <T>(accumulator: T[], currentValue: Page<T>): T[] => [...accumulator, ...currentValue.content];