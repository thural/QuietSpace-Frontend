import React, { useState } from "react"
import Comment from "./Comment"
import styles from "./styles/commentSectionStyles"
import { useSelector, useDispatch } from "react-redux"
import { overlay } from "../../redux/formViewReducer"
import { addComment } from "../../redux/postReducer"

const CommentSection = ({ postID, comments }) => {
  const { user } = useSelector(state => state.userReducer)
  const dispatch = useDispatch()
  const [commentData, setCommentData] = useState({ text: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setCommentData({ ...commentData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    postComment(commentData, postID)
    dispatch(overlay())
  }

  const postComment = async (commentData, postID) => {
    await fetch(`http://localhost:5000/api/posts/${postID}/comments`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(commentData)
    })
      .then(res => res.json(), err => console.log('error from add post: ', err))
      .then(data => {
        dispatch(addComment({ data }))
      })
  }


  const classes = styles()

  return (
    <div className={classes.commentSection} >

      <form onSubmit={handleSubmit} >
        <textarea className={classes.commentInput}
          type='text'
          name='text'
          placeholder="Write a comment ..." maxLength="128"
          value={commentData.text} onChange={handleChange}>
        </textarea>
        <button className="submit-btn" type='submit'> add </button>
      </form>

      {
        comments &&
        comments.map(comment =>
          <Comment
            key={comment['_id']}
            loggedUser={user}
            comment={comment}
            postID={postID}
          />
        )
      }
    </div>
  )
}

export default CommentSection