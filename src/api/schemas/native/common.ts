export type ResId = string | number

export interface BaseSchema {
    id: ResId
    version?: number,
    createDate: Date
    updateDate?: Date
}

export type JwtToken = string

export interface FetchOptions {
    method: string
    headers: Headers
    body: string | null
}

export enum ContentType {
    POST = "POST",
    COMMENT = "COMMENT",
    MESSAGE = "MESSAGE"
}

export interface SortProps {
    sorted: boolean,
    unsorted: boolean,
    empty: boolean
}

export interface PageableProps {
    pageNumber: number
    pageSize: number
    sort: SortProps
    offset: number
    paged: boolean
    unpaged: boolean
}

export type ContentResponse<T extends Object> = Array<T>;

export interface PagedResponse<T extends Object> {
    content: ContentResponse<T>;
    pageable: PageableProps;
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: SortProps;
    numberOfElements: number;
    empty: boolean;
}