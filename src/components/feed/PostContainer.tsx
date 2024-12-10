import DefaultContainer from "@/components/shared/DefaultContainer";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { useParams } from "react-router-dom";
import CommentPanel from "./comment/CommentPanel";
import PostLoader from "./post/PostLoader";
import { validateIsNotUndefined } from "@/utils/validations";

const PostContainer: React.FC<GenericWrapper> = () => {

    const { postId } = useParams();
    const { postId: validPostId } = validateIsNotUndefined({ postId });

    return (
        <DefaultContainer>
            <PostLoader postId={validPostId}>
                <CommentPanel postId={postId} />
            </PostLoader>
        </DefaultContainer>
    );
}

export default withErrorBoundary(PostContainer);