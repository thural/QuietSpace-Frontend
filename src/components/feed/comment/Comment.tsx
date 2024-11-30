import { CommentResponse } from "@/api/schemas/inferred/comment";
import Overlay from "@/components/shared/Overlay";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import useComment from "@/services/hook/feed/useComment";
import styles from "@/styles/feed/commentStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import BoxStyled from "@components/shared/BoxStyled";
import EmojiText from "@components/shared/EmojiText";
import FlexStyled from "@components/shared/FlexStyled";
import CreateCommentForm from "../form/CreateCommentForm";
import CommentControls from "./CommentControls";

interface CommentProps extends GenericWrapper {
    comment: CommentResponse
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


    const CommentBody: React.FC<{ comment: CommentResponse }> = ({ comment }) => (
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
                <UserAvatarPhoto size="2rem" userId={comment.userId} />
                <CommentBody comment={comment} />
            </FlexStyled>
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </BoxStyled>
    );
};

export default CommentBox