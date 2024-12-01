import useStyles from "@/styles/feed/commentControlStyles";
import { ConsumerFn } from "@/types/genericTypes";
import BoxStyled from "@components/shared/BoxStyled";
import Conditional from "@components/shared/Conditional";
import Typography from "@components/shared/Typography";


interface CommentControlsProps {
    isOwner: boolean,
    isLiked: boolean,
    handleLike: ConsumerFn,
    handleReply: ConsumerFn,
    hanldeDelete: ConsumerFn,
}

const CommentControls: React.FC<CommentControlsProps> = ({ isOwner, isLiked, handleLike, handleReply, hanldeDelete }) => {

    const classes = useStyles();

    return (
        <BoxStyled className={classes.commentOptions}>
            <Typography className="comment-like" onClick={handleLike}>{isLiked ? "unlike" : "like"}</Typography>
            <Typography className="comment-reply" onClick={handleReply}>reply</Typography>
            <Conditional isEnabled={isOwner}>
                <Typography className="comment-delete" onClick={hanldeDelete}>delete</Typography>
            </Conditional>
        </BoxStyled>
    )
};

export default CommentControls