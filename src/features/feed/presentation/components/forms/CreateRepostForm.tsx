import { PostResponse } from "@/api/schemas/inferred/post";
import FormStyled from "@/shared/FormStyled";
import ModalStyled from "@/shared/ModalStyled";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import useCreateRepostForm from "@/services/hook/feed/useCreateRepostForm";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import FormControls from "../fragments/FormControls";
import TextInput from "../fragments/TextInput";
import PostCardBase from "../../../post/PostCardBase";

/**
 * Props for the CreateRepostForm component.
 * 
 * @interface CreateRepostProps
 * @extends GenericWrapper
 * @property {ConsumerFn} toggleForm - Function to toggle the visibility of the form.
 * @property {PostResponse} post - The original post being reposted.
 */
interface CreateRepostProps extends GenericWrapper {
    toggleForm: ConsumerFn;
    post: PostResponse;
}

/**
 * CreateRepostForm component.
 * 
 * This component provides a form for users to create a repost of an existing post.
 * It includes a textarea for the user's comments and displays the original post.
 * The component manages user input and submits the repost upon completion.
 * 
 * @param {CreateRepostProps} props - The component props.
 * @returns {JSX.Element} - The rendered CreateRepostForm component.
 */
const CreateRepostForm: React.FC<CreateRepostProps> = ({ toggleForm, post }) => {
    const {
        signedUser,
        repostData,
        addRepost,
        handleChange,
        handleSubmit,
    } = useCreateRepostForm(toggleForm, post);

    return (
        <ModalStyled onClick={(e: Event) => e.stopPropagation()}>
            <FormStyled>
                <UserAvatarPhoto userId={signedUser.id} />
                <TextInput minHeight="3rem" value={repostData.text} handleChange={handleChange} />
            </FormStyled>
            <PostCardBase post={post} />
            <FormControls isLoading={addRepost.isPending} isDisabled={!repostData.text} handleSubmit={handleSubmit} />
        </ModalStyled>
    );
};

export default CreateRepostForm;