import React, { useState } from "react";
import styles from "./styles/createPostStyles";
import Overlay from "../Overlay/Overlay";
import ComboMenu from "./ComboMenu";
import { useCreatePost } from "../../hooks/usePostData";
import { Avatar, Box, Button, Flex, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import { toUpperFirstChar } from "../../utils/stringUtils";

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


    const PollSection = () => (
        <Flex
            className={classes.pollView}
            style={{ display: pollView.enabled ? "flex" : "none" }}>

            <input
                name="option1"
                className="poll-input"
                placeholder="yes"
                onChange={handleChange}
            />

            <input
                name="option2"
                className="poll-input"
                placeholder="no"
                onChange={handleChange}
            />

            <input
                name="option3"
                className="poll-input"
                placeholder="add another option"
                onChange={handleChange}
            />

            <input
                name="option4"
                className="poll-input"
                placeholder="add another option"
                onChange={handleChange}
                hidden={!postData.option3 && !postData.option4}
            />

            <p className="close-poll" onClick={togglePoll} >remove poll</p>

        </Flex>
    );

    const UserAvatar = () => (
        <Avatar color="black" radius="10rem">{avatarPlaceholder}</Avatar>
    )

    const TitleInput = () => (
        <input
            type="text"
            name="title"
            required
            minLength="1"
            maxLength="32"
            placeholder="type a title"
            onChange={handleChange}
        />
    )

    const TextInput = () => (
        <textarea
            className='text area'
            name='text'
            placeholder="what's on your mind?"
            minLength="1"
            maxLength="1000"
            value={postData.text}
            onChange={handleChange}
        >
        </textarea>
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
                    <TitleInput />
                    <TextInput />
                    <PollSection />
                    <ControlSection />
                </form>
            </Flex>
        </Box>
    )
}

export default CreatePostForm