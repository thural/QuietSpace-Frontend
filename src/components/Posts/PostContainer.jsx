import Post from "./Post";
import React, { useMemo, useState } from "react";
import CreatePostForm from "./CreatePostForm";
import { viewStore } from "../../hooks/zustand";
import { useGetPosts } from "../../hooks/usePostData";
import { Avatar, Box, Button, Container, Flex, Input, LoadingOverlay } from "@mantine/core";

import styles from './styles/postContainerStyles'
import { generatePfpUrls } from "../../utils/randomPfp";

function PostContainer() {

    const { data: viewData, setViewData } = viewStore();
    const { createPost: createPostView } = viewData;
    const [postQueryResult, setPostQueryResult] = useState([])
    const postsQuery = useGetPosts();
    const classes = styles();

    const numOfPosts = postsQuery.data?.length;

    const randomPfpUrls = useMemo(() => {
        return generatePfpUrls(numOfPosts ? numOfPosts : 1, "beam").getAllUrls();
    }, [numOfPosts]);


    if (postsQuery.isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (postsQuery.isError) return <h1>{postsQuery.error.message}</h1>;


    return (
        <Container className={classes.container} size="600px">
            <Box style={{ margin: "1rem 0" }}>
                <Flex justify="space-between" gap="1rem">
                    <Avatar color="black" radius="10rem" src={randomPfpUrls[0]}>T</Avatar>
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
            {!postsQuery.isLoading &&
                postsQuery.data?.map((post, index) => (<Post key={post["id"]} post={post} avatarUrl={randomPfpUrls[index]} />))
            }
        </Container>
    )
}

export default PostContainer