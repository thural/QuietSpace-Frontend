import React, {useState} from "react"
import styles from "./styles/commentStyles"
import {useDispatch, useSelector} from "react-redux"
import postReducer, {deleteComment} from "../../redux/postReducer"
import emoji from 'react-easy-emoji'
import {fetchDeleteComment} from "../../api/commentRequests";
import {COMMENT_PATH} from "../../constants/ApiPath";


const Comment = ({comment, postId}) => {
    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);
    const dispatch = useDispatch();
    const likes = comment.likes == null ? [] : comment.likes;
    const [liked, setLiked] = useState(likes.includes(user.id));

    console.log("username of user from comment component: ", user.username);
    console.log("username of comment from comment component: ", comment.username);

    const handleDeleteComment = async () => {
        try {
            const response = await fetchDeleteComment(COMMENT_PATH + comment.id, auth.token);
            console.log("response from fetch delete comment: ", response);
            if (response.ok) dispatch(deleteComment({postID: postId, commentID: comment.id}));
        } catch (error) {
            console.log("error on comment delete: ", error)
        }
    }

    const handleLikeComment = async (commentID, postID) => {
        await fetch(`http://localhost:5000/api/posts/${postID}/comments/like/${commentID}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({commentID})
        })
            .then(res => res.json(), err => console.log('error message from edit POST: ', err))
            .then(setLiked(true))
    }

    const handleUnlikeComment = async (commentID, postID) => {
        await fetch(`http://localhost:5000/api/posts/${postID}/comments/unlike/${commentID}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({commentID})
        })
            .then(res => res.json(), err => console.log('error message from edit POST: ', err))
            .then(setLiked(false))
    }

    const handleLike = () => {
        if (liked) handleUnlikeComment(commentId, postId)
        else handleLikeComment(commentId, postId)
    }

    const classes = styles()

    return (
        <div key={comment.id} className={classes.comment}>

            <p className="comment-author">{comment.username}</p>

            {
                emoji(comment.text).map((element, index) => (
                    <p key={index} className="comment-text">{element}</p>
                ))
            }

            <div className="comment-options">
                <p className="comment-like" onClick={handleLike}>{liked ? "unlike" : "like"}</p>
                <p className="comment-reply">reply</p>
                {
                    comment.username === user.username &&
                    <p className="comment-delete" onClick={handleDeleteComment}>delete</p>
                }
            </div>

        </div>
    )
}

export default Comment