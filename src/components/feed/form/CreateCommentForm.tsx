import { CommentResponse } from "@/api/schemas/inferred/comment";
import { PostResponse } from "@/api/schemas/inferred/post";
import ModalStyled from "@/components/shared/ModalStyled";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import useCreateCommentForm from "@/services/hook/feed/useCreateCommentForm";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import FormControls from "../fragments/FormControls";
import ReplyInput from "../fragments/ReplyInput";
import TruncatedContent from "../fragments/TruncatedContent";

interface CreateCommentFormProps extends GenericWrapper {
    postItem: PostResponse | CommentResponse
    isSecondaryMode?: boolean
}

const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ postItem, isSecondaryMode = false }) => {

    const useComment = useCreateCommentForm(postItem);
    const { addComment, commentData, authorId, handleSubmit } = useComment


    return (
        <>
            {
                isSecondaryMode ? <ReplyInput{...useComment} />
                    :
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
            }
        </>
    )
};

export default CreateCommentForm;