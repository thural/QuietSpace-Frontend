import { PagedPostresponse } from "@/api/schemas/inferred/post"
import { UserPage } from "@/api/schemas/inferred/user"
import { AnyFunction } from "@/types/genericTypes"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseQueryResult } from "@tanstack/react-query"

export interface FollowSectionProps extends GenericWrapper {
    followers: UseQueryResult<UserPage>
    followings: UseQueryResult<UserPage>
    toggleFollowings: AnyFunction
    toggleFollowers: AnyFunction
    posts: PagedPostresponse
}