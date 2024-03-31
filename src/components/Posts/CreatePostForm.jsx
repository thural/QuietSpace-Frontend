import React, { useState } from "react";
import styles from "./styles/editPostStyles";
import Overlay from "../Overlay";
import { fetchCreatePost } from "../../api/postRequests";
import { POST_URL } from "../../constants/ApiPath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore, viewStore } from "../../hooks/zustand";

const CreatePostForm = () => {

    const [postData, setPostData] = useState({ text: '' });


    const queryClient = useQueryClient();
    const { data: authData } = authStore();
    const { setViewData } = viewStore();


    const newPostMutation = useMutation({
        mutationFn: async (postData) => {
            const response = await fetchCreatePost(POST_URL, postData, authData.token);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            // queryClient.setQueryData(["posts", {id: data.id}], postData);
            queryClient.invalidateQueries(["posts"], { exact: true });
        },
        onError: (error, variables, context) => {
            console.log("error on post: ", error.message)
        },
        onSettled: (data, error, variables, context) => { // optional for both error and success cases
            if (error) {
                console.error("Error adding new post:", error);
            } else {
                console.log("Post added successfully:", data);
                setViewData({ overlay: false, createPost: false })
            }
        },
    })


    const handleChange = (event) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        newPostMutation.mutate(postData);
    }


    const classes = styles();


    return (
        <>
            <Overlay closable={{ createPost: false }} />
            <div className={classes.post}>
                <h3>Create a post</h3>
                <form>
                    <textarea
                        className='text area'
                        name='text'
                        placeholder="What's on your mind?"
                        maxLength="128"
                        value={postData.text}
                        onChange={handleChange}>
                    </textarea>
                    <button
                        disabled={newPostMutation.isPending}
                        className="submit-btn"
                        onClick={handleSubmit}
                        type="button">
                        Post
                    </button>
                </form>
            </div>
        </>
    )
}

export default CreatePostForm