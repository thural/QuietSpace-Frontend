import React, {useState} from "react";
import styles from "./styles/editPostStyles"
import Overlay from "../Overlay"
import {useDispatch, useSelector} from "react-redux";
import {addPost} from "../../redux/postReducer";
import {overlay} from "../../redux/formViewReducer";
import {fetchCreatePost} from "../../api/postRequests";
import {POST_URL} from "../../constants/ApiPath";

const CreatePostForm = () => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.authReducer);
    const [postData, setPostData] = useState({text: ''});

    const handleCreatePost = async (postData, token) => {
        try {
            const response = await fetchCreatePost(POST_URL, postData, token);
            const responseData = await response.json();
            responseData.likes = [];  // temporary fix for response null values
            responseData.comments = []; // temporary fix for response null values
            const postLocation = response.headers.get('Location');
            console.log(postLocation);
            if (response.ok) dispatch(addPost(responseData));
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setPostData({...postData, [name]: value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleCreatePost(postData, auth.token);
        dispatch(overlay());
    }

    const classes = styles()
    return (
        <>
            <Overlay/>
            <div className={classes.post}>
                <h3>Create a post</h3>
                <form onSubmit={handleSubmit}
                >
          <textarea
              className='text area'
              type='text' name='text'
              placeholder="What's on your mind?"
              maxLength="128"
              value={postData.text}
              onChange={handleChange}>
          </textarea>
                    <button className="submit-btn" type='submit'> Post</button>
                </form>
            </div>
        </>
    )
}

export default CreatePostForm