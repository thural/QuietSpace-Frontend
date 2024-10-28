import BoxStyled from "@/components/shared/BoxStyled";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import FlexStyled from "@/components/shared/FlexStyled";
import FormStyled from "@/components/shared/FormStyled";
import TextInput from "@/components/shared/TextInput";
import UserAvatar from "@/components/shared/UserAvatar";
import ComboMenu from "../../shared/combo-menu/ComboMenu";
import PollForm from "../poll/PollForm";
import useCreatePostForm from "./hooks/useCreatePostForm";
import styles from "./styles/createPostStyles";
import { PiChartBarHorizontalFill } from "react-icons/pi";

const CreatePostForm = () => {

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
    } = useCreatePostForm();

    const ControlSection = () => (
        <FlexStyled className="control-area">
            <ComboMenu options={viewAccessOptions}
                selectedOption={postData.viewAccess}
                handleSelect={handleViewSelect}
                textContent={"can view"}
            />
            <PiChartBarHorizontalFill className="poll-toggle" onClick={togglePoll} />
            <DarkButton name="post" loading={addPost.isPending} onClick={handleSubmit} />
        </FlexStyled>
    );

    return (
        <BoxStyled>
            <FlexStyled className={classes.wrapper}>
                <UserAvatar radius="10rem" chars={avatarPlaceholder} />
                <FormStyled>
                    <TextInput
                        name="title"
                        minLength="1"
                        maxLength="32"
                        placeholder="type a title"
                        handleChange={handleChange}
                    />
                    <textarea
                        className='text area'
                        name="text"
                        value={postData.text}
                        onChange={handleChange}
                        placeholder="what's on your mind?"
                        maxLength={999}
                        minLength={1}
                    />
                    <PollForm
                        postData={postData}
                        handleChange={handleChange}
                        togglePoll={togglePoll}
                        pollView={pollView}
                    />
                    <ControlSection />
                </FormStyled>
            </FlexStyled>
        </BoxStyled>
    );
};

export default CreatePostForm;