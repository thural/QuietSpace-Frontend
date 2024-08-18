import React, { useState } from "react";
import styles from "./styles/postStyles";
import CommentSection from "./CommentSection";
import { useQueryClient } from "@tanstack/react-query";
import EditPostForm from "./EditPostForm";
import ShareMenu from "./ShareMenu"
import { viewStore } from "../../hooks/zustand";
import { useDeletePost } from "../../hooks/usePostData";
import { useGetComments } from "../../hooks/useCommentData";
import {
    PiArrowFatDown, PiArrowFatDownFill,
    PiArrowFatUp, PiArrowFatUpFill,
    PiChatCircle,
} from "react-icons/pi";
import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { parseCount } from "../../utils/stringUtils";
import Poll from "./Poll";
import PostMenu from "./PostMenu";
import { ContentType, LikeType } from "../../utils/enumClasses";
import { useToggleReaction } from "../../hooks/useReactionData";




const Post = ({ post, avatarUrl }) => {


    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { editPost: editPostView } = viewData;

    const { id: postId, username, userReaction, text, likeCount, dislikeCount } = post;
    const [showComments, setShowComments] = useState(false);


    const { data: comments, status, error } = useGetComments(postId);
    const deletePost = useDeletePost(postId);
    const togglePostLike = useToggleReaction(postId);


    const handleDeletePost = async (event) => {
        event.preventDefault();
        deletePost.mutate();
    }

    const handleReaction = async (event, likeType) => {
        event.preventDefault();
        const reactionBody = {
            userId: user.id,
            contentId: postId,
            reactionType: likeType,
            contentType: ContentType.POST.toString(),
        }
        togglePostLike.mutate(reactionBody);
    }

    const handleLike = (event) => {
        handleReaction(event, LikeType.LIKE.toString())
    }

    const handleDislike = (event) => {
        handleReaction(event, LikeType.DISLIKE.toString())
    }

    const isMutable = user?.role === "admin" || post?.userId === user?.id;



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

            {post.poll && <Poll pollData={post.poll} postId={postId} />}

            <Box className="panel">
                {
                    userReaction?.reactionType === LikeType.LIKE.toString() ?
                        <PiArrowFatUpFill className="posticon" onClick={handleLike} alt={"post like icon"}></PiArrowFatUpFill> :
                        <PiArrowFatUp className="posticon" onClick={handleLike} alt={"post like icon"}></PiArrowFatUp>
                }
                {
                    userReaction?.reactionType === LikeType.DISLIKE.toString() ?
                        <PiArrowFatDownFill className="posticon" onClick={handleDislike} alt={"post like icon"}></PiArrowFatDownFill> :
                        <PiArrowFatDown className="posticon" onClick={handleDislike} alt={"post like icon"}></PiArrowFatDown>
                }

                <PiChatCircle onClick={() => setShowComments(!showComments)} alt={"comment icon"} />

                <ShareMenu />

                <Flex className={classes.postinfo}>
                    {likeCount > 0 && <p>{parseCount(likeCount)} likes</p>}
                    {dislikeCount > 0 && <p>{parseCount(dislikeCount)} dislikes</p>}
                    {!!comments?.length && <p>{parseCount(comments?.length)} comments</p>}
                </Flex>
            </Box>

            {editPostView && <EditPostForm postId={postId} />}
            {showComments && <CommentSection postId={postId} />}
            <hr></hr>
        </Box>
    )
}

export default Post 