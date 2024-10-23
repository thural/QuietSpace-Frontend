import { PagedPostresponse } from "@/api/schemas/post"
import { PagedUserResponse } from "@/api/schemas/user"
import { AnyFunction } from "@/types/genericTypes"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseQueryResult } from "@tanstack/react-query"

export interface FollowSectionProps extends GenericWrapper {
    followers: UseQueryResult<PagedUserResponse>
    followings: UseQueryResult<PagedUserResponse>
    toggleFollowings: AnyFunction
    toggleFollowers: AnyFunction
    posts: PagedPostresponse
}