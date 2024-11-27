import CloseButtonStyled from "@/components/shared/CloseButtonStyled";
import FormStyled from "@/components/shared/FormStyled";
import ModalStyled from "@/components/shared/ModalStyled";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
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

export interface CreatePostFormProps extends GenericWrapper {
    toggleForm: ConsumerFn
}

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
        avatarPlaceholder,
        addPost,
        viewAccessOptions,
    } = useCreatePostForm(toggleForm);


    return (
        <ModalStyled>
            <CloseButtonStyled handleToggle={toggleForm} />
            <Typography style={{ alignSelf: "center" }} type="h4">Create Post</Typography>
            <UserAvatar radius="10rem" chars={avatarPlaceholder} />
            <FormStyled>
                <TitleInput value={postData.title} handleChange={handleChange} />
                <TextInput value={postData.text} handleChange={handleChange} />
                <Image radius="md" src={previewUrl} />
                <PollForm
                    postData={postData}
                    handleChange={handleChange}
                    togglePoll={togglePoll}
                    pollView={pollView}
                />
                <FormControls isDisabled={!postData.text} isLoading={addPost.isPending} handleSubmit={handleSubmit}>
                    <ComboMenu options={viewAccessOptions}
                        selectedOption={postData.viewAccess}
                        handleSelect={handleViewSelect}
                        textContent={"can view"}
                    />
                    <PiChartBarHorizontalFill style={{ cursor: 'pointer' }} onClick={togglePoll} />
                    <FileInput
                        variant="unstyled"
                        leftSection={<PiImage />}
                        placeholder="add photo"
                        onChange={handleFileChange}
                    />
                </FormControls>
            </FormStyled>
        </ModalStyled>
    );
};

export default CreatePostForm;