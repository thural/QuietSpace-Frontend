import { CommentResponse } from "@/features/feed/data/models/comment";
import { PostResponse } from "@/features/feed/data/models/post";
import ModalStyled from "@/shared/ModalStyled";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import useCreateCommentForm from "@features/feed/application/hooks/useCreateCommentForm";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import FormControls from "../fragments/FormControls";
import ReplyInput from "../fragments/ReplyInput";
import TruncatedContent from "../fragments/TruncatedContent";

/**
 * Props for the CreateCommentForm component, extending GenericWrapper.
 *
 * @interface CreateCommentFormProps
 * @extends GenericWrapper
 * @property {PostResponse | CommentResponse} postItem - The post or comment item to which the comment is related.
 * @property {boolean} [isSecondaryMode] - Indicates if the form is in secondary mode for replies.
 * @property {ConsumerFn} [handleClose] - Function to handle closing the modal.
 */
interface CreateCommentFormProps extends GenericWrapper {
    postItem: PostResponse | CommentResponse;
    isSecondaryMode?: boolean;
    handleClose?: ConsumerFn;
}

/**
 * CreateCommentForm component that allows users to create comments on a post or reply to a comment.
 *
 * The component conditionally renders a reply input or a modal based on the `isSecondaryMode` prop.
 *
 * @param {CreateCommentFormProps} props - The props for the CreateCommentForm component.
 * @returns {JSX.Element} - The rendered create comment form component.
 */
const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ postItem, isSecondaryMode = false, handleClose }) => {
    const useComment = useCreateCommentForm(postItem, handleClose);
    const { addComment, commentData, authorId, handleSubmit } = useComment;

    return (
        <>
            {
                isSecondaryMode ? (
                    <ReplyInput {...useComment} />
                ) : (
                    <ModalStyled onClick={(e: Event) => e.stopPropagation()}>
                        <TruncatedContent
                            lineClamp={3}
                            text={postItem.text}
                            Avatar={<UserAvatarPhoto userId={authorId} />}
                        />
                        <ReplyInput {...useComment} />
                        <FormControls
                            isLoading={addComment.isPending}
                            isDisabled={!commentData.text}
                            handleSubmit={handleSubmit}
                        />
                    </ModalStyled>
                )
            }
        </>
    );
};

export default CreateCommentForm;