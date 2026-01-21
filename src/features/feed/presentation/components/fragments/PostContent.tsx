import { PostResponse } from "@/features/feed/data/models/post";
import BoxStyled from "@/shared/BoxStyled";
import Conditional from "@/shared/Conditional";
import Typography from "@/shared/Typography";
import { ConsumerFn } from "@/shared/types/genericTypes";
import PollBox from "../poll/Poll";
import PhotoDisplay from "@/shared/PhotoDisplay";

/**
 * Props for the PostContent component.
 * 
 * @interface PostContentProps
 * @property {ConsumerFn} handleContentClick - Function to handle clicks on the post content.
 * @property {PostResponse} post - The post data object containing the post's content and metadata.
 */
interface PostContentProps {
    handleContentClick: ConsumerFn;
    post: PostResponse;
}

/**
 * PostContent component.
 * 
 * This component displays the content of a post, including the text, any associated photos,
 * and polls. It triggers a specified function when the content is clicked. Conditional rendering
 * is used to display the photo and poll only if they exist in the post data.
 * 
 * @param {PostContentProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostContent component.
 */
const PostContent: React.FC<PostContentProps> = ({ handleContentClick, post }) => {
    return (
        <BoxStyled onClick={handleContentClick}>
            <Typography style={{ margin: "1rem 0" }}>{post.text}</Typography>
            <Conditional isEnabled={!!post.photo}>
                <PhotoDisplay photoResponse={post.photo} />
            </Conditional>
            <Conditional isEnabled={!!post.poll}>
                <PollBox postId={post.id} pollData={post.poll} />
            </Conditional>
        </BoxStyled>
    );
};

export default PostContent;