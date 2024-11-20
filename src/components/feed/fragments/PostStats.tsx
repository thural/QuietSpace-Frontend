import { Post } from "@/api/schemas/inferred/post";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import { parseCount } from "@/utils/stringUtils";
import { createUseStyles } from "react-jss";

interface PostStatsProps {
    post: Post
    commentCount: number
}

const useStyles = createUseStyles({
    postStats: {
        opacity: '0.7',
        marginLeft: "auto",
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        fontSize: '14px',
    }
})

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