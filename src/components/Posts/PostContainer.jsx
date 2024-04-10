import Post from "./Post";
import React from "react";
import CreatePostForm from "./CreatePostForm";
import { viewStore } from "../../hooks/zustand";
import { useGetPosts } from "../../hooks/usePostData";
import { Avatar, Box, Button, Container, Flex, Input, LoadingOverlay } from "@mantine/core";

import styles from './styles/postContainerStyles'

function PostContainer() {

    const { data: viewData, setViewData } = viewStore();
    const { createPost: createPostView } = viewData;
    const postsQuery = useGetPosts();
    const classes = styles();


    if (postsQuery.isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (postsQuery.isError) return <h1>{postsQuery.error.message}</h1>;

    return (
        <Container className={classes.container} size="600px">
            <Box style={{ margin: "1rem 0" }}>
                <Flex justify="space-between" gap="1rem">
                    <Avatar color="black"  radius="10rem">T</Avatar>
                    <Input
                        variant="unstyled"
                        style={{ width: "100%" }}
                        placeholder="start a topic..."
                        onClick={() => setViewData({ createPost: true })}
                    />
                    <Button
                        variant="light"
                        color="rgba(0, 0, 0, 1)"
                        radius="xl"
                        size="sm"
                        onClick={() => setViewData({ createPost: true })}
                    >post</Button>
                </Flex>
            </Box>
            <hr></hr>
            {createPostView && <CreatePostForm />}
            {!postsQuery.isLoading && postsQuery.data.map(post => (<Post key={post["id"]} post={post} />))}
        </Container>
    )
}

export default PostContainer