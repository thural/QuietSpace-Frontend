import { Page } from "@/api/schemas/inferred/common";
import { Post } from "@/api/schemas/inferred/post";

export const buildPageParams = (pageNumber: number, pageSize: number = 9): string => (
    `?page-number=${pageNumber}&page-size=${pageSize}`
);

export const getNextPageParam = (lastPage: Page<Post>) => {
    console.log("is last page: ", lastPage.last);
    if (lastPage.last) return undefined;

    console.log("lastPageNumber: ", lastPage.pageable.pageNumber);
    const nextPageNumber = lastPage.pageable.pageNumber + 1;
    console.log("nextPageNumber: ", nextPageNumber);
    return nextPageNumber;
}

export const pageReducer = <T>(accumulator: T[], currentValue: Page<T>): T[] => [...accumulator, ...currentValue.content];