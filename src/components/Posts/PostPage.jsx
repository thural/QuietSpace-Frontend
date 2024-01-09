import React, {useEffect} from "react"
import PostContainer from "./PostContainer"
import CreatePostForm from "./CreatePostForm"
import EditPostForm from "./EditPostForm"
import styles from "./styles/postPageStyles"
import {useDispatch, useSelector} from "react-redux"
import {post} from "../../redux/formViewReducer"
import {fetchPosts} from "../../api/postRequests";
import {POST_URL} from "../../constants/ApiPath";
import {loadPosts} from "../../redux/postReducer";

const PostPage = () => {
    const formView = useSelector(state => state.formViewReducer);
    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);


    const dispatch = useDispatch();
    const classes = styles();

    const handleFetchPosts = async () => {
        if (auth.token != null) {
            const response = await fetchPosts(POST_URL, auth.token);
            const responseData = await response.json();
            dispatch(loadPosts(responseData["content"]));
        } else {
            dispatch(loadPosts([]));
        }
    }

    useEffect(() => {
        handleFetchPosts().then(() => console.log("posts loaded"))
    }, [user]);

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

                <PostContainer />
            </div>
        </>
    )
}

export default PostPage