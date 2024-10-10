import React from "react";
import styles from "./styles/postStyles";
import CommentSection from "./CommentSection";
import EditPostForm from "./EditPostForm";
import ShareMenu from "./ShareMenu";
import Poll from "./Poll";
import PostMenu from "./PostMenu";
import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { parseCount, toUpperFirstChar } from "../../utils/stringUtils";
import { LikeType } from "../../utils/enumClasses";
import {
    PiArrowFatDown, PiArrowFatDownFill,
    PiArrowFatUp, PiArrowFatUpFill,
    PiChatCircle,
} from "react-icons/pi";
import { usePost } from "./hooks/usePost";

const Post = ({ post }) => {
    const classes = styles();
    const {
        user,
        viewData,
        setViewData,
        editPostView,
        postId,
        username,
        userReaction,
        text,
        likeCount,
        dislikeCount,
        showComments,
        comments,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        toggleComments,
    } = usePost(post);

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
        if (!post.poll) return null;
        return <Poll pollData={post.poll} postId={postId} />;
    };

    const PostStats = () => (
        <Flex className={classes.postinfo}>
            {likeCount > 0 && <p>{parseCount(likeCount)} likes</p>}
            {dislikeCount > 0 && <p>{parseCount(dislikeCount)} dislikes</p>}
            {!!comments?.length && <p>{parseCount(comments?.length)} comments</p>}
        </Flex>
    );

    const LikeToggle = () => (
        userReaction?.reactionType === LikeType.LIKE.toString()
            ? <PiArrowFatUpFill className="posticon" onClick={handleLike} alt="post like icon" />
            : <PiArrowFatUp className="posticon" onClick={handleLike} alt="post like icon" />
    );

    const DislikeToggle = () => (
        userReaction?.reactionType === LikeType.DISLIKE.toString()
            ? <PiArrowFatDownFill className="posticon" onClick={handleDislike} alt="post dislike icon" />
            : <PiArrowFatDown className="posticon" onClick={handleDislike} alt="post dislike icon" />
    );

    const CommentToggle = () => (
        <PiChatCircle onClick={toggleComments} alt="comment icon" />
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
            <hr />
        </Box>
    );
};

export default Post;