import BoxStyled from "@shared/BoxStyled";
import EmojiText from "@shared/EmojiText";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import styles from "./styles/commenReplytStyles";
import useRepliedComment from "./hooks/useRepliedComment";

const CommentReply = ({ comment, repliedComment }) => {
    const classes = styles();
    const { user, handleDeleteComment, handleReaction } = useRepliedComment(comment);

    const appliedStyle = {
        borderRadius: '1rem 0rem 1rem 1rem',
        marginLeft: 'auto'
    };

    const CommentBody = () => (
        <BoxStyled key={comment.id} className={classes.comment} style={appliedStyle}>
            <FlexStyled className={classes.replyCard}>
                <BoxStyled className="reply-card-indicator"></BoxStyled>
                <Typography className="reply-card-text" lineClamp={1}>{repliedComment.text}</Typography>
            </FlexStyled>
            <EmojiText text={comment.text} />
        </BoxStyled>
    );

    return (
        <FlexStyled className={classes.wrapper}>
            <CommentBody />
            <UserAvatar chars={toUpperFirstChar(user.username)} />
        </FlexStyled>
    );
};

export default CommentReply;