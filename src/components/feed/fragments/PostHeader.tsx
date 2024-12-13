import { PostResponse } from "@/api/schemas/inferred/post";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import UserCard from "@/components/shared/UserCard";
import { GenericWrapper } from "@/types/sharedComponentTypes";

/**
 * Props for the PostHeader component.
 * 
 * @interface PostHeadlineProps
 * @extends GenericWrapper
 * @property {PostResponse} post - The post data object containing the post's details.
 */
interface PostHeadlineProps extends GenericWrapper {
    post: PostResponse;
}

/**
 * PostHeader component.
 * 
 * This component displays the header of a post, including the user's card and the post's title.
 * It also allows additional elements to be passed as children, which will be displayed alongside
 * the header content. The header click event is propagated to prevent any parent handlers from 
 * executing.
 * 
 * @param {PostHeadlineProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostHeader component.
 */
const PostHeader: React.FC<PostHeadlineProps> = ({ post, children }) => {
    return (
        <FlexStyled onClick={(e: MouseEvent) => e.stopPropagation()}>
            <UserCard userId={post.userId}>
                <Typography type="h5">{post.title}</Typography>
            </UserCard>
            {children}
        </FlexStyled>
    );
};

export default PostHeader;