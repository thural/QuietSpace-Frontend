import React from "react"
import PostBoard from "./PostBoard"
import PostForm from "./PostForm"
import EditForm from "./EditForm"
import styles from "./styles/postsStyles"
import { useDispatch, useSelector } from "react-redux"

const Posts = () => {
  const formView = useSelector(state => state.formViewReducer)
  const dispatch = useDispatch()
  const loggedUser = useSelector(state => state.userReducer)
  const posts = useSelector(state => state.postReducer)

  const classes = styles()

  return (
    <>
      <div className={classes.posts}>
        {
          loggedUser.username &&
          <button className="add-post-btn" onClick={() => dispatch({ type: 'post' })}>
            Add
          </button>
        }

        {
          loggedUser.username && formView.post &&
          <PostForm />
        }

        {
          loggedUser.username && formView.edit.view &&
          <EditForm />
        }
        <PostBoard posts={posts} />
      </div>
    </>
  )
}

export default Posts