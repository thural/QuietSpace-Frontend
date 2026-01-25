import useStyles from "../../styles/commentControlStyles";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { Container } from "@/shared/ui/components/layout/Container";
import Conditional from "@/shared/Conditional";
import Typography from "@/shared/Typography";

/**
 * Props for the CommentControls component.
 *
 * @interface CommentControlsProps
 * @property {boolean} isOwner - Indicates if the user is the owner of the comment.
 * @property {boolean} isLiked - Indicates if the comment is liked by the user.
 * @property {ConsumerFn} handleLike - Callback function for liking/unliking the comment.
 * @property {ConsumerFn} handleReply - Callback function for replying to the comment.
 * @property {ConsumerFn} hanldeDelete - Callback function for deleting the comment.
 */
interface CommentControlsProps {
    isOwner: boolean;
    isLiked: boolean;
    handleLike: ConsumerFn;
    handleReply: ConsumerFn;
    hanldeDelete: ConsumerFn;
}

/**
 * CommentControls component that provides options for interacting with a comment.
 *
 * @param {CommentControlsProps} props - The props for the CommentControls component.
 * @returns {JSX.Element} - The rendered comment controls component.
 */
const CommentControls: React.FC<CommentControlsProps> = ({
    isOwner,
    isLiked,
    handleLike,
    handleReply,
    hanldeDelete
}) => {
    const classes = useStyles();

    return (
        <Container className={classes.commentOptions}>
            <Typography className="comment-like" onClick={handleLike}>
                {isLiked ? "unlike" : "like"}
            </Typography>
            <Typography onClick={handleReply}>reply</Typography>
            <Conditional isEnabled={isOwner}>
                <Typography onClick={hanldeDelete}>
                    delete
                </Typography>
            </Conditional>
        </Container>
    );
};

export default CommentControls;