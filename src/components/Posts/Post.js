import React, { useState } from "react"
import styles from "./styles/postStyles"
import likeIcon from "../../assets/thumbs.svg"
import shareIcon from "../../assets/share.svg"
import editIcon from "../../assets/edit.svg"
import commentIcon from "../../assets/comment-3-line.svg"
import deleteIcon from "../../assets/delete-bin-line.svg"
import CommentSection from "./CommentSection"
import { useDispatch, useSelector } from "react-redux"
import { deletePost, likePost } from "../../redux/postReducer"
import { edit } from "../../redux/formViewReducer"

const Post = ({ post }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.userReducer)

  const { _id, username, text, likes, comments } = post
  const [active, setActive] = useState(false)
  const liked = post.likes.includes(user['_id']) ? 'unlike' : 'like'

  const fetchDeletePost = async (_id) => {
    await fetch(`http://localhost:5000/api/posts/delete/${_id}`, { method: 'POST' })
      .then(res => res.json())
      .then(() => dispatch(deletePost({ _id, user: user, })))
      .catch(err => console.log('error from delete post: ', err))
  }

  const fetchLikePost = async (_id) => {
    await fetch(`http://localhost:5000/api/posts/like/${_id}`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        dispatch(likePost({ _id, user }))
      })
      .catch(err => console.log('error from like post: ', err))
  }

  const classes = styles()

  return (
    <div id={_id} className={classes.wrapper}>
      <div className="author">{username}</div>
      <div className="text"><p>{text}</p></div>
      <div className={classes.postinfo}>
        <p className="likes" >{likes.length} likes</p>
        <p>{comments.length} comments </p>
        <p>0 shares</p>
      </div>

      {
        user.username &&
        <>
          <hr></hr>
          <div className="panel">
            {
              post.username !== user.username &&
              <img src={likeIcon} onClick={() => fetchLikePost(_id)} />
            }

            <img src={commentIcon} onClick={() => setActive(active ? false : true)} />

            {
              post.username == user.username &&
              <img src={editIcon} onClick={() => dispatch(edit(_id))} />
            }

            <img src={shareIcon} />

            {
              user.admin || post.username == user.username &&
              <img src={deleteIcon} onClick={() => fetchDeletePost(_id)} />
            }
          </div>
          {
            active &&
            <CommentSection _id={_id} comments={comments} />
          }
        </>
      }
    </div>
  )
}

export default Post