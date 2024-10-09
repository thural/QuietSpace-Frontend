import Post from "./Post";
import React, { useMemo, useState } from "react";
import CreatePostForm from "./CreatePostForm";
import { viewStore } from "../../hooks/zustand";
import { useGetPosts } from "../../hooks/usePostData";
import { Avatar, Box, Button, Container, Flex, Input, LoadingOverlay } from "@mantine/core";

import styles from './styles/postContainerStyles'
import { useQueryClient } from "@tanstack/react-query";
import { toUpperFirstChar } from "../../utils/stringUtils";

function PostContainer() {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { createPost: createPostView } = viewData;
    const posts = useGetPosts();
    const classes = styles();


    if (posts.isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (posts.isError) return <h1>{posts.error.message}</h1>;

    const CreatePostSection = () => (
        <Box style={{ margin: "1rem 0" }}>
            <Flex justify="space-between" gap="1rem">
                <Avatar color="black" radius="10rem">{toUpperFirstChar(user.username)}</Avatar>
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
    );

    const PostList = () => {
        if (posts.isLoading) return null;
        return posts.data?.map((post, index) => <Post key={index} post={post} />);
    }


    return (
        <Container className={classes.container} size="600px">
            <CreatePostSection />
            <hr></hr>
            {createPostView && <CreatePostForm />}
            <PostList />
        </Container>
    )
}

export default PostContainer