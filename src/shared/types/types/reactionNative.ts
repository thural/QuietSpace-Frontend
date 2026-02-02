import { ContentType } from "@/shared/api/models/commonNative"
import { BaseSchema } from "@/shared/api/models/commonNative"

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