import { PostResponse } from "@/features/feed/data/models/post";
import BatchShareForm from "@/features/chat/presentation/components/forms/BatchSendForm";
import BoxStyled from "@/shared/BoxStyled";
import Conditional from "@/shared/Conditional";
import styles from "../../styles/postStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import PostOverlays from "./PostOverlays";
import PostContent from "../fragments/PostContent";
import PostHeader from "../fragments/PostHeader";
import PostInteractions from "../fragments/PostInteractions";
import PostMenu from "../fragments/PostMenu";
import type { PostViewModel } from "@features/feed/application/hooks/usePost";

export interface PostCardViewProps extends GenericWrapper {
    post: PostResponse;
    isBaseCard?: boolean;
    isMenuHidden?: boolean;
    postData: PostViewModel;
}

const PostCardView: React.FC<PostCardViewProps> = ({
    post,
    isBaseCard = false,
    isMenuHidden = false,
    children,
    postData
}) => {
    const classes = styles();

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
        <BoxStyled id={post.id} className={classes.postCard} onClick={handleNavigation}>
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
            <PostOverlays post={post} postData={postData}>{children}</PostOverlays>
            {children}
        </BoxStyled>
    );
};

export default PostCardView;
