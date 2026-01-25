import { CommentResponse } from "@/features/feed/data/models/comment";
import Overlay from "@/shared/Overlay";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import useComment from "@features/feed/application/hooks/useComment";
import { CommentWrapper, CommentElement, TextBody, MainElement } from "../../styles/commentStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import EmojiText from "@/shared/EmojiText";
import CreateCommentForm from "../forms/CreateCommentForm";
import CommentControls from "./CommentControls";

/**
 * Props for the CommentBox component, extending GenericWrapper.
 *
 * @interface CommentProps
 * @extends GenericWrapper
 * @property {CommentResponse} comment - The comment data to display.
 */
interface CommentProps extends GenericWrapper {
    comment: CommentResponse;
}

/**
 * CommentBox component that displays a comment with options to interact with it.
 *
 * @param {CommentProps} props - The props for the CommentBox component.
 * @returns {JSX.Element} - The rendered comment box component.
 */
const CommentBox: React.FC<CommentProps> = ({ comment }) => {
    const {
        user,
        commentFormView,
        handleDeleteComment,
        handleLikeToggle,
        toggleCommentForm,
        isLiked,
    } = useComment(comment);

    /**
     * CommentBody component that renders the body of the comment.
     *
     * @param {{ comment: CommentResponse }} props - The props for the CommentBody component.
     * @returns {JSX.Element} - The rendered comment body.
     */
    const CommentBody: React.FC<{ comment: CommentResponse }> = ({ comment }) => (
        <CommentElement>
            <TextBody key={comment.id}>
                <EmojiText text={comment.text} />
            </TextBody>
            <CommentControls
                isOwner={comment.userId === user.id}
                isLiked={isLiked}
                handleLike={handleLikeToggle}
                handleReply={toggleCommentForm}
                hanldeDelete={handleDeleteComment}
            />
        </CommentElement>
    );

    return (
        <CommentWrapper>
            <MainElement>
                <UserAvatarPhoto size="2rem" userId={comment.userId} />
                <CommentBody comment={comment} />
            </MainElement>
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </CommentWrapper>
    );
};

export default CommentBox;