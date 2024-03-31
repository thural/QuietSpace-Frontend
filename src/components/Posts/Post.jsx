import React, { useState } from "react";
import styles from "./styles/postStyles";
import likeIcon from "../../assets/thumbs.svg";
import shareIcon from "../../assets/share.svg";
import editIcon from "../../assets/edit.svg";
import commentIcon from "../../assets/comment-3-line.svg";
import deleteIcon from "../../assets/delete-bin-line.svg";
import CommentSection from "./CommentSection";
import { fetchDeletePost, fetchLikePost } from "../../api/postRequests";
import { COMMENT_PATH, POST_URL } from "../../constants/ApiPath";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditPostForm from "./EditPostForm";
import { fetchCommentsByPostId } from "../../api/commentRequests";
import { authStore, viewStore } from "../../hooks/zustand";

const Post = ({ post }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: authData } = authStore();
    const { data: viewData, setViewData } = viewStore();
    const { editPost: editPostView } = viewData;


    const { id: postId, username, text, likes } = post;
    const [showComments, setShowComments] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);


    const { data: commentData, status, error } = useQuery({
        queryKey: ["comments", { id: postId }],
        queryFn: async () => {
            const response = await fetchCommentsByPostId(COMMENT_PATH, postId, authData["token"]);
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
        mutationFn: async () => {
            const response = await fetchDeletePost(POST_URL, postId, authData["token"]);
            return response;
        },
        onSuccess: (data, variables, context) => {
            console.log("response data on post delete: ", data);
            queryClient.invalidateQueries(["posts"], { exact: true });
            console.log("delete post sucess");
        },
        onError: (error, variables, context) => {
            console.log("error on deleting post: ", `postId: ${postId}, error message: `, error.message);
        },
    })

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchLikePost(POST_URL, postId, authData.token);
            return response;
        },
        onSuccess: (data, variables, context) => {
            console.log("response data on post like: ", data);
            queryClient.invalidateQueries(["posts"], { id: postId });
        },
        onError: (error, variables, context) => {
            console.log("error on liking post: ", error.message);
        },
    })


    const handleDeletePost = async (event) => {
        event.preventDefault();
        deletePostMutation.mutate();
    }

    const handlePostLike = async (event) => {
        event.preventDefault();
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
                editPostView && <EditPostForm postId={postId} />
            }

            <hr></hr>

            <div className="panel">
                {
                    post?.userId !== user?.userId &&
                    <img src={likeIcon} onClick={handlePostLike} alt={"post like icon"} />
                }

                <img src={commentIcon} onClick={() => setShowComments(!showComments)} alt={"comment icon"} />

                {
                    post?.userId === user?.id &&
                    <img src={editIcon} onClick={() => setViewData({ editPost: true })}
                        alt={"edit icon"} />
                }

                <img src={shareIcon} alt={"share icon"} />

                {
                    user?.role === "admin" || post?.userId === user?.id &&
                    <img src={deleteIcon} onClick={handleDeletePost} alt={"delete post icon"} />
                }
            </div>

            {
                showComments && <CommentSection postId={postId} />
            }

        </div>
    )
}

export default Post