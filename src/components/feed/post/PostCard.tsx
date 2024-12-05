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
import PostHeader from "../fragments/PostHeader";
import PostInteractions from "../fragments/PostInteractions";
import PostMenu from "../fragments/PostMenu";


interface PostCardProps extends GenericWrapper {
    postId: ResId | undefined
    isBaseCard?: boolean
    isMenuHidden?: boolean
    isPostsLoading?: boolean
}


const PostCard: React.FC<PostCardProps> = ({
    postId,
    isBaseCard = false,
    isMenuHidden = false,
    isPostsLoading = false,
    children
}) => {

    const classes = styles();
    let postData = undefined;

    try {
        if (postId === undefined) throw nullishValidationdError({ postId });
        postData = usePost(postId);
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
        post,
        isLoading,
        shareFormview,
        isMutable,
        isOverlayOpen,
        commentFormView,
        repostFormView,
        handleDeletePost,
        toggleShareForm,
        toggleRepostForm,
        toggleEditForm,
        toggleCommentForm,
        handleNavigation,
    } = postData;


    const MainContent = () => (
        <>
            <PostHeader post={post}>
                <Conditional isEnabled={!isMenuHidden}>
                    <PostMenu
                        postId={post.id}
                        handleDeletePost={handleDeletePost}
                        toggleEditForm={toggleEditForm}
                        isMutable={isMutable}
                    />
                </Conditional>
            </PostHeader>
            <PostContent post={post} handleContentClick={handleNavigation} />
            <Conditional isEnabled={!isBaseCard}>
                <PostInteractions{...postData} />
            </Conditional>
            <Overlay onClose={toggleEditForm} isOpen={isOverlayOpen}>
                <EditPostForm postId={postId} toggleForm={toggleEditForm} />
            </Overlay>
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm handleClose={toggleCommentForm} postItem={post} />
            </Overlay>
            <Overlay onClose={toggleRepostForm} isOpen={repostFormView}>
                <CreateRepostForm toggleForm={toggleRepostForm} post={post} />
            </Overlay>
            <Overlay onClose={toggleShareForm} isOpen={shareFormview}>
                <BatchShareForm toggleForm={toggleShareForm} postId={post.id} />
            </Overlay>
            <Conditional isEnabled={!!children}>
                <hr />
                <CreateCommentForm handleClose={toggleCommentForm} postItem={post} isSecondaryMode={true} />
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