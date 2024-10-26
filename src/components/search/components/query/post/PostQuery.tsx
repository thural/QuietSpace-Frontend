import { PagedPostresponse, PostList, PostSchema } from "@/api/schemas/inferred/post";
import PostBox from "@/components/feed/components/post/PostBox";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import Typography from "@components/shared/Typography";
import { UseMutationResult } from "@tanstack/react-query";

interface PostQueryProps extends GenericWrapper {
    postQueryList: PostList
    fetchPostQuery: UseMutationResult<PagedPostresponse, Error, string>
}

const PostQuery: React.FC<PostQueryProps> = ({ fetchPostQuery, postQueryList }) => (
    fetchPostQuery.isPending ? <FullLoadingOverlay />
        : fetchPostQuery.isError ? <Typography type="h1">{fetchPostQuery.error.message}</Typography>
            : postQueryList?.map((post: PostSchema, index: number) => <PostBox key={index} post={post} />)
)

export default PostQuery