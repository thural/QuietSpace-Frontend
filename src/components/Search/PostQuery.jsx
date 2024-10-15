import Post from "@components/Posts/Post";
import FullLoadingOverlay from "@shared/FullLoadingOverlay";
import Typography from "@shared/Typography";

const PostQuery = ({ fetchPostQuery, postQueryResult }) => (
    fetchPostQuery.isPending ? <FullLoadingOverlay />
        : fetchPostQuery.isError ? <Typography type="h1">{fetchPostQuery.error.message}</Typography>
            : postQueryResult?.map((post, index) => <Post key={index} post={post} />)
)

export default PostQuery