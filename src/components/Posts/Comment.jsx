import React, { useState } from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import { fetchDeleteComment, fetchLikeComment } from "../../api/commentRequests";
import { COMMENT_LIKE_TOGGLE, COMMENT_PATH } from "../../constants/ApiPath";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const Comment = ({ comment, postId }) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");
    const auth = queryClient.getQueryData("auth");
    const [liked, setLiked] = useState(false);


    const deleteCommentMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchDeleteComment(COMMENT_PATH + `/${comment.id}`, auth["token"]);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["comments"], { exact: true });
            console.log(context);
        },
        onError: (error, variables, context) => {
            console.log("error on deleting comment: ", error.message)
        },
        onMutate: () => { // do something before mutation
            return { message: "comment was deleted" } // create context
        },
    })

    const handleDeleteComment = () => {
        deleteCommentMutation.mutate();
    }

    const toggleLikeMutation = useMutation({
        mutationFn: async (likeBody) => {
            const response = await fetchLikeComment(COMMENT_LIKE_TOGGLE, likeBody, token);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["comments", { id: comment.id }], { exact: true });
            // TODO: write a dispatch logic
            setLiked(!liked);
            console.log(context);
        },
        onError: (error, variables, context) => {
            console.log("error on like toggle: ", error.message)
        },
        onMutate: () => { // do something before mutation
            return { message: "like toggle success" } // create context
        },
    })

    const handleLikeToggle = () => {
        toggleLikeMutation.mutate(likeBody);
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
                <p className="comment-like" onClick={handleLikeToggle}>{liked ? "unlike" : "like"}</p>
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