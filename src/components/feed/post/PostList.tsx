import PostCard from "./PostCard";
import { UseQueryResult } from "@tanstack/react-query";
import { PagedPostresponse } from "@/api/schemas/native/post";
import RepostCard from "../repost/RepostCard";
import LoaderStyled from "@/components/shared/LoaderStyled";

const PostListBox = ({ posts }: { posts: UseQueryResult<PagedPostresponse> }) => {
    if (posts.isLoading || !posts.data) return <LoaderStyled />;
    return posts.data.content?.map((post, index) => {
        if (post.repostId === null) return <PostCard isPostsLoading={posts.isLoading} key={index} postId={post.id} />;
        return <RepostCard isPostsLoading={posts.isLoading} post={post} key={index} />
    });
};

export default PostListBox