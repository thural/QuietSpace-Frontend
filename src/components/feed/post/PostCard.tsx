import { PostResponse } from "@/api/schemas/inferred/post";
import BatchShareForm from "@/components/chat/form/BatchSendForm";
import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import Overlay from "@/components/shared/Overlay";
import { usePost } from "@/services/hook/feed/usePost";
import styles from "@/styles/feed/postStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import CreateCommentForm from "../form/CreateCommentForm";
import CreateRepostForm from "../form/CreateRepostForm";
import EditPostForm from "../form/EditPostForm";
import PostContent from "../fragments/PostContent";
import PostHeader from "../fragments/PostHeader";
import PostInteractions from "../fragments/PostInteractions";
import PostMenu from "../fragments/PostMenu";
import { isRepost } from "@/utils/typeUtils";

/**
 * Props for the PostCard component.
 * 
 * @interface PostCardProps
 * @extends GenericWrapper
 * @property {PostResponse} post - The post data object containing details of the post.
 * @property {boolean} [isBaseCard] - Flag to indicate if the card is a base card.
 * @property {boolean} [isMenuHidden] - Flag to control visibility of the post menu.
 */
export interface PostCardProps extends GenericWrapper {
    post: PostResponse;
    isBaseCard?: boolean;
    isMenuHidden?: boolean;
}

/**
 * PostCard component.
 * 
 * This component renders a card for displaying a post, including its content, header,
 * interactions, and various forms for editing, commenting, reposting, and sharing.
 * It handles error states when retrieving post data and manages the visibility of overlays
 * for different forms.
 * 
 * @param {PostCardProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostCard component.
 */
const PostCard: React.FC<PostCardProps> = ({
    post,
    isBaseCard = false,
    isMenuHidden = false,
    children
}) => {
    const classes = styles();
    const postId = post.id;
    let postData = undefined;

    try {
        if (isRepost(post)) throw new TypeError("object is not post");
        postData = usePost(post);
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
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

    return (
        <BoxStyled id={postId} className={classes.postCard} onClick={handleNavigation}>
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
                <PostInteractions {...postData} post={post} />
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
                <CreateCommentForm handleClose={toggleCommentForm} postItem={post} isSecondaryMode={true} />
            </Conditional>
            {children}
        </BoxStyled>
    );
};

export default PostCard;