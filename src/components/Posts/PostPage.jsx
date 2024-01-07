import React from "react"
import PostContainer from "./PostContainer"
import CreatePostForm from "./CreatePostForm"
import EditPostForm from "./EditPostForm"
import styles from "./styles/postPageStyles"
import {useDispatch, useSelector} from "react-redux"
import {post} from "../../redux/formViewReducer"

const PostPage = () => {
    const formView = useSelector(state => state.formViewReducer);
    const posts = useSelector(state => state.postReducer);
    const user = useSelector(state => state.userReducer);

    const dispatch = useDispatch();

    const classes = styles()

    return (
        <>
            <div className={classes.posts}>
                {
                    user.username &&
                    <button className="add-post-btn" onClick={() => dispatch(post())}>
                        Add
                    </button>
                }

                {
                    user.username && formView.post &&
                    <CreatePostForm/>
                }

                {
                    user.username && formView.edit.view &&
                    <EditPostForm/>
                }

                <PostContainer posts={posts}/>

            </div>
        </>
    )
}

export default PostPage