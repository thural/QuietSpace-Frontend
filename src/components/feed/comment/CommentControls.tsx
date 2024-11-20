import { ConsumerFn } from "@/types/genericTypes";
import BoxStyled from "@components/shared/BoxStyled";
import Conditional from "@components/shared/Conditional";
import Typography from "@components/shared/Typography";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({

    commentOptions: {
        width: '100%',
        justifyContent: 'flex-start',
        gap: '10px',
        color: '#303030',
        display: 'flex',
        flexFlow: 'row nowrap',
        fontSize: '.8rem',
        fontWeight: '500',
        '& > *': {
            cursor: 'pointer',
        },
        '& p': {
            margin: '0',
            fontSize: '.8rem',
            color: '#4d4d4d'
        }
    },
})

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