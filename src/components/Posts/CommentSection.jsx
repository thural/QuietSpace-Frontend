import React, {useState, useRef, useEffect} from "react"
import Comment from "./Comment"
import styles from "./styles/commentSectionStyles"
import {useSelector, useDispatch} from "react-redux"
import {overlay} from "../../redux/formViewReducer"
import {addComment} from "../../redux/postReducer"
import InputEmoji from 'react-input-emoji'
import {COMMENT_PATH} from "../../constants/ApiPath";
import {fetchCreateComment} from "../../api/commentRequests";


const CommentSection = ({postId, comments}) => {

    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);

    const dispatch = useDispatch();

    const [commentData, setCommentData] = useState({postId: postId, userId: user.id, text: ''});

    const cursorPosition = useRef(commentData.text.length);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef === null) return;
        if (inputRef.current === null) return;

        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentData.text]);

    const handlePostComment = async (commentData) => {
        try {
            const response = await fetchCreateComment(COMMENT_PATH, commentData, auth.token);
            const responseData = await response.json();
            if (response.ok) dispatch(addComment(responseData));
        } catch (error) {
            console.log('error on creating new comment: ', error)
        }
    }

    const handleEmojiInput = (event) => {
        setCommentData({...commentData, text: event})
    }

    const handleSubmit = async (event) => {
        await handlePostComment(commentData)
        dispatch(overlay())
    }

    const classes = styles();

    return (
        <div className={classes.commentSection}>
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
                comments && comments.map(comment =>
                    <Comment
                        key={comment["id"]}
                        loggedUser={user}
                        comment={comment}
                        postId={postId}
                    />
                )
            }

        </div>
    )
}

export default CommentSection