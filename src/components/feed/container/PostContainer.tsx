import DefaultContainer from "@/components/shared/DefaultContainer";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import { useParams } from "react-router-dom";
import PostCard from "../components/post/card/PostCard";
import CommentPanel from "../components/comment/panel/CommentPanel";

const PostContainer: React.FC<GenericWrapper> = () => {

    const { postId } = useParams();


    return (
        <DefaultContainer>
            <PostCard postId={postId}>
                <CommentPanel postId={postId} />
            </PostCard>
        </DefaultContainer>
    );
}

export default withErrorBoundary(PostContainer);