import DefaultContainer from "@/components/shared/DefaultContainer";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { assertNullisValues } from "@/utils/errorUtils";
import { useParams } from "react-router-dom";
import CommentPanel from "./comment/CommentPanel";
import PostLoader from "./post/PostLoader";

const PostContainer: React.FC<GenericWrapper> = () => {

    const { postId } = useParams();
    if (postId === undefined) throw assertNullisValues({ postId });

    return (
        <DefaultContainer>
            <PostLoader postId={postId}>
                <CommentPanel postId={postId} />
            </PostLoader>
        </DefaultContainer>
    );
}

export default withErrorBoundary(PostContainer);