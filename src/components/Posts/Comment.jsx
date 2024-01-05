import React, { useState } from "react"
import styles from "./styles/commentStyles"
import { useDispatch, useSelector } from "react-redux"
import { deleteComment } from "../../redux/postReducer"
import emoji from 'react-easy-emoji'



const Comment = ({ comment, postId }) => {
  const user = useSelector(state => state.userReducer)
  const dispatch = useDispatch()
  const [liked, setLiked] = useState(comment.likes.includes(user.id))

  const handleDeleteComment = async () => {
    await fetch(`http://localhost:5000/api/posts/${postId}/comments/delete/${commentId}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ commentID: commentId })
    })
      .then(res => res.json(), err => console.log('error message from edit POST: ', err))
      .then(() => { dispatch(deleteComment({ postID: postId, commentID: commentId })); console.log('comment deleted') })
  }

  const handleLikeComment = async (commentID, postID) => {
    await fetch(`http://localhost:5000/api/posts/${postID}/comments/like/${commentID}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ commentID })
    })
      .then(res => res.json(), err => console.log('error message from edit POST: ', err))
      .then(setLiked(true))
  }

  const handleUnlikeComment = async (commentID, postID) => {
    await fetch(`http://localhost:5000/api/posts/${postID}/comments/unlike/${commentID}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ commentID })
    })
      .then(res => res.json(), err => console.log('error message from edit POST: ', err))
      .then(setLiked(false))
  }

  const handleLike = () => {
    if (liked) handleUnlikeComment(commentId, postId)
    else handleLikeComment(commentId, postId)
  }

  const classes = styles()
  const commentId = comment['id'];

  return (
    <div key={commentId} className={classes.comment}>
      <p className="comment-author">{comment.username}</p>
      {
        emoji(comment.text).map((element, index) => (
          <p key={index} className="comment-text">
            {element}
          </p>
        ))
      }
      <div className="comment-options">
        <p className="comment-like" onClick={handleLike}>{liked ? "unlike" : "like"}</p>
        <p className="comment-reply">reply</p>
        {
          comment.username == user.username &&
          <p className="comment-delete" onClick={handleDeleteComment}>delete</p>
        }
      </div>
    </div>
  )
}

export default Comment