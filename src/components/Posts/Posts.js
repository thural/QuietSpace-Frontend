import React from "react"
import PostBoard from "./PostBoard"
import PostForm from "./PostForm"
import EditForm from "./EditForm"
import styles from "./styles/postsStyles"
import { useDispatch, useSelector } from "react-redux"
import { post } from "../../redux/formViewReducer"

const Posts = () => {
  const formView = useSelector(state => state.formViewReducer)
  const dispatch = useDispatch()
  const user = useSelector(state => state.userReducer)
  const posts = useSelector(state => state.postReducer)

  const classes = styles()

  return (
    <>
      <div className={classes.posts}>
        {
          user.username &&
          <button className="add-post-btn" onClick={() => dispatch(post())}>
            Add
          </button>
        }

        {
          user.username && formView.post &&
          <PostForm />
        }

        {
          user.username && formView.edit.view &&
          <EditForm />
        }
        <PostBoard posts={posts} />
      </div>
    </>
  )
}

export default Posts