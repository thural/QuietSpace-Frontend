import { Post } from "@/api/schemas/inferred/post";
import LoaderStyled from "@/components/shared/LoaderStyled";
import RepostCard from "../repost/RepostCard";
import PostCard from "./PostCard";

interface PostListBoxProps {
    posts: Array<Post>,
    isLoading: boolean
}

const PostListBox: React.FC<PostListBoxProps> = ({ posts, isLoading }) => {
    if (isLoading) return <LoaderStyled />;

    return posts.map((post, index) => {
        if (post.repostId === null) return <PostCard isPostsLoading={isLoading} key={index} postId={post.id} />;
        return <RepostCard isPostsLoading={isLoading} post={post} key={index} />
    });
};

export default PostListBox;