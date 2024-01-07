import Post from "./Post"
import styles from "./styles/postContainerStyles"
import React from "react"

const PostContainer = ({posts}) => {

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