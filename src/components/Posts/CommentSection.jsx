import React, { useState, useRef, useEffect } from "react"
import Comment from "./Comment"
import styles from "./styles/commentSectionStyles"
import { useSelector, useDispatch } from "react-redux"
import { overlay } from "../../redux/formViewReducer"
import { addComment } from "../../redux/postReducer"
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation
} from "emoji-picker-react";
// import InputEmoji from 'react-input-emoji'



const CommentSection = ({ postID, comments }) => {
  const { user } = useSelector(state => state.userReducer)
  const dispatch = useDispatch()
  const [commentData, setCommentData] = useState({ text: '' })
  const [pickerState, setPickerState] = useState(false)


  // get cursor position info using ref and useEffect hooks
  const cursorPos = useRef(commentData.text.length);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;

    inputRef.current.setSelectionRange(cursorPos.current, cursorPos.current);
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

  const handleChange = (event) => {
    const { name, value } = event.target

    //cursorPos.current = inputRef.current.selectionStart;
    cursorPos.current = event.target.selectionStart;
    console.log("current cursor position: ", cursorPos.current)


    setCommentData({ ...commentData, [name]: value })
    console.log("current input value: ", value)
    console.log("input value at state: ", commentData.text)
  }
  // // backup code for inputEmoji module
  // const [inputStr, setInputStr] = useState('');
  // const [showPicker, setShowPicker] = useState(false);
  // const handleEmojiInput = (event) => {
  //   const { value } = event.target
  //   setCommentData({ ...commentData, text: event })
  //   console.log(event)
  //   console.log(commentData.text)
  // }

  // handle the submit event on the comment form
  const handleSubmit = (event) => {
    event.preventDefault()
    postComment(commentData, postID)
    dispatch(overlay())
  }

  // show/hide the emoji picker
  const handleEmojiPicker = (event) => {
    event.preventDefault()
    //setChosenEmoji(emojiObject)
    if (pickerState) setPickerState(false)
    else setPickerState(true)
  }

  // handle emoji click event
  const onEmojiClick = (emojiObject, event) => {
    setCommentData({
      ...commentData,
      text: commentData.text.slice(0, cursorPos.current) + 
      emojiObject.emoji + 
      commentData.text.slice(cursorPos.current + 1)
    })

    // hide emoji pciker on clinking any emoji
    setPickerState(false);
  }

  const classes = styles()

  return (
    <div className={classes.commentSection} >

      {
        pickerState &&
        <EmojiPicker
          emojiStyle="apple"
          height={400}
          width="100%"
          className={classes.emojiPicker}
          onEmojiClick={onEmojiClick}
        />
      }



      <form onSubmit={handleSubmit}>
        <textarea className={classes.commentInput}
          type='text'
          name='text'
          placeholder="Write a comment ..." maxLength="128"
          value={commentData.text} onChange={handleChange}>
        </textarea>
        {/* <InputEmoji
          className={classes.commentInput}
          value={commentData.text}
          onChange={handleChange}
          cleanOnEnter
          buttonElement
          onEnter={handleOnEnter}
          placeholder="Type a comment"
          /> */}
        <button className="submit-btn" type="button" onClick={handleEmojiPicker}>emoji</button>
        <button onSubmit={handleSubmit} className="submit-btn" type="submit">add</button>
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