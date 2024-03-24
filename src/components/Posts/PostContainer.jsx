import Post from "./Post"
import React from "react"
import { useSelector } from "react-redux";
import { Container } from '@mantine/core';

const PostContainer = () => {

    const posts = useSelector(state => state.postReducer);

    const styleProps = {
        bg: 'var(--mantine-color-blue-light)',
        h: 50,
        mt: 'md',
    };

    return (
        <Container size="xs" {...styleProps}>
            {
                posts.map((post) => (<Post key={post["id"]} post={post} />))
            }
        </Container>

    )
}

export default PostContainer