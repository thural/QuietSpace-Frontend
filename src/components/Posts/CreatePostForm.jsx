import React, { useState } from "react";
import styles from "./styles/createPostStyles";
import Overlay from "../Overlay/Overlay";
import { useCreatePost } from "../../hooks/usePostData";
import { Avatar, Box, Button, Flex, Text } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";
import { useQueryClient } from "@tanstack/react-query";
import ComboMenu from "./ComboMenu";

const CreatePostForm = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const [postData, setPostData] = useState({
        text: '',
        viewAccess: 'friends',
        replyAccess: 'friends'
    });

    const addPost = useCreatePost();


    const handleChange = (event) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        addPost.mutate(postData);
    }

    const avatarUrl = generatePfp("beam");
    const avatarPlaceholder = user.username.charAt(0).toUpperCase();

    const viewAccessOptions = ["friends", "anyone"];
    const replyAccessOptons = ["friends", "anyone"];

    const handleViewSelect = (option) => {
        setPostData({ ...postData, viewAccess: option });
    }

    const handleReplySelect = (option) => {
        setPostData({ ...postData, viewAccess: option });
    }


    const classes = styles();


    return (
        <Box>
            <Overlay closable={{ createPost: false }} />
            <Flex className={classes.wrapper}>
                <Avatar color="black" radius="10rem" src={avatarUrl}>{avatarPlaceholder}</Avatar>
                <form>
                    <input
                        type="text"
                        name="title"
                        required minlength="1"
                        maxlength="32"
                        placeholder="type a title"
                    />
                    <textarea
                        className='text area'
                        name='text'
                        placeholder="what's on your mind?"
                        maxLength="1000"
                        value={postData.text}
                        onChange={handleChange}>
                    </textarea>
                    <Flex className="control-area">
                        <ComboMenu options={viewAccessOptions}
                            selectedOption={postData.viewAccess}
                            handleSelect={handleViewSelect}
                            textContent={"can view"}
                        />
                        <ComboMenu options={replyAccessOptons}
                            selectedOption={postData.replyAccess}
                            handleSelect={handleViewSelect}
                            textContent={"can reply"}
                        />
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