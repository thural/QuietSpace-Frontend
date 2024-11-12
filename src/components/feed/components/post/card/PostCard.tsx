import { ResId } from "@/api/schemas/inferred/common";
import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import Overlay from "@/components/shared/Overlay/Overlay";
import PostSkeleton from "@/components/shared/PostSkeleton";
import { nullishValidationdError } from "@/utils/errorUtils";
import CreateCommentForm from "../../form/comment/CreateCommentForm";
import EditPostForm from "../../form/post/EditPostForm";
import CreateRepostForm from "../../form/repost/CreateRepostForm";
import PostContent from "../../fragments/PostContent";
import PostHeadline from "../../fragments/PostHeadline";
import { usePost } from "../hooks/usePost";
import styles from "../styles/postStyles";
import PostStatSection from "../../fragments/PostStatSection";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";


interface PostCardProps extends GenericWrapper {
    postId: ResId | undefined
    isBaseCard?: boolean
    isMenuHidden?: boolean
}


const PostCard: React.FC<PostCardProps> = ({ postId, isBaseCard = false, isMenuHidden = false, children }) => {

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



    if (isError) return <ErrorComponent message="could not load post" />;


    const postStatSectionProps = {
        post,
        commentCount: comments.data?.totalElements,
        hasCommented,
        handleLike,
        handleDislike,
        toggleCommentForm,
        toggleRepostForm
    }

    const postHeadlineProps = {
        post,
        isMenuHidden,
        isMutable,
        toggleEditForm,
        handleDelete: handleDeletePost,
        handleUserClick: handleUserNavigation
    }


    const MainContent = () => (
        <>
            <PostHeadline {...postHeadlineProps} />
            <PostContent post={post} handleContentClick={handleNavigation} />
            <Conditional isEnabled={!isBaseCard}>
                <PostStatSection{...postStatSectionProps} />
            </Conditional>
            <Overlay onClose={toggleEditForm} isOpen={isOverlayOpen}>
                <EditPostForm postId={postId} toggleForm={toggleEditForm} />
            </Overlay>
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={post} />
            </Overlay>
            <Overlay onClose={toggleRepostForm} isOpen={repostFormView}>
                <CreateRepostForm toggleForm={toggleRepostForm} post={post} />
            </Overlay>
            {children}
        </>
    );

    const RenderResult = () => (
        isLoading ? <PostSkeleton /> : <MainContent />
    );


    return (
        <>
            <BoxStyled id={postId} className={classes.wrapper} onClick={handleNavigation} >
                <RenderResult />
            </BoxStyled>
            {!children && <hr />}
        </>
    );
};

export default PostCard;