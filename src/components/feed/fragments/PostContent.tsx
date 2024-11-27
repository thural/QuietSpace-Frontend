import { PostResponse } from "@/api/schemas/inferred/post";
import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import Typography from "@/components/shared/Typography";
import { ConsumerFn } from "@/types/genericTypes";
import PollBox from "../poll/Poll";

interface PostContentProps {
    handleContentClick: ConsumerFn
    post: PostResponse
}

const PostContent: React.FC<PostContentProps> = ({ handleContentClick, post }) => (
    <BoxStyled onClick={handleContentClick}>
        <Typography>{post.text}</Typography>
        <Conditional isEnabled={!!post.poll}>
            <PollBox postId={post.id} pollData={post.poll} />
        </Conditional>
    </BoxStyled>
);

export default PostContent