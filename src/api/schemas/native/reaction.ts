import { ContentType } from "@/utils/enumClasses"

export enum Reactiontype {
    LIKE,
    DISLIKE
}

export interface UserReaction {
    userId: string | number
    contentId: string | number
    reactionType: Reactiontype
    contentType: ContentType
}

export interface UserReactionResponse extends UserReaction {
    id: string | number
    username: string | number
    updateDate: Date | null
}