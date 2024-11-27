import { CommentResponse } from "@/api/schemas/inferred/comment";
import { PostResponse } from "@/api/schemas/inferred/post";
import FlexStyled from "@/components/shared/FlexStyled";
import ModalStyled from "@/components/shared/ModalStyled";
import UserAvatar from "@/components/shared/UserAvatar";
import useCreateCommentForm from "@/services/hook/feed/useCreateCommentForm";
import styles from "@/styles/feed/commentFormStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { Text } from "@mantine/core";
import ReplyInput from "../fragments/ReplyInput";
import FormControls from "../fragments/FormControls";

interface CreateCommentFormProps extends GenericWrapper {
    postItem: PostResponse | CommentResponse
    isSecondaryMode?: boolean
}

const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ postItem, isSecondaryMode = false }) => {

    const classes = styles();

    const {
        inputRef,
        addComment,
        commentData,
        handleChange,
        handleSubmit,
        userAvatarPlaceholder,
        authorAvatarPlaceholder,
    } = useCreateCommentForm(postItem);



    const replyInputProps = {
        inputRef,
        handleChange,
        handleSubmit,
        avatarPlaceholder: userAvatarPlaceholder,
        inputValue: commentData.text
    };


    return (
        <>
            {
                isSecondaryMode ? <ReplyInput{...replyInputProps} />
                    :
                    <ModalStyled onClick={(e: Event) => e.stopPropagation()}>
                        <FlexStyled className={classes.card}>
                            <UserAvatar radius="10rem" chars={authorAvatarPlaceholder} />
                            <Text className={classes.content} truncate="end">{postItem.text}</Text>
                        </FlexStyled>
                        <ReplyInput {...replyInputProps} />
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