import { PostResponse } from "@/api/schemas/inferred/post";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import useStyles from "@/styles/feed/poststatStyles";
import { parseCount } from "@/utils/stringUtils";

interface PostStatsProps {
    post: PostResponse
    commentCount: number
}

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

export default PostStats