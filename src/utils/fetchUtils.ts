import { Page } from "@/api/schemas/inferred/common";
import { Post } from "@/api/schemas/inferred/post";

export const buildPageParams = (pageNumber: number, pageSize: number = 0): string => (
    `?page-number=${pageNumber}&page-size=${pageSize}`
);

export const getNextPageParam = (lastPage: Page<Post>) => {
    console.log("is last page: ", lastPage.last);
    if (lastPage.last) return lastPage.pageable.pageNumber;

    console.log("lastPageNumber: ", lastPage.pageable.pageNumber);
    const nextPageNumber = lastPage.pageable.pageNumber + 1;
    console.log("nextPageNumber: ", nextPageNumber);
    return nextPageNumber;
}