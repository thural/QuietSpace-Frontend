import { ContentType } from "../inferred/reaction"
import { BaseSchema } from "./common"

export enum ReactionType {
    LIKE = "LIKE",
    DISLIKE = "DISLIKE"
}

export interface UserReaction {
    userId: string | number
    contentId: string | number
    reactionType: ReactionType
    contentType: ContentType
}

export interface UserReactionResponse extends UserReaction, BaseSchema {
    username: string | number
}