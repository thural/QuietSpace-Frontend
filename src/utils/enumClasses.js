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

class UserRole {
    static USER = new UserRole('USER');
    static ADMIN = new UserRole('ADMIN');

    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

class ChatEventType {
    static CONNECT = new ChatEventType("CONNECT");
    static DISCONNECT = new ChatEventType("DISCONNECT");
    static DELETE = new ChatEventType("DELETE");
    static DELETE_MESSAGE = new ChatEventType("DELETE_MESSAGE");
    static SEEN_MESSAGE = new ChatEventType("SEEN_MESSAGE");
    static JOINED_CHAT = new ChatEventType("JOINED_CHAT");
    static LEFT_CHAT = new ChatEventType("LEFT_CHAT");
    static EXCEPTION = new ChatEventType("EXCEPTION");

    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

export { ContentType, LikeType, UserRole, ChatEventType };