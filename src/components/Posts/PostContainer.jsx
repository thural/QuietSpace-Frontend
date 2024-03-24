import Post from "./Post"
import React from "react"
import CreatePostForm from "./CreatePostForm"
import EditPostForm from "./EditPostForm"
import { useDispatch, useSelector } from "react-redux"
import styles from "./styles/postPageStyles"
import { post } from "../../redux/formViewReducer";

const PostContainer = () => {
    const formView = useSelector(state => state.formViewReducer);
    const user = useSelector(state => state.userReducer);

    const dispatch = useDispatch();
    const classes = styles();

    const posts = useSelector(state => state.postReducer);

    return (
        <>
            <div className={classes.posts}>
            </div>

            {
                user.username && <button onClick={() => dispatch(post())}>post</button>
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
        </>

    )
}

export default PostContainer