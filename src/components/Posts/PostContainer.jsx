import Post from "./Post";
import React from "react";
import CreatePostForm from "./CreatePostForm";
import { viewStore } from "../../hooks/zustand";
import { useGetPosts } from "../../hooks/usePostData";

function PostContainer() {

    const { data: viewData, setViewData } = viewStore();
    const { createPost: createPostView } = viewData;
    const postsQuery = useGetPosts()

    
    if (postsQuery.isLoading) return <h1>Loading</h1>;
    if (postsQuery.isError) return <h1>{postsQuery.error.message}</h1>;


    return (
        <>
            <button onClick={postsQuery.refetch}>refresh feed</button>
            <button onClick={() => setViewData({ createPost: true })}>add post</button>
            {createPostView && <CreatePostForm />}
            {!postsQuery.isLoading && postsQuery.data.map(post => (<Post key={post["id"]} post={post} />))}
        </>
    )
}

export default PostContainer