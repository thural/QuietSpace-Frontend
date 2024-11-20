import { Comment } from "@/api/schemas/inferred/comment";
import Overlay from "@/components/shared/Overlay";
import useComment from "@/services/hook/feed/useComment";
import styles from "@/styles/feed/commentStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { toUpperFirstChar } from "@/utils/stringUtils";
import BoxStyled from "@components/shared/BoxStyled";
import EmojiText from "@components/shared/EmojiText";
import FlexStyled from "@components/shared/FlexStyled";
import UserAvatar from "@components/shared/UserAvatar";
import CreateCommentForm from "../form/CreateCommentForm";
import CommentControls from "./CommentControls";

interface CommentProps extends GenericWrapper {
    comment: Comment
}

const CommentBox: React.FC<CommentProps> = ({ comment }) => {

    const classes = styles();

    const {
        user,
        commentFormView,
        handleDeleteComment,
        handleLikeToggle,
        toggleCommentForm,
        isLiked,
    } = useComment(comment);


    const CommentBody: React.FC<{ comment: Comment }> = ({ comment }) => (
        <FlexStyled className={classes.commentElement}>
            <BoxStyled key={comment.id} className={classes.textBody}>
                <EmojiText text={comment.text} />
            </BoxStyled>
            <CommentControls
                isOwner={comment.userId === user.id}
                isLiked={isLiked}
                handleLike={handleLikeToggle}
                handleReply={toggleCommentForm}
                hanldeDelete={handleDeleteComment}
            />
        </FlexStyled>
    );

    return (
        <BoxStyled className={classes.commentWrapper}>
            <FlexStyled className={classes.mainElement}>
                <UserAvatar size="1.75rem" chars={toUpperFirstChar(comment.username)} />
                <CommentBody comment={comment} />
            </FlexStyled>
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </BoxStyled>
    );
};

export default CommentBox