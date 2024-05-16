import React, { useState } from "react";
import styles from "./styles/postStyles";
import CommentSection from "./CommentSection";
import { useQueryClient } from "@tanstack/react-query";
import EditPostForm from "./EditPostForm";
import ShareMenu from "./ShareMenu"
import { viewStore } from "../../hooks/zustand";
import { useDeletePost, useLikePost } from "../../hooks/usePostData";
import { useGetComments } from "../../hooks/useCommentData";
import {
    PiArrowFatDown,
    PiArrowFatUp,
    PiChatCircle,
} from "react-icons/pi";
import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { parseCount } from "../../utils/stringUtils";
import Poll from "./Poll";
import PostMenu from "./PostMenu";




const Post = ({ post, avatarUrl }) => {

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

    const isMutable = user?.role === "admin" || post?.userId === user?.id;

    // console.log("post likes: ", likes);

    // const isLikedByUser = likes.some( like => like.id === user.id);

    // console.log("is like by user? : ", isLikedByUser );


    const classes = styles();


    return (
        <Box id={postId} className={classes.wrapper}>

            <Flex className={classes.postHeadline}>
                <Avatar color="black" radius="10rem" src={avatarUrl}>{username.charAt(0).toUpperCase()}</Avatar>
                <Title className="title" order={5}>{post.title}</Title>
                <PostMenu handleDeletePost={handleDeletePost} setViewData={setViewData} isMutable={isMutable} />
            </Flex>

            <Box className="content">
                <Text className="text">{text}</Text>
                {post.isPoll && <Poll pollData={post.pollData} />}
            </Box>

            {post.poll && <Poll pollData={post.poll} />}

            <Box className="panel">

                <PiArrowFatUp className="posticon" onClick={handlePostLike} alt={"post like icon"}></PiArrowFatUp>

                <PiArrowFatDown onClick={handlePostLike} alt={"post dislike icon"} />

                <PiChatCircle onClick={() => setShowComments(!showComments)} alt={"comment icon"} />

                <ShareMenu />

                <Flex className={classes.postinfo}>
                    {!!likes?.length && <Text>{parseCount(likes?.length)} likes</Text>}
                    {!!comments?.length && <Text>{parseCount(comments?.length)} comments</Text>}
                </Flex>

            </Box>

            {editPostView && <EditPostForm postId={postId} />}

            {showComments && <CommentSection postId={postId} />}

            <hr></hr>

        </Box>
    )
}

export default Post 