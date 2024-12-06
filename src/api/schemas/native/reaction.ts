import { ContentType } from "../inferred/reaction"
import { BaseSchema } from "./common"

export enum Reactiontype {
    LIKE = "LIKE",
    DISLIKE = "DISLIKE"
}

export interface UserReaction {
    userId: string | number
    contentId: string | number
    reactionType: Reactiontype
    contentType: ContentType
}

export interface UserReactionResponse extends UserReaction, BaseSchema {
    username: string | number
}