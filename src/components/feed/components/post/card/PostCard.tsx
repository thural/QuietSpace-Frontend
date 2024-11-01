import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import { parseCount, toUpperFirstChar } from "@/utils/stringUtils";
import EditPostForm from "../../form/post/EditPostForm";
import PostMenu from "../../shared/post-menu/PostMenu";
import PollBox from "../../poll/Poll";
import { usePost } from "../hooks/usePost";
import styles from "../styles/postStyles";
import Overlay from "@/components/shared/Overlay/Overlay";
import {
    PiArrowFatDown, PiArrowFatDownFill,
    PiArrowFatUp, PiArrowFatUpFill,
    PiChatCircle,
} from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { Reactiontype } from "@/api/schemas/native/reaction";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import { ResId } from "@/api/schemas/inferred/common";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { nullishValidationdError } from "@/utils/errorUtils";
import CreateCommentForm from "../../form/comment/CreateCommentForm";



const PostCard = ({ postId }: { postId: ResId }) => {

    const classes = styles();

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate(`/feed/${postId}`);
    }

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
        comments,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        isOverlayOpen,
        commentFormView,
        toggleOverlay,
        toggleCommentForm
    } = data;

    if (isLoading || post === undefined) return <FullLoadingOverlay />;
    if (isError) return <ErrorComponent message="could not load post" />;

    const { username, userReaction, text, likeCount, dislikeCount } = post;


    const PostHeadLine: React.FC<GenericWrapper> = ({ onClick }) => (
        <FlexStyled className={classes.postHeadline} onClick={onClick}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(username)} />
            <Typography className="title" type="h5">{post.title}</Typography>
            <PostMenu handleDeletePost={handleDeletePost} toggleEdit={toggleOverlay} isMutable={isMutable} />
        </FlexStyled>
    );

    const PostContent: React.FC<GenericWrapper> = ({ onClick }) => (
        <BoxStyled className="content" onClick={onClick}>
            <Typography className="text">{text}</Typography>
            <Conditional isEnabled={!!post.poll}>
                <PollBox postId={postId} pollData={post.poll} />
            </Conditional>
        </BoxStyled>
    );

    const PollContent = ({ onClick }) => (
        <Conditional isEnabled={!!post.poll}>
            <PollBox pollData={post.poll} postId={postId} onClick={onClick} />
        </Conditional>
    );

    const PostStats = () => (
        <FlexStyled className={classes.postinfo}>
            {likeCount > 0 && <Typography size="0.85rem">{parseCount(likeCount)} likes</Typography>}
            {dislikeCount > 0 && <Typography size="0.85rem">{parseCount(dislikeCount)} dislikes</Typography>}
            {!!comments.data?.content?.length && <Typography size="0.85rem">{parseCount(comments.data.totalElements)} comments</Typography>}
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
        <BoxStyled id={postId} className={classes.wrapper} >
            <PostHeadLine onClick={handleNavigation} />
            <PostContent onClick={handleNavigation} />
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
        </BoxStyled>
    );
};

export default PostCard;