import { Box, Flex } from "@mantine/core";
import React from "react";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import Overlay from "../Overlay/Overlay";
import DarkButton from "../Shared/buttons/DarkButton ";
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
        <Flex className="control-area">
            <ComboMenu options={viewAccessOptions}
                selectedOption={postData.viewAccess}
                handleSelect={handleViewSelect}
                textContent={"can view"}
            />
            <PiChartBarHorizontalFill className="poll-toggle" onClick={togglePoll} />
            <DarkButton name="post" loading={addPost.isPending} onClick={handleSubmit} />
        </Flex>
    );

    return (
        <Box>
            <Overlay closable={{ createPost: false }} />
            <Flex className={classes.wrapper}>
                <UserAvatar radius="10rem" chars={avatarPlaceholder} />
                <form>
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
                </form>
            </Flex>
        </Box>
    );
};

export default CreatePostForm;