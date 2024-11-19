import { Post } from "@/api/schemas/inferred/post";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import FlexStyled from "@/components/shared/FlexStyled";
import FormStyled from "@/components/shared/FormStyled";
import TextInputStyled from "@/components/shared/TextInputStyled";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import UserAvatar from "@/components/shared/UserAvatar";
import { ConsumerFn } from "@/types/genericTypes";
import PostCardBase from "../post/PostCardBase";
import useCreateRepostForm from "../../../services/hook/feed/useCreateRepostForm";
import styles from "../../../styles/feed/createRepostStyles";


interface CreateRepostProps extends GenericWrapper {
    toggleForm: ConsumerFn
    post: Post
}

const CreateRepostForm: React.FC<CreateRepostProps> = ({ toggleForm, post }) => {

    const classes = styles();

    const {
        avatarPlaceholder,
        repostData,
        addRepost,
        handleChange,
        handleSubmit,
    } = useCreateRepostForm(toggleForm, post);



    const ControlSection = () => (
        <FlexStyled className="control-area">
            <DarkButton name="post" disabled={!repostData.text} loading={addRepost.isPending} onClick={handleSubmit} />
        </FlexStyled>
    );

    return (
        <FlexStyled className={classes.wrapper} onClick={(e: Event) => e.stopPropagation()}>
            <FormStyled>
                <UserAvatar radius="10rem" chars={avatarPlaceholder} />
                <TextInputStyled
                    name="text"
                    minLength="1"
                    maxLength="64"
                    placeholder="type a comment"
                    handleChange={handleChange}
                />
            </FormStyled>
            <PostCardBase text={post.text} title={post.title} userId={post.userId} />
            <ControlSection />
        </FlexStyled>
    );
};

export default CreateRepostForm;