import Post from "./Post";
import React from "react";
import CreatePostForm from "./CreatePostForm";
import { POST_URL } from "../../constants/ApiPath";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "../../api/postRequests";
import { authStore, viewStore } from "../../hooks/zustand";

function PostContainer() {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);


    const { data: authData } = authStore();
    const { data, setViewData } = viewStore();
    const { createPost } = data;


    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await fetchPosts(POST_URL, authData.token);
            return await response.json();
        },
        enabled: !!user?.id, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 3 minutes
        refetchInterval: 1000 * 60 * 6 // refetch data after 6 minutes on idle
    });


    if (postsQuery.isLoading) return <h1>Loading</h1>;
    if (postsQuery.isError) return <h1>{JSON.stringify(postsQuery.error)}</h1>;
    if (postsQuery.isPending) return <h1>Loading</h1>;


    const posts = postsQuery.data["content"];

    
    return (
        <>
            <button onClick={postsQuery.refetch}>refresh feed</button>
            <button onClick={() => setViewData({ createPost: true })}>add post</button>
            {createPost && <CreatePostForm />}
            {!postsQuery.isLoading && posts.map(post => (<Post key={post["id"]} post={post} />))}
        </>
    )
}

export default PostContainer