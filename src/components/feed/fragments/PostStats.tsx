import { Post } from "@/api/schemas/inferred/post";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import { parseCount } from "@/utils/stringUtils";

interface PostStatsProps {
    post: Post
    commentCount: number
}

const style = {
    opacity: '0.7',
    marginLeft: "auto",
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    fontSize: '14px',
}

const PostStats: React.FC<PostStatsProps> = ({ post, commentCount }) => {
    const { likeCount, dislikeCount } = post;
    return (
        <FlexStyled style={style}>
            {likeCount > 0 && <Typography size="0.85rem">{parseCount(likeCount)} likes</Typography>}
            {dislikeCount > 0 && <Typography size="0.85rem">{parseCount(dislikeCount)} dislikes</Typography>}
            {commentCount > 0 && <Typography size="0.85rem">{parseCount(commentCount)} comments</Typography>}
        </FlexStyled>
    );
}

export default PostStats