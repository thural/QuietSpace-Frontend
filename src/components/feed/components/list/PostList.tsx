import PostCard from "../post/card/PostCard";
import { UseQueryResult } from "@tanstack/react-query";
import { PagedPostresponse } from "@/api/schemas/native/post";
import RepostCard from "../repost/RepostCard";

const PostListBox = ({ posts }: { posts: UseQueryResult<PagedPostresponse> }) => {
    if (posts.isLoading || !posts.data) return null;
    return posts.data.content?.map((post, index) => {
        if (post.repostId === null) return <PostCard key={index} postId={post.id} />;
        return <RepostCard postId={post.id} text={post.repostText} />
    });
};

export default PostListBox