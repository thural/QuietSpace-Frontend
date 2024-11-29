import { PostResponse } from "@/api/schemas/inferred/post";
import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import Typography from "@/components/shared/Typography";
import { ConsumerFn } from "@/types/genericTypes";
import PollBox from "../poll/Poll";
import PhotoDisplay from "@/components/shared/PhotoDisplay";

interface PostContentProps {
    handleContentClick: ConsumerFn
    post: PostResponse
}

const PostContent: React.FC<PostContentProps> = ({ handleContentClick, post }) => {

    return (
        <BoxStyled onClick={handleContentClick}>
            <Typography>{post.text}</Typography>
            <Conditional isEnabled={!!post.photo}>
                <PhotoDisplay photoResponse={post.photo} />
            </Conditional>
            <Conditional isEnabled={!!post.poll}>
                <PollBox postId={post.id} pollData={post.poll} />
            </Conditional>
        </BoxStyled>
    )
};

export default PostContent