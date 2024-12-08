import { BaseSchema, ContentResponse, PagedResponse, ResId } from "./common"
import { ReactionType } from "./reaction"

export interface VoteBody {
    userId: ResId
    postId: ResId
    option: string
}

export interface PollOptionSchema {

    id: ResId
    label: string
    voteShare: string

}

type PollOptionList = ContentResponse<PollOptionSchema>

export interface PollSchema {

    id: ResId
    votedOption: string
    voteCount: number
    options: PollOptionList
    dueDate: string | null

}

export interface PollBody {
    dueDate: string | null
    options: Array<String>
}

export interface PostBody {
    text: string
    userId: ResId
    viewAccess: 'friends' | 'all' // TODO: check all available options
    poll: PollBody | null
}

export interface PostSchema extends BaseSchema {
    repostId: ResId
    repostText: string
    userId: ResId
    username: string
    title: string
    text: string
    poll: PollSchema
    likeCount: number
    dislikeCount: number
    commentCount: number
    userReaction: ReactionType
}

export type PostListResponse = ContentResponse<PostSchema>

export type PagedPostresponse = PagedResponse<PostSchema>

