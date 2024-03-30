import React, { useState } from "react";
import styles from "./styles/postStyles";
import likeIcon from "../../assets/thumbs.svg";
import shareIcon from "../../assets/share.svg";
import editIcon from "../../assets/edit.svg";
import commentIcon from "../../assets/comment-3-line.svg";
import deleteIcon from "../../assets/delete-bin-line.svg";
import CommentSection from "./CommentSection";
import { fetchDeletePost, fetchLikePost } from "../../api/postRequests";
import { COMMENT_PATH, POST_LIKE_TOGGLE, POST_URL } from "../../constants/ApiPath";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditPostForm from "./EditPostForm";
import { fetchCommentsByPostId } from "../../api/commentRequests";
import { authStore } from "../../hooks/zustand";

const Post = ({ post }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: authData } = authStore();


    const { id: postId, username, text, likes } = post;
    const [showComments, setShowComments] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);


    const { data: commentData, status, error } = useQuery({
        queryKey: ["comments", { id: postId }],
        queryFn: async () => {
            const response = await fetchCommentsByPostId(COMMENT_PATH + `/post/${postId}`, authData["token"]);
            return await response.json();
        },
        onSuccess: (data) => {
            console.log("comments fetch success");
        },
        onError: (error) => {
            console.log(`error on loading comments for post with id ${postId}: `, error);
        },
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 3 // refetch data after 3 minutes on idle
    })

    const deletePostMutation = useMutation({
        mutationFn: () => {
            fetchDeletePost(POST_URL, authData["token"], postId)
                .then(response => response.data);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts"], { exact: true });
            console.log("delete post sucess");
        },
        onError: (error, variables, context) => {
            console.log("error on deleting post: ", error.message)
        },
    })

    const toggleLikeMutation = useMutation({
        mutationFn: () => {
            const likeBody = { postId }; // TODO: provide user id
            fetchLikePost(POST_LIKE_TOGGLE, likeBody, token)
                .then(response => response.data);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts", { id: postId }]);
            console.log("post like toggle sucess");
        },
        onError: (error, variables, context) => {
            console.log("error on deleting post: ", error.message);
        },
    })


    const handleDeletePost = async () => {
        deletePostMutation.mutate();
    }

    const handlePostLikeToggle = async () => {
        toggleLikeMutation.mutate();
    }


    const comments = commentData?.content;
    const classes = styles();

    
    return (
        <div id={postId} className={classes.wrapper}>

            <div className="author">{username}</div>
            <div className="text"><p>{text}</p></div>

            <div className={classes.postinfo}>
                <p className="likes">{likes?.length} likes</p>
                <p>{comments?.length} comments </p>
                <p>0 shares</p>
            </div>

            {
                showEditForm && <EditPostForm />
            }

            <hr></hr>

            <div className="panel">
                {
                    post?.userId !== user?.userId &&
                    <img src={likeIcon} onClick={() => handlePostLikeToggle()} alt={"post like icon"} />
                }

                <img src={commentIcon} onClick={() => setShowComments(!showComments)} alt={"comment icon"} />

                {
                    post?.userId === user?.userId &&
                    <img src={editIcon} onClick={() => setShowEditForm(true)}
                        alt={"edit icon"} />
                }

                <img src={shareIcon} alt={"share icon"} />

                {
                    user?.role === "admin" || post?.userId === user?.userId &&
                    <img src={deleteIcon} onClick={() => handleDeletePost()} alt={"delete post icon"} />
                }
            </div>

            {
                showComments && <CommentSection postId={postId} />
            }

        </div>
    )
}

export default Post