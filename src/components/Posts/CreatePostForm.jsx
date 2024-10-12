import React from "react";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import Overlay from "../Overlay/Overlay";
import BoxStyled from "../Shared/BoxStyled";
import DarkButton from "../Shared/buttons/DarkButton ";
import FlexStyled from "../Shared/FlexStyled";
import FormStyled from "../Shared/Form";
import TextInput from "../Shared/TextInput";
import UserAvatar from "../Shared/UserAvatar";
import ComboMenu from "./ComboMenu";
import useCreatePostForm from "./hooks/useCreatePostForm";
import PollSection from "./PollSection";
import styles from "./styles/createPostStyles";

const CreatePostForm = () => {
    const classes = styles();
    const {
        postData,
        pollView,
        handleChange,
        handleSubmit,
        handleViewSelect,
        handleReplySelect,
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
            <Overlay closable={{ createPost: false }} />
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
                        maxLength="999"
                        minLength="1"
                    />
                    <PollSection
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