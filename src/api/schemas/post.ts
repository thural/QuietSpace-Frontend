import { ContentResponse, PagedResponse } from "./common"
import { Reactiontype } from "./reaction"

interface PollOptionSchema {

    id: string | number
    label: string
    voteShare: string

}

type PollOptionList = ContentResponse<PollOptionSchema>

interface PollSchema {

    id: string | number
    votedOption: string
    voteCount: number
    options: PollOptionList
    dueDate: Date | null

}

export interface PostSchema {
    id: string | number
    userId: string | number
    username: string
    title: string
    text: string
    poll: PollSchema
    likeCount: number
    dislikeCount: number
    commentCount: number
    userReaction: Reactiontype
    createDate: Date | null
    updateDate: Date | null
}

export type PostListResponse = ContentResponse<PostSchema>

export type PagedPostresponse = PagedResponse<PostSchema>

