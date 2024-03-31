import React, { useState } from "react";
import styles from "./styles/postStyles";
import likeIcon from "../../assets/thumbs.svg";
import shareIcon from "../../assets/share.svg";
import editIcon from "../../assets/edit.svg";
import commentIcon from "../../assets/comment-3-line.svg";
import deleteIcon from "../../assets/delete-bin-line.svg";
import CommentSection from "./CommentSection";
import { useQueryClient } from "@tanstack/react-query";
import EditPostForm from "./EditPostForm";
import { viewStore } from "../../hooks/zustand";
import { useDeletePost, useGetComments, useLikePost } from "../../hooks/useFetchData";

const Post = ({ post }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { editPost: editPostView } = viewData;


    const { id: postId, username, text, likes } = post;
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

            <div className={classes.postinfo}>
                <p className="likes">{likes?.length} likes</p>
                <p>{comments?.length} comments </p>
                <p>0 shares</p>
            </div>

            {editPostView && <EditPostForm postId={postId} />}

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

            {showComments && <CommentSection postId={postId} />}

        </div>
    )
}

export default Post