import React, { useState } from "react"
import styles from "./styles/commentStyles"
import { useDispatch, useSelector } from "react-redux"
import { deleteComment } from "../../redux/postReducer"



const Comment = ({ comment, postID }) => {
  const user = useSelector(state => state.userReducer)
  const dispatch = useDispatch()

  const [liked, setLiked] = useState(comment.likes.includes(user._id))

  const postDeleteComment = async () => {
    await fetch(`http://localhost:5000/api/posts/${postID}/comments/delete/${commentID}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ commentID })
    })
      .then(res => res.json(), err => console.log('error message from edit POST: ', err))
      .then(() => {dispatch(deleteComment({ postID, commentID })); console.log('comment deleted')})
  }

  const likeComment = async (commentID, postID) => {
    await fetch(`http://localhost:5000/api/posts/${postID}/comments/like/${commentID}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ commentID })
    })
      .then(res => res.json(), err => console.log('error message from edit POST: ', err))
      .then(setLiked(true))
  }

  const unlikeComment = async (commentID, postID) => {
    await fetch(`http://localhost:5000/api/posts/${postID}/comments/unlike/${commentID}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ commentID })
    })
      .then(res => res.json(), err => console.log('error message from edit POST: ', err))
      .then(setLiked(false))
  }

  const handleLike = () => {
    if (liked) unlikeComment(commentID, postID)
    else likeComment(commentID, postID)
  }

  const classes = styles()
  const commentID = comment['_id'].toString()

  return (
    <div key={commentID} className={classes.comment}>
      <p className="comment-author">{comment.username}</p>
      <p className="comment-text">{comment.text}</p>
      <div className="comment-options">
        <p className="comment-like" onClick={handleLike}>{liked ? "unlike" : "like"}</p>
        <p className="comment-reply">reply</p>
        {
          comment.username == user.username &&
          <p className="comment-delete" onClick={postDeleteComment}>delete</p>
        }
      </div>
    </div>
  )
}

export default Comment

