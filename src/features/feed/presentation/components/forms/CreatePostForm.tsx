import CloseButtonStyled from "@/shared/CloseButtonStyled";
import Conditional from "@/shared/Conditional";
import FormStyled from "@/shared/FormStyled";
import ModalStyled from "@/shared/ModalStyled";
import Typography from "@/shared/Typography";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import useCreatePostForm from "@/services/hook/feed/useCreatePostForm";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { FileInput, Image } from "@mantine/core";
import { PiChartBarHorizontalFill, PiImage } from "react-icons/pi";
import ComboMenu from "../fragments/ComboMenu";
import FormControls from "../fragments/FormControls";
import TextInput from "../fragments/TextInput";
import TitleInput from "../fragments/TitleInput";
import PollForm from "./PollForm";

/**
 * Props for the CreatePostForm component.
 * 
 * @interface CreatePostFormProps
 * @extends GenericWrapper
 * @property {ConsumerFn} toggleForm - Function to toggle the visibility of the form.
 */
export interface CreatePostFormProps extends GenericWrapper {
    toggleForm: ConsumerFn;
}

/**
 * CreatePostForm component.
 * 
 * This component provides a form for users to create a new post. It includes 
 * fields for the post title, text, image upload, and polling options. The 
 * component manages user input and submits the post upon completion.
 * 
 * @param {CreatePostFormProps} props - The component props.
 * @returns {JSX.Element} - The rendered CreatePostForm component.
 */
const CreatePostForm: React.FC<CreatePostFormProps> = ({ toggleForm }) => {
    const {
        postData,
        pollView,
        previewUrl,
        handleChange,
        handleSubmit,
        handleViewSelect,
        handleFileChange,
        togglePoll,
        addPost,
        viewAccessOptions,
    } = useCreatePostForm(toggleForm);

    return (
        <ModalStyled>
            <CloseButtonStyled handleToggle={toggleForm} />
            <Typography style={{ alignSelf: "center" }} type="h4">Create Post</Typography>
            <UserAvatarPhoto userId={postData.userId} />
            <FormStyled>
                <TitleInput value={postData.title} handleChange={handleChange} />
                <TextInput minHeight="7rem" value={postData.text} handleChange={handleChange} />
                <Image radius="md" w="auto" fit="scale-down" style={{ maxHeight: "50vh" }} src={previewUrl} />
                <PollForm
                    postData={postData}
                    handleChange={handleChange}
                    togglePoll={togglePoll}
                    pollView={pollView}
                />
                <FormControls isDisabled={!postData.text} isLoading={addPost.isPending} handleSubmit={handleSubmit}>
                    <ComboMenu
                        options={viewAccessOptions}
                        selectedOption={postData.viewAccess}
                        handleSelect={handleViewSelect}
                        textContent={"can view"}
                    />
                    <Conditional isEnabled={!previewUrl}>
                        <PiChartBarHorizontalFill style={{ cursor: 'pointer' }} onClick={togglePoll} />
                    </Conditional>
                    <Conditional isEnabled={!pollView.enabled}>
                        <FileInput
                            variant="unstyled"
                            leftSection={<PiImage />}
                            placeholder="add photo"
                            onChange={handleFileChange}
                        />
                    </Conditional>
                </FormControls>
            </FormStyled>
        </ModalStyled>
    );
};

export default CreatePostForm;