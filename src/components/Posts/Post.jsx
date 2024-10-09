import React, { useState } from "react";
import styles from "./styles/postStyles";
import CommentSection from "./CommentSection";
import EditPostForm from "./EditPostForm";
import ShareMenu from "./ShareMenu";
import Poll from "./Poll";
import PostMenu from "./PostMenu";
import { useQueryClient } from "@tanstack/react-query";
import { viewStore } from "../../hooks/zustand";
import { useDeletePost } from "../../hooks/usePostData";
import { useGetComments } from "../../hooks/useCommentData";
import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { parseCount, toUpperFirstChar } from "../../utils/stringUtils";
import { ContentType, LikeType } from "../../utils/enumClasses";
import { useToggleReaction } from "../../hooks/useReactionData";
import {
    PiArrowFatDown, PiArrowFatDownFill,
    PiArrowFatUp, PiArrowFatUpFill,
    PiChatCircle,
} from "react-icons/pi";


const Post = ({ post }) => {

    const classes = styles();

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

    const handleLike = (event) => handleReaction(event, LikeType.LIKE.toString());
    const handleDislike = (event) => handleReaction(event, LikeType.DISLIKE.toString());
    const isMutable = user?.role === "admin" || post?.userId === user?.id;

    const PostHeadLine = () => (
        <Flex className={classes.postHeadline}>
            <Avatar color="black" radius="10rem">{toUpperFirstChar(username)}</Avatar>
            <Title className="title" order={5}>{post.title}</Title>
            <PostMenu handleDeletePost={handleDeletePost} setViewData={setViewData} isMutable={isMutable} />
        </Flex>
    );

    const PostContent = () => (
        <Box className="content">
            <Text className="text">{text}</Text>
            {post.isPoll && <Poll pollData={post.pollData} />}
        </Box>
    );

    const PollContent = () => {
        if (!post.poll) return;
        return <Poll pollData={post.poll} postId={postId} />
    };

    const PostStats = () => (
        <Flex className={classes.postinfo}>
            {likeCount > 0 && <p>{parseCount(likeCount)} likes</p>}
            {dislikeCount > 0 && <p>{parseCount(dislikeCount)} dislikes</p>}
            {!!comments?.length && <p>{parseCount(comments?.length)} comments</p>}
        </Flex>
    );

    const LikeToggle = () => {
        if (userReaction?.reactionType === LikeType.LIKE.toString())
            return <PiArrowFatUpFill className="posticon" onClick={handleLike} alt={"post like icon"}></PiArrowFatUpFill>
        return <PiArrowFatUp className="posticon" onClick={handleLike} alt={"post like icon"}></PiArrowFatUp>
    }

    const DislikeToggle = () => {
        if (userReaction?.reactionType === LikeType.DISLIKE.toString())
            return <PiArrowFatDownFill className="posticon" onClick={handleDislike} alt={"post like icon"}></PiArrowFatDownFill>
        return <PiArrowFatDown className="posticon" onClick={handleDislike} alt={"post like icon"}></PiArrowFatDown>
    }

    const CommentToggle = () => (
        <PiChatCircle onClick={() => setShowComments(!showComments)} alt={"comment icon"} />
    );


    return (
        <Box id={postId} className={classes.wrapper}>

            <PostHeadLine />
            <PostContent />
            <PollContent />

            <Box className="panel">
                <LikeToggle />
                <DislikeToggle />
                <CommentToggle />
                <ShareMenu />
                <PostStats />
            </Box>

            {editPostView && <EditPostForm postId={postId} />}
            {showComments && <CommentSection postId={postId} />}
            <hr></hr>

        </Box>
    )
}

export default Post 