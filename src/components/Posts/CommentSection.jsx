import React, { useState, useRef, useEffect } from "react"
import Comment from "./Comment"
import styles from "./styles/commentSectionStyles"
import { useSelector, useDispatch } from "react-redux"
import { overlay } from "../../redux/formViewReducer"
import { addComment } from "../../redux/postReducer"
import InputEmoji from 'react-input-emoji'



const CommentSection = ({ postID, comments }) => {
  const { user } = useSelector(state => state.userReducer)
  const dispatch = useDispatch()
  const [commentData, setCommentData] = useState({ text: '' })

  const cursorPosition = useRef(commentData.text.length);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;

    inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
  }, [commentData.text]);

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

  const handleEmojiInput = (event) => {
    setCommentData({ ...commentData, text: event })
    console.log(event)
    console.log(commentData.text)
  }

  const handleSubmit = (event) => {
    postComment(commentData, postID)
    dispatch(overlay())
  }
  
  const classes = styles()

  return (
    <div className={classes.commentSection} >
      <form onSubmit={handleSubmit}>

        <InputEmoji
          className={classes.commentInput}
          value={commentData.text}
          onChange={handleEmojiInput}
          fontSize={15}
          cleanOnEnter
          buttonElement
          borderColor="#FFFFFF"
          onEnter={handleSubmit}
          theme="light"
          placeholder="Type a comment"
        />

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