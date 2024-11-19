import { Post, PostList, PostPage } from "@/api/schemas/inferred/post";
import PostCard from "@/components/feed/post/PostCard";
import LoaderStyled from "@/components/shared/LoaderStyled";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import Typography from "@components/shared/Typography";
import { UseMutationResult } from "@tanstack/react-query";

export interface PostQueryProps extends GenericWrapper {
    postQueryList: PostList
    fetchPostQuery: UseMutationResult<PostPage, Error, string>
}

const PostQuery: React.FC<PostQueryProps> = ({ fetchPostQuery, postQueryList }) => (
    fetchPostQuery.isPending ? <LoaderStyled />
        : fetchPostQuery.isError ? <Typography type="h1">{fetchPostQuery.error.message}</Typography>
            : postQueryList?.map((post: Post, index: number) => <PostCard key={index} postId={post.id} />)
)

export default PostQuery