import React from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleCommentLike, useDeleteComment } from "../../hooks/useFetchData";


const Comment = ({ comment }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.postId);
    const toggleLike = useToggleCommentLike(comment.postId);


    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    }

    const handleLikeToggle = () => {
        toggleLike.mutate(comment.id);
    }


    const isLiked = comment.likes.some(likeObject => likeObject.userId === user.id);
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
                <p className="comment-like" onClick={handleLikeToggle}>{isLiked ? "unlike" : "like"}</p>
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