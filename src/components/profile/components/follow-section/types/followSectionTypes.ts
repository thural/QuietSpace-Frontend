import { ProcedureFn } from "@/types/genericTypes"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseQueryResult } from "@tanstack/react-query"
import { PostPage } from "@/api/schemas/inferred/post"
import { UserPage } from "@/api/schemas/inferred/user"

export interface FollowSectionProps extends GenericWrapper {
    posts: UseQueryResult<PostPage>
    followings: UseQueryResult<UserPage>
    followers: UseQueryResult<UserPage>
    toggleFollowings: ProcedureFn
    toggleFollowers: ProcedureFn
}