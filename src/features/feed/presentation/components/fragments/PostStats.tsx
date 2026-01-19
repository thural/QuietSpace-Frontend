import { PostResponse } from "@/api/schemas/inferred/post";
import FlexStyled from "@/shared/FlexStyled";
import Typography from "@/shared/Typography";
import useStyles from "../../styles/poststatStyles";
import { parseCount } from "@/utils/stringUtils";

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
    const classes = useStyles();
    const { likeCount, dislikeCount } = post;

    return (
        <FlexStyled className={classes.postStats}>
            {likeCount > 0 && <Typography size="0.85rem">{parseCount(likeCount)} likes</Typography>}
            {dislikeCount > 0 && <Typography size="0.85rem">{parseCount(dislikeCount)} dislikes</Typography>}
            {commentCount > 0 && <Typography size="0.85rem">{parseCount(commentCount)} comments</Typography>}
        </FlexStyled>
    );
}

export default PostStats;