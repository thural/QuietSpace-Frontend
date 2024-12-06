import { ResId } from "@/api/schemas/native/common";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import PostSkeleton from "@/components/shared/PostSkeleton";
import { useGetPostById } from "@/services/data/usePostData";
import PostCard from "./PostCard";
import { GenericWrapper } from "@/types/sharedComponentTypes";

export interface PostLoaderProps extends GenericWrapper {
    postId: ResId
}

export const PostLoader: React.FC<PostLoaderProps> = ({ postId, children }) => {

    const { data: post, isLoading, isError, error } = useGetPostById(postId);
    if (post === undefined || isLoading) return <PostSkeleton />;
    if (isError) return <ErrorComponent message={error.message} />;
    return <PostCard post={post}>{children}</PostCard>

}

export default PostLoader