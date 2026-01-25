import { PostResponse } from "@/features/feed/data/models/post";
import { PostStats as PostStatsStyled } from "../../styles/poststatStyles";
import { parseCount } from "@/shared/utils/stringUtils";

/**
 * Props for the PostStats component.
 * 
 * @interface PostStatsProps
 * @property {PostResponse} post - The post data object containing statistics about the post.
 * @property {number} commentCount - The total number of comments on the post.
 */
interface PostStatsProps {
    post: PostResponse;
    commentCount: number;
}

/**
 * PostStats component.
 * 
 * This component displays the statistical information of a post, including the number of likes,
 * dislikes, and comments. It conditionally renders each statistic only if the count is greater than zero.
 * 
 * @param {PostStatsProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostStats component.
 */
const PostStats: React.FC<PostStatsProps> = ({ post, commentCount }) => {
    const { likeCount, dislikeCount } = post;

    return (
        <PostStatsStyled>
            {likeCount > 0 && <span>{parseCount(likeCount)} likes</span>}
            {dislikeCount > 0 && <span>{parseCount(dislikeCount)} dislikes</span>}
            {commentCount > 0 && <span>{parseCount(commentCount)} comments</span>}
        </PostStatsStyled>
    );
}

export default PostStats;