import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import { LikeType } from "@/utils/enumClasses";
import { parseCount, toUpperFirstChar } from "@/utils/stringUtils";
import EditPostForm from "../form/post/EditPostForm";
import PostMenu from "../shared/post-menu/PostMenu";
import CommentPanel from "../comment/panel/CommentPanel";
import PollBox from "../poll/Poll";
import { usePost } from "./hooks/usePost";
import styles from "./styles/postStyles";
import { Post } from "@/api/schemas/inferred/post";
import Overlay from "@/components/shared/Overlay/Overlay";
import {
    PiArrowFatDown, PiArrowFatDownFill,
    PiArrowFatUp, PiArrowFatUpFill,
    PiChatCircle,
} from "react-icons/pi";



const PostBox = ({ post }: { post: Post }) => {

    const classes = styles();

    const {
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
        isOverlayOpen,
        toggleOverlay,
        toggleComments,
    } = usePost(post);


    const PostHeadLine = () => (
        <FlexStyled className={classes.postHeadline}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(username)} />
            <Typography className="title" type="h5">{post.title}</Typography>
            <PostMenu handleDeletePost={handleDeletePost} toggleEdit={toggleOverlay} isMutable={isMutable} />
        </FlexStyled>
    );

    const PostContent = () => (
        <BoxStyled className="content">
            <Typography className="text">{text}</Typography>
            <Conditional isEnabled={!!post.poll}>
                <PollBox postId={postId} pollData={post.poll} />
            </Conditional>
        </BoxStyled>
    );

    const PollContent = () => (
        <Conditional isEnabled={!!post.poll}>
            <PollBox pollData={post.poll} postId={postId} />
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
            ? <PiArrowFatUpFill className="posticon" onClick={handleLike} />
            : <PiArrowFatUp className="posticon" onClick={handleLike} />
    );

    const DislikeToggle = () => (
        userReaction?.reactionType === LikeType.DISLIKE.toString()
            ? <PiArrowFatDownFill className="posticon" onClick={handleDislike} />
            : <PiArrowFatDown className="posticon" onClick={handleDislike} />
    );

    const CommentToggle = () => (
        <PiChatCircle onClick={toggleComments} />
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
                {/* <ShareMenu /> */}
                <PostStats />
            </BoxStyled>
            <Overlay onClose={toggleOverlay} isOpen={isOverlayOpen}>
                <EditPostForm postId={postId} />
            </Overlay>
            <Conditional isEnabled={showComments}>
                <CommentPanel postId={postId} />
            </Conditional>
            <hr />
        </BoxStyled>
    );
};

export default PostBox;