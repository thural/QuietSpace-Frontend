import Post from "../post/Post";

const PostList = ({ posts }) => {
    if (posts.isLoading) return null;
    return posts?.data.content?.map((post, index) => <Post key={index} post={post} />);
};

export default PostList