import DarkButton from "@/components/shared/buttons/DarkButton ";
import CloseButtonStyled from "@/components/shared/CloseButtonStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import FormStyled from "@/components/shared/FormStyled";
import ModalStyled from "@/components/shared/ModalStyled";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import UserAvatar from "@/components/shared/UserAvatar";
import { ConsumerFn } from "@/types/genericTypes";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import TextInput from "../../fragments/TextInput";
import TitleInput from "../../fragments/TitleInput";
import ComboMenu from "../../shared/combo-menu/ComboMenu";
import PollForm from "../poll/PollForm";
import useCreatePostForm from "./hooks/useCreatePostForm";
import styles from "./styles/createPostStyles";
import Typography from "@/components/shared/Typography";

interface CreatePostFormProps extends GenericWrapper {
    toggleForm: ConsumerFn
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ toggleForm }) => {

    const classes = styles();

    const {
        postData,
        pollView,
        handleChange,
        handleSubmit,
        handleViewSelect,
        togglePoll,
        avatarPlaceholder,
        addPost,
        viewAccessOptions,
    } = useCreatePostForm(toggleForm);



    const ControlSection = () => (
        <FlexStyled className={classes.controlArea}>
            <ComboMenu options={viewAccessOptions}
                selectedOption={postData.viewAccess}
                handleSelect={handleViewSelect}
                textContent={"can view"}
            />
            <PiChartBarHorizontalFill className={classes.pollToggle} onClick={togglePoll} />
            <DarkButton className={classes.button} name="post" disabled={!postData.text} loading={addPost.isPending} onClick={handleSubmit} />
        </FlexStyled>
    );


    return (
        <ModalStyled>
            <CloseButtonStyled handleToggle={toggleForm} />
            <Typography style={{ alignSelf: "center" }} type="h4">Create Post</Typography>
            <UserAvatar radius="10rem" chars={avatarPlaceholder} />
            <FormStyled>
                <TitleInput value={postData.title} handleChange={handleChange} />
                <TextInput value={postData.text} handleChange={handleChange} />
                <PollForm
                    postData={postData}
                    handleChange={handleChange}
                    togglePoll={togglePoll}
                    pollView={pollView}
                />
                <ControlSection />
            </FormStyled>
        </ModalStyled>
    );
};

export default CreatePostForm;