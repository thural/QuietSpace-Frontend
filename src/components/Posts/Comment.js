import React, { useContext, useState } from "react"
import styles from "./styles/commentStyles"
import MainContext from "../MainContext"




const Comment = ({ comment, postID }) => {

  const { setPosts, setFormView, loggedUser } = useContext(MainContext);

  const deleteComment = async (commentID, postID) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${postID}/comments/delete/${commentID}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ commentID })
      })
        .then(res => res.json(), err => console.log('error message from edit POST: ', err))
        .then(setPosts({ type: 'deleteComment', postID, commentID }))
    } catch (err) { throw err }
  }
  

  const classes = styles()

  const commentID = comment['_id'].toString()

  return (

    <div key={commentID} className={classes.comment}>

      <p className="comment-author">{comment.username}</p>

      <p className="comment-text">{comment.text}</p>

      <div className="comment-options">

        <p className="comment-like">like</p>
        <p className="comment-reply">reply</p>
        {comment.username == loggedUser.username &&
          <p className="comment-delete" onClick={() => deleteComment(commentID, postID)}>delete</p>
        }

      </div>

    </div>
  )
}

export default Comment

