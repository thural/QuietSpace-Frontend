import { LoadingOverlay } from "@mantine/core";
import Post from "../Posts/Post";

const PostQuery = ({ fetchPostQuery, postQueryResult }) => {

    if (fetchPostQuery.isPending)
        return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    else if (fetchPostQuery.isError) return <h1>{fetchPostQuery.error.message}</h1>;
    return postQueryResult?.map((post, index) => (<Post key={index} post={post} />));
}

export default PostQuery