import DefaultContainer from "@/components/shared/DefaultContainer";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { useParams } from "react-router-dom";
import CommentPanel from "./comment/CommentPanel";
import PostCard from "./post/PostCard";

const PostContainer: React.FC<GenericWrapper> = () => {

    const { postId } = useParams();

    console.log("postId", postId);

    return (
        <DefaultContainer>
            <PostCard postId={postId}>
                <CommentPanel postId={postId} />
            </PostCard>
        </DefaultContainer>
    );
}

export default withErrorBoundary(PostContainer);