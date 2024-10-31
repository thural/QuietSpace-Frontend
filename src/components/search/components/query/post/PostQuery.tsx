import { Post } from "@/api/schemas/inferred/post";
import PostCard from "@/components/feed/components/post/card/PostCard";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import Typography from "@components/shared/Typography";
import { PostQueryProps } from "./types/postQueryTypes";


const PostQuery: React.FC<PostQueryProps> = ({ fetchPostQuery, postQueryList }) => (
    fetchPostQuery.isPending ? <FullLoadingOverlay />
        : fetchPostQuery.isError ? <Typography type="h1">{fetchPostQuery.error.message}</Typography>
            : postQueryList?.map((post: Post, index: number) => <PostCard key={index} post={post} />)
)

export default PostQuery