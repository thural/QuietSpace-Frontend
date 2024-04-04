import Post from "./Post";
import React from "react";
import CreatePostForm from "./CreatePostForm";
import { viewStore } from "../../hooks/zustand";
import { useGetPosts } from "../../hooks/usePostData";
import { Box, Button, Container, Flex, Input, Loader, LoadingOverlay } from "@mantine/core";

function PostContainer() {

    const { data: viewData, setViewData } = viewStore();
    const { createPost: createPostView } = viewData;
    const postsQuery = useGetPosts()


    if (postsQuery.isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (postsQuery.isError) return <h1>{postsQuery.error.message}</h1>;


    return (
        <Container size="600px" style={{ marginTop: "1rem" }}>
            <Box style={{ margin: "1rem 0" }}>
                <Flex justify="space-between" gap="1rem">
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
            {createPostView && <CreatePostForm />}
            {!postsQuery.isLoading && postsQuery.data.map(post => (<Post key={post["id"]} post={post} />))}
        </Container>
    )
}

export default PostContainer