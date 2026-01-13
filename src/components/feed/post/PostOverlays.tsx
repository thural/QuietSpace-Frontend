import { PostResponse } from "@/api/schemas/inferred/post";
import BatchShareForm from "@/components/chat/form/BatchSendForm";
import Conditional from "@/components/shared/Conditional";
import Overlay from "@/components/shared/Overlay";
import CreateCommentForm from "../form/CreateCommentForm";
import CreateRepostForm from "../form/CreateRepostForm";
import EditPostForm from "../form/EditPostForm";
import type { PostViewModel } from "@/services/hook/feed/usePost";

export interface PostOverlaysProps {
    post: PostResponse;
    postData: PostViewModel;
    children?: React.ReactNode;
}

const PostOverlays: React.FC<PostOverlaysProps> = ({ post, postData, children }) => {
    const {
        shareFormview,
        isOverlayOpen,
        commentFormView,
        repostFormView,
        toggleShareForm,
        toggleRepostForm,
        toggleEditForm,
        toggleCommentForm,
    } = postData;

    return (
        <>
            <Overlay onClose={toggleEditForm} isOpen={isOverlayOpen}>
                <EditPostForm postId={post.id} toggleForm={toggleEditForm} />
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
        </>
    );
};

export default PostOverlays;
