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

export const PRIVACY_DESCRIPTION = (
    "When your account is public, your profile and posts can be seen by anyone, When your account is private, only your followers can see your content, including your followers and following lists. Your profile info, like your profile picture and username, is visible to everyone"
);