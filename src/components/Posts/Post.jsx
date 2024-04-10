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
    PiArrowsClockwise,
    PiChatCircle,
    PiPaperPlaneTilt,
    PiPencilSimple,
    PiTrashSimple
} from "react-icons/pi";
import { Avatar, Box, Flex, Text, Title } from "@mantine/core";




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

    const parseCount = (number) => {
        if (number < 1000) {
            return number;
        } else if (number >= 1000 && number < 1_000_000) {
            return (number / 1000).toFixed(1) + "K";
        } else if (number >= 1_000_000 && number < 1_000_000_000) {
            return (number / 1_000_000).toFixed(1) + "M";
        } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
            return (number / 1_000_000_000).toFixed(1) + "B";
        } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
            return (number / 1_000_000_000_000).toFixed(1) + "T";
        }
    }

    function getFirstThreeWords(str) {
        if (!str.trim() || str.split(/\s+/).length < 3) {
            return str.trim();
        }

        return str.split(/\s+/, 3).join(" ");
    }

    // console.log("post likes: ", likes);

    // const isLikedByUser = likes.some( like => like.id === user.id);

    // console.log("is like by user? : ", isLikedByUser );


    const classes = styles();


    return (
        <Box id={postId} className={classes.wrapper}>

            <Flex className={classes.postHeadline}>
                <Avatar color="black" radius="10rem">{username.charAt(0).toUpperCase()}</Avatar>
                <Title className="title" order={5}>{getFirstThreeWords(text)}</Title>
            </Flex>

            <Box className="content">
                <Text className="text">{text}</Text>
                {editPostView && <EditPostForm postId={postId} />}
            </Box>

            <Box className="panel">

                <PiArrowFatUp className="posticon" onClick={handlePostLike} alt={"post like icon"}></PiArrowFatUp>

                <PiArrowFatDown onClick={handlePostLike} alt={"post dislike icon"} />

                <PiChatCircle onClick={() => setShowComments(!showComments)} alt={"comment icon"} />

                <PiPaperPlaneTilt />

                <PiArrowsClockwise />

                {
                    post?.userId === user?.id &&
                    <PiPencilSimple onClick={() => setViewData({ editPost: true })} alt={"edit icon"} />
                }

                {
                    user?.role === "admin" || post?.userId === user?.id &&
                    <PiTrashSimple onClick={handleDeletePost} alt={"delete post icon"} />
                }

                <Flex className={classes.postinfo}>
                    {!!likes?.length && <Text>{parseCount(likes?.length)} likes</Text>}
                    {!!comments?.length && <Text>{parseCount(comments?.length)} comments</Text>}
                </Flex>

            </Box>

            {showComments && <CommentSection postId={postId} />}

            <hr></hr>

        </Box>
    )
}

export default Post 