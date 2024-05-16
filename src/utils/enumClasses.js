class ContentType {
    static POST = new ContentType('POST');
    static COMMENT = new ContentType('COMMENT');
    static MESSAGE = new ContentType('MESSAGE');

    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

class LikeType {
    static LIKE = new LikeType('LIKE');
    static DISLIKE = new LikeType('DISLIKE');

    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

export { ContentType, LikeType };