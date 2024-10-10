import React from "react";
import Post from "./Post";
import CreatePostForm from "./CreatePostForm";
import { Box, Container, Flex, Input, LoadingOverlay } from "@mantine/core";
import styles from './styles/postContainerStyles';
import { toUpperFirstChar } from "../../utils/stringUtils";
import UserAvatar from "../Shared/UserAvatar";
import LightBtn from "../Shared/LightBtn ";
import { usePostContainer } from "./hooks/usePostContainer";

function PostContainer() {
    const classes = styles();
    const { user, createPostView, posts, showCreatePostForm } = usePostContainer();

    if (posts.isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (posts.isError) return <h1>{posts.error.message}</h1>;

    const CreatePostSection = () => (
        <Box style={{ margin: "1rem 0" }}>
            <Flex justify="space-between" gap="1rem">
                <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
                <Input
                    variant="unstyled"
                    style={{ width: "100%" }}
                    placeholder="start a topic..."
                    onClick={showCreatePostForm}
                />
                <LightBtn name="post" handleClick={showCreatePostForm} />
            </Flex>
        </Box>
    );

    const PostList = () => {
        if (posts.isLoading) return null;
        return posts.data?.map((post, index) => <Post key={index} post={post} />);
    };

    return (
        <Container className={classes.container} size="600px">
            <CreatePostSection />
            <hr />
            {createPostView && <CreatePostForm />}
            <PostList />
        </Container>
    );
}

export default PostContainer;