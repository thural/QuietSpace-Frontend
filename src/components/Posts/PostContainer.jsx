import Post from "./Post"
import React from "react"
import CreatePostForm from "./CreatePostForm"
import EditPostForm from "./EditPostForm"
import { Container } from '@mantine/core';
import { post } from "../../redux/formViewReducer"
import { useDispatch, useSelector } from "react-redux"
import styles from "./styles/postPageStyles"

const PostContainer = () => {
    const formView = useSelector(state => state.formViewReducer);
    const user = useSelector(state => state.userReducer);

    const dispatch = useDispatch();
    const classes = styles();

    const posts = useSelector(state => state.postReducer);

    const styleProps = {
        bg: 'var(--mantine-color-blue-light)',
        h: 50,
        mt: 'md',
    };

    return (
        <Container size="xs" {...styleProps}>
            <div className={classes.posts}>
            </div>

            {
                user.username &&
                <button className="add-post-btn" onClick={() => dispatch(post())}>
                    Add
                </button>
            }
            {
                user.username && formView.post &&
                <CreatePostForm />
            }
            {
                user.username && formView.edit.view &&
                <EditPostForm />
            }

            {
                posts.map((post) => (<Post key={post["id"]} post={post} />))
            }
        </Container>

    )
}

export default PostContainer