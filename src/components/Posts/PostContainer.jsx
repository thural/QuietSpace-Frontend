import Post from "./Post"
import React from "react"
import CreatePostForm from "./CreatePostForm"
import EditPostForm from "./EditPostForm"
import { useDispatch, useSelector } from "react-redux"
import { post } from "../../redux/formViewReducer";
import { POST_URL } from "../../constants/ApiPath"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "../../api/postRequests"

function PostContainer() {
    const formView = useSelector(state => state.formViewReducer);
    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);

    const queryClient = useQueryClient();
    const userData = queryClient.getQueryData(["user"]);

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await fetchPosts(POST_URL, auth.token);
            return await response.json();
        },
        enabled: userData.userId !== null, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 6 // refetch data after 6 minutes on idle
    });

    if (postsQuery.isLoading) return <h1>Loading</h1>;
    if (postsQuery.isError) return <h1>{JSON.stringify(postsQuery.error)}</h1>

    const dispatch = useDispatch();
    const posts = postsQuery.data["content"];

    return (
        <>
            <button onClick={postsQuery.refetch}>refresh feed</button>
            <button onClick={() => dispatch(post())}>post</button>
            {formView.post && <CreatePostForm />}
            {user.username && formView.edit.view && <EditPostForm />}
            {!postsQuery.isLoading && posts.map((post) => (<Post key={post["id"]} post={post} />))}
        </>

    )
}

export default PostContainer