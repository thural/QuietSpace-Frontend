import { Post } from "@/api/schemas/inferred/post";
import PostCard from "@/components/feed/components/post/card/PostCard";
import LoaderStyled from "@/components/shared/LoaderStyled";
import Typography from "@components/shared/Typography";
import { PostQueryProps } from "./types/postQueryTypes";


const PostQuery: React.FC<PostQueryProps> = ({ fetchPostQuery, postQueryList }) => (
    fetchPostQuery.isPending ? <LoaderStyled />
        : fetchPostQuery.isError ? <Typography type="h1">{fetchPostQuery.error.message}</Typography>
            : postQueryList?.map((post: Post, index: number) => <PostCard key={index} postId={post.id} />)
)

export default PostQuery