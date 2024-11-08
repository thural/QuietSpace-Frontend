import { getSignedUser } from "@/api/queries/userQueries";
import { Post, RepostBody } from "@/api/schemas/inferred/post";
import BoxStyled from "@/components/shared/BoxStyled";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import FlexStyled from "@/components/shared/FlexStyled";
import FormStyled from "@/components/shared/FormStyled";
import TextInput from "@/components/shared/TextInput";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import UserAvatar from "@/components/shared/UserAvatar";
import { useCreateRepost } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { useState } from "react";
import PostCardBase from "../../post/card/PostCardBase";
import styles from "./styles/createRepostStyles";
import { toUpperFirstChar } from "@/utils/stringUtils";

interface CreateRepostProps extends GenericWrapper {
    toggleForm: ConsumerFn
    post: Post
}

const CreateRepostForm: React.FC<CreateRepostProps> = ({ toggleForm, post }) => {

    const classes = styles();

    const signedUser = getSignedUser();


    const [repostData, setRepostData] = useState<RepostBody>({ text: "", postId: post.id });
    const handleChange = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        setRepostData({ ...repostData, [name]: value });
    };


    const addRepost = useCreateRepost(toggleForm);
    const handleSubmit = () => addRepost.mutate(repostData);


    const avatarPlaceholder = toUpperFirstChar(signedUser?.username);


    const ControlSection = () => (
        <FlexStyled className="control-area">
            <DarkButton name="post" disabled={!repostData.text} loading={addRepost.isPending} onClick={handleSubmit} />
        </FlexStyled>
    );

    return (
        <BoxStyled onClick={(e: Event) => e.stopPropagation()}>
            <FlexStyled className={classes.wrapper}>
                <FormStyled>
                    <UserAvatar radius="10rem" chars={avatarPlaceholder} />
                    <TextInput
                        name="text"
                        minLength="1"
                        maxLength="64"
                        placeholder="type a comment"
                        handleChange={handleChange}
                    />
                </FormStyled>
                <PostCardBase text={post.text} title={post.title} signedUser={signedUser} />
                <ControlSection />
            </FlexStyled>
        </BoxStyled>
    );
};

export default CreateRepostForm;