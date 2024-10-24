import { ContentResponse, PagedResponse, ResId } from "./common"
import { Reactiontype } from "./reaction"

export interface VoteBody {
    userId: ResId
    postId: ResId
    option: string
}

export interface PollOptionSchema {

    id: string | number
    label: string
    voteShare: string

}

type PollOptionList = ContentResponse<PollOptionSchema>

export interface PollSchema {

    id: string | number
    votedOption: string
    voteCount: number
    options: PollOptionList
    dueDate: string | null

}

export interface PostBody {
    text: string
    userId: ResId
    viewAccess: 'friends' | 'all' // TODO: check all available options
    poll: PollSchema | null
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

