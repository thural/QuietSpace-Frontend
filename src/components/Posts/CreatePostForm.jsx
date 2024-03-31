import React, { useState } from "react";
import styles from "./styles/editPostStyles";
import Overlay from "../Overlay";
import { useCreatePost } from "../../hooks/useFetchData";

const CreatePostForm = () => {

    const [postData, setPostData] = useState({ text: '' });

    const addPost = useCreatePost();


    const handleChange = (event) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        addPost.mutate(postData);
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
                        disabled={addPost.isPending}
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