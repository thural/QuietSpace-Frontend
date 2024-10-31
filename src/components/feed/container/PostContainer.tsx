import DefaultContainer from "@/components/shared/DefaultContainer";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import PostBox from "../components/post/PostBox";

const PostContainer: React.FC<GenericWrapper> = () => {

    return (
        <DefaultContainer>
            <PostBox />
        </DefaultContainer>
    );
}

export default withErrorBoundary(PostContainer);