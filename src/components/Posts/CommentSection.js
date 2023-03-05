import React, { useContext, useState } from "react"
import MainContext from "../MainContext"
import Comment from "./Comment"
import styles from "./styles/commentSectionStyles"

const CommentSection = ({ _id: postID, comments }) => {
  const { setPosts, setFormView, loggedUser } = useContext(MainContext);
  const [commentData, setCommentData] = useState({ text: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setCommentData({ ...commentData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addComment(commentData, postID)
    setFormView({ formName: 'overlay' })
  }

  const addComment = async (commentData, _id) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${_id}/comments`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(commentData)
      })
        .then(res => res.json(), err => console.log('error from add post: ', err))
        .then(data => {
          setPosts({ type: 'addComment', data })
        })
    } catch (err) { throw err }
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
            loggedUser={loggedUser}
            comment={comment}
            postID={postID}
          />
        )
      }
    </div>
  )
}

export default CommentSection