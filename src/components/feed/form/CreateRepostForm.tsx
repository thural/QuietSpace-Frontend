import { Post } from "@/api/schemas/inferred/post";
import FormStyled from "@/components/shared/FormStyled";
import ModalStyled from "@/components/shared/ModalStyled";
import UserAvatar from "@/components/shared/UserAvatar";
import useCreateRepostForm from "@/services/hook/feed/useCreateRepostForm";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import FormControls from "../fragments/FormControls";
import TextInput from "../fragments/TextInput";
import PostCardBase from "../post/PostCardBase";


interface CreateRepostProps extends GenericWrapper {
    toggleForm: ConsumerFn
    post: Post
}

const CreateRepostForm: React.FC<CreateRepostProps> = ({ toggleForm, post }) => {

    const {
        avatarPlaceholder,
        repostData,
        addRepost,
        handleChange,
        handleSubmit,
    } = useCreateRepostForm(toggleForm, post);

    return (
        <ModalStyled onClick={(e: Event) => e.stopPropagation()}>
            <FormStyled>
                <UserAvatar radius="10rem" chars={avatarPlaceholder} />
                <TextInput minHeight="3rem" value={repostData.text} handleChange={handleChange} />
            </FormStyled>
            <PostCardBase post={post} />
            <FormControls isLoading={addRepost.isPending} isDisabled={!repostData.text} handleSubmit={handleSubmit} />
        </ModalStyled>
    );
};

export default CreateRepostForm;