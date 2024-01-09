import Post from "./Post"
import styles from "./styles/postContainerStyles"
import React from "react"
import {useSelector} from "react-redux";

const PostContainer = () => {

    const posts = useSelector(state => state.postReducer);
    const classes = styles();

    return (

        <div className={classes.cardboard}>
            {
                posts.map((post) => (<Post key={post["id"]} post={post}/>))
            }
        </div>

    )
}

export default PostContainer