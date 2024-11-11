import { ResId } from "@/api/schemas/inferred/common";
import { Reactiontype } from "@/api/schemas/native/reaction";
import UserCard from "@/components/chat/components/sidebar/query/UserCard";
import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import FlexStyled from "@/components/shared/FlexStyled";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Overlay from "@/components/shared/Overlay/Overlay";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import { nullishValidationdError } from "@/utils/errorUtils";
import { parseCount } from "@/utils/stringUtils";
import {
    PiArrowFatDown, PiArrowFatDownFill,
    PiArrowFatUp, PiArrowFatUpFill,
    PiChatCircle,
    PiChatCircleFill,
} from "react-icons/pi";
import CreateCommentForm from "../../form/comment/CreateCommentForm";
import EditPostForm from "../../form/post/EditPostForm";
import CreateRepostForm from "../../form/repost/CreateRepostForm";
import PollBox from "../../poll/Poll";
import PostMenu from "../../shared/post-menu/PostMenu";
import ShareMenu from "../../shared/share-menu/ShareMenu";
import { usePost } from "../hooks/usePost";
import styles from "../styles/postStyles";


interface PostCardProps {
    postId: ResId
    isBaseCard?: boolean
    isMenuHidden?: boolean
}


const PostCard: React.FC<PostCardProps> = ({ postId, isBaseCard = false, isMenuHidden = false }) => {

    const classes = styles();

    let data = undefined;

    try {
        if (postId === undefined) throw nullishValidationdError({ postId });
        data = usePost(postId);
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
        post,
        isSuccess,
        isLoading,
        isError,
        comments,
        hasCommented,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        isOverlayOpen,
        commentFormView,
        repostFormView,
        toggleRepostForm,
        toggleEditForm,
        toggleCommentForm,
        handleNavigation,
        handleUserNavigation
    } = data;


    if (isLoading || !post || !isSuccess) return <FullLoadingOverlay />;
    if (isError) return <ErrorComponent message="could not load post" />;


    const { userReaction, text, likeCount, dislikeCount } = post;


    const PostHeadLine = () => (
        <FlexStyled className={classes.postHeadline} onClick={(e: MouseEvent) => e.stopPropagation()}>
            <UserCard userId={post.userId} onClick={(e: React.MouseEvent) => handleUserNavigation(e, post.userId)}>
                <Typography className="title" type="h5">{post.title}</Typography>
            </UserCard>
            <Conditional isEnabled={!isMenuHidden}>
                <PostMenu postId={postId} handleDeletePost={handleDeletePost} toggleEditForm={toggleEditForm} isMutable={isMutable} />
            </Conditional>
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
        hasCommented ? <PiChatCircleFill onClick={toggleCommentForm} />
            : <PiChatCircle onClick={toggleCommentForm} />
    );



    return (
        <>
            <BoxStyled id={postId} className={classes.wrapper} onClick={handleNavigation} >
                <PostHeadLine />
                <PostContent />
                <BoxStyled className={classes.controls}>
                    <Conditional isEnabled={!isBaseCard}>
                        <LikeToggle />
                        <DislikeToggle />
                        <CommentToggle />
                        <ShareMenu handleSendClick={() => console.log("handle send post")} handleRepostClick={toggleRepostForm} />
                        <PostStats />
                    </Conditional>
                </BoxStyled>
                <Overlay onClose={toggleEditForm} isOpen={isOverlayOpen}>
                    <EditPostForm postId={postId} toggleForm={toggleEditForm} />
                </Overlay>
                <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                    <CreateCommentForm postItem={post} />
                </Overlay>
                <Overlay onClose={toggleRepostForm} isOpen={repostFormView}>
                    <CreateRepostForm toggleForm={toggleRepostForm} post={post} />
                </Overlay>
            </BoxStyled>
            <hr />
        </>
    );
};

export default PostCard;