import Post from "../Posts/Post";
import FullLoadingOverlay from "../Shared/FillLoadingOverlay";

const PostQuery = ({ fetchPostQuery, postQueryResult }) => {

    if (fetchPostQuery.isPending) return <FullLoadingOverlay />;
    else if (fetchPostQuery.isError) return <h1>{fetchPostQuery.error.message}</h1>;
    return postQueryResult?.map((post, index) => (<Post key={index} post={post} />));
}

export default PostQuery