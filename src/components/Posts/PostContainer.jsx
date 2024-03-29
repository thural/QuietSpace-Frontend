import Post from "./Post";
import React, { useState } from "react";
import CreatePostForm from "./CreatePostForm";
import { POST_URL } from "../../constants/ApiPath";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "../../api/postRequests";
import { viewStore } from "../../hooks/zustand";

function PostContainer() {

    const queryClient = useQueryClient();
    const auth = queryClient.getQueryData("auth");
    const user = queryClient.getQueryData("user");
    const [showForm, setShowForm] = useState(false);

    const { data, setViewData } = viewStore();
    const { createPost } = data;

    console.log("create post data state: ", data)
    console.log("create post vew state: ", createPost)

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await fetchPosts(POST_URL, auth.token);
            return await response.json();
        },
        enabled: user?.id !== null, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 3 minutes
        refetchInterval: 1000 * 60 * 6 // refetch data after 6 minutes on idle
    });

    if (postsQuery.isLoading) return <h1>Loading</h1>;
    if (postsQuery.isError) return <h1>{JSON.stringify(postsQuery.error)}</h1>;

    const posts = postsQuery.data["content"];

    return (
        <>
            <button onClick={postsQuery.refetch}>refresh feed</button>
            <button onClick={() => setViewData({createPost:true})}>add post</button>
            {createPost && <CreatePostForm />}
            {!postsQuery.isLoading && posts.map(post => (<Post key={post["id"]} post={post} />))}
        </>
    )
}

export default PostContainer