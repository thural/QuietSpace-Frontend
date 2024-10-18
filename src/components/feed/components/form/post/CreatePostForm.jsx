import BoxStyled from "@shared/BoxStyled";
import DarkButton from "@shared/buttons/DarkButton ";
import FlexStyled from "@shared/FlexStyled";
import FormStyled from "@shared/FormStyled";
import Overlay from "@shared/Overlay";
import TextInput from "@shared/TextInput";
import UserAvatar from "@shared/UserAvatar";
import React from "react";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import ComboMenu from "../../shared/combo-menu/ComboMenu";
import PollForm from "../poll/PollForm";
import useCreatePostForm from "./hooks/useCreatePostForm";
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