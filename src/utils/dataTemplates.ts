export const getInitPageObject = (pageSize: number, content: Array<any>) => {
    return {
        "content": content,
        "pageable": {
            "pageNumber": 0,
            "pageSize": pageSize,
            "sort": {
                "sorted": true,
                "unsorted": false,
                "empty": false
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 1,
        "totalElements": 1,
        "last": true,
        "size": pageSize,
        "number": 0,
        "sort": {
            "sorted": true,
            "unsorted": false,
            "empty": false
        },
        "first": true,
        "numberOfElements": 1,
        "empty": false
    }
}

export const getInitInfinitePagesObject = (pageSize: number, content: Array<any>) => {

    const pageObject = getInitPageObject(pageSize, content);

    return {
        "pages": [pageObject],
        "pageParams": [0, pageSize]
    }
}