import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEditPost } from "../../../hooks/usePostData";

const useEditPostForm = (postId) => {
    const queryClient = useQueryClient();
    const posts = queryClient.getQueryData(["posts"]);
    const editedPostData = posts.content.find(post => post.id === postId);

    const [postData, setPostData] = useState(editedPostData);
    const editCurrentPost = useEditPost(postId);

    const handleSubmit = (event) => {
        event.preventDefault();
        editCurrentPost.mutate(postData);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    return {
        postData,
        handleSubmit,
        handleChange,
    };
};

export default useEditPostForm;