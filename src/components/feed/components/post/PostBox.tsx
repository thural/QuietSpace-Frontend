import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import { parseCount, toUpperFirstChar } from "@/utils/stringUtils";
import EditPostForm from "../form/post/EditPostForm";
import PostMenu from "../shared/post-menu/PostMenu";
import PollBox from "../poll/Poll";
import { usePost } from "./hooks/usePost";
import styles from "./styles/postStyles";
import Overlay from "@/components/shared/Overlay/Overlay";
import { useParams } from "react-router-dom";
import { nullishValidationdError } from "@/utils/errorUtils";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import CommentPanel from "../comment/panel/CommentPanel";
import { Reactiontype } from "@/api/schemas/native/reaction";
import {
    PiArrowFatDown, PiArrowFatDownFill,
    PiArrowFatUp, PiArrowFatUpFill,
    PiChatCircle,
} from "react-icons/pi";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import CreateCommentForm from "../form/comment/CreateCommentForm";



const PostBox = () => {

    const classes = styles();
    const { postId } = useParams();

    let data = undefined;

    try {
        if (postId === undefined) throw nullishValidationdError({ postId });
        data = usePost(postId);
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
        post,
        isLoading,
        isError,
        commentFormView,
        comments,
        isMutable,
        isOverlayOpen,
        handleDeletePost,
        handleLike,
        handleDislike,
        toggleOverlay,
        toggleCommentForm,
    } = data;



    if (isLoading || post === undefined) return <FullLoadingOverlay />;
    if (isError) return <ErrorComponent message="could not load post" />;

    const { username, userReaction, text, likeCount, dislikeCount } = post;


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
            {!!comments?.data?.content.length && <Typography size="0.85rem">{parseCount(comments.data.totalElements)} comments</Typography>}
        </FlexStyled>
    );

    const LikeToggle = () => (
        (!!userReaction && userReaction.reactionType === Reactiontype.LIKE)
            ? <PiArrowFatUpFill className="posticon" onClick={handleLike} />
            : <PiArrowFatUp className="posticon" onClick={handleLike} />
    );

    const DislikeToggle = () => (
        (!!userReaction && userReaction.reactionType === Reactiontype.DISLIKE)
            ? <PiArrowFatDownFill className="posticon" onClick={handleDislike} />
            : <PiArrowFatDown className="posticon" onClick={handleDislike} />
    );

    const CommentToggle = () => (
        <PiChatCircle onClick={toggleCommentForm} />
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
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm post={post} />
            </Overlay>
            <hr />
            <CommentPanel comments={comments} />
        </BoxStyled>
    );
};

export default PostBox