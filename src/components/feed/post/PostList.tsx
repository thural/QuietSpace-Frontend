import { PostResponse } from "@/api/schemas/inferred/post";
import PostSkeleton from "@/components/shared/PostSkeleton";
import usePlaceholderCount from "@/services/hook/shared/usePlaceholderCount";
import { useIsFetching } from "@tanstack/react-query";
import RepostCard from "../repost/RepostCard";
import PostCard from "./PostCard";
import { useMemo } from "react";

interface PostListBoxProps {
    posts: Array<PostResponse>,
    isLoading: boolean
}

const PostListBox: React.FC<PostListBoxProps> = ({ posts, isLoading }) => {

    const isFetchingPosts = useIsFetching({ queryKey: ['posts'] });

    const placeholderHeight = 75;
    const placeholders = usePlaceholderCount(placeholderHeight);
    const postSkeletons = useMemo(() => Array.from({ length: placeholders })
        .map((_, index) => (<PostSkeleton key={index} />)), [isFetchingPosts, isLoading, placeholders]);

    if (isLoading || isFetchingPosts > 0) {
        return postSkeletons;
    };

    return posts.map((post, index) => {
        if (!post.repostId) return <PostCard key={index} post={post} />;
        return <RepostCard post={post} key={index} />;
    });
};

export default PostListBox;