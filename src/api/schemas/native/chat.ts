import { BaseSchema, ContentResponse, PagedResponse, ResId } from "./common";
import { UserSchema } from "./user";

export enum ChatEventType {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    DELETE_MESSAGE = "DELETE_MESSAGE",
    SEEN_MESSAGE = "SEEN_MESSAGE",
    SEEN_NOTIFICATION = "SEEN_NOTIFICATION",
    JOINED_CHAT = "JOINED_CHAT",
    LEFT_CHAT = "LEFT_CHAT",
    EXCEPTION = "EXCEPTION"
}

export interface BaseEvent {

    message: string
    eventBody: Object
    type: ChatEventType

}

export interface ChatEvent extends BaseEvent {

    chatId: ResId
    actorId: ResId
    messageId: ResId
    recipientId: ResId

}

export interface MessageBody {
    chatId: ResId
    senderId: ResId
    recipientId: ResId
    text: string
}

export interface MessageSchema extends MessageBody, BaseSchema {
    senderName: string
    isSeen: boolean
}

export type MessageListResponse = ContentResponse<MessageSchema>

export type PagedMessageResponse = PagedResponse<MessageSchema>

export interface ChatSchema extends BaseSchema {
    userIds: Array<ResId>,
    members: Array<UserSchema>,
    recentMessage: MessageSchema,
}

export type AtLeastTwoElems<T> = [T, T, ...T[]];

export interface CreateChatRequest {
    isGroupChat: boolean
    userIds: AtLeastTwoElems<ResId>
    recipientId: ResId
    text: string
}


export type ChatResponseList = ContentResponse<ChatSchema>