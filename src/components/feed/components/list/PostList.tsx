import PostCard from "../post/card/PostCard";
import { UseQueryResult } from "@tanstack/react-query";
import { PagedPostresponse } from "@/api/schemas/native/post";

const PostListBox = ({ posts }: { posts: UseQueryResult<PagedPostresponse> }) => {
    if (posts.isLoading || !posts.data) return null;
    return posts.data.content?.map((post, index) => <PostCard key={index} post={post} />);
};

export default PostListBox