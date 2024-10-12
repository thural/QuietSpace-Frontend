import { Box, Container, Flex, Input } from "@mantine/core";
import React from "react";
import { toUpperFirstChar } from "../../utils/stringUtils";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import UserAvatar from "../Shared/UserAvatar";
import LightButton from "../Shared/buttons/LightButton";
import CreatePostForm from "./CreatePostForm";
import Post from "./Post";
import { usePostContainer } from "./hooks/usePostContainer";
import styles from './styles/postContainerStyles';

function PostContainer() {
    const classes = styles();
    const { user, createPostView, posts, showCreatePostForm } = usePostContainer();

    if (posts.isLoading) return <FullLoadingOverlay />;
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
                <LightButton name="post" handleClick={showCreatePostForm} />
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