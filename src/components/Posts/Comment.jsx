import React from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import { fetchDeleteComment, fetchLikeComment } from "../../api/commentRequests";
import { COMMENT_PATH } from "../../constants/ApiPath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "../../hooks/zustand";


const Comment = ({ comment }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: authData } = authStore();


    const deleteCommentMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchDeleteComment(COMMENT_PATH + `/${comment.id}`, authData["token"]);
            return response;
        },
        onSuccess: (data, variables, context) => {
            console.log("response data on comment deletion: ", data);
            queryClient.invalidateQueries(["comments"], { id: comment.postId });
        },
        onError: (error, variables, context) => {
            console.log("error on deleting comment: ", error.message);
        },
    })

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchLikeComment(COMMENT_PATH, comment.id, authData["token"]);
            return response;
        },
        onSuccess: (data, variables, context) => {
            console.log("response data on like toggle: ", data);
            queryClient.invalidateQueries(["comments"], { id: comment.postId });
        },
        onError: (error, variables, context) => {
            console.log("error on like toggle: ", error.message)
        },
    })


    const handleDeleteComment = () => {
        deleteCommentMutation.mutate();
    }

    const handleLikeToggle = () => {
        toggleLikeMutation.mutate();
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