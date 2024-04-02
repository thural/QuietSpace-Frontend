import React, { useState } from "react";
import styles from "./styles/postStyles";
import CommentSection from "./CommentSection";
import { useQueryClient } from "@tanstack/react-query";
import EditPostForm from "./EditPostForm";
import { viewStore } from "../../hooks/zustand";
import { useDeletePost, useLikePost } from "../../hooks/usePostData";
import { useGetComments } from "../../hooks/useCommentData";
import {
    PiArrowFatDown,
    PiArrowFatUp,
    PiChatCircle,
    PiPaperPlaneTilt,
    PiPencilSimpleLine,
    PiTrash
} from "react-icons/pi";
import { Badge } from "@mantine/core";




const Post = ({ post }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { editPost: editPostView } = viewData;


    const { id: postId, username, text, likes, dislikes } = post;
    const [showComments, setShowComments] = useState(false);


    const { data: comments, status, error } = useGetComments(postId);
    const deletePost = useDeletePost(postId);
    const togglePostLike = useLikePost(postId);


    const handleDeletePost = async (event) => {
        event.preventDefault();
        deletePost.mutate();
    }

    const handlePostLike = async (event) => {
        event.preventDefault();
        togglePostLike.mutate();
    }


    const classes = styles();


    return (
        <div id={postId} className={classes.wrapper}>

            <div className="author">{username}</div>
            <div className="text"><p>{text}</p></div>

            {editPostView && <EditPostForm postId={postId} />}

            <div className="panel">

                <div className="iconbox">
                    <PiArrowFatUp className="posticon" onClick={handlePostLike} alt={"post like icon"}></PiArrowFatUp>
                    {likes?.length > 0 && <Badge className="badge" color="rgba(0, 0, 0, 1)" size="xs" circle>{likes?.length}</Badge>}
                </div>

                <div className="iconbox">
                    <PiArrowFatDown onClick={handlePostLike} alt={"post dislike icon"} />
                    {comments?.length > 0 && <Badge className="badge" color="rgba(0, 0, 0, 1)" size="xs" circle>{comments?.length}</Badge>}
                </div>

                <div className="iconbox">
                    <PiChatCircle onClick={() => setShowComments(!showComments)} alt={"comment icon"} />
                    {comments?.length > 0 && <Badge className="badge" color="rgba(0, 0, 0, 1)" size="xs" circle>{comments?.length}</Badge>}
                </div>


                {
                    post?.userId === user?.id &&
                    <PiPencilSimpleLine onClick={() => setViewData({ editPost: true })} alt={"edit icon"} />
                }

                <PiPaperPlaneTilt />

                {
                    user?.role === "admin" || post?.userId === user?.id &&
                    <PiTrash onClick={handleDeletePost} alt={"delete post icon"} />
                }
            </div>

            {showComments && <CommentSection postId={postId} />}

            <hr></hr>

        </div>
    )
}

export default Post 