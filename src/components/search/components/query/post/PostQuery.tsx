import { PagedPostresponse, PostListResponse, PostSchema } from "@/api/schemas/post";
import Post from "@/components/feed/components/post/Post";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import Typography from "@components/shared/Typography";
import { UseMutationResult } from "@tanstack/react-query";

interface PostQueryProps extends GenericWrapper {
    postQueryList: PostListResponse
    fetchPostQuery: UseMutationResult<PagedPostresponse, Error, string>
}

const PostQuery: React.FC<PostQueryProps> = ({ fetchPostQuery, postQueryList }) => (
    fetchPostQuery.isPending ? <FullLoadingOverlay />
        : fetchPostQuery.isError ? <Typography type="h1">{fetchPostQuery.error.message}</Typography>
            : postQueryList?.map((post: PostSchema, index: number) => <Post key={index} post={post} />)
)

export default PostQuery