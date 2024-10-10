import React from "react";
import styles from "./styles/createPostStyles";
import Overlay from "../Overlay/Overlay";
import ComboMenu from "./ComboMenu";
import { Avatar, Box, Button, Flex } from "@mantine/core";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import TextInput from "../Shared/TextInput";
import PollSection from "./PollSection";
import UserAvatar from "../Shared/UserAvatar";
import useCreatePostForm from "./hooks/useCreatePostForm";

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
            <Button
                loading={addPost.isPending}
                onClick={handleSubmit}
            >
                post
            </Button>
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