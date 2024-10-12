import React from "react";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "../Shared/BoxStyled";
import EmojiText from "../Shared/EmojiText";
import FlexStyled from "../Shared/FlexStyled";
import Typography from "../Shared/Typography";
import UserAvatar from "../Shared/UserAvatar";
import useRepliedComment from "./hooks/useRepliedComment";
import styles from "./styles/repliedCommentStyles";

const RepliedComment = ({ comment, repliedComment }) => {
    const classes = styles();
    const { user, handleDeleteComment, handleReaction } = useRepliedComment(comment);

    const appliedStyle = {
        borderRadius: '1rem 0rem 1rem 1rem',
        marginLeft: 'auto'
    };

    const CommentBody = () => (
        <BoxStyled key={comment.id} className={classes.comment} style={appliedStyle}>
            <FlexStyled className={classes.replyCard}>
                <div className="reply-card-indicator"></div>
                <Typography className="reply-card-text" lineClamp={1}>{repliedComment.text}</Typography>
            </FlexStyled>
            <EmojiText text={comment.text} />
        </BoxStyled>
    );

    return (
        <FlexStyled className={classes.container}>
            <CommentBody />
            <UserAvatar chars={toUpperFirstChar(user.username)} />
        </FlexStyled>
    );
};

export default RepliedComment;