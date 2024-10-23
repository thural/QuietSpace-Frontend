import { BaseSchema, ContentResponse, PagedResponse, ResId } from "./common";
import { UserSchema } from "./user";

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