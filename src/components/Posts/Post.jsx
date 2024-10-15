import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { LikeType } from "@utils/enumClasses";
import { parseCount, toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import {
    PiArrowFatDown, PiArrowFatDownFill,
    PiArrowFatUp, PiArrowFatUpFill,
    PiChatCircle,
} from "react-icons/pi";
import CommentSection from "./CommentSection";
import EditPostForm from "./EditPostForm";
import { usePost } from "./hooks/usePost";
import Poll from "./Poll";
import PostMenu from "./PostMenu";
import ShareMenu from "./ShareMenu";
import styles from "./styles/postStyles";

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
        <FlexStyled className={classes.postHeadline}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(username)} />
            <Typography className="title" type="5">{post.title}</Typography>
            <PostMenu handleDeletePost={handleDeletePost} setViewData={setViewData} isMutable={isMutable} />
        </FlexStyled>
    );

    const PostContent = () => (
        <BoxStyled className="content">
            <Typography className="text">{text}</Typography>
            <Conditional isEnabled={post.isPoll}>
                <Poll pollData={post.pollData} />
            </Conditional>
        </BoxStyled>
    );

    const PollContent = () => (
        <Conditional isEnabled={post.poll}>
            <Poll pollData={post.poll} postId={postId} />
        </Conditional>
    );

    const PostStats = () => (
        <FlexStyled className={classes.postinfo}>
            {likeCount > 0 && <Typography size="0.85rem">{parseCount(likeCount)} likes</Typography>}
            {dislikeCount > 0 && <Typography size="0.85rem">{parseCount(dislikeCount)} dislikes</Typography>}
            {!!comments?.length && <Typography size="0.85rem">{parseCount(comments.length)} comments</Typography>}
        </FlexStyled>
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
        <BoxStyled id={postId} className={classes.wrapper}>
            <PostHeadLine />
            <PostContent />
            <PollContent />
            <BoxStyled className={classes.controls}>
                <LikeToggle />
                <DislikeToggle />
                <CommentToggle />
                <ShareMenu />
                <PostStats />
            </BoxStyled>
            <Conditional isEnabled={editPostView}>
                <EditPostForm postId={postId} />
            </Conditional>
            <Conditional isEnabled={showComments}>
                <CommentSection postId={postId} />
            </Conditional>
            <hr />
        </BoxStyled>
    );
};

export default Post;