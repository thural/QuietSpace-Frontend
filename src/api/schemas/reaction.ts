export enum Reactiontype {
    LIKE,
    DISLIKE
}

export interface UserReaction {
    id: string | number
    userId: string | number
    contentId: string | number
    username: string | number
    reactionType: Reactiontype
    updateDate: Date | null
}