import React, {useEffect, useRef, useState} from "react";
import Comment from "./Comment";
import styles from "./styles/commentSectionStyles";
import {useDispatch, useSelector} from "react-redux";
import {COMMENT_PATH} from "../../constants/ApiPath";
import {fetchCreateComment} from "../../api/commentRequests";
import InputEmoji from "react-input-emoji";
import {addComment} from "../../redux/postReducer";


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

    const handleCreateComment = async (commentData) => {
        const response = await fetchCreateComment(COMMENT_PATH, commentData, auth["token"]);
        if (response.ok) {
            return await response.json();
        } else throw Error("error on creating the comment")
    }

    const handleEmojiInput = (event) => {
        setCommentData({...commentData, text: event})
    }

    const handleSubmit = async () => {
        await handleCreateComment(commentData).then(responseData => {
            dispatch(addComment(responseData));
            console.log("comment was added")
        })
            .catch(error => console.log(error));
    }

    const classes = styles();

    return (
        <div className={classes.commentSection}>
            <form>

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