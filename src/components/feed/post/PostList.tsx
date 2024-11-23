import PostCard from "./PostCard";
import { InfiniteData, InfiniteQueryObserverSuccessResult, UseQueryResult } from "@tanstack/react-query";
import { PagedPostresponse } from "@/api/schemas/native/post";
import RepostCard from "../repost/RepostCard";
import LoaderStyled from "@/components/shared/LoaderStyled";

const PostListBox = ({ posts }: { posts: InfiniteQueryObserverSuccessResult<InfiniteData<PagedPostresponse>> }) => {
    if (posts.isLoading || !posts.data) return <LoaderStyled />;
    return posts.data.pages[0].content?.map((post, index) => {
        if (post.repostId === null) return <PostCard isPostsLoading={posts.isLoading} key={index} postId={post.id} />;
        return <RepostCard isPostsLoading={posts.isLoading} post={post} key={index} />
    });
};

export default PostListBox