import { Comment } from "@/api/schemas/inferred/comment";
import { Post } from "@/api/schemas/inferred/post";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import EmojiInput from "@/components/shared/EmojiInput";
import FlexStyled from "@/components/shared/FlexStyled";
import FormStyled from "@/components/shared/FormStyled";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import UserAvatar from "@/components/shared/UserAvatar";
import { Text } from "@mantine/core";
import useCreateCommentForm from "./hooks/useCreateCommentForm";
import styles from "./styles/createPostStyles";

interface CreateCommentFormProps extends GenericWrapper {
    postItem: Post | Comment
}

const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ postItem }) => {

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



    const ControlSection = () => (
        <FlexStyled className="control-area">
            <DarkButton name="post" loading={addComment.isPending} onClick={handleSubmit} />
        </FlexStyled>
    );



    return (
        <FlexStyled className={classes.wrapper} onClick={(e: Event) => e.stopPropagation()}>
            <FlexStyled className={classes.postCard}>
                <UserAvatar radius="10rem" chars={authorAvatarPlaceholder} />
                <Text className={classes.postContent} truncate="end">{postItem.text}</Text>
            </FlexStyled>
            <FlexStyled>
                <UserAvatar radius="10rem" chars={userAvatarPlaceholder} />
                <FormStyled>
                    <EmojiInput
                        className={classes.commentInput}
                        value={commentData.text}
                        onChange={handleChange}
                        cleanOnEnter
                        buttonElement
                        onEnter={handleSubmit}
                        placeholder="type a comment"
                        inputRef={inputRef}
                    />
                    <ControlSection />
                </FormStyled>
            </FlexStyled>
        </FlexStyled>
    );
};

export default CreateCommentForm;