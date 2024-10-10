import React, { useState } from "react";
import styles from "./styles/createPostStyles";
import Overlay from "../Overlay/Overlay";
import ComboMenu from "./ComboMenu";
import { useCreatePost } from "../../hooks/usePostData";
import { Avatar, Box, Button, Flex, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import { toUpperFirstChar } from "../../utils/stringUtils";
import TextInput from "../Shared/TextInput";
import PollSection from "./PollSection";

const CreatePostForm = () => {

    const classes = styles();

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const addPost = useCreatePost();

    const [postData, setPostData] = useState({
        text: "",
        userId: user.id,
        viewAccess: 'friends',
        poll: null
    });

    const [pollView, setPollView] = useState({ enabled: false, extraOption: false });

    const handleChange = (event) => {
        console.log("post form data: ", postData);
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const poll = { dueDate: null, options: [] }
        Object.entries(postData).forEach(([key, value]) => {
            if (key.includes("option")) poll.options.push(value)
        });
        const requestBody = poll.options.length ? { ...postData, poll } : postData;
        addPost.mutate(requestBody);
    }

    const viewAccessOptions = ["friends", "anyone"];

    const handleViewSelect = (option) => {
        setPostData({ ...postData, viewAccess: option });
    }

    const handleReplySelect = (option) => {
        setPostData({ ...postData, replyAccess: option });
    }

    const togglePoll = () => {
        setPollView({ ...pollView, enabled: !pollView.enabled });
    }

    const avatarPlaceholder = toUpperFirstChar(user.username);



    const UserAvatar = () => (
        <Avatar color="black" radius="10rem">{avatarPlaceholder}</Avatar>
    )



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
                <UserAvatar />
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
    )
}

export default CreatePostForm