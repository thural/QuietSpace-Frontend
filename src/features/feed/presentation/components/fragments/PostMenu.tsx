import { ResId } from "@/shared/api/models/commonNative";
import { useSavePost } from "@features/feed/data";
import { ConsumerFn } from "@/shared/types/genericTypes";
import Clickable from "@/shared/Clickable";
import Conditional from "@/shared/Conditional";
import ListMenu from "@/shared/ListMenu";
import { PiDotsThreeVertical } from "react-icons/pi";

/**
 * Props for the PostMenu component.
 * 
 * @interface PostMenuProps
 * @property {ConsumerFn} handleDeletePost - Function to handle deleting the post.
 * @property {ConsumerFn} toggleEditForm - Function to toggle the visibility of the edit form.
 * @property {boolean} [isMutable] - Indicates if the post can be edited or deleted.
 * @property {boolean} [isRepost] - Indicates if the post is a repost.
 * @property {ResId} postId - The ID of the post.
 */
interface PostMenuProps {
    handleDeletePost: ConsumerFn;
    toggleEditForm: ConsumerFn;
    isMutable?: boolean;
    isRepost?: boolean;
    postId: ResId;
}

/**
 * PostMenu component.
 * 
 * This component renders a menu for interacting with a post. It provides options to edit,
 * delete, save, or report the post based on its state (mutable or repost). The available
 * actions are conditionally displayed depending on the provided props.
 * 
 * @param {PostMenuProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostMenu component.
 */
const PostMenu: React.FC<PostMenuProps> = ({ postId, handleDeletePost, toggleEditForm, isMutable = false, isRepost = false }) => {

    const savePost = useSavePost();

    const handleSavePost = () => {
        savePost.mutate(postId);
    }

    const handleReportPost = () => {
        // TODO: handle report post
    }

    return (
        <ListMenu menuIcon={<PiDotsThreeVertical />}>
            <Conditional isEnabled={isMutable && !isRepost}>
                <Clickable handleClick={toggleEditForm} alt="edit post" text="edit" />
            </Conditional>
            <Conditional isEnabled={isMutable}>
                <Clickable handleClick={handleDeletePost} alt="remove post" text="remove" />
            </Conditional>
            <Conditional isEnabled={!isMutable}>
                <Clickable handleClick={handleSavePost} alt="save post" text="save" />
                <Clickable handleClick={handleReportPost} alt="report post" text="report" />
            </Conditional>
        </ListMenu>
    );
}

export default PostMenu;