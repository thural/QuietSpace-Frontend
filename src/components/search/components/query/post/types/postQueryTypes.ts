import { PostList, PostPage } from "@/api/schemas/inferred/post"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseMutationResult } from "@tanstack/react-query"

export interface PostQueryProps extends GenericWrapper {
    postQueryList: PostList
    fetchPostQuery: UseMutationResult<PostPage, Error, string>
}