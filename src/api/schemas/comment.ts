import { BaseSchema, PagedResponse, ResId } from "./common";
import { UserReaction } from "./reaction";

export interface CommentBody {
    parentId?: ResId | null
    postId: ResId
    userId: ResId
    text: string
}

export interface CommentSchema extends CommentBody, BaseSchema {
    username: string
    likeCount: number
    replyCount: number
    userReaction: UserReaction
}

export type PagedCommentResponse = PagedResponse<CommentSchema>