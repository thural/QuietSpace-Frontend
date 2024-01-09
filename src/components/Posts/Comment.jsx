import React, {useEffect, useState} from "react"
import styles from "./styles/commentStyles"
import {useDispatch, useSelector} from "react-redux"
import {deleteComment} from "../../redux/postReducer"
import emoji from 'react-easy-emoji'
import {fetchDeleteComment, fetchLikeComment} from "../../api/commentRequests";
import {COMMENT_LIKE_TOGGLE, COMMENT_PATH} from "../../constants/ApiPath";


const Comment = ({comment, postId}) => {
    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);
    const dispatch = useDispatch();
    const [liked, setLiked] = useState(false);

    const handleDeleteComment = async () => {
        try {
            const response = await fetchDeleteComment(COMMENT_PATH + `/${comment.id}`, auth.token);
            if (response.ok) dispatch(deleteComment({postId: postId, commentId: comment.id}));
        } catch (error) {
            console.log("error on comment delete: ", error)
        }
    }

    const handleLikeToggle = async (commentId, userId, token) => {
        try {
            const likeBody = {commentId, userId};
            const response = await fetchLikeComment(COMMENT_LIKE_TOGGLE, likeBody, token);
            if (response.ok) console.log("like was toggled"); // TODO:  write a dispatch logic
            setLiked(!liked);
        } catch (error) {
            console.log(`like toggle on comment with id: ${commentId} was failed`);
        }
    }


    const classes = styles();

    return (
        <div key={comment.id} className={classes.comment}>

            <p className="comment-author">{comment.username}</p>

            {
                emoji(comment.text).map((element, index) => (
                    <p key={index} className="comment-text">{element}</p>
                ))
            }

            <div className="comment-options">
                <p className="comment-like" onClick={() =>
                    handleLikeToggle(comment.id, user.id, auth.token)}>{liked ? "unlike" : "like"}</p>

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