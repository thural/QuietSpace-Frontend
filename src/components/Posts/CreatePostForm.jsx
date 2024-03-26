import React, { useState } from "react";
import styles from "./styles/editPostStyles";
import Overlay from "../Overlay";
import { fetchCreatePost } from "../../api/postRequests";
import { POST_URL } from "../../constants/ApiPath";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreatePostForm = () => {
    const [postData, setPostData] = useState({ text: '' });

    const queryClient = useQueryClient();
    const auth = queryClient.getQueryData(auth);

    const newPostMutation = useMutation({
        mutationFn: async (postData) => {
            const response = await fetchCreatePost(POST_URL, postData, auth["token"]);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(["posts", data.id], postData); // manually cache data before refetch
            queryClient.invalidateQueries(["posts"], { exact: true });
            console.log(context);
        },
        onError: (error, variables, context) => {
            console.log("error on post: ", error.message)
        },
        onSettled: (data, error, variables, context) => { // optional for both error and success cases
            if (error) {
                console.error("Error adding new post:", error);
                // Handle error (e.g., show an error message)
            } else {
                console.log("Post added successfully:", data);
                // Perform any cleanup or additional actions
            }
        },
        onMutate: () => { // do something before mutation
            return { message: "added new post" } // create context
        },
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        newPostMutation.mutate(postData);
        // TODO: add logic to close the form on submit
    }

    const classes = styles()
    return (
        <>
            <Overlay />
            <div className={classes.post}>
                <h3>Create a post</h3>
                <form onSubmit={handleSubmit}>
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
                        className="submit-btn" type='submit'
                    >
                        Post
                    </button>
                </form>
            </div>
        </>
    )
}

export default CreatePostForm