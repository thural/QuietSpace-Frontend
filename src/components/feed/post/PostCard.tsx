import { ResId } from "@/api/schemas/inferred/common";
import BatchShareForm from "@/components/chat/form/BatchSendForm";
import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import Overlay from "@/components/shared/Overlay";
import PostSkeleton from "@/components/shared/PostSkeleton";
import { usePost } from "@/services/hook/feed/usePost";
import styles from "@/styles/feed/postStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { nullishValidationdError } from "@/utils/errorUtils";
import CreateCommentForm from "../form/CreateCommentForm";
import CreateRepostForm from "../form/CreateRepostForm";
import EditPostForm from "../form/EditPostForm";
import PostContent from "../fragments/PostContent";
import PostHeadline from "../fragments/PostHeadline";
import PostMenu from "../fragments/PostMenu";
import PostStatSection from "../fragments/PostStatSection";


interface PostCardProps extends GenericWrapper {
    postId: ResId | undefined
    isBaseCard?: boolean
    isMenuHidden?: boolean
    isPostsLoading?: boolean
}


const PostCard: React.FC<PostCardProps> = ({
    isPostsLoading = false,
    postId, isBaseCard = false,
    isMenuHidden = false,
    children
}) => {

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
        shareFormview,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        isOverlayOpen,
        commentFormView,
        repostFormView,
        toggleShareForm,
        toggleRepostForm,
        toggleEditForm,
        toggleCommentForm,
        handleNavigation,
    } = data;



    if (isError) return <ErrorComponent message="could not load post" />;


    const postStatSectionProps = {
        post,
        commentCount: comments.data?.totalElements,
        hasCommented,
        toggleShareForm,
        handleLike,
        handleDislike,
        toggleCommentForm,
        toggleRepostForm
    }


    const MainContent = () => (
        <>
            <PostHeadline post={post}>
                <Conditional isEnabled={!isMenuHidden}>
                    <PostMenu
                        postId={post.id}
                        handleDeletePost={handleDeletePost}
                        toggleEditForm={toggleEditForm}
                        isMutable={isMutable}
                    />
                </Conditional>
            </PostHeadline>
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
            <Overlay onClose={toggleShareForm} isOpen={shareFormview}>
                <BatchShareForm toggleForm={toggleShareForm} postId={post.id} />
            </Overlay>
            <Conditional isEnabled={!!children}>
                <hr />
                <CreateCommentForm postItem={post} isSecondaryMode={true} />
            </Conditional>
            {children}
        </>
    );

    const RenderResult = () => (
        isPostsLoading || isLoading ? <PostSkeleton /> : <MainContent />
    );


    return (
        <>
            <BoxStyled id={postId} className={classes.postCard} onClick={handleNavigation} >
                <RenderResult />
            </BoxStyled>
            {!children && <hr />}
        </>
    );
};

export default PostCard;