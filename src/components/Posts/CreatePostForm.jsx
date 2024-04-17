import React, { useState } from "react";
import styles from "./styles/createPostStyles";
import Overlay from "../Overlay/Overlay";
import { useCreatePost } from "../../hooks/usePostData";
import { Avatar, Box, Button, Flex, Text } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";
import { useQueryClient } from "@tanstack/react-query";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import ComboMenu from "./ComboMenu";

const CreatePostForm = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const [postData, setPostData] = useState({
        viewAccess: 'friends'
    });

    const [pollView, setPollview] = useState({ enabled: false, extraOption: false });

    console.log("post data: ", postData);

    const addPost = useCreatePost();


    const handleChange = (event) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
        console.log("psot data", postData);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        addPost.mutate(postData);
    }

    const avatarUrl = generatePfp("beam");
    const avatarPlaceholder = user.username.charAt(0).toUpperCase();

    const viewAccessOptions = ["friends", "anyone"];

    const handleViewSelect = (option) => {
        setPostData({ ...postData, viewAccess: option });
    }

    const handleReplySelect = (option) => {
        setPostData({ ...postData, replyAccess: option });
    }

    const togglePoll = () => {
        setPollview({ ...pollView, enabled: !pollView.enabled });
    }


    const classes = styles();


    return (
        <Box>
            <Overlay closable={{ createPost: false }} />
            <Flex className={classes.wrapper}>
                <Avatar color="black" radius="10rem" src={avatarUrl}>{avatarPlaceholder}</Avatar>
                <form onChange={handleChange}>
                    <input
                        type="text"
                        name="title"
                        required
                        minLength="1"
                        maxLength="32"
                        placeholder="type a title"
                    />

                    <textarea
                        className='text area'
                        name='text'
                        placeholder="what's on your mind?"
                        minLength="1"
                        maxLength="1000"
                        value={postData.text}
                    >
                    </textarea>

                    <Flex
                        className={classes.pollView}
                        style={{ display: pollView.enabled ? "flex" : "none" }}>

                        <input
                            name="option1"
                            className="poll-input"
                            placeholder="yes" />

                        <input
                            name="option2"
                            className="poll-input"
                            placeholder="no" />

                        <input
                            name="option3"
                            className="poll-input"
                            placeholder="add another option" />

                        <input
                            name="option4"
                            className="poll-input"
                            placeholder="add another option"
                            hidden={!postData.option3 && !postData.option4} />

                        <p className="close-poll" onClick={togglePoll} >remove poll</p>

                    </Flex>

                    <Flex className="control-area">
                        <ComboMenu options={viewAccessOptions}
                            selectedOption={postData.viewAccess}
                            handleSelect={handleViewSelect}
                            textContent={"can view"}
                        />
                        <PiChartBarHorizontalFill className="poll-toggle" onClick={togglePoll} />
                        <Button
                            disabled={addPost.isPending}
                            onClick={handleSubmit}
                        >
                            post
                        </Button>
                    </Flex>

                </form>
            </Flex>
        </Box>
    )
}

export default CreatePostForm