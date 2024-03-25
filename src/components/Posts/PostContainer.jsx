import Post from "./Post"
import React from "react"
import CreatePostForm from "./CreatePostForm"
import EditPostForm from "./EditPostForm"
import { useDispatch, useSelector } from "react-redux"
import styles from "./styles/postPageStyles"
import { post } from "../../redux/formViewReducer";
import { POST_URL } from "../../constants/ApiPath"
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPosts } from "../../api/postRequests"

function PostContainer () {
    const formView = useSelector(state => state.formViewReducer);
    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await fetchPosts(POST_URL, auth.token);
            return await response.json();
        }
    });

    if(postsQuery.isLoading) return <h1>Loading</h1>;
    if(postsQuery.isError) return <h1>{JSON.stringify(postsQuery.error)}</h1>

    const dispatch = useDispatch();
    const classes = styles();

    // const posts = useSelector(state => state.postReducer);

    const posts = postsQuery.data["content"];

    return (
        <>
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

            {   !postsQuery.isLoading &&
                posts.map((post) => (<Post key={post["id"]} post={post} />))
            }
        </>

    )
}

export default PostContainer